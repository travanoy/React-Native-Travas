export interface AnimeDetail {
  id: string;
  shikimoriId: number;
  title: string;
  englishTitle: string;
  rating: number;
  coverImage: string;
  description: string;
  year: number;
  status: string;
  episodes: number;
  genres: string[];
  currentTime?: string;
  totalTime?: string;
  progress?: number;
  watchStatusSlug?: string;
}

export interface BannerAnime {
  id: string;
  shikimoriId: number;
  title: string;
  englishTitle: string;
  rating: number;
  coverImage: string;
}

export interface ContinueWatchingAnime {
  id: string;
  shikimoriId: number;
  title: string;
  coverImage: string;
  currentTime: string;
  totalTime: string;
  progress: number;
}

export interface NewEpisodeAnime {
  id: string;
  shikimoriId: number;
  title: string;
  coverImage: string;
}

export interface WatchingType {
  id: string;
  slug: string;
  title: string;
}

export interface AnimeFilters {
  genre?: string;
  status?: string;
  search?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
