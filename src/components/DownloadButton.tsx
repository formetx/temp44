
import React, { useState } from 'react';
import { Episode, DownloadProgress } from '@/types';
import { downloadEpisode } from '@/services/episode/downloader';
import { Button } from '@/components/ui/button';
import { Download, Check, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [downloadedFilename, setDownloadedFilename] = useState<string | null>(null);

  const handleDirectDownload = () => {
    // Crée un nom de fichier basé sur le titre
    const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    
    // Crée un lien d'accès direct au fichier audio
    const link = document.createElement('a');
    link.href = episode.audioUrl;
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
      const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
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

  if (downloadState.isComplete) {
    return (
      <div className="space-y-2 w-full">
        <Button variant="outline" className="bg-green-50 text-green-600 border-green-200 w-full" disabled>
          <Check className="h-4 w-4 mr-2" />
          Téléchargé {downloadedFilename && `(${downloadedFilename})`}
        </Button>
        <p className="text-xs text-muted-foreground">
          Le fichier est dans votre dossier de téléchargements du navigateur.
          <button 
            onClick={() => {
              toast({
                title: "Emplacement du fichier",
                description: (
                  <div>
                    <p>Votre fichier a été téléchargé sous le nom <strong>{downloadedFilename}</strong>.</p>
                    <p className="mt-2">Pour trouver ce fichier :</p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>Chrome/Edge : Dossier "Téléchargements" ou "Downloads"</li>
                      <li>Firefox : Ouvrez le gestionnaire de téléchargements (Ctrl+J)</li>
                      <li>Safari : Cliquez sur l'icône de téléchargement</li>
                    </ul>
                  </div>
                ),
                duration: 8000,
              });
            }}
            className="ml-1 text-xs underline hover:text-blue-600"
          >
            Où se trouve mon fichier ?
          </button>
        </p>
      </div>
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
      <div className="space-y-2 w-full">
        <Button variant="outline" className="bg-red-50 text-red-600 border-red-200 w-full" onClick={handleDownload}>
          <AlertCircle className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleDirectDownload}>
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Télécharger directement depuis la source
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Button 
        onClick={handleDownload} 
        className="france-inter-bg hover:bg-blue-700 w-full" 
        disabled={isDownloading}
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? "Préparation..." : "Télécharger"}
      </Button>
      <button 
        onClick={handleDirectDownload}
        className="text-xs text-muted-foreground underline hover:text-blue-600 w-full text-center"
      >
        Télécharger directement depuis la source
      </button>
    </div>
  );
};

export default DownloadButton;
