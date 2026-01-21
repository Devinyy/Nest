// src/types/article.ts

export type BlockType = 'text' | 'heading' | 'image' | 'gallery' | 'quote' | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // 支持简单的 HTML/Markdown
  align?: 'left' | 'center' | 'right';
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  caption?: string;
  exif?: string; // e.g., "f/2.8 · 1/1000s · ISO 100"
  layout?: 'default' | 'portrait' | 'bleed'; // default: 全宽; portrait: 竖构图相框; bleed: 超宽
}

export interface GalleryImage {
  src: string;
  exif?: string;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: GalleryImage[];
  caption?: string;
  layout?: 'grid-2' | 'grid-3' | 'masonry'; // default: grid-2
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export type ContentBlock = 
  | TextBlock 
  | HeadingBlock 
  | ImageBlock 
  | GalleryBlock 
  | QuoteBlock 
  | DividerBlock;

export interface ArticleData {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  date: string;
  location?: string;
  weather?: string;
  camera?: string;
  tags?: string[];
  content: ContentBlock[];
}
