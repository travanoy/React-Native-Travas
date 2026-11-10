export interface PlayerEpisode {
  number: number;
  title?: string;
  url: string;
}

export interface PlayerTranslation {
  id: number;
  title: string;
  type: string;
  episodes: PlayerEpisode[];
}

export interface PlayerData {
  shikimoriId: number;
  title: string;
  translations: PlayerTranslation[];
}

export interface WatchProgress {
  shikimoriId: number;
  episode: number;
  translationId?: number;
  position: number;
  duration: number;
}
