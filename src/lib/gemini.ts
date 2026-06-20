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

// === YouTube Title Generator ===
export interface TitleResult {
  title: string;
  charCount: number;
  clickbaitScore: number;
  style: string;
}

export async function generateYouTubeTitles(topic: string, style: string = 'mixed'): Promise<TitleResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 15 catchy, SEO-optimized YouTube video titles for: "${topic}". Style preference: ${style}. 
    Each title must be under 100 characters. Include a mix of: curiosity-driven, list-based, how-to, emotional, and question-style titles.
    For each title, estimate a clickbait score from 1-10 (10 = highest click potential, but still honest).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                charCount: { type: Type.NUMBER },
                clickbaitScore: { type: Type.NUMBER },
                style: { type: Type.STRING },
              },
            },
          },
        },
        required: ['titles'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"titles":[]}');
  return result.titles.map((t: any) => ({ ...t, charCount: t.title?.length || 0 }));
}

// === YouTube Description Generator ===
export interface DescriptionResult {
  description: string;
  hashtags: string[];
  chapters: { time: string; title: string }[];
}

export async function generateYouTubeDescription(topic: string, keywords: string = '', timestamps: string = ''): Promise<DescriptionResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive YouTube video description (500+ words) for: "${topic}".
    ${keywords ? `Target keywords: ${keywords}` : ''}
    ${timestamps ? `Include these timestamps/chapters: ${timestamps}` : ''}
    
    The description should include:
    - An engaging opening hook (first 2 lines are most important)
    - Detailed content summary with keywords naturally integrated
    - Timestamps/chapters if applicable
    - A strong call-to-action (subscribe, like, comment)
    - Related video suggestions
    - 15-20 relevant hashtags
    - Social media links placeholder
    - About section placeholder`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
              },
            },
          },
        },
        required: ['description', 'hashtags', 'chapters'],
      },
    },
  });
  return JSON.parse(response.text || '{"description":"","hashtags":[],"chapters":[]}');
}

// === YouTube Tag Generator ===
export interface TagResult {
  tag: string;
  searchVolume: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
}

export async function generateYouTubeTags(topic: string): Promise<TagResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 40 relevant YouTube tags for a video about: "${topic}".
    Include a mix of:
    - High search volume broad tags
    - Medium competition niche tags
    - Long-tail specific tags
    - Related topic tags
    For each tag, estimate search volume (high/medium/low) and competition level (high/medium/low).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tags: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tag: { type: Type.STRING },
                searchVolume: { type: Type.STRING },
                competition: { type: Type.STRING },
              },
            },
          },
        },
        required: ['tags'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"tags":[]}');
  return result.tags;
}

// === YouTube Hashtag Generator ===
export interface HashtagResult {
  hashtag: string;
  category: 'trending' | 'niche' | 'broad' | 'branded';
  estimatedReach: 'high' | 'medium' | 'low';
}

export async function generateYouTubeHashtags(topic: string): Promise<HashtagResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 30 YouTube hashtags for a video about: "${topic}".
    Categorize each as: trending, niche, broad, or branded.
    Estimate reach potential (high/medium/low) for each.
    Include popular YouTube-specific hashtags and niche-specific ones.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hashtags: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hashtag: { type: Type.STRING },
                category: { type: Type.STRING },
                estimatedReach: { type: Type.STRING },
              },
            },
          },
        },
        required: ['hashtags'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"hashtags":[]}');
  return result.hashtags;
}

// === YouTube Script Writer ===
export interface ScriptSection {
  section: string;
  timestamp: string;
  content: string;
  notes: string;
}

export interface ScriptResult {
  title: string;
  hook: string;
  sections: ScriptSection[];
  cta: string;
  outro: string;
  totalDuration: string;
}

export async function generateYouTubeScript(topic: string, duration: string = '10 minutes', style: string = 'educational'): Promise<ScriptResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a complete YouTube video script for: "${topic}"
    Duration: ${duration}
    Style: ${style}
    
    Include:
    - A compelling hook (first 5-10 seconds)
    - Introduction with context
    - Main content sections with timestamps
    - Key talking points for each section
    - Call-to-action (subscribe, like, comment)
    - Outro with end-screen suggestions
    
    Format each section with timestamps, speaking content, and production notes.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                content: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
            },
          },
          cta: { type: Type.STRING },
          outro: { type: Type.STRING },
          totalDuration: { type: Type.STRING },
        },
        required: ['title', 'hook', 'sections', 'cta', 'outro', 'totalDuration'],
      },
    },
  });
  return JSON.parse(response.text || '{"title":"","hook":"","sections":[],"cta":"","outro":"","totalDuration":""}');
}

// === YouTube SEO Score Checker ===
export interface SEOResult {
  overallScore: number;
  titleScore: number;
  descriptionScore: number;
  tagScore: number;
  thumbnailScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywordAnalysis: { keyword: string; frequency: number; recommendation: string }[];
}

export async function checkYouTubeSEO(title: string, description: string, tags: string): Promise<SEOResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the SEO quality of this YouTube video metadata:
    Title: "${title}"
    Description: "${description}"
    Tags: "${tags}"
    
    Score each factor (0-100):
    - Title: length, keyword placement, click appeal, emotional triggers
    - Description: length, keyword density, CTA presence, link structure
    - Tags: relevance, variety, long-tail coverage
    - Thumbnail: suggest improvements based on title
    
    Provide overall score, individual scores, strengths, weaknesses, actionable suggestions, and keyword analysis.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          titleScore: { type: Type.NUMBER },
          descriptionScore: { type: Type.NUMBER },
          tagScore: { type: Type.NUMBER },
          thumbnailScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                frequency: { type: Type.NUMBER },
                recommendation: { type: Type.STRING },
              },
            },
          },
        },
        required: ['overallScore', 'titleScore', 'descriptionScore', 'tagScore', 'thumbnailScore', 'strengths', 'weaknesses', 'suggestions', 'keywordAnalysis'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === YouTube Comment Reply Generator ===
export interface CommentReplyResult {
  replies: { tone: string; reply: string }[];
}

export async function generateCommentReplies(comment: string, tone: string = 'friendly'): Promise<CommentReplyResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 different replies to this YouTube comment:
    Comment: "${comment}"
    Primary tone: ${tone}
    
    Generate replies in these tones:
    1. Friendly and warm
    2. Professional and informative
    3. Humorous and engaging
    4. Enthusiastic and energetic
    5. Concise and appreciative
    
    Each reply should be 1-3 sentences, genuine, and encourage further engagement.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          replies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                reply: { type: Type.STRING },
              },
            },
          },
        },
        required: ['replies'],
      },
    },
  });
  return JSON.parse(response.text || '{"replies":[]}');
}

// === YouTube Video Ideas Generator ===
export interface VideoIdea {
  title: string;
  type: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedViews: 'low' | 'medium' | 'high' | 'viral';
  keywords: string[];
}

export async function generateVideoIdeas(niche: string, count: number = 50): Promise<VideoIdea[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} YouTube video ideas for the niche: "${niche}".
    Include a diverse mix of:
    - Tutorial/How-to videos
    - Review/Comparison videos
    - List/Countdown videos
    - Challenge/Trend videos
    - Storytime/Experience videos
    - News/Update videos
    - Collaboration ideas
    - Series/Recurring content ideas
    
    For each idea, provide: title, type, brief description, difficulty level (easy/medium/hard), estimated views potential (low/medium/high/viral), and 3-5 relevant keywords.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                estimatedViews: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
        required: ['ideas'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"ideas":[]}');
  return result.ideas;
}

// === Blog Post Title Generator ===
export interface BlogTitleResult {
  title: string;
  charCount: number;
  emotionalTrigger: string;
  powerWords: string[];
}

export async function generateBlogTitles(topic: string, tone: string, audience: string): Promise<BlogTitleResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 20 SEO-friendly blog post titles for: "${topic}"
    Tone: ${tone}
    Target audience: ${audience}
    Include emotional trigger words and power words in titles.
    Each title should be under 70 characters for optimal SEO.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                charCount: { type: Type.NUMBER },
                emotionalTrigger: { type: Type.STRING },
                powerWords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
        required: ['titles'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"titles":[]}');
  return result.titles.map((t: any) => ({ ...t, charCount: t.title?.length || 0 }));
}

// === Blog Post Outline Generator ===
export interface OutlineSection {
  heading: string;
  level: 'h2' | 'h3';
  points: string[];
}

export interface BlogOutlineResult {
  title: string;
  introduction: string;
  sections: OutlineSection[];
  conclusion: string;
  faq: { question: string; answer: string }[];
}

export async function generateBlogOutline(topic: string, wordCount: string): Promise<BlogOutlineResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed blog post outline for: "${topic}"
    Target word count: ${wordCount}
    Include: Introduction, H2/H3 headings with key points, Conclusion, and FAQ section (5 questions).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          introduction: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                level: { type: Type.STRING },
                points: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
          conclusion: { type: Type.STRING },
          faq: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
            },
          },
        },
        required: ['title', 'introduction', 'sections', 'conclusion', 'faq'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === Meta Description Generator ===
export interface MetaDescResult {
  description: string;
  charCount: number;
  hasKeyword: boolean;
  hasCTA: boolean;
}

export async function generateMetaDescriptions(content: string): Promise<MetaDescResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 meta description variations for this content: "${content}"
    Each must be 150-160 characters, include primary keyword naturally, and end with a call-to-action.
    Optimize for high CTR in search results.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          descriptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                charCount: { type: Type.NUMBER },
                hasKeyword: { type: Type.BOOLEAN },
                hasCTA: { type: Type.BOOLEAN },
              },
            },
          },
        },
        required: ['descriptions'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"descriptions":[]}');
  return result.descriptions.map((d: any) => ({ ...d, charCount: d.description?.length || 0 }));
}

// === Social Media Post Generator ===
export interface SocialPostResult {
  post: string;
  hashtags: string[];
  emojis: string[];
  charCount: number;
  platform: string;
}

export async function generateSocialPosts(topic: string, platform: string): Promise<SocialPostResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 ${platform} posts about: "${topic}"
    Platform-specific requirements:
    - Twitter: max 280 chars
    - Instagram: engaging captions with emojis, 30 hashtags max
    - Facebook: conversational, 40-80 chars optimal
    - LinkedIn: professional, thought leadership
    Include relevant hashtags and emojis for each.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          posts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                post: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                emojis: { type: Type.ARRAY, items: { type: Type.STRING } },
                charCount: { type: Type.NUMBER },
                platform: { type: Type.STRING },
              },
            },
          },
        },
        required: ['posts'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"posts":[]}');
  return result.posts.map((p: any) => ({ ...p, charCount: p.post?.length || 0 }));
}

// === Content Paraphraser ===
export interface ParaphraseResult {
  text: string;
  tone: string;
  wordCount: number;
}

export async function paraphraseContent(text: string, tone: string): Promise<ParaphraseResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Paraphrase this text in 4 different tones while maintaining the original meaning:
    Original: "${text}"
    Tones: Professional, Casual, Academic, Creative
    Ensure all versions are plagiarism-free and natural-sounding.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          versions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                tone: { type: Type.STRING },
                wordCount: { type: Type.NUMBER },
              },
            },
          },
        },
        required: ['versions'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"versions":[]}');
  return result.versions;
}

// === Grammar Checker ===
export interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
}

export interface GrammarCheckResult {
  correctedText: string;
  errors: GrammarError[];
  readabilityScore: number;
  readabilityLabel: string;
  overallGrade: string;
}

export async function checkGrammar(text: string): Promise<GrammarCheckResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Check this text for grammar, spelling, punctuation, and style errors:
    "${text}"
    Provide: corrected text, list of errors with explanations, readability score (0-100), readability label, and grade level.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: { type: Type.STRING },
          errors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                corrected: { type: Type.STRING },
                explanation: { type: Type.STRING },
                type: { type: Type.STRING },
              },
            },
          },
          readabilityScore: { type: Type.NUMBER },
          readabilityLabel: { type: Type.STRING },
          overallGrade: { type: Type.STRING },
        },
        required: ['correctedText', 'errors', 'readabilityScore', 'readabilityLabel', 'overallGrade'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === Email Subject Line Generator ===
export interface EmailSubjectResult {
  subject: string;
  openRatePrediction: string;
  personalizationToken: string;
  emoji: string;
}

export async function generateEmailSubjectLines(content: string): Promise<EmailSubjectResult[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 15 email subject lines for: "${content}"
    Include open rate predictions, personalization tokens like {{first_name}}, and emoji options.
    Optimize for high open rates. Mix curiosity, urgency, value, and personalization styles.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                openRatePrediction: { type: Type.STRING },
                personalizationToken: { type: Type.STRING },
                emoji: { type: Type.STRING },
              },
            },
          },
        },
        required: ['subjectLines'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"subjectLines":[]}');
  return result.subjectLines;
}

// === Content Calendar Generator ===
export interface CalendarDay {
  day: number;
  date: string;
  platform: string;
  contentType: string;
  topic: string;
  caption: string;
  hashtags: string[];
  bestTime: string;
  category: 'educational' | 'promotional' | 'engagement' | 'entertainment';
}

export async function generateContentCalendar(niche: string, platforms: string[], frequency: string): Promise<CalendarDay[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 30-day content calendar for: "${niche}"
    Platforms: ${platforms.join(', ')}
    Posting frequency: ${frequency}
    Mix content types: educational (40%), promotional (20%), engagement (25%), entertainment (15%)
    Include specific topics, captions, hashtags, and best posting times for each day.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                date: { type: Type.STRING },
                platform: { type: Type.STRING },
                contentType: { type: Type.STRING },
                topic: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                bestTime: { type: Type.STRING },
                category: { type: Type.STRING },
              },
            },
          },
        },
        required: ['calendar'],
      },
    },
  });
  const result = JSON.parse(response.text || '{"calendar":[]}');
  return result.calendar;
}

// === AI Document Summarizer ===
export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: string;
}

export async function summarizeDocument(text: string, length: string): Promise<SummaryResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize this document in ${length} length:
    "${text}"
    Provide a clear summary, extract key points as bullet points, and estimate word count and reading time of the original.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          wordCount: { type: Type.NUMBER },
          readingTime: { type: Type.STRING },
        },
        required: ['summary', 'keyPoints', 'wordCount', 'readingTime'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === AI Code Generator ===
export interface CodeResult {
  code: string;
  explanation: string;
  language: string;
}

export async function generateCode(description: string, language: string): Promise<CodeResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate clean, well-commented ${language} code for: "${description}"
    Include proper error handling, meaningful variable names, and a detailed explanation of how the code works.
    Return production-ready code with comments.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING },
          explanation: { type: Type.STRING },
          language: { type: Type.STRING },
        },
        required: ['code', 'explanation', 'language'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === AI Translator ===
export interface TranslationResult {
  translatedText: string;
  pronunciation: string;
  alternatives: string[];
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<TranslationResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate this text from ${sourceLang} to ${targetLang}:
    "${text}"
    Provide the translation, pronunciation guide, and 2-3 alternative translations if applicable.
    Preserve the original formatting and tone.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translatedText: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['translatedText', 'pronunciation', 'alternatives'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === AI Sentiment Analyzer ===
export interface SentimentResult {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
  emotions: { emotion: string; score: number }[];
  keyPhrases: string[];
  summary: string;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the sentiment and emotions in this text:
    "${text}"
    Provide: overall sentiment (positive/negative/neutral/mixed), confidence score (0-100), emotion breakdown with scores, key phrases, and a brief analysis summary.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overall: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          emotions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                emotion: { type: Type.STRING },
                score: { type: Type.NUMBER },
              },
            },
          },
          keyPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ['overall', 'confidence', 'emotions', 'keyPhrases', 'summary'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}

// === AI Text to Image Prompt Enhancer ===
export async function enhanceImagePrompt(prompt: string, style: string): Promise<{ enhanced: string; suggestions: string[] }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Enhance this image generation prompt for ${style} style:
    "${prompt}"
    Make it more detailed and specific. Provide the enhanced prompt and 3 alternative prompt suggestions.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          enhanced: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['enhanced', 'suggestions'],
      },
    },
  });
  return JSON.parse(response.text || '{}');
}
