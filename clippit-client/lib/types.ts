export interface Item {
  _id: string;
  type: 'text' | 'image' | 'link';
  title?: string;
  content?: string;
  imageUrl?: string;
  sourceUrl: string;
  tags: string[];
  note?: string;
  isEmbedded: boolean;
  createdAt: string;
}
