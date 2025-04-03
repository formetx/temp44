
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

    // Requête pour obtenir l'audio
    const response = await fetch(episode.audioUrl);
    
    // Mise à jour de la progression
    onProgress(50);

    if (!response.ok) {
      console.error(`Erreur lors du téléchargement: ${response.statusText}`);
      return false;
    }

    // Récupération du blob audio
    const blob = await response.blob();
    onProgress(80);

    // Création d'un lien de téléchargement pour le fichier
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nom du fichier basé sur le titre de l'épisode
    const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    link.download = fileName;
    
    // Déclenchement du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libération de la ressource
    window.URL.revokeObjectURL(url);
    
    // Téléchargement terminé avec succès
    onProgress(100);
    console.log(`Épisode ${episode.title} téléchargé avec succès`);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error}`);
    return false;
  }
};
