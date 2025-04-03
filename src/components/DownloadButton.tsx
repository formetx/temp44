
import React, { useState } from 'react';
import { Episode, DownloadProgress } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { Button } from '@/components/ui/button';
import { Download, Check, AlertCircle, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      // Marquer le début du téléchargement
      setIsDownloading(true);
      
      // Réinitialiser l'état de téléchargement
      setDownloadState({
        episodeId: episode.id,
        progress: 0,
        isComplete: false
      });

      // Lancer le téléchargement réel avec mise à jour de la progression
      const success = await downloadEpisode(episode, (progress) => {
        console.log(`Progression du téléchargement: ${progress}%`);
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
          title: "Téléchargement terminé",
          description: `"${episode.title}" a été téléchargé dans votre dossier de téléchargements. Vérifiez votre dossier de téléchargements par défaut du navigateur.`,
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
    } finally {
      setIsDownloading(false);
    }
  };

  if (downloadState.isComplete) {
    return (
      <Button variant="outline" className="bg-green-50 text-green-600 border-green-200" disabled>
        <Check className="h-4 w-4 mr-2" />
        Téléchargé
      </Button>
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
      <Button variant="outline" className="bg-red-50 text-red-600 border-red-200" onClick={handleDownload}>
        <AlertCircle className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleDownload} 
      className="france-inter-bg hover:bg-blue-700" 
      disabled={isDownloading}
    >
      <Download className="h-4 w-4 mr-2" />
      {isDownloading ? "Préparation..." : "Télécharger"}
    </Button>
  );
};

export default DownloadButton;
