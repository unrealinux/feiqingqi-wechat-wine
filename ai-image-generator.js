/**
 * AI Image Generation Module
 * Supports domestic (Chinese) and international AI image APIs
 */

require('dotenv').config();
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Wine-themed prompts for AI image generation
const WINE_PROMPTS = {
  wineglass: {
    prompt: "A crystal wine glass filled with deep red burgundy wine, soft studio lighting, elegant reflection on table, dark wooden background, professional product photography, shallow depth of field, high detail, dark moody atmosphere",
    negative: "blurry, low quality, cartoon, text, watermark, deformed, overexposed"
  },
  bottle: {
    prompt: "Premium red wine bottle and glass on wooden table, wine cork, ambient candlelight, elegant restaurant setting, dark moody atmosphere, professional photography, rich burgundy colors",
    negative: "blurry, overexposed, cartoon, text, watermark, ugly"
  },
  vineyard: {
    prompt: "French Bordeaux vineyard at golden hour, rolling hills, rows of grapevines, distant chateau, warm sunset sky, professional landscape photography, breathtaking view, wine country",
    negative: "blurry, ugly, deformed, low quality, text, watermark, modern building"
  },
  grapes: {
    prompt: "Fresh wine grapes cluster with wine glass, autumn lighting, professional food photography, rich colors, elegant presentation, dark background, wine making",
    negative: "blurry, low quality, cartoon, text, watermark"
  },
  luxury: {
    prompt: "Elegant wine tasting setup, crystal decanter, premium red wine bottles, mahogany table, leather, warm ambient lighting, luxury lifestyle, professional photography",
    negative: "blurry, low quality, cartoon, text, watermark, modern"
  }
};

/**
 * Generate AI image using GLM-Image (智谱AI - 国内)
 */
async function generateWithGLM(apiKey, prompt) {
  console.log('Generating image with GLM-Image (智谱AI)...');
  
  const response = await fetch(
    'https://open.bigmodel.cn/api/paas/v4/images/generations',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'cogview-4',
        prompt: prompt,
        size: '1024x1024'
      })
    }
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`GLM API error: ${response.status} - ${JSON.stringify(data)}`);
  }
  
  if (!data.data || !data.data[0] || !data.data[0].url) {
    throw new Error('No image in GLM response');
  }
  
  // Download image from URL
  const imageResponse = await fetch(data.data[0].url);
  const imageBuffer = await imageResponse.arrayBuffer();
  
  return Buffer.from(imageBuffer);
}

/**
 * Generate AI image using Z-Image (阿里通义 - 国内)
 */
async function generateWithZImage(apiKey, prompt) {
  console.log('Generating image with Z-Image (阿里通义)...');
  
  const response = await fetch(
    'https://api.modelscope.cn/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'z-image-turbo',
        prompt: prompt,
        negative_prompt: 'blurry, low quality, cartoon, text, watermark',
        steps: 8,
        width: 1024,
        height: 1024
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Z-Image API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  if (!data.data || !data.data[0] || !data.data[0].image) {
    throw new Error('No image in Z-Image response');
  }
  
  const imageData = data.data[0].image;
  return Buffer.from(imageData, 'base64');
}

/**
 * Generate AI image using Google Gemini (International)
 */
async function generateWithGemini(apiKey, prompt, negativePrompt) {
  const fullPrompt = `${prompt}. ${negativePrompt ? `Negative: ${negativePrompt}` : ''}`;
  
  console.log('Generating image with Google Gemini...');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          responseModalities: "image"
        }
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    throw new Error('No image in Gemini response');
  }
  
  const imagePart = data.candidates[0].content.parts.find(part => part.inlineData);
  
  if (!imagePart) {
    throw new Error('No image generated');
  }
  
  return Buffer.from(imagePart.inlineData.data, 'base64');
}

/**
 * Crop and resize image to WeChat cover size (900x383)
 */
