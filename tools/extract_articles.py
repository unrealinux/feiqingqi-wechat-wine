#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 build_*.py 中提取文章数据 -> articles/<name>.json

背景
----
项目里 70+ 个 build_*.py 只做一件事：用 build_article(name=..., title=...,
content_blocks=[...]) 定义文章内容。它们本质上是「数据」，却被编译成了
200+ 个高度重复的 generate-*.js。

本工具用 AST 静态解析（不会执行脚本，因此不会触发发布）把这些数据抽出来，
交给 engine/ 下的 Node 渲染引擎统一生产 HTML / 封面 / 发布。

用法
----
    python tools/extract_articles.py build_new_topics.py
    python tools/extract_articles.py build_new_topics.py --only bbq_pairing,hotpot_pairing
    python tools/extract_articles.py --all
    python tools/extract_articles.py build_new_topics.py --dry-run
"""
import argparse
import ast
import json
import os
import re
import sys
from glob import glob

# Windows 控制台默认 GBK，无法输出 emoji/中文，这里强制切到 UTF-8
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError):
        pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'articles')

# 内容块类型的字段契约，与 engine/blocks.js 的 BLOCK_SPEC 保持一致
BLOCK_SPEC = {
    'title':    {'required': ('text',), 'optional': ()},
    'subtitle': {'required': ('text',), 'optional': ()},
    'h2':       {'required': ('text',), 'optional': ()},
    'h3':       {'required': ('text',), 'optional': ()},
    'p':        {'required': ('text',), 'optional': ()},
    'lead':     {'required': ('text',), 'optional': ()},
    'tip':      {'required': ('text',), 'optional': ('heading',)},
    'quote':    {'required': ('text',), 'optional': ()},
    'box':      {'required': ('text',), 'optional': ('heading',)},
    'ri':       {'required': ('text',), 'optional': ('heading',)},
    'card':     {'required': ('text',), 'optional': ('heading',)},
    'info':     {'required': ('text',), 'optional': ('heading',)},
    'item':     {'required': ('text',), 'optional': ('info', 'price', 'tag')},
    'table':    {'required': ('headers', 'rows'), 'optional': ()},
    'list':     {'required': ('items',), 'optional': ()},
    'sep':      {'required': (), 'optional': ('text',)},
    'end':      {'required': ('text',), 'optional': ()},
}

# 渲染主题：第一代模板（暗金配色） / 第二代模板（可传主题色）
def find_theme_and_cover(tree):
    """从 AST 中识别渲染主题与封面色配置。"""
    theme = {'name': 'classic'}
    cover = None

    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        func = node.func
        fname = None
        if isinstance(func, ast.Name):
            fname = func.id
        elif isinstance(func, ast.Attribute):
            fname = func.attr

        if fname == 'rich_article':
            theme = {'name': 'rich'}
            for kw in node.keywords:
                if kw.arg in ('primary', 'secondary', 'theme_color', 'accent_color'):
                    try:
                        theme[kw.arg] = literal(kw.value)
                    except (ValueError, SyntaxError):
                        pass

        elif fname == 'cover_svg':
            args = []
            for arg in node.args:
                try:
                    args.append(literal(arg))
                except (ValueError, SyntaxError):
                    args.append(None)
            cover = {
                'color': args[0] if len(args) > 0 else None,
                'titleLines': args[1] if len(args) > 1 else [],
                'subtitle': args[2] if len(args) > 2 else '',
                'bottomText': args[3] if len(args) > 3 else '',
            }

    return theme, cover


def find_author(source):
    """从生成模板中取出 author 字段（如 '红樽坊' / '红酒顾问'）。"""
    match = re.search(r"author:\s*'((?:[^'\\]|\\.)*)'", source)
    return match.group(1) if match else None


def literal(node):
    """安全地把 AST 字面量节点转成 Python 值。"""
    return ast.literal_eval(node)


def find_module_date(tree):
    """取出模块级的 DATE 常量作为发布日期。"""
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == 'DATE':
                    try:
                        return str(literal(node.value))
                    except (ValueError, SyntaxError):
                        pass
    return None


def validate_blocks(name, blocks, errors):
    if not isinstance(blocks, list) or not blocks:
        errors.append(f'{name}: content_blocks 为空或不是列表')
        return
    for i, block in enumerate(blocks):
        if not isinstance(block, dict):
            errors.append(f'{name}: 第 {i} 个内容块不是字典')
            continue
        btype = block.get('type')
        if btype not in BLOCK_SPEC:
            errors.append(f'{name}: 第 {i} 个内容块类型未知 -> {btype!r}')
            continue
        spec = BLOCK_SPEC[btype]
        for field in spec['required']:
            if field not in block:
                errors.append(f'{name}: 第 {i} 个 {btype} 块缺少必填字段 {field!r}')
        allowed = set(spec['required']) | set(spec['optional']) | {'type'}
        for field in block:
            if field not in allowed:
                errors.append(f'{name}: 第 {i} 个 {btype} 块含多余字段 {field!r}')


def extract_file(path):
    """解析单个 build_*.py，返回 (articles, date, errors)。"""
    source = open(path, encoding='utf-8').read()
    tree = ast.parse(source, filename=path)
    module_date = find_module_date(tree)
    theme, cover = find_theme_and_cover(tree)
    author = find_author(source)
    articles, errors = [], []

    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        func = node.func
        if not (isinstance(func, ast.Name) and func.id == 'build_article'):
            continue
        if not node.args:
            errors.append(f'{os.path.basename(path)}: build_article 调用缺少位置参数 name')
            continue
        try:
            name = literal(node.args[0])
        except (ValueError, SyntaxError):
            errors.append(f'{os.path.basename(path)}: build_article 的 name 不是字面量')
            continue

        kwargs = {}
        for kw in node.keywords:
            if kw.arg is None:
                continue
            try:
                kwargs[kw.arg] = literal(kw.value)
            except (ValueError, SyntaxError):
                errors.append(f'{os.path.basename(path)}/{name}: 字段 {kw.arg} 不是可静态求值的字面量')

        blocks = kwargs.get('content_blocks', [])
        validate_blocks(name, blocks, errors)

        articles.append({
            'name': name,
            'title': kwargs.get('title', ''),
            'author': author or '',
            'digest': kwargs.get('digest', ''),
            'category': kwargs.get('category', ''),
            'tags': kwargs.get('tags', []),
            'publishDate': module_date or '',
            'theme': theme,
            'cover': cover,
            'source': os.path.basename(path),
            'content': blocks,
        })

    return articles, module_date, errors


def main():
    parser = argparse.ArgumentParser(description='从 build_*.py 提取文章数据为 JSON')
    parser.add_argument('files', nargs='*', help='build_*.py 文件（默认配合 --all 使用）')
    parser.add_argument('--all', action='store_true', help='处理仓库根目录下所有 build_*.py')
    parser.add_argument('--only', default='', help='只提取指定 name，逗号分隔')
    parser.add_argument('--out', default=OUT_DIR, help='输出目录（默认 articles/）')
    parser.add_argument('--dry-run', action='store_true', help='只校验并打印，不写文件')
    parser.add_argument('--strict', action='store_true', help='同名冲突时终止并返回非零退出码')
    args = parser.parse_args()

    if args.all:
        files = sorted(glob(os.path.join(ROOT, 'build_*.py')))
    else:
        files = [f if os.path.isabs(f) else os.path.join(ROOT, f) for f in args.files]

    if not files:
        parser.error('请提供 build_*.py 文件，或使用 --all')

    only = {s.strip() for s in args.only.split(',') if s.strip()}
    all_articles, all_errors, skipped = [], [], []

    for path in files:
        if not os.path.isfile(path):
            print(f'⚠️  跳过（不存在）: {path}')
            continue
        try:
            articles, _, errors = extract_file(path)
        except SyntaxError as exc:
            print(f'❌ 解析失败 {os.path.basename(path)}: {exc}')
            all_errors.append(f'{os.path.basename(path)}: {exc}')
            continue
        all_errors.extend(errors)
        if not articles:
            skipped.append(os.path.basename(path))
            continue
        all_articles.extend(articles)

    if only:
        all_articles = [a for a in all_articles if a['name'] in only]

    # 同名冲突检测：不同 build 文件定义了相同 name，后写入的会覆盖先写入的
    by_name = {}
    for art in all_articles:
        by_name.setdefault(art['name'], []).append(art.get('source', '?'))
    collisions = {n: srcs for n, srcs in by_name.items() if len(srcs) > 1}

    deduped = {}
    for art in all_articles:
        deduped[art['name']] = art  # 后者覆盖前者，保持原行为
    final_articles = list(deduped.values())

    if collisions:
        print(f'⚠️  发现 {len(collisions)} 组同名文章（后者将覆盖前者）:')
        for name, srcs in sorted(collisions.items()):
            print(f'    - {name}: {" vs ".join(srcs)}')
        print('    请人工确认保留哪一份，并重命名另一份')
        if args.strict:
            print('❌ --strict 模式下视为错误，已终止')
            return 1

    if not args.dry_run:
        os.makedirs(args.out, exist_ok=True)
        for art in final_articles:
            dest = os.path.join(args.out, f"{art['name']}.json")
            with open(dest, 'w', encoding='utf-8') as fh:
                json.dump(art, fh, ensure_ascii=False, indent=2)
                fh.write('\n')

    print(f'📄 解析文件: {len(files)}')
    print(f'✅ 提取文章: {len(all_articles)} 篇 / 去重后 {len(final_articles)} 个唯一名称'
          + ('  (dry-run, 未写入)' if args.dry_run else f'  -> {args.out}'))
    if skipped:
        print(f'➖ 无 build_article 定义: {len(skipped)} 个文件')
    if all_errors:
        print(f'⚠️  发现 {len(all_errors)} 个问题:')
        for err in all_errors[:30]:
            print(f'    - {err}')
        if len(all_errors) > 30:
            print(f'    ... 另有 {len(all_errors) - 30} 个')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
