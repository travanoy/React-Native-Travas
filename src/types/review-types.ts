export interface Review {
  id: string;
  animeId: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
}
