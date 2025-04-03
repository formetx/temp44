
import { useState } from 'react';
import { Episode, DownloadProgress } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { getProbableAudioUrl } from '@/services/episode/audioExtractor';
import { useToast } from '@/hooks/use-toast';

export const useDownload = (episode: Episode, onDownloadComplete: () => void) => {
  const [downloadState, setDownloadState] = useState<DownloadProgress>({
    episodeId: episode.id,
    progress: 0,
    isComplete: false
  });
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFilename, setDownloadedFilename] = useState<string | null>(null);

  // Créer un nom de fichier propre pour l'épisode
  const getFileName = () => {
    return `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
  };

  const handleDirectDownload = () => {
    const fileName = getFileName();
    const audioUrl = getProbableAudioUrl(episode);
    
    // Log l'URL utilisée pour aider au débogage
    console.log(`Téléchargement direct depuis: ${audioUrl}`);
    
    // Crée un lien d'accès direct au fichier audio
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement lancé",
      description: "Le téléchargement a été lancé directement depuis la source. Vérifiez votre navigateur.",
      duration: 5000,
    });

    // Marquer comme téléchargé
    setDownloadState({
      episodeId: episode.id,
      progress: 100,
      isComplete: true
    });
    setDownloadedFilename(fileName);
    onDownloadComplete();
  };

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

      // Créer un nom de fichier propre pour l'épisode
      const fileName = getFileName();
      setDownloadedFilename(fileName);

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
        
        // Message toast amélioré avec plus d'informations
        toast({
          title: "Téléchargement terminé",
          description: (
            <div>
              <p><strong>"{episode.title}"</strong> a été téléchargé sous le nom <strong>{fileName}</strong>.</p>
              <p className="mt-2 text-xs">Le fichier se trouve dans votre dossier de téléchargements par défaut du navigateur :</p>
              <ul className="mt-1 text-xs list-disc list-inside">
                <li>Chrome/Edge: Généralement dans "Téléchargements" ou "Downloads"</li>
                <li>Firefox: Vérifiez dans le gestionnaire de téléchargements (Ctrl+J)</li>
                <li>Safari: Cliquez sur l'icône de téléchargement dans la barre d'outils</li>
              </ul>
            </div>
          ),
          duration: 10000,
        });
        onDownloadComplete();
      } else {
        // Si le téléchargement échoue, proposer un téléchargement direct
        toast({
          title: "Problème de téléchargement",
          description: (
            <div>
              <p>Le téléchargement n'a pas pu être complété correctement.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleDirectDownload}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Télécharger directement
              </Button>
            </div>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      setDownloadState(prev => ({
        ...prev,
        error: "Erreur de téléchargement"
      }));
      toast({
        title: "Erreur de téléchargement",
        description: (
          <div>
            <p>Une erreur s'est produite lors du téléchargement de l'épisode.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleDirectDownload}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Télécharger directement
            </Button>
          </div>
        ),
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadState,
    isDownloading,
    downloadedFilename,
    handleDownload,
    handleDirectDownload
  };
};
