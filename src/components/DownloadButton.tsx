
import React, { useState } from 'react';
import { Episode, DownloadProgress } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface DownloadButtonProps {
  episode: Episode;
  onDownloadComplete: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  episode,
  onDownloadComplete
}) => {
  const [downloadState, setDownloadState] = useState<DownloadProgress>({
    episodeId: episode.id,
    progress: 0,
    isComplete: false
  });
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation
    try {
      // Réinitialiser l'état de téléchargement
      setDownloadState({
        episodeId: episode.id,
        progress: 0,
        isComplete: false
      });

      // Lancer le téléchargement direct
      const success = await downloadEpisode(episode, (progress) => {
        setDownloadState(prev => ({
          ...prev,
          progress
        }));
      });

      if (success) {
        setDownloadState(prev => ({
          ...prev,
          isComplete: true
        }));
        toast({
          title: "Téléchargement initié",
          description: `"${episode.title}" est en cours de téléchargement. Vérifiez votre dossier de téléchargements.`,
          duration: 5000,
        });
        onDownloadComplete();
      }
    } catch (error) {
      setDownloadState(prev => ({
        ...prev,
        error: "Erreur de téléchargement"
      }));
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement de l'épisode.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (downloadState.isComplete) {
    return (
      <span className="text-sm text-green-600">
        Téléchargement terminé
      </span>
    );
  }

  if (downloadState.progress > 0 && downloadState.progress < 100) {
    return (
      <div className="space-y-2 w-full">
        <Progress value={downloadState.progress} className="h-2" />
        <p className="text-xs text-muted-foreground">{downloadState.progress}% téléchargé</p>
      </div>
    );
  }

  if (downloadState.error) {
    return (
      <a href={episode.audioUrl} 
         onClick={handleDownload}
         className="text-sm text-red-600 hover:underline">
        Réessayer le téléchargement
      </a>
    );
  }

  return (
    <a href={episode.audioUrl} 
       onClick={handleDownload}
       className="text-sm text-blue-600 hover:underline">
      téléchargement
    </a>
  );
};

export default DownloadButton;
