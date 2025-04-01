
export interface Episode {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duration: string;
}

export interface DownloadProgress {
  episodeId: string;
  progress: number;
  isComplete: boolean;
  error?: string;
}

export interface ScrapingState {
  isActive: boolean;
  currentPage: number;
  totalEpisodes: number;
  hasMore: boolean;
  estimatedTotalPages?: number;
  error?: string;
}
