
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
