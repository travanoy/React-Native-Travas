export interface BannerAnime {
  id: string;
  title: string;
  englishTitle: string;
  rating: number;
  coverImage: string;
}

export interface ContinueWatchingAnime {
  id: string;
  title: string;
  currentTime: string;
  totalTime: string;
  progress: number;
  coverImage: string;
}

export interface NewEpisodeAnime {
  id: string;
  title: string;
  coverImage: string;
}

export const BANNER_ANIME: BannerAnime = {
  id: "1",
  title: "Solo Leveling",
  englishTitle: "Solo Leveling",
  rating: 8.9,
  coverImage: "https://via.placeholder.com/600x300/3D4080/FFFFFF?text=Solo+Leveling",
};

export const CONTINUE_WATCHING_LIST: ContinueWatchingAnime[] = [
  {
    id: "101",
    title: "Jujutsu Kaisen",
    currentTime: "12:30",
    totalTime: "24:00",
    progress: 0.5,
    coverImage: "https://via.placeholder.com/300x400/2B3A60/FFFFFF?text=Jujutsu",
  },
  {
    id: "102",
    title: "Steins;Gate",
    currentTime: "8:15",
    totalTime: "23:50",
    progress: 0.35,
    coverImage: "https://via.placeholder.com/300x400/602B3A/FFFFFF?text=Steins;Gate",
  },
  {
    id: "103",
    title: "Attack on Titan",
    currentTime: "5:20",
    totalTime: "24:00",
    progress: 0.22,
    coverImage: "https://via.placeholder.com/300x400/1E5E57/FFFFFF?text=Attack+on+Titan",
  },
];

export const NEW_EPISODES_LIST: NewEpisodeAnime[] = [
  {
    id: "201",
    title: "Mushoku Tensei",
    coverImage: "https://via.placeholder.com/300x200/1E5E57/FFFFFF?text=Reincarnation",
  },
  {
    id: "202",
    title: "Dandadan",
    coverImage: "https://via.placeholder.com/300x200/805A32/FFFFFF?text=Dandadan",
  },
  {
    id: "203",
    title: "Frieren",
    coverImage: "https://via.placeholder.com/300x200/42528E/FFFFFF?text=Frieren",
  },
  {
    id: "204",
    title: "Blue Lock",
    coverImage: "https://via.placeholder.com/300x200/61488E/FFFFFF?text=Blue+Lock",
  },
];
