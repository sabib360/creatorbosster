import { Calendar, ArrowRight } from 'lucide-react';
import BlogPost from './BlogPost';
import { useState } from 'react';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}

const blogArticles: BlogArticle[] = [
  {
    id: 'viral-titles-ai',
    title: 'How to Generate Viral YouTube Titles with AI - YouTube Title Generator Guide',
    excerpt: 'Learn the secrets of creating click-worthy yet accurate YouTube titles using our AI-powered YouTube title generator. Boost your video engagement and CTR.',
    author: 'Creator Booster AI',
    date: 'April 12, 2026',
    readTime: '4 min read',
    content: `
      <h2>Creating the Perfect Title is an Art and Science</h2>
      <p>In the competitive world of online content creation, your title is often the first impression viewers get of your work. Whether you're creating YouTube videos, TikTok clips, Instagram Reels, or Facebook posts, the title determines whether someone clicks to watch or scrolls past.</p>
      
      <h2>The Challenge of Title Creation</h2>
      <p>Creating effective titles is challenging because you need to balance several competing goals:</p>
      <ul>
        <li><strong>Attention-grabbing:</strong> Your title needs to stand out in crowded feeds and search results</li>
        <li><strong>Accurate:</strong> Clickbait might get views initially, but misleading titles hurt credibility and viewers won't return</li>
        <li><strong>SEO-optimized:</strong> Including relevant keywords helps your content get discovered</li>
        <li><strong>On-brand:</strong> Your title should reflect your channel's voice and style</li>
        <li><strong>Platform-specific:</strong> What works for YouTube might not work for Instagram or Facebook</li>
      </ul>
      
      <h2>How AI Solves This Problem</h2>
      <p>AI-powered title generation tools analyze millions of successful videos to understand what makes titles effective. These tools can:</p>
      <ul>
        <li>Analyze your video content and generate 5-10 title variations in seconds</li>
        <li>Incorporate trending keywords and phrases that resonate with your audience</li>
        <li>Maintain brand consistency by learning your typical title style</li>
        <li>Suggest titles optimized for different platforms and formats</li>
        <li>Balance virality with accuracy to ensure your audience trusts your content</li>
      </ul>
      
      <h2>Real-World Example</h2>
      <p>Let's say you've created a video about "5 ways to improve your productivity." An AI tool might generate titles like:</p>
      <ul>
        <li>"This Simple Habit Changed My Productivity Forever (5 Tips)"</li>
        <li>"Productivity Experts HATE This One Trick | 5 Methods That Actually Work"</li>
        <li>"How I Tripled My Productivity in 30 Days - 5 Science-Backed Strategies"</li>
      </ul>
      <p>Each title is compelling and includes your core topic, but they have different angles and tones. You can choose what best matches your content and audience.</p>
      
      <h2>Best Practices for AI-Generated Titles</h2>
      <ul>
        <li><strong>Start with great content:</strong> AI can enhance a good title, but it can't fix poorly produced content</li>
        <li><strong>Test multiple variations:</strong> Use A/B testing to see which titles get better click-through rates</li>
        <li><strong>Keep it authentic:</strong> Your audience can sense when titles don't match the video quality</li>
        <li><strong>Include numbers when relevant:</strong> Listicles (like "5 Ways") perform particularly well</li>
        <li><strong>Avoid all-caps:</strong> It looks spammy and can hurt your channel's credibility</li>
        <li><strong>Use power words:</strong> Words like "Discover," "Proven," "Secrets," and "Exclusive" attract attention</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Creating viral titles no longer requires guesswork. By leveraging AI tools, you can generate optimized, attention-grabbing titles that accurately represent your content and drive engagement. Start experimenting with AI-generated titles today and watch your click-through rates improve.</p>
    `
  },
  {
    id: 'seo-descriptions',
    title: 'The Importance of SEO Descriptions for Content Creators',
    excerpt: 'Discover why video descriptions matter more than you think and how to craft SEO-friendly descriptions that boost visibility.',
    author: 'Creator Booster AI',
    date: 'April 11, 2026',
    readTime: '5 min read',
    content: `
      <h2>Video Descriptions: The Often-Overlooked SEO Goldmine</h2>
      <p>Many content creators focus exclusively on titles and thumbnails while neglecting video descriptions. This is a critical mistake. Your video description is one of the most important SEO elements on YouTube, TikTok, and other platforms—and it often receives far less attention than it deserves. Combined with a great thumbnail, a well-written description creates the complete package for video discovery.</p>
      
      <h2>Why Video Descriptions Matter</h2>
      <p>Platform algorithms use descriptions to understand what your video is about. They look for keywords, context clues, and related information to decide:</p>
      <ul>
        <li>Who should see your video</li>
        <li>What search queries your video should appear for</li>
        <li>How to categorize and rank your content</li>
        <li>Whether to recommend it to similar viewers</li>
      </ul>
      
      <h2>The Challenge: Time and Consistency</h2>
      <p>Writing effective descriptions for every single video is time-consuming. Most creators fall into one of two traps:</p>
      <ul>
        <li><strong>Generic descriptions:</strong> "Check out my latest video!" — This provides zero SEO value</li>
        <li><strong>Inconsistent quality:</strong> Some videos get detailed descriptions while others don't</li>
        <li><strong>Keyword stuffing:</strong> Overloading descriptions with keywords, which hurts credibility and engagement</li>
      </ul>
      
      <h2>What Makes a Great SEO Description</h2>
      <p>A well-written video description includes:</p>
      <ul>
        <li><strong>Hook in the first line:</strong> Summarize what viewers will learn in 1-2 sentences</li>
        <li><strong>Relevant keywords:</strong> Naturally incorporate 3-5 keywords related to your content</li>
        <li><strong>Links and resources:</strong> Include links to mentioned resources, your website, or social media</li>
        <li><strong>Timestamps:</strong> For longer videos, break down the content structure</li>
        <li><strong>CTAs (Call to Actions):</strong> Encourage viewers to like, comment, and subscribe</li>
        <li><strong>About section:</strong> A brief description of your channel at the end</li>
      </ul>
      
      <h2>How AI Accelerates This Process</h2>
      <p>AI-powered description generators can create SEO-optimized descriptions in seconds by:</p>
      <ul>
        <li>Analyzing your video title and content to identify primary and secondary keywords</li>
        <li>Generating natural, readable descriptions that don't feel like keyword spam</li>
        <li>Suggesting relevant links and CTAs based on your video type</li>
        <li>Maintaining consistency in tone and structure across all your videos</li>
        <li>Creating multiple variations so you can choose the best version</li>
      </ul>
      
      <h2>Real Impact on Channel Growth</h2>
      <p>Studies have shown that creators who optimize their descriptions see:</p>
      <ul>
        <li>15-25% increase in visibility in search results</li>
        <li>Better click-through rates from recommendations</li>
        <li>Longer average watch times (because viewers understand what they're watching)</li>
        <li>Higher engagement rates from targeted viewers</li>
      </ul>
      
      <h2>Practical Tips for Better Descriptions</h2>
      <ul>
        <li><strong>First 125 characters matter most:</strong> This is what shows in thumbnails on YouTube</li>
        <li><strong>Use proper formatting:</strong> Line breaks make descriptions easier to read</li>
        <li><strong>Include exact match keywords:</strong> If possible, include the exact phrase you want to rank for</li>
        <li><strong>Connect related videos:</strong> Link to other videos on the same topic to keep viewers on your channel</li>
        <li><strong>Update old descriptions:</strong> Refresh SEO descriptions of your evergreen content</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Stop treating video descriptions as an afterthought. They're a crucial ranking factor that can significantly impact your channel's growth. With AI-powered tools, optimizing descriptions is now quick and easy, giving you more time to focus on creating amazing content.</p>
    `
  },
  {
    id: 'youtube-growth-tips-2026',
    title: 'Top 5 Tips to Grow Your YouTube Channel in 2026',
    excerpt: 'Master these five proven strategies to accelerate your YouTube growth and build a thriving audience in 2026.',
    author: 'Creator Booster AI',
    date: 'April 10, 2026',
    readTime: '6 min read',
    content: `
      <h2>YouTube Growth is Accelerating in 2026</h2>
      <p>The YouTube landscape is evolving faster than ever. With increased competition, algorithm changes, and shifting viewer preferences, growing your channel requires a strategic approach. Here are the five most effective tips for growing your YouTube channel in 2026.</p>
      
      <h2>Tip 1: Master the Algorithm with Data-Driven Content</h2>
      <p>YouTube's algorithm prioritizes engagement metrics: watch time, click-through rate, and average view duration. Instead of guessing what works, use analytics to guide your content creation.</p>
      <ul>
        <li><strong>Analyze top performers:</strong> Look at your most-watched videos and identify patterns (topic, length, format, posting time)</li>
        <li><strong>Study competitor success:</strong> Research successful channels in your niche to understand what resonates</li>
        <li><strong>A/B test titles and thumbnails:</strong> Small changes can significantly impact click-through rates</li>
        <li><strong>Monitor retention graphs:</strong> Identify where viewers drop off and adjust your pacing and content structure</li>
      </ul>
      
      <h2>Tip 2: Create Compelling Thumbnails That Actually Convert</h2>
      <p>Your thumbnail is the single most important factor in click-through rate (CTR). Studies show that creators with optimized thumbnails see 30-50% higher CTR than those using generic thumbnails. The most successful thumbnails in 2026 follow a specific formula:</p>
      <ul>
        <li><strong>High contrast colors:</strong> Use contrasting colors (red/blue, yellow/purple) to stand out in search results and recommendations. Avoid colors that blend into YouTube's interface</li>
        <li><strong>Bold, readable text:</strong> Add text with 16-20pt effective size that's readable even at 100x100px. Keep to 1-3 words maximum</li>
        <li><strong>Facial expressions:</strong> Close-up faces with strong emotions (genuine surprise, curiosity, excitement) get 30% more clicks. Eye contact matters</li>
        <li><strong>Minimal design:</strong> Avoid cluttering; viewers have less than 1 second to process your thumbnail. White space is your friend</li>
        <li><strong>Consistent branding:</strong> Use the same fonts, logo placement, and color scheme across all thumbnails so viewers instantly recognize your content</li>
        <li><strong>Action/value indicators:</strong> Use arrows, circles, or other visual cues to highlight the important part of your thumbnail</li>
      </ul>
      <p><strong>The Data Proves It:</strong> Creators using custom thumbnails get 2-5x more views than those using auto-generated ones. Test multiple variations in the first 24 hours and use YouTube Analytics to track which thumbnails perform best. Your top-performing thumbnails deserve to be replicated.</p>
      
      <h2>Tip 3: Optimize for the YouTube Recommendation Algorithm</h2>
      <p>Most views come from YouTube's recommendation system, not search. To dominate recommendations:</p>
      <ul>
        <li><strong>Strategic playlists:</strong> Create playlists that keep viewers watching your content longer</li>
        <li><strong>Series and sequels:</strong> Create follow-up videos to successful content to ride the momentum</li>
        <li><strong>Consistent publishing schedule:</strong> Upload on a predictable schedule so your audience anticipates new content</li>
        <li><strong>End screens and cards:</strong> Guide viewers to related videos and boost watch time</li>
        <li><strong>YouTube Shorts:</strong> Use shorts to drive traffic to your longer-form content</li>
      </ul>
      
      <h2>Tip 4: Leverage Community Building Features</h2>
      <p>YouTube is rewarding creators who build engaged communities. In 2026, community features are more powerful than ever:</p>
      <ul>
        <li><strong>Respond to every comment:</strong> Engagement signals matter to the algorithm</li>
        <li><strong>Create discussion posts:</strong> Share polls, questions, and updates between uploads</li>
        <li><strong>Go live regularly:</strong> Live streams build stronger connections with your audience</li>
        <li><strong>Join the Community tab:</strong> Update this feature regularly with behind-the-scenes content and polls</li>
        <li><strong>Encourage user-generated content:</strong> Create challenges or hashtags that get your audience involved</li>
      </ul>
      
      <h2>Tip 5: Invest in Production Quality Without Burnout</h2>
      <p>While you don't need expensive equipment, production quality does matter. However, don't sacrifice consistency for perfection:</p>
      <ul>
        <li><strong>Use AI tools:</strong> AI editing, transcription, and content generation save enormous amounts of time</li>
        <li><strong>Create content templates:</strong> Build repeatable structures (intro, main content, CTA) to speed up production</li>
        <li><strong>Batch your content:</strong> Record 3-4 videos in one session to maintain consistency without daily stress</li>
        <li><strong>Outsource what you can:</strong> Editing, thumbnails, and descriptions can be delegated or automated</li>
        <li><strong>Focus on audio quality:</strong> Poor audio quality is the #1 reason viewers click away</li>
      </ul>
      
      <h2>The Compound Effect</h2>
      <p>These tips work best when used together. A viral-worthy title with a compelling thumbnail, posted to a well-planned channel with consistent engagement, will significantly outperform isolated efforts. Start implementing these strategies today, and you'll see measurable growth within 30-60 days.</p>
      
      <h2>Ready to Level Up?</h2>
      <p>Creating best-in-class titles, descriptions, and thumbnails is easier with AI tools. Focus on creating amazing content while letting technology handle the optimization details.</p>
    `
  },
  {
    id: 'youtube-thumbnails-guide',
    title: 'The Ultimate Guide to YouTube Thumbnails That Drive Views',
    excerpt: 'Master the science of thumbnail design and discover why your thumbnail matters more than your content quality.',
    author: 'Creator Booster AI',
    date: 'April 9, 2026',
    readTime: '7 min read',
    content: `
      <h2>Your Thumbnail is Your First Sales Pitch</h2>
      <p>Let me be blunt: your thumbnail is more important than your video itself. YouTube executives have stated that the thumbnail is the #1 factor in their recommendation algorithm, often outweighing even watch time and engagement metrics. While your content needs to be good to retain viewers, your thumbnail needs to be exceptional to get the initial click.</p>
      
      <h2>The Numbers Don't Lie</h2>
      <p>Here's what the data tells us about thumbnails:</p>
      <ul>
        <li><strong>2-5x higher CTR:</strong> Custom thumbnails get 2-5 times more clicks than default thumbnails</li>
        <li><strong>30-50% improvement possible:</strong> Optimizing your thumbnail design can increase CTR from 3% to 4.5-5%</li>
        <li><strong>View volume multiplier:</strong> A 2% CTR improvement on 1 million impressions = 20,000 additional views</li>
        <li><strong>Algorithm boost:</strong> Higher CTR signals YouTube that your content is good, triggering more impressions</li>
        <li><strong>Viewer perception:</strong> People decide whether to click in 0.5-1.0 seconds—your thumbnail must convince them instantly</li>
      </ul>
      
      <h2>The Mathematics of Thumbnail Success</h2>
      <p>CTR affects YouTube's ranking more than almost any other metric. Here's why it matters so much:</p>
      <ul>
        <li>If 1,000,000 people see your video in recommendations and your CTR is 3%, you get 30,000 views</li>
        <li>If you optimize your thumbnail to 4.5% CTR, you get 45,000 views from the same impressions</li>
        <li>Those additional 15,000 views trigger more watch time, which triggers more impressions</li>
        <li>This creates a compounding effect that can triple your visibility within weeks</li>
      </ul>
      
      <h2>The Five Elements of a High-Performing Thumbnail</h2>
      
      <h3>1. Color Strategy (30% of CTR improvement comes from this)</h3>
      <ul>
        <li><strong>High contrast:</strong> Use colors on opposite sides of the color wheel (red/cyan, yellow/purple, orange/blue)</li>
        <li><strong>Saturation matters:</strong> Highly saturated colors (vivid, not muted) stand out more</li>
        <li><strong>Avoid YouTube colors:</strong> Don't use red and white exclusively—it blends with YouTube's interface</li>
        <li><strong>Platform awareness:</strong> You want to pop whether you're on desktop, mobile, or in a crowded subscription feed</li>
      </ul>
      
      <h3>2. Facial Expressions (40% of CTR improvement comes from this)</h3>
      <ul>
        <li><strong>Strong emotion:</strong> Surprise, curiosity, excitement (genuine, not photoshopped). Avoid neutral faces</li>
        <li><strong>Eye contact:</strong> Eyes looking at the camera create engagement</li>
        <li><strong>Eyebrows raised:</strong> Signifies surprise or interest</li>
        <li><strong>Mouth position:</strong> Open-mouthed expressions suggest discovery or revelation</li>
        <li><strong>Professional photography:</strong> Blurry or pixelated faces reduce clicks dramatically</li>
      </ul>
      
      <h3>3. Text Overlay (20% of CTR improvement)</h3>
      <ul>
        <li><strong>1-3 words maximum:</strong> "MIND BLOWING" beats "10 Ways Your Life Will Change If You Watch This"</li>
        <li><strong>High contrast text:</strong> Dark text on light backgrounds or light text on dark backgrounds</li>
        <li><strong>Large, bold fonts:</strong> Think from 100+ pixels at app resolution, not what looks good in your editor</li>
        <li><strong>Strategic placement:</strong> Bottom third for mobile viewers who might not see the top</li>
        <li><strong>No busy backgrounds:</strong> Text needs 90%+ visibility even when the thumbnail is tiny</li>
      </ul>
      
      <h3>4. Visual Hierarchy (5% improvement)</h3>
      <ul>
        <li><strong>One focal point:</strong> Your viewer's eye should know where to look instantly</li>
        <li><strong>Negative space:</strong> Breathing room around elements makes the thumbnail feel less chaotic</li>
        <li><strong>Arrows and pointers:</strong> Direct attention to the most important element</li>
        <li><strong>Size relationships:</strong> Make your primary element significantly larger than supporting elements</li>
      </ul>
      
      <h3>5. Brand Consistency (5% improvement + long-term growth)</h3>
      <ul>
        <li><strong>Logo placement:</strong> Always in the same corner (usually top-right or bottom-left)</li>
        <li><strong>Consistent fonts:</strong> 2-3 fonts maximum across all thumbnails</li>
        <li><strong>Color palette:</strong> Use 3-5 brand colors repeatedly</li>
        <li><strong>Recognition factor:</strong> Viewers should recognize your content as yours</li>
      </ul>
      
      <h2>Common Thumbnail Mistakes (That Kill CTR)</h2>
      <ul>
        <li><strong>All-text thumbnails:</strong> No faces means no emotional connection</li>
        <li><strong>Too many elements:</strong> Clutter confuses the viewer's brain</li>
        <li><strong>Small faces:</strong> If the thumbnail is 100x100px, faces should be at least 60px</li>
        <li><strong>Unrelated stock photos:</strong> Generic images get ignored</li>
        <li><strong>Title repetition:</strong> Your thumbnail shouldn't just be a mini version of your title</li>
        <li><strong>Poor lighting in photo:</strong> Badly lit faces look unprofessional and get fewer clicks</li>
        <li><strong>Following trends too closely:</strong> Everyone else is using the same arrow and emoji—differentiate</li>
      </ul>
      
      <h2>The AI Advantage for Thumbnail Generation</h2>
      <p>Modern AI tools can now generate multiple thumbnail variations instantly, analyzing what colors, compositions, and styles work best for your niche. You can:</p>
      <ul>
        <li>Generate 5-10 thumbnail variations for each video in minutes</li>
        <li>Get color palette suggestions based on your video content</li>
        <li>Receive A/B testing recommendations (which version performed better)</li>
        <li>Automatically maintain brand consistency</li>
        <li>Learn what works for your specific audience</li>
      </ul>
      
      <h2>How to Test and Optimize Your Thumbnails</h2>
      <p>YouTube Analytics shows you which thumbnails drive the most clicks. Here's the process:</p>
      <ol>
        <li><strong>Create 2-3 thumbnail variations</strong> using the principles above</li>
        <li><strong>Upload your video with Version 1</strong> (different variations performed differently for different niches)</li>
        <li><strong>Monitor CTR for the first 2-3 days</strong> while the video is getting initial impressions</li>
        <li><strong>Switch to Version 2 if it seems better</strong> (YouTube lets you change thumbnails anytime)</li>
        <li><strong>Check Analytics after a week</strong> to see which version had better CTR</li>
        <li><strong>Apply the winning formula</strong> to future videos</li>
        <li><strong>Continuously refine:</strong> Your best-performing thumbnail style is your winning formula</li>
      </ol>
      
      <h2>Why This Matters for Your Channel Growth</h2>
      <p>A single thumbnail optimization might seem small, but across your channel's lifetime, it's enormous:</p>
      <ul>
        <li>If you have 100 videos and improve CTR by even 20%, you've added thousands of views</li>
        <li>More views = more watch time = more channel authority = faster growth</li>
        <li>YouTube's algorithm compounds this effect—higher performing videos get shown more often</li>
        <li>This creates a virtuous cycle where your old videos start performing better too</li>
      </ul>
      
      <h2>Conclusion: Don't Neglect Your Thumbnail</h2>
      <p>Your thumbnail is worth investing time and resources into. Spend 15-20 minutes per video designing compelling thumbnails, test variations, and continuously improve based on data. Combined with a great title and description, an optimized thumbnail is the foundation of YouTube growth. Start today, and in 3 months, you'll see measurable improvements in your channel's performance.</p>
    `
  }
];

interface BlogProps {
  onNavigate: (view: string) => void;
}

export default function Blog({ onNavigate }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  if (selectedPost) {
    const post = blogArticles.find(a => a.id === selectedPost);
    if (post) {
      return (
        <BlogPost
          id={post.id}
          title={post.title}
          author={post.author}
          date={post.date}
          readTime={post.readTime}
          content={post.content}
          onBack={() => setSelectedPost(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">Creator Booster Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Tips, strategies, and insights to grow your YouTube channel and master content creation with AI.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-1 gap-8">
          {blogArticles.map((article) => (
            <article
              key={article.id}
              className="bg-card border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden group cursor-pointer"
              onClick={() => setSelectedPost(article.id)}
            >
              <div className="p-8">
                {/* Category Badge */}
                <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Content Creation
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{article.date}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-primary" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Transform Your Content?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Use Creator Booster AI to generate viral titles, SEO-optimized descriptions, and eye-catching thumbnails instantly.
          </p>
          <button
            onClick={() => onNavigate('generator')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
