
import { Episode } from "@/types";

/**
 * Fonction pour télécharger un épisode directement depuis l'URL audio
 */
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement direct de l'épisode: ${episode.title}`);
  
  try {
    // Début du suivi de progression
    onProgress(10);

    // Vérification de l'URL audio
    if (!episode.audioUrl) {
      console.error("URL audio manquante pour l'épisode");
      return false;
    }

    // Création d'un élément a invisible pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = episode.audioUrl;
    
    // Nom du fichier basé sur le titre de l'épisode
    const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    link.download = fileName;
    
    // Déclenchement du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Téléchargement initié, on considère qu'il est en cours
    onProgress(100);
    console.log(`Épisode ${episode.title} téléchargement initié`);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error}`);
    return false;
  }
};
