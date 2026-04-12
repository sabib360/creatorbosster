import { GoogleGenAI, Type } from '@google/genai';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// @ts-ignore
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface CTRAnalysis {
  predictedCTR: string;
  confidenceScore: number;
  visualAppealScore: number;
  titleStrengthScore: number;
  seoScore: number;
  strengths: string[];
  weaknesses: string[];
  optimizationTips: string[];
  audienceSentiment: string;
}

export interface YoutubeIdeas {
  titles: {
    viral: string[];
    curiosity: string[];
    emotional: string[];
    seo: string[];
    short: string[];
    long: string[];
  };
  thumbnailTexts: string[];
  hookLines: string[];
  thumbnailIdeas: string[];
  description: string;
  tags: string[];
  hashtags: string[];
  ctrAnalysis?: CTRAnalysis;
}

export async function generateYoutubeIdeas(topic: string): Promise<YoutubeIdeas> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate YouTube video ideas for the topic: "${topic}". Provide titles in different styles (at least 3 each), short bold thumbnail texts (at least 5), engaging hook lines (at least 3), thumbnail visual ideas (at least 3), a SEO-friendly description, and tags/hashtags.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.OBJECT,
            properties: {
              viral: { type: Type.ARRAY, items: { type: Type.STRING } },
              curiosity: { type: Type.ARRAY, items: { type: Type.STRING } },
              emotional: { type: Type.ARRAY, items: { type: Type.STRING } },
              seo: { type: Type.ARRAY, items: { type: Type.STRING } },
              short: { type: Type.ARRAY, items: { type: Type.STRING } },
              long: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          thumbnailTexts: { type: Type.ARRAY, items: { type: Type.STRING } },
          hookLines: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["titles", "thumbnailTexts", "hookLines", "thumbnailIdeas", "description", "tags", "hashtags"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export interface CompetitorAnalysis {
  betterTitles: string[];
  betterThumbnailTexts: string[];
  ctrSuggestions: string[];
}

export async function analyzeCompetitor(competitorTitle: string): Promise<CompetitorAnalysis> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this competitor YouTube video title: "${competitorTitle}". Suggest 5 better titles, 5 better short bold thumbnail texts, and 3 CTR improvement suggestions.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          betterTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
          betterThumbnailTexts: { type: Type.ARRAY, items: { type: Type.STRING } },
          ctrSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["betterTitles", "betterThumbnailTexts", "ctrSuggestions"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeCTR(ideas: YoutubeIdeas): Promise<CTRAnalysis> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these YouTube video ideas and predict CTR. 
    Titles: ${JSON.stringify(ideas.titles)}
    Thumbnail Ideas: ${JSON.stringify(ideas.thumbnailIdeas)}
    Thumbnail Texts: ${JSON.stringify(ideas.thumbnailTexts)}
    Description: ${ideas.description}
    
    Provide a detailed CTR analysis including predicted CTR percentage, confidence score (0-100), visual appeal score (0-100), title strength score (0-100), SEO score (0-100), key strengths, weaknesses, optimization tips, and predicted audience sentiment.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictedCTR: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          visualAppealScore: { type: Type.NUMBER },
          titleStrengthScore: { type: Type.NUMBER },
          seoScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          optimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          audienceSentiment: { type: Type.STRING },
        },
        required: ["predictedCTR", "confidenceScore", "visualAppealScore", "titleStrengthScore", "seoScore", "strengths", "weaknesses", "optimizationTips", "audienceSentiment"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function generateThumbnailImages(prompt: string, count: number = 3): Promise<string[]> {
  const generateSingleImage = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `YouTube thumbnail, high contrast, viral clickbait style, no watermark. ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9',
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No image generated in response.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response parts.");
  };

  const imagePromises = Array.from({ length: count }, () => generateSingleImage());
  return Promise.all(imagePromises);
}

export async function generateVideo(prompt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  const videoApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const aiInstance = new GoogleGenAI({ apiKey: videoApiKey });

  let operation = await aiInstance.models.generateVideos({
    model: 'veo-3.1-lite-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await aiInstance.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Failed to generate video.");
  }

  const fetchApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': fetchApiKey,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch video.");
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
