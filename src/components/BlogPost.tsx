import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface BlogPostProps {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  onBack: () => void;
}

export default function BlogPost({ id, title, author, date, readTime, content, onBack }: BlogPostProps) {
  const sharePost = () => {
    const url = `${window.location.origin}/?blog=${id}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: title,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </button>

        {/* Article Header */}
        <article className="bg-card rounded-lg border border-border shadow-lg p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={18} />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User size={18} />
              <span>{author}</span>
            </div>
            <div className="text-muted-foreground">{readTime}</div>
            <button
              onClick={sharePost}
              className="ml-auto p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Share post"
            >
              <Share2 size={18} className="text-primary" />
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div
              className="text-base md:text-lg leading-relaxed text-foreground space-y-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="bg-secondary/50 rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-2">About Creator Booster AI</h4>
              <p className="text-muted-foreground text-sm">
                Create compelling titles, descriptions, and thumbnails for your content using AI. 
                Growing your audience has never been easier.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
