/**
 * AI Script Generation Functions for YouTube Script Generator
 * Handles all AI-powered script generation with structured output.
 */
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export type VideoType = 'educational' | 'entertainment' | 'vlog' | 'review' | 'tutorial' | 'storytelling' | 'motivation' | 'tech';
export type Tone = 'professional' | 'funny' | 'emotional' | 'dramatic' | 'informative' | 'engaging' | 'viral';
export type Duration = 'short' | 'medium' | 'long';

export interface ScriptSection {
  section: string;
  timestamp: string;
  content: string;
  notes: string;
  keyPoints: string[];
  retentionTip: string;
}

export interface ScriptResult {
  title: string;
  hook: string;
  intro: string;
  sections: ScriptSection[];
  engagementLines: string[];
  cta: string;
  outro: string;
  totalDuration: string;
  wordCount: number;
  estimatedRetentionScore: number;
  estimatedEngagementScore: number;
  tags: string[];
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  videoType: VideoType;
  tone: Tone;
  duration: Duration;
  prompt: string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'educational',
    name: 'Educational Script',
    description: 'Step-by-step educational content with clear explanations',
    videoType: 'educational',
    tone: 'informative',
    duration: 'medium',
    prompt: 'Create a structured educational script with clear learning objectives, step-by-step explanations, visual cues, and a summary recap.',
  },
  {
    id: 'viral-short',
    name: 'Viral Short Script',
    description: 'Fast-paced, hook-driven short-form content',
    videoType: 'entertainment',
    tone: 'viral',
    duration: 'short',
    prompt: 'Create a fast-paced, attention-grabbing short script with an immediate hook, quick facts or reveals, and a satisfying conclusion.',
  },
  {
    id: 'story',
    name: 'Story Based Script',
    description: 'Narrative-driven content with emotional arc',
    videoType: 'storytelling',
    tone: 'emotional',
    duration: 'medium',
    prompt: 'Create a story-driven script with a compelling narrative arc, character development, emotional beats, and a meaningful conclusion.',
  },
  {
    id: 'review',
    name: 'Review Script',
    description: 'Balanced product or content review with pros/cons',
    videoType: 'review',
    tone: 'professional',
    duration: 'medium',
    prompt: 'Create a balanced review script with product overview, pros, cons, personal experience, rating, and recommendation.',
  },
  {
    id: 'tutorial',
    name: 'Tutorial Script',
    description: 'Hands-on step-by-step tutorial with demonstrations',
    videoType: 'tutorial',
    tone: 'engaging',
    duration: 'long',
    prompt: 'Create a detailed tutorial script with prerequisites, step-by-step instructions, on-screen actions, troubleshooting tips, and final results.',
  },
];

export async function generateYouTubeScript(
  topic: string,
  videoType: VideoType,
  tone: Tone,
  duration: Duration,
  keywords: string = '',
  audience: string = '',
  language: string = 'english'
): Promise<ScriptResult> {
  const durationMap: Record<Duration, string> = {
    short: '1-3 minutes (short-form, approximately 150-450 words)',
    medium: '4-8 minutes (mid-length, approximately 600-1200 words)',
    long: '8-15 minutes (long-form, approximately 1200-2250 words)',
  };

  const toneMap: Record<Tone, string> = {
    professional: 'Professional and authoritative, like a news anchor or industry expert',
    funny: 'Humorous and entertaining, with jokes, sarcasm, and witty observations',
    emotional: 'Emotionally resonant, connecting with viewers on a personal level',
    dramatic: 'Dramatic and cinematic, with suspense, tension, and powerful reveals',
    informative: 'Informative and educational, focused on delivering value and knowledge',
    engaging: 'Conversational and interactive, asking questions and involving the viewer',
    viral: 'High-energy, attention-grabbing, designed for maximum shareability',
  };

  const videoTypeMap: Record<VideoType, string> = {
    educational: 'Educational/How-to content that teaches something valuable',
    entertainment: 'Entertainment-focused content designed to engage and amuse',
    vlog: 'Personal vlog-style content sharing experiences and daily life',
    review: 'Product, service, or content review with honest opinions',
    tutorial: 'Step-by-step tutorial with clear instructions and demonstrations',
    storytelling: 'Story-driven narrative content with emotional arc',
    motivation: 'Motivational or inspirational content that uplifts viewers',
    tech: 'Technology-focused content about gadgets, software, or tech trends',
  };

  const prompt = `Generate a complete, professional YouTube video script for the following:

TOPIC: "${topic}"
VIDEO TYPE: ${videoTypeMap[videoType]}
TONE: ${toneMap[tone]}
DURATION: ${durationMap[duration]}
${keywords ? `KEYWORDS TO INCLUDE: ${keywords}` : ''}
${audience ? `TARGET AUDIENCE: ${audience}` : ''}
LANGUAGE: ${language === 'bangla' ? 'Write the script in Bangla (বাংলা)' : 'Write the script in English'}

IMPORTANT RULES:
- Write in a natural, human tone — NO robotic or AI-sounding language
- The hook must grab attention in the first 5-10 seconds
- Include specific timestamps for each section
- Add production notes for visual/audio cues
- Include key talking points for each section
- Add a retention tip for each section to keep viewers watching
- Include natural engagement boost lines (like, subscribe, comment prompts)
- The CTA should feel organic, not forced
- The outro should suggest end-screen content
- Include relevant tags for the video
- Estimate word count and retention/engagement scores (0-100)

SCRIPT STRUCTURE:
1. HOOK (0:00 - 0:10) — Grab attention immediately
2. INTRO (0:10 - 0:30) — Brief intro, what viewers will learn/gain
3. MAIN SECTIONS — 3-6 content sections with clear transitions
4. ENGAGEMENT BOOST — Natural engagement prompts woven in
5. CTA — Clear call to action
6. OUTRO — Closing with end-screen suggestions

Make it feel like a real YouTuber wrote this script, not an AI.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING },
          intro: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                content: { type: Type.STRING },
                notes: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                retentionTip: { type: Type.STRING },
              },
            },
          },
          engagementLines: { type: Type.ARRAY, items: { type: Type.STRING } },
          cta: { type: Type.STRING },
          outro: { type: Type.STRING },
          totalDuration: { type: Type.STRING },
          wordCount: { type: Type.NUMBER },
          estimatedRetentionScore: { type: Type.NUMBER },
          estimatedEngagementScore: { type: Type.NUMBER },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'hook', 'intro', 'sections', 'engagementLines', 'cta', 'outro', 'totalDuration', 'wordCount', 'estimatedRetentionScore', 'estimatedEngagementScore', 'tags'],
      },
    },
  });

  return JSON.parse(response.text || '{}') as ScriptResult;
}
