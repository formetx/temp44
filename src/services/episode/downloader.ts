
import { Episode } from "@/types";

// Fonction pour télécharger un épisode
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement de l'épisode: ${episode.title}`);
  
  try {
    // Simuler la progression pour montrer que quelque chose se passe
    // Dans une vraie application, on utiliserait un vrai téléchargement avec XMLHttpRequest
    // qui permettrait de suivre la progression réelle du téléchargement
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Ceci est un vrai téléchargement - nous utilisons l'API de téléchargement du navigateur
        // pour télécharger le fichier audio depuis l'URL de l'épisode
        const link = document.createElement('a');
        link.href = episode.audioUrl;
        link.download = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
        link.setAttribute('type', 'audio/mpeg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Épisode ${episode.title} téléchargé avec succès`);
      }
    }, 300);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error}`);
    return false;
  }
};
