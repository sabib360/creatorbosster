import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, ArrowLeft, ExternalLink, Video, FileText, Download, Star, Clock, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  views: number;
  rating: number;
  content: string;
  steps?: string[];
  tips?: string[];
  relatedTools?: string[];
}

const tutorials: Tutorial[] = [
  // AI Tools Tutorials
  {
    id: 'ai-thumbnail-generator-guide',
    title: 'Complete Guide to AI Thumbnail Generator',
    description: 'Learn how to create stunning YouTube thumbnails using AI technology',
    category: 'AI Tools',
    difficulty: 'beginner',
    readTime: 15,
    views: 15420,
    rating: 4.8,
    content: `# Complete Guide to AI Thumbnail Generator

## Introduction
The AI Thumbnail Generator is a powerful tool that helps content creators create professional YouTube thumbnails using artificial intelligence. This comprehensive guide will walk you through every aspect of using this tool effectively.

## What is AI Thumbnail Generator?
AI Thumbnail Generator uses advanced machine learning algorithms to analyze your video content and generate eye-catching thumbnails that are optimized for maximum click-through rates.

## Getting Started
1. Navigate to the AI Thumbnail Generator tool
2. Upload your video or provide a description
3. Customize the AI-generated thumbnail
4. Download your final thumbnail

## Step-by-Step Tutorial

### Step 1: Access the Tool
- Go to the AI Tools section
- Click on "AI Thumbnail Generator"
- The tool will load in your browser

### Step 2: Input Your Content
- Upload a video file (MP4, MOV, AVI)
- Or provide a text description of your video
- Include relevant keywords for better results

### Step 3: Generate Thumbnails
- Click the "Generate Thumbnails" button
- Wait for the AI to process your content
- Review the generated options

### Step 4: Customize Your Thumbnail
- Select your preferred thumbnail
- Adjust colors, text, and layout
- Add your branding elements

### Step 5: Download and Use
- Download your final thumbnail
- Upload to YouTube
- Monitor performance metrics

## Advanced Features
- Batch thumbnail generation
- Custom templates
- Brand color integration
- A/B testing capabilities

## Tips for Best Results
- Use high-quality video input
- Include relevant keywords
- Test multiple variations
- Follow YouTube's thumbnail guidelines

## Common Issues and Solutions
- Low-quality input images
- Incorrect aspect ratios
- Text readability issues
- Color optimization problems

## Conclusion
The AI Thumbnail Generator is an essential tool for content creators looking to increase their video engagement and click-through rates.`,
    steps: [
      'Navigate to AI Tools section and click AI Thumbnail Generator',
      'Upload your video file or provide text description',
      'Click Generate Thumbnails and wait for AI processing',
      'Customize the generated thumbnail with your branding',
      'Download and use your thumbnail on YouTube'
    ],
    tips: [
      'Use high-quality video input for better results',
      'Include relevant keywords in your description',
      'Test multiple thumbnail variations',
      'Follow YouTube\'s 1280x720px recommendation',
      'Ensure text is readable at small sizes'
    ],
    relatedTools: ['Background Remover', 'Image Analyzer', 'Image Compressor']
  },
  {
    id: 'background-remover-tutorial',
    title: 'How to Remove Backgrounds from Images Using AI',
    description: 'Step-by-step guide to removing image backgrounds with AI technology',
    category: 'AI Tools',
    difficulty: 'beginner',
    readTime: 10,
    views: 12350,
    rating: 4.7,
    content: `# How to Remove Backgrounds from Images Using AI

## Overview
Background removal is essential for creating professional images for e-commerce, social media, and marketing materials. Our AI-powered tool makes this process simple and accurate.

## Why Use AI Background Removal?
- Precision and accuracy
- Time-saving automation
- Professional results
- No manual editing required

## Step-by-Step Process

### Step 1: Upload Your Image
- Supported formats: JPG, PNG, WebP
- Maximum file size: 10MB
- Recommended resolution: 1000x1000px or higher

### Step 2: AI Processing
- The AI analyzes the image
- Identifies foreground and background
- Creates a precise mask

### Step 3: Review and Refine
- Check the edges for accuracy
- Use the refinement tools if needed
- Adjust the mask if necessary

### Step 4: Download Results
- Choose transparent background
- Or select a new background color/image
- Download in your preferred format

## Best Practices
- Use high-contrast images
- Ensure good lighting
- Avoid complex backgrounds
- Test with different image types

## Common Applications
- Product photography
- Profile pictures
- Marketing materials
- Social media content`,
    steps: [
      'Upload your image in JPG, PNG, or WebP format',
      'Wait for AI to process and identify the background',
      'Review the automatic selection and refine if needed',
      'Choose your preferred background option',
      'Download your processed image'
    ],
    tips: [
      'Use images with clear subject-background separation',
      'Higher resolution images give better results',
      'Avoid images with complex or similar-colored backgrounds',
      'Test the refinement tools for edge perfection'
    ],
    relatedTools: ['Image Compressor', 'Image Resizer', 'Image Converter']
  },
  
  // Image Tools Tutorials
  {
    id: 'image-compression-guide',
    title: 'Complete Guide to Image Compression',
    description: 'Learn how to compress images without losing quality for web optimization',
    category: 'Image Tools',
    difficulty: 'intermediate',
    readTime: 20,
    views: 18920,
    rating: 4.9,
    content: `# Complete Guide to Image Compression

## Understanding Image Compression
Image compression is the process of reducing file size while maintaining acceptable quality. This is crucial for web performance and user experience.

## Types of Compression
- **Lossy Compression**: Reduces file size by removing some data
- **Lossless Compression**: Reduces size without losing any data
- **Adaptive Compression**: Smart compression based on content

## When to Use Compression
- Website optimization
- Email attachments
- Social media uploads
- Mobile app development

## Step-by-Step Compression Guide

### Step 1: Choose Your Images
- Select images for compression
- Check current file sizes
- Identify target size requirements

### Step 2: Select Compression Settings
- Choose compression level (1-100)
- Select output format
- Set quality preferences

### Step 3: Preview Results
- Compare before and after
- Check for quality loss
- Adjust settings if needed

### Step 4: Batch Processing
- Process multiple images
- Apply consistent settings
- Monitor progress

### Step 5: Download and Implement
- Download compressed images
- Replace original files
- Test website performance

## Advanced Techniques
- Progressive JPEGs
- WebP format conversion
- Smart cropping
- Responsive image solutions

## Quality vs. Size Balance
- Find the sweet spot for your use case
- Test different compression levels
- Consider your audience's internet speed
- Monitor loading times

## Common Mistakes to Avoid
- Over-compression leading to poor quality
- Not testing on different devices
- Ignoring format optimization
- Forgetting about mobile users`,
    steps: [
      'Select images you want to compress',
      'Choose compression level and output format',
      'Preview compressed results and adjust settings',
      'Process multiple images with batch compression',
      'Download and implement compressed images'
    ],
    tips: [
      'Start with moderate compression (70-80%) and adjust',
      'Use WebP format for better compression ratios',
      'Test compressed images on different devices',
      'Keep original high-quality images as backup'
    ],
    relatedTools: ['Image Resizer', 'Image Converter', 'Bulk Compressor']
  },
  {
    id: 'image-resizing-tutorial',
    title: 'How to Resize Images for Different Platforms',
    description: 'Complete guide to resizing images for social media, web, and print',
    category: 'Image Tools',
    difficulty: 'beginner',
    readTime: 12,
    views: 15670,
    rating: 4.6,
    content: `# How to Resize Images for Different Platforms

## Why Image Resizing Matters
Different platforms require different image dimensions. Proper resizing ensures your images look great everywhere they appear.

## Common Image Sizes
- **Instagram Post**: 1080x1080px
- **Instagram Story**: 1080x1920px
- **Facebook Cover**: 851x315px
- **Twitter Header**: 1500x500px
- **YouTube Thumbnail**: 1280x720px

## Resizing Techniques
- **Maintain Aspect Ratio**: Prevent image distortion
- **Smart Cropping**: Focus on important areas
- **Batch Resizing**: Process multiple images
- **Custom Dimensions**: Specific size requirements

## Step-by-Step Resizing

### Step 1: Upload Your Image
- Drag and drop or click to upload
- Supported formats: JPG, PNG, WebP, GIF
- Maximum file size: 50MB

### Step 2: Choose Resize Method
- Maintain aspect ratio
- Custom dimensions
- Preset sizes for platforms
- Smart cropping options

### Step 3: Set Dimensions
- Enter width and height
- Select units (pixels, percentage)
- Choose resize algorithm

### Step 4: Preview and Adjust
- See real-time preview
- Compare with original
- Fine-tune settings

### Step 5: Download Results
- Choose output format
- Select quality settings
- Download resized image

## Platform-Specific Guidelines
- Social media aspect ratios
- Web optimization requirements
- Print resolution standards
- Mobile responsiveness

## Best Practices
- Always maintain quality
- Use appropriate file formats
- Test on target platforms
- Keep original files`,
    steps: [
      'Upload your image file',
      'Choose resize method (maintain ratio, custom, or preset)',
      'Set target dimensions or select platform preset',
      'Preview the resized image and adjust if needed',
      'Download in your preferred format'
    ],
    tips: [
      'Always maintain aspect ratio to avoid distortion',
      'Use platform presets for social media optimization',
      'Test resized images on actual platforms',
      'Keep original high-resolution images as backup'
    ],
    relatedTools: ['Image Compressor', 'Image Cropper', 'Image Converter']
  },

  // PDF Tools Tutorials
  {
    id: 'pdf-merger-guide',
    title: 'How to Merge Multiple PDF Files',
    description: 'Complete guide to combining PDF documents into one file',
    category: 'PDF Tools',
    difficulty: 'beginner',
    readTime: 8,
    views: 21450,
    rating: 4.8,
    content: `# How to Merge Multiple PDF Files

## Why Merge PDFs?
- Combine related documents
- Create comprehensive reports
- Organize project files
- Simplify document sharing

## Use Cases
- Business reports
- Academic papers
- Legal documents
- Personal organization

## Step-by-Step PDF Merging

### Step 1: Upload PDF Files
- Drag and drop multiple PDFs
- Click to select files
- Rearrange file order if needed

### Step 2: Organize Files
- Change file order
- Remove unwanted files
- Add more files if needed

### Step 3: Configure Settings
- Choose page ranges
- Set output options
- Select compression level

### Step 4: Merge and Download
- Click merge button
- Wait for processing
- Download combined PDF

## Advanced Features
- Selective page merging
- Bookmark preservation
- Form field handling
- Metadata management

## Tips for Best Results
- Check file compatibility
- Ensure proper page order
- Verify merged content
- Test on different devices

## Common Issues
- Password-protected PDFs
- Corrupted files
- Large file sizes
- Format incompatibilities`,
    steps: [
      'Upload multiple PDF files by dragging or selecting',
      'Arrange files in desired order',
      'Configure merge settings and page ranges',
      'Click merge and wait for processing',
      'Download your combined PDF file'
    ],
    tips: [
      'Arrange files in the order you want them merged',
      'Check that all PDFs are not password-protected',
      'Consider file size if merging many documents',
      'Test the merged PDF for formatting issues'
    ],
    relatedTools: ['PDF Splitter', 'PDF Compressor', 'PDF Converter']
  },
  {
    id: 'pdf-splitter-tutorial',
    title: 'How to Split PDF Files into Separate Pages',
    description: 'Learn to extract pages from PDF documents efficiently',
    category: 'PDF Tools',
    difficulty: 'beginner',
    readTime: 10,
    views: 18760,
    rating: 4.7,
    content: `# How to Split PDF Files into Separate Pages

## When to Split PDFs
- Extract specific chapters
- Separate invoice pages
- Create individual worksheets
- Share relevant sections only

## Splitting Options
- **Page Range**: Extract specific pages
- **Every Page**: Create single-page PDFs
- **Bookmark Sections**: Split by bookmarks
- **Custom Groups**: Group pages as needed

## Step-by-Step Splitting

### Step 1: Upload PDF
- Select your PDF file
- Preview page thumbnails
- Check total page count

### Step 2: Choose Split Method
- Select page range
- Choose split frequency
- Set naming convention

### Step 3: Configure Output
- Select output format
- Set quality options
- Choose destination

### Step 4: Process and Download
- Start splitting process
- Monitor progress
- Download individual files

## Advanced Splitting
- Multiple page ranges
- Batch processing
- Template-based naming
- Automatic organization

## Best Practices
- Verify page numbers
- Check content continuity
- Test output files
- Organize results properly

## Common Applications
- Chapter extraction
- Invoice separation
- Worksheet creation
- Document sharing`,
    steps: [
      'Upload your PDF file and preview pages',
      'Choose split method (page range, every page, or bookmark)',
      'Configure output settings and naming convention',
      'Start the splitting process',
      'Download your split PDF files'
    ],
    tips: [
      'Double-check page numbers before splitting',
      'Use descriptive names for split files',
      'Test each split file for completeness',
      'Consider organizing split files in folders'
    ],
    relatedTools: ['PDF Merger', 'PDF Remover', 'PDF Converter']
  },

  // Finance Tools Tutorials
  {
    id: 'loan-emi-calculator-guide',
    title: 'Complete Guide to Loan EMI Calculator',
    description: 'How to calculate and manage your loan EMIs effectively',
    category: 'Finance Tools',
    difficulty: 'intermediate',
    readTime: 18,
    views: 32150,
    rating: 4.9,
    content: `# Complete Guide to Loan EMI Calculator

## Understanding EMI
EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.

## EMI Calculation Formula
\[
EMI = P \times r \times \frac{(1+r)^n}{(1+r)^n-1}
\]
Where:
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of monthly installments

## Types of Loans
- **Home Loan**: Long-term, lower interest
- **Personal Loan**: Short-term, higher interest
- **Car Loan**: Medium-term, moderate interest
- **Education Loan**: Special terms and conditions

## Step-by-Step EMI Calculation

### Step 1: Enter Loan Details
- Principal amount (₹1,00,000 - ₹1,00,00,000)
- Interest rate (5% - 20% per annum)
- Loan tenure (1 - 30 years)
- Processing fees (if any)

### Step 2: Calculate EMI
- Click calculate button
- Review monthly EMI amount
- Check total interest payable
- Verify total payment amount

### Step 3: Analyze Results
- Monthly payment breakdown
- Principal vs. interest ratio
- Amortization schedule
- Year-wise payment details

### Step 4: Compare Options
- Different loan amounts
- Various interest rates
- Multiple tenure options
- Find最适合 option

### Step 5: Plan Repayment
- Monthly budget allocation
- Prepayment strategies
- Interest-saving tips
- Emergency fund planning

## Advanced Features
- Prepayment calculations
- Part-payment effects
- Interest rate changes
- Refinancing analysis

## Tips for Loan Management
- Maintain good credit score
- Compare multiple lenders
- Negotiate interest rates
- Plan for emergencies

## Common Mistakes to Avoid
- Ignoring processing fees
- Not considering inflation
- Over-borrowing
- Missing payment deadlines

## EMI Management Strategies
- Automate payments
- Create repayment buffer
- Monitor interest changes
- Consider prepayment options`,
    steps: [
      'Enter loan amount, interest rate, and tenure',
      'Click calculate to see your monthly EMI',
      'Review the detailed payment breakdown',
      'Compare different loan scenarios',
      'Download the amortization schedule'
    ],
    tips: [
      'Always compare offers from multiple lenders',
      'Consider the total cost, not just monthly EMI',
      'Plan for interest rate fluctuations in variable loans',
      'Keep some buffer for unexpected expenses'
    ],
    relatedTools: ['SIP Calculator', 'Budget Planner', 'Currency Converter']
  },
  {
    id: 'sip-calculator-tutorial',
    title: 'How to Use SIP Calculator for Investment Planning',
    description: 'Complete guide to Systematic Investment Plan calculations',
    category: 'Finance Tools',
    difficulty: 'intermediate',
    readTime: 15,
    views: 28930,
    rating: 4.8,
    content: `# How to Use SIP Calculator for Investment Planning

## What is SIP?
Systematic Investment Plan (SIP) is an investment strategy where you invest a fixed amount regularly in mutual funds.

## Benefits of SIP
- **Rupee Cost Averaging**: Buy more units when prices are low
- **Power of Compounding**: Earn returns on returns
- **Disciplined Investing**: Regular investment habit
- **Flexibility**: Start with small amounts

## SIP Calculation Formula
\[
FV = P \times \frac{[(1+r)^n - 1]}{r} \times (1+r)
\]
Where:
- FV = Future Value
- P = Monthly investment amount
- r = Expected monthly return rate
- n = Number of months

## Step-by-Step SIP Calculation

### Step 1: Enter Investment Details
- Monthly investment amount (₹500 - ₹1,00,000)
- Expected annual return (8% - 25%)
- Investment period (1 - 30 years)
- Step-up percentage (annual increase)

### Step 2: Calculate Returns
- Click calculate button
- Review future value
- Check total investment
- Analyze wealth gained

### Step 3: Analyze Growth
- Year-wise growth chart
- Compound interest effect
- Investment vs. returns ratio
- Inflation-adjusted returns

### Step 4: Compare Scenarios
- Different investment amounts
- Various return rates
- Multiple time periods
- Step-up vs. fixed SIP

### Step 5: Plan Strategy
- Set realistic goals
- Choose appropriate funds
- Monitor performance
- Adjust as needed

## Advanced SIP Features
- Step-up SIP calculations
- Goal-based planning
- Risk assessment tools
- Tax benefit analysis

## SIP Best Practices
- Start early, invest regularly
- Increase investment with income growth
- Diversify across fund types
- Stay invested for long term

## Common SIP Mistakes
- Stopping during market downturns
- Not reviewing performance regularly
- Investing without goals
- Ignoring inflation impact

## Types of SIP
- **Regular SIP**: Fixed amount monthly
- **Step-up SIP**: Increasing amount yearly
- **Flexible SIP**: Variable amount
- **Trigger SIP**: Invest on market events

## Goal Planning with SIP
- Retirement planning
- Children's education
- Home purchase
- Emergency fund creation`,
    steps: [
      'Enter monthly investment amount and expected returns',
      'Set investment period and step-up percentage',
      'Calculate future value and wealth gained',
      'Analyze year-wise growth projections',
      'Download detailed investment report'
    ],
    tips: [
      'Start SIP early to maximize compounding benefits',
      'Increase investment amount annually (step-up)',
      'Choose diversified mutual funds for better returns',
      'Stay invested for long-term despite market volatility'
    ],
    relatedTools: ['Loan EMI Calculator', 'Budget Planner', 'FDCalculator']
  },

  // Social Media Tools Tutorials
  {
    id: 'hashtag-generator-guide',
    title: 'Complete Guide to Instagram Hashtag Generator',
    description: 'How to generate trending hashtags for maximum reach',
    category: 'Social Media Tools',
    difficulty: 'beginner',
    readTime: 12,
    views: 42180,
    rating: 4.9,
    content: `# Complete Guide to Instagram Hashtag Generator

## Why Hashtags Matter
Hashtags are crucial for content discovery on Instagram. They help your posts reach beyond your followers and increase engagement.

## Hashtag Strategy
- **Mix of sizes**: Use popular, medium, and niche hashtags
- **Relevance**: Match hashtags to your content
- **Quantity**: Use 10-30 hashtags per post
- **Research**: Find trending and relevant tags

## Step-by-Step Hashtag Generation

### Step 1: Describe Your Content
- Enter post description
- Include key topics
- Mention target audience
- Add relevant keywords

### Step 2: Select Platform
- Choose Instagram
- Select TikTok (if needed)
- Set content type
- Define audience demographics

### Step 3: Generate Hashtags
- Click generate button
- Review suggested hashtags
- Analyze hashtag popularity
- Check relevance scores

### Step 4: Customize Selection
- Mix different hashtag sizes
- Remove irrelevant tags
- Add your own hashtags
- Organize by popularity

### Step 5: Copy and Use
- Copy hashtag list
- Paste in your post
- Monitor performance
- Track engagement metrics

## Advanced Hashtag Features
- Trending hashtag analysis
- Competitor hashtag research
- Performance tracking
- Automated hashtag suggestions

## Best Practices
- Research hashtag popularity
- Use platform-specific limits
- Monitor hashtag performance
- Update strategy regularly

## Common Hashtag Mistakes
- Using irrelevant hashtags
- Overusing generic tags
- Not researching competition
- Ignoring performance data

## Hashtag Categories
- **Popular**: 1M+ posts
- **Medium**: 100K-1M posts
- **Niche**: 10K-100K posts
- **Micro**: <10K posts

## Platform-Specific Tips
- **Instagram**: 30 hashtags max
- **TikTok**: 5-10 hashtags
- **Twitter**: 1-2 hashtags
- **LinkedIn**: 3-5 hashtags`,
    steps: [
      'Describe your content with keywords and topics',
      'Select target platform and audience',
      'Generate hashtags and analyze suggestions',
      'Customize your hashtag mix for optimal reach',
      'Copy hashtags and track performance'
    ],
    tips: [
      'Use a mix of popular, medium, and niche hashtags',
      'Research hashtag performance before using',
      'Create hashtag sets for different content types',
      'Monitor which hashtags drive most engagement'
    ],
    relatedTools: ['Content Idea Generator', 'Instagram Caption Writer', 'Social Analytics']
  },
  {
    id: 'content-idea-generator-tutorial',
    title: 'How to Generate Viral Content Ideas',
    description: 'Complete guide to creating engaging content ideas',
    category: 'Social Media Tools',
    difficulty: 'intermediate',
    readTime: 16,
    views: 35670,
    rating: 4.8,
    content: `# How to Generate Viral Content Ideas

## Understanding Viral Content
Viral content resonates with audiences, evokes emotions, and encourages sharing. It's not just about luck; it's about strategy.

## Content Idea Generation Process
- **Audience Analysis**: Understand your followers
- **Trend Research**: Identify popular topics
- **Creative Brainstorming**: Generate unique angles
- **Format Selection**: Choose optimal presentation

## Step-by-Step Idea Generation

### Step 1: Define Your Niche
- Enter your industry/topic
- Specify target audience
- Set content goals
- Choose platforms

### Step 2: Configure Parameters
- Content type (video, image, text)
- Tone of voice
- Length preference
- Engagement goals

### Step 3: Generate Ideas
- Click generate button
- Review suggested topics
- Analyze engagement potential
- Check trend alignment

### Step 4: Refine Ideas
- Customize suggestions
- Add personal touch
- Research competition
- Validate uniqueness

### Step 5: Plan Content
- Create content calendar
- Schedule posts
- Prepare materials
- Launch campaign

## Advanced Features
- Trend analysis integration
- Competitor content analysis
- Engagement prediction
- Seasonal content suggestions

## Content Idea Categories
- **Educational**: Teach something valuable
- **Entertainment**: Make people laugh/cry
- **Inspirational**: Motivate and inspire
- **Controversial**: Spark discussion
- **Trending**: Capitalize on current events

## Best Practices
- Know your audience deeply
- Stay authentic to your brand
- Test different content types
- Analyze performance data

## Common Content Mistakes
- Chasing trends without relevance
- Ignoring audience preferences
- Not having a content strategy
- Inconsistent posting schedule

## Viral Content Elements
- **Emotional Appeal**: Strong emotions drive sharing
- **Relatability**: Audience sees themselves
- **Surprise Factor**: Unexpected elements
- **Practical Value**: Useful information
- **Storytelling**: Compelling narratives

## Content Planning Strategies
- **Pillar Content**: Comprehensive guides
- **Micro Content**: Quick, shareable posts
- **Series Content**: Recurring themes
- **User-Generated Content**: Audience participation`,
    steps: [
      'Define your niche and target audience',
      'Configure content parameters and goals',
      'Generate and analyze content ideas',
      'Refine ideas with your unique perspective',
      'Plan and schedule your content calendar'
    ],
    tips: [
      'Research trending topics in your niche',
      'Create content that solves audience problems',
      'Test different content formats to see what works',
      'Engage with your audience to understand their preferences'
    ],
    relatedTools: ['Hashtag Generator', 'Instagram Caption Writer', 'Social Analytics']
  }
];

