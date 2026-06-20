/**
 * SEO-Optimized Image Component
 * Handles: alt text, title attribute, width/height, lazy loading, WebP, responsive images.
 */

import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface SEOImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  webpSrc?: string;
  sizes?: string;
  quality?: number;
}

export default function SEOImage({
  src,
  alt,
  title,
  width = 800,
  height = 600,
  loading = 'lazy',
  webpSrc,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  ...props
}: SEOImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');

  useEffect(() => {
    if (loading !== 'lazy') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => setIsLoaded(true);

  if (webpSrc && isInView) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          style={{ aspectRatio: `${width}/${height}` }}
          {...props}
        />
      </picture>
    );
  }

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      title={title}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
      {...props}
    />
  );
}

/**
 * Generate alt text for tool images
 */
export function generateToolAlt(toolName: string, context?: string): string {
  if (context) return `${toolName} - ${context} | CreatorBoost AI`;
  return `${toolName} - Free Online Tool | CreatorBoost AI`;
}

/**
 * Generate title attribute for images
 */
export function generateImageTitle(toolName: string, action?: string): string {
  if (action) return `${action} with ${toolName} - CreatorBoost AI`;
  return `Use ${toolName} Free Online - CreatorBoost AI`;
}
