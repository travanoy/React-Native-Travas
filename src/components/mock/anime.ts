export interface AnimeDetail {
  id: string;
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
}

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

export const ANIME_DETAILS: AnimeDetail[] = [
  {
    id: "1",
    title: "Solo Leveling",
    englishTitle: "Solo Leveling",
    rating: 8.9,
    coverImage: "https://via.placeholder.com/600x300/3D4080/FFFFFF?text=Solo+Leveling",
    description:
      "In a world where hunters fight monsters, Sung Jin-Woo is the weakest of them all. After a near-fatal dungeon raid he awakens a mysterious system that lets him level up without limits.",
    year: 2024,
    status: "Ongoing",
    episodes: 12,
    genres: ["Action", "Fantasy", "Adventure"],
  },
  {
    id: "101",
    title: "Jujutsu Kaisen",
    englishTitle: "Jujutsu Kaisen",
    rating: 8.7,
    coverImage: "https://via.placeholder.com/300x400/2B3A60/FFFFFF?text=Jujutsu",
    description:
      "Yuji Itadori swallows a cursed finger and becomes the host of the King of Curses. To survive, he joins Tokyo Jujutsu High and learns to fight curses.",
    year: 2020,
    status: "Ongoing",
    episodes: 24,
    genres: ["Action", "Supernatural"],
    currentTime: "12:30",
    totalTime: "24:00",
    progress: 0.5,
  },
  {
    id: "102",
    title: "Steins;Gate",
    englishTitle: "Steins;Gate",
    rating: 9.1,
    coverImage: "https://via.placeholder.com/300x400/602B3A/FFFFFF?text=Steins;Gate",
    description:
      "A self-proclaimed mad scientist discovers that his microwave can send messages to the past. Every change to the timeline carries a price.",
    year: 2011,
    status: "Completed",
    episodes: 24,
    genres: ["Sci-Fi", "Thriller"],
    currentTime: "8:15",
    totalTime: "23:50",
    progress: 0.35,
  },
  {
    id: "103",
    title: "Attack on Titan",
    englishTitle: "Attack on Titan",
    rating: 9.0,
    coverImage: "https://via.placeholder.com/300x400/1E5E57/FFFFFF?text=Attack+on+Titan",
    description:
      "Humanity hides behind giant walls from man-eating Titans. When the walls fall, Eren Yeager swears to destroy every last Titan.",
    year: 2013,
    status: "Completed",
    episodes: 25,
    genres: ["Action", "Drama"],
    currentTime: "5:20",
    totalTime: "24:00",
    progress: 0.22,
  },
  {
    id: "201",
    title: "Mushoku Tensei",
    englishTitle: "Mushoku Tensei: Jobless Reincarnation",
    rating: 8.8,
    coverImage: "https://via.placeholder.com/300x200/1E5E57/FFFFFF?text=Reincarnation",
    description:
      "A hopeless man is reincarnated into a fantasy world and decides to live his new life to the fullest, armed with the memories of his past.",
    year: 2021,
    status: "Ongoing",
    episodes: 23,
    genres: ["Adventure", "Fantasy"],
  },
  {
    id: "202",
    title: "Dandadan",
    englishTitle: "Dandadan",
    rating: 8.6,
    coverImage: "https://via.placeholder.com/300x200/805A32/FFFFFF?text=Dandadan",
    description:
      "An occult fanatic and a believer in aliens argue over what is real — until both ghosts and extraterrestrials show up at once.",
    year: 2024,
    status: "Ongoing",
    episodes: 12,
    genres: ["Action", "Comedy", "Supernatural"],
  },
  {
    id: "203",
    title: "Frieren",
    englishTitle: "Frieren: Beyond Journey's End",
    rating: 9.2,
    coverImage: "https://via.placeholder.com/300x200/42528E/FFFFFF?text=Frieren",
    description:
      "After the heroes defeat the Demon King, an elf mage outlives her companions and sets out to understand the humans she once travelled with.",
    year: 2023,
    status: "Ongoing",
    episodes: 28,
    genres: ["Adventure", "Fantasy", "Drama"],
  },
  {
    id: "204",
    title: "Blue Lock",
    englishTitle: "Blue Lock",
    rating: 8.4,
    coverImage: "https://via.placeholder.com/300x200/61488E/FFFFFF?text=Blue+Lock",
    description:
      "Three hundred strikers enter a ruthless training facility. Only one will leave as Japan's greatest egoist and lead the national team.",
    year: 2022,
    status: "Ongoing",
    episodes: 24,
    genres: ["Sports", "Drama"],
  },
];

const CONTINUE_WATCHING_IDS = new Set(["101", "102", "103"]);
const NEW_EPISODE_IDS = new Set(["201", "202", "203", "204"]);

export const getAnimeById = (id: string | string[] | undefined) => {
  const animeId = Array.isArray(id) ? id[0] : id;

  return ANIME_DETAILS.find((anime) => anime.id === animeId);
};

export const BANNER_ANIME: BannerAnime = ANIME_DETAILS[0];

export const CONTINUE_WATCHING_LIST: ContinueWatchingAnime[] = ANIME_DETAILS.filter((anime) =>
  CONTINUE_WATCHING_IDS.has(anime.id),
).map((anime) => ({
  id: anime.id,
  title: anime.title,
  coverImage: anime.coverImage,
  currentTime: anime.currentTime ?? "0:00",
  totalTime: anime.totalTime ?? "24:00",
  progress: anime.progress ?? 0,
}));

export const NEW_EPISODES_LIST: NewEpisodeAnime[] = ANIME_DETAILS.filter((anime) =>
  NEW_EPISODE_IDS.has(anime.id),
).map((anime) => ({
  id: anime.id,
  title: anime.title,
  coverImage: anime.coverImage,
}));
