/**
 * 数据导入导出模块
 * 支持JSON/CSV格式，用于数据备份和迁移
 */

const fs = require('fs');
const path = require('path');

class DataImporterExporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || './output';
    this.defaultFormat = options.defaultFormat || 'json';
  }

  /**
   * 导出文章数据
   */
  async exportArticles(articles, options = {}) {
    const format = options.format || this.defaultFormat;
    const filename = options.filename || `articles_${Date.now()}`;
    const includeMetadata = options.includeMetadata !== false;

    const data = includeMetadata ? {
      exportedAt: new Date().toISOString(),
      count: articles.length,
      version: '1.0',
      articles
    } : articles;

    const filepath = path.join(this.outputDir, `${filename}.${format}`);

    switch (format) {
      case 'json':
        return this.exportJSON(data, filepath);
      case 'csv':
        return this.exportCSV(articles, filepath);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * 导出为JSON
   */
  async exportJSON(data, filepath) {
    const jsonStr = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(filepath, jsonStr, 'utf-8');
    return { filepath, count: data.articles?.length || 0 };
  }

  /**
   * 导出为CSV
   */
  async exportCSV(articles, filepath) {
    if (!articles.length) {
      await fs.promises.writeFile(filepath, '', 'utf-8');
      return { filepath, count: 0 };
    }

    // 提取所有可能的字段
    const headers = new Set();
    articles.forEach(article => {
      Object.keys(article).forEach(key => headers.add(key));
    });

    const headerArr = Array.from(headers);
    const rows = [headerArr.join(',')];

    articles.forEach(article => {
      const row = headerArr.map(header => {
        const value = article[header];
        if (value === null || value === undefined) return '';
        const str = String(value).replace(/"/g, '""');
        return str.includes(',') || str.includes('"') || str.includes('\n') 
          ? `"${str}"` 
          : str;
      });
      rows.push(row.join(','));
    });

    await fs.promises.writeFile(filepath, rows.join('\n'), 'utf-8');
    return { filepath, count: articles.length };
  }

  /**
   * 导入文章数据
   */
  async importArticles(options = {}) {
    const filepath = options.filepath;
    const format = options.format || path.extname(filepath).slice(1) || 'json';

    if (!filepath || !fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }

    switch (format) {
      case 'json':
        return this.importJSON(filepath);
      case 'csv':
        return this.importCSV(filepath);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * 从JSON导入
   */
  async importJSON(filepath) {
    const content = await fs.promises.readFile(filepath, 'utf-8');
    const data = JSON.parse(content);

    // 处理两种格式：{articles: [...]} 或 [...]
    const articles = Array.isArray(data) ? data : data.articles || [];
    
    return {
      articles,
      count: articles.length,
      importedAt: new Date().toISOString()
    };
  }

  /**
   * 从CSV导入
   */
  async importCSV(filepath) {
    const content = await fs.promises.readFile(filepath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return { articles: [], count: 0 };
    }

    const headers = this.parseCSVLine(lines[0]);
    const articles = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const article = {};
      
      headers.forEach((header, index) => {
        article[header] = values[index] || '';
      });

      articles.push(article);
    }

    return {
      articles,
      count: articles.length,
      importedAt: new Date().toISOString()
    };
  }

  /**
   * 解析CSV行
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }

    result.push(current);
    return result;
  }

  /**
   * 导出配置
   */
  async exportConfig(config, options = {}) {
    const filename = options.filename || `config_${Date.now()}.json`;
    const filepath = path.join(this.outputDir, filename);
    
    // 过滤敏感信息
    const safeConfig = this.filterSensitiveData(config);
    
    await fs.promises.writeFile(filepath, JSON.stringify(safeConfig, null, 2), 'utf-8');
    return { filepath };
  }

  /**
   * 导入配置
   */
  async importConfig(filepath) {
    const content = await fs.promises.readFile(filepath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 过滤敏感数据
   */
  filterSensitiveData(obj) {
    const sensitiveKeys = ['password', 'secret', 'token', 'key', 'apiKey', 'appSecret'];
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const isSensitive = sensitiveKeys.some(sk => 
        key.toLowerCase().includes(sk.toLowerCase())
      );
      
      if (isSensitive) {
        result[key] = '***HIDDEN***';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.filterSensitiveData(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * 批量导出历史文章
   */
  async exportFromHistory(historyDir, options = {}) {
    const format = options.format || 'json';
    const limit = options.limit || 100;
    const outputDir = options.outputDir || this.outputDir;

    const files = await fs.promises.readdir(historyDir);
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, limit);

    const allArticles = [];

    for (const file of jsonFiles) {
      const filepath = path.join(historyDir, file);
      const content = await fs.promises.readFile(filepath, 'utf-8');
      const data = JSON.parse(content);
      
      if (data.articles) {
        allArticles.push(...data.articles);
      }
    }

    const outputFile = path.join(outputDir, `history_export_${Date.now()}.${format}`);
    
    if (format === 'json') {
      await fs.promises.writeFile(outputFile, JSON.stringify({
        exportedAt: new Date().toISOString(),
        count: allArticles.length,
        articles: allArticles
      }, null, 2), 'utf-8');
    }

    return { filepath: outputFile, count: allArticles.length };
  }
}

module.exports = DataImporterExporter;
