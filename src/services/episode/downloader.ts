
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
    
    if (!response.ok) {
      console.error(`Erreur lors du téléchargement: ${response.statusText}`);
      return false;
    }

    // Récupération du contenu
    const contentLength = response.headers.get('content-length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Si nous avons la taille totale, nous pouvons suivre le progrès
    const reader = response.body?.getReader();
    
    if (reader && totalSize) {
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];
      
      while(true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Mise à jour de la progression
        const progress = Math.round((receivedLength / totalSize) * 100);
        onProgress(Math.min(progress, 95)); // Max à 95% jusqu'à ce que le téléchargement soit vraiment terminé
      }
      
      // Concaténation de tous les fragments en un seul Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      
      // Création du blob avec le type MIME approprié
      const blob = new Blob([chunksAll], { type: 'audio/mpeg' });
      onProgress(98);
      
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
    } else {
      // Fallback si nous ne pouvons pas obtenir le reader ou la taille
      const blob = await response.blob();
      onProgress(90);
      
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
    }
    
    // Téléchargement terminé avec succès
    onProgress(100);
    console.log(`Épisode ${episode.title} téléchargé avec succès`);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error}`);
    return false;
  }
};
