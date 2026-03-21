# AI Image Generation Skill

## Overview

This skill provides capabilities for generating AI images, specifically focused on creating realistic wine-themed cover images for the WeChat MP wine article project.

## Available Image Generation Options

### Option 1: Google Gemini 2.5 Flash (Recommended - Free)

- **API**: Google AI Studio (https://aistudio.google.com/app/apikey)
- **Free Tier**: 500 images/day
- **Model**: gemini-2.0-flash-exp-image-generation
- **Resolution**: 1024x1024 (can crop to 900x383)
- **Setup**: Get free API key, no credit card required

### Option 2: deAPI.ai

- **API**: https://deapi.ai
- **Free Tier**: $5 credits on sign-up
- **Models**: FLUX.1, Stable Diffusion
- **Best for**: High-quality artistic images

### Option 3: OpenRouter

- **API**: https://openrouter.ai
- **Free Tier**: Varies by model
- **Models**: FLUX, Stable Diffusion variants

### Option 4: Self-Hosted (Advanced)

- **Project**: AUTOMATIC1111/stable-diffusion-webui
- **GitHub**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **Docker**: AbdBarho/stable-diffusion-webui-docker
- **Requirements**: GPU with 8GB+ VRAM
- **Best for**: Unlimited generations, full control

## Wine Image Prompts

### Photorealistic Wine Images

```
Prompt: "A crystal wine glass filled with deep red burgundy wine, soft studio lighting, 
elegant reflection on table, dark wooden background, professional product photography, 
shallow depth of field, high detail"

Negative: "blurry, low quality, cartoon, text, watermark, deformed"
```

### Wine Bottle with Glass

```
Prompt: "Premium red wine bottle and glass on wooden table, wine cork, ambient 
candlelight, elegant restaurant setting, dark moody atmosphere, professional 
photography, rich burgundy colors"

Negative: "blurry, overexposed, cartoon, text, watermark"
```

### Vineyard Landscape

```
Prompt: "French Bordeaux vineyard at golden hour, rolling hills, rows of grapevines, 
distant chateau, warm sunset sky, professional landscape photography, breathtaking view"

Negative: "blurry, ugly, deformed, low quality, text, watermark"
```

### Wine & Grapes

```
Prompt: "Fresh wine grapes cluster with wine glass, autumn lighting, professional 
food photography, rich colors, elegant presentation, dark background"

Negative: "blurry, low quality, cartoon, text, watermark"
```

## Implementation

### Generate Image via Google Gemini

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateWineImage(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation"
  });
  
  const prompt = "A crystal wine glass filled with deep red burgundy wine, soft studio lighting, elegant reflection";
  
  const result = await model.generateContent(prompt);
  const image = result.response.candidates[0].content.parts[0].inlineData.data;
  
  return Buffer.from(image, 'base64');
}
```

### Crop to WeChat Cover Size (900x383)

```javascript
const sharp = require('sharp');

async function cropToWeChatCover(imageBuffer) {
  return sharp(imageBuffer)
    .resize(900, 383, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toBuffer();
}
```

## Integration with Cover Generator

The project's cover generator (`coverGenerator.js` and `wine-element-cover.js`) can be extended to use AI-generated images as backgrounds:

1. Generate AI image with wine prompt
2. Crop to 900x383
3. Overlay text using existing cover generator
4. Save and use for WeChat publish

## Next Steps for This Project

1. Get free Google Gemini API key from https://aistudio.google.com/app/apikey
2. Add `GEMINI_API_KEY` to .env
3. Update cover generator to use AI images
4. Generate realistic wine covers

## References

- Google AI Studio: https://aistudio.google.com/
- deAPI: https://deapi.ai
- OpenRouter: https://openrouter.ai
- Stable Diffusion WebUI: https://github.com/AUTOMATIC1111/stable-diffusion-webui
