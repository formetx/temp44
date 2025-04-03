
import React from 'react';
import { Episode } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  episode: Episode;
  onDownloadComplete: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  episode,
  onDownloadComplete
}) => {
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Empêcher le comportement par défaut du lien
    
    try {
      // Notification du début du téléchargement
      toast({
        title: "Téléchargement en cours",
        description: `Téléchargement de "${episode.title}" en cours...`,
        duration: 3000,
      });

      // Lancer le téléchargement réel
      const success = await downloadEpisode(episode, (progress) => {
        // La progression est gérée dans la fonction downloadEpisode
      });

      if (success) {
        toast({
          title: "Téléchargement terminé",
          description: `"${episode.title}" a été téléchargé dans votre dossier de téléchargements.`,
          duration: 5000,
        });
        onDownloadComplete();
      }
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement de l'épisode.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <a 
      href="#" 
      onClick={handleDownload}
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      téléchargement
    </a>
  );
};

export default DownloadButton;
