export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserStats {
  watching: number;
  completed: number;
  planned: number;
  onHold: number;
  dropped: number;
  totalAnime: number;
  episodesWatched: number;
  daysWatched: number;
}