async function cropToWeChatCover(imageBuffer) {
  return sharp(imageBuffer)
    .resize(900, 383, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toBuffer();
}

/**
 * Add text overlay to wine image
 */
async function addTextOverlay(imageBuffer, title, subtitle, date) {
  const textY = 320;
  const accentColor = '#D4AF37';
  
  const titleLines = [];
  let line = '';
  const maxChars = 22;
  
  for (const char of title) {
    if (line.length >= maxChars && char !== ' ') {
      titleLines.push(line);
      line = char;
    } else {
      line += char;
    }
  }
  titleLines.push(line);
  
  let svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#D4AF37"/>
        <stop offset="100%" style="stop-color:#F4E4BC"/>
      </linearGradient>
    </defs>
    <style>
      .title { font-family: Microsoft YaHei, PingFang SC; font-weight: bold; }
      .subtitle { font-family: Microsoft YaHei, PingFang SC; }
      .date { font-family: Microsoft YaHei, PingFang SC; }
    </style>
  `;
  
  svg += `<rect x="0" y="250" width="900" height="133" fill="rgba(0,0,0,0.6)"/>`;
  
  const titleStartY = textY;
  titleLines.forEach((line, i) => {
    svg += `<text x="30" y="${titleStartY + i * 38}" class="title" font-size="32" fill="url(#textGrad)">${escapeXml(line)}</text>`;
  });
  
  if (subtitle) {
    svg += `<text x="30" y="${titleStartY + titleLines.length * 38 + 15}" class="subtitle" font-size="18" fill="rgba(255,255,255,0.8)">${escapeXml(subtitle)}</text>`;
  }
  
  if (date) {
    svg += `<text x="870" y="365" class="date" font-size="14" fill="${accentColor}" text-anchor="end" opacity="0.9">${escapeXml(date)}</text>`;
  }
  
  svg += `</svg>`;
  
  const textBuffer = Buffer.from(svg);
  
  return sharp(imageBuffer)
    .composite([{
      input: textBuffer,
      top: 0,
      left: 0
    }])
    .png()
    .toBuffer();
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Main function to generate wine cover
 */
async function generateWineCover(options = {}) {
  const {
    title = '2026年红酒市场分析',
    subtitle = '投资机遇与市场趋势',
    element = 'wineglass',
    date = new Date().toISOString().slice(0, 7),
    outputPath = path.join(__dirname, 'output', 'ai_wine_cover.png')
  } = options;
  
  // Check for API keys
  const glmKey = process.env.GLM_API_KEY;
  const zImageKey = process.env.ZIMAGE_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  let imageBuffer = null;
  let usedProvider = null;
  
  // Priority: Domestic providers first
  
  // Try GLM (智谱AI)
  if (!imageBuffer && glmKey) {
    try {
      const promptData = WINE_PROMPTS[element] || WINE_PROMPTS.wineglass;
      imageBuffer = await generateWithGLM(glmKey, promptData.prompt);
      usedProvider = 'GLM-Image (智谱AI)';
      console.log('✓ Generated with GLM-Image (智谱AI)');
    } catch (err) {
      console.log('✗ GLM failed:', err.message);
    }
  }
  
  // Try Z-Image (阿里通义)
  if (!imageBuffer && zImageKey) {
    try {
      const promptData = WINE_PROMPTS[element] || WINE_PROMPTS.wineglass;
      imageBuffer = await generateWithZImage(zImageKey, promptData.prompt);
      usedProvider = 'Z-Image (阿里通义)';
      console.log('✓ Generated with Z-Image (阿里通义)');
    } catch (err) {
      console.log('✗ Z-Image failed:', err.message);
    }
  }
  
  // Try Gemini (Google)
  if (!imageBuffer && geminiKey) {
    try {
      const promptData = WINE_PROMPTS[element] || WINE_PROMPTS.wineglass;
      imageBuffer = await generateWithGemini(geminiKey, promptData.prompt, promptData.negative);
      usedProvider = 'Google Gemini';
      console.log('✓ Generated with Google Gemini');
    } catch (err) {
      console.log('✗ Gemini failed:', err.message);
    }
  }
  
  // Fallback to gradient if no API keys
  if (!imageBuffer) {
    console.log('⚠ No API keys found or all failed, using gradient fallback');
    imageBuffer = await createGradientFallback(element);
    usedProvider = 'Gradient (Fallback)';
  }
  
  console.log(`📌 Provider used: ${usedProvider}`);
  
  // Crop to WeChat cover size
  imageBuffer = await cropToWeChatCover(imageBuffer);
  
  // Add text overlay
  imageBuffer = await addTextOverlay(imageBuffer, title, subtitle, date);
  
  // Save
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`✓ Cover saved to: ${outputPath}`);
  
  return { path: outputPath, provider: usedProvider };
}

/**
 * Create gradient fallback when no API available
 */
async function createGradientFallback(element) {
  const gradients = {
    wineglass: ['#1a0a10', '#2d1424', '#4a1a2e'],
    bottle: ['#1a0f15', '#2d1820', '#4a1a28'],
    vineyard: ['#1a1a0f', '#2d2d18', '#4a4a1a'],
    grapes: ['#1a1020', '#2d1a30', '#4a1a3a'],
    luxury: ['#1a0a08', '#2d1410', '#4a1a18']
  };
  
  const colors = gradients[element] || gradients.wineglass;
  
  const svg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]}"/>
        <stop offset="50%" style="stop-color:${colors[1]}"/>
        <stop offset="100%" style="stop-color:${colors[2]}"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#grad)"/>
  </svg>`;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer();
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    title: args[0] || '🍷 2026年Liv-ex精品葡萄酒市场报告',
    subtitle: args[1] || '复苏信号明显，投资机会显现',
    element: args[2] || 'wineglass',
    date: args[3] || new Date().toISOString().slice(0, 7)
  };
  
  console.log('='.repeat(50));
  console.log('AI Wine Cover Generator (支持国内外API)');
  console.log('='.repeat(50));
  console.log('Options:', options);
  console.log('');
  
  generateWineCover(options)
    .then(result => {
      console.log('');
      console.log('✅ Done! Cover generated:', result.path);
      console.log('📌 Provider:', result.provider);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { generateWineCover, WINE_PROMPTS };