export default function HowToUse() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = ['all', 'AI Tools', 'Image Tools', 'PDF Tools', 'Finance Tools', 'Social Media Tools'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI Tools': return 'text-purple-400 bg-purple-400/20';
      case 'Image Tools': return 'text-blue-400 bg-blue-400/20';
      case 'PDF Tools': return 'text-orange-400 bg-orange-400/20';
      case 'Finance Tools': return 'text-green-400 bg-green-400/20';
      case 'Social Media Tools': return 'text-pink-400 bg-pink-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (selectedTutorial) {
    return (
      <>
        <SEOHead 
          title={`${selectedTutorial.title} | How to Use Guide | Creator Booster`}
          description={selectedTutorial.description}
          keywords={`${selectedTutorial.category}, tutorial, guide, how to use, ${selectedTutorial.title.toLowerCase()}`}
          canonicalUrl={`https://creatorboostai.xyz/how-to-use/${selectedTutorial.id}`}
        />
        <div className="min-h-screen bg-slate-950 text-ink">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
              onClick={() => setSelectedTutorial(null)}
              className="flex items-center gap-2 text-ink/60 hover:text-ink mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </button>

            {/* Tutorial Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(selectedTutorial.category)}`}>
                  {selectedTutorial.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                  {selectedTutorial.difficulty}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-ink mb-4">{selectedTutorial.title}</h1>
              <p className="text-xl text-ink/60 mb-6">{selectedTutorial.description}</p>
              
              {/* Tutorial Stats */}
              <div className="flex items-center gap-6 text-sm text-ink/40">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedTutorial.readTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {selectedTutorial.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {selectedTutorial.rating} rating
                </div>
              </div>
            </div>

            {/* Tutorial Content */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
              <div className="prose prose-invert max-w-none">
                {selectedTutorial.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold text-ink mb-6 mt-8">{paragraph.substring(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-ink mb-4 mt-6">{paragraph.substring(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold text-ink mb-3 mt-4">{paragraph.substring(4)}</h3>;
                  } else if (paragraph.startsWith('- ')) {
                    return <li key={index} className="text-ink/80 mb-2 ml-6">{paragraph.substring(2)}</li>;
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <p key={index} className="text-ink font-bold mb-4">{paragraph.slice(2, -2)}</p>;
                  } else if (paragraph.startsWith('```')) {
                    return <pre key={index} className="bg-slate-800 p-4 rounded-lg mb-4 overflow-x-auto"><code>{paragraph.slice(3, -3)}</code></pre>;
                  } else if (paragraph.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="text-ink/80 mb-4">{paragraph}</p>;
                  }
                })}
              </div>
            </div>

            {/* Steps Section */}
            {selectedTutorial.steps && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-ink mb-6">Step-by-Step Guide</h2>
                <div className="space-y-4">
                  {selectedTutorial.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">{index + 1}</span>
                      </div>
                      <p className="text-ink/80">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section */}
            {selectedTutorial.tips && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-ink mb-6">Pro Tips</h2>
                <div className="space-y-3">
                  {selectedTutorial.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                      <p className="text-ink/80">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tools */}
            {selectedTutorial.relatedTools && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-ink mb-6">Related Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTutorial.relatedTools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl">
                      <ExternalLink className="w-5 h-5 text-primary" />
                      <span className="text-ink/80">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="How to Use CreatorBoost Tools | Complete Tutorials & Guides"
        description="Step-by-step tutorials for all CreatorBoost tools. Learn how to use AI tools, image editors, PDF tools, financial calculators, and social media tools effectively."
        keywords="how to use, tutorials, guides, step by step, tool tutorials, AI tools guide, image tools tutorial, PDF tools guide, finance tools tutorial, social media tools guide"
        canonicalUrl="https://creatorboostai.xyz/how-to-use"
      />
      <div className="min-h-screen bg-slate-950 text-ink">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-ink mb-4">How to Use Our Tools</h1>
            <p className="text-xl text-ink/60 max-w-3xl mx-auto">
              Comprehensive step-by-step guides and tutorials for all CreatorBoost tools. Learn from basics to advanced techniques.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-ink/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tutorials..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink placeholder-ink/40 focus:border-primary/50 outline-none"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink focus:border-primary/50 outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink focus:border-primary/50 outline-none"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setSelectedTutorial(tutorial)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(tutorial.category)}`}>
                    {tutorial.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                
                <p className="text-ink/60 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-ink/40">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {tutorial.readTime} min
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {tutorial.rating}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-ink/40">
                    <Users className="w-4 h-4" />
                    {tutorial.views.toLocaleString()} views
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{tutorials.length}</div>
                <div className="text-sm text-ink/60">Total Tutorials</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {tutorials.reduce((sum, t) => sum + t.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-ink/60">Total Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {(tutorials.reduce((sum, t) => sum + t.rating, 0) / tutorials.length).toFixed(1)}
                </div>
                <div className="text-sm text-ink/60">Avg Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {tutorials.reduce((sum, t) => sum + t.readTime, 0)}
                </div>
                <div className="text-sm text-ink/60">Total Read Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
