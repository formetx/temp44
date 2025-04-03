
import { Episode } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getProbableAudioUrl } from "./audioExtractor";

// Fonction pour télécharger un épisode via Supabase Edge Function
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement de l'épisode: ${episode.title}`);
  
  try {
    // Début du suivi de progression
    onProgress(10);

    // Nom du fichier basé sur le titre de l'épisode
    const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;

    // S'assurer que nous avons une URL audio valide
    const audioUrl = getProbableAudioUrl(episode);
    console.log(`URL audio déterminée: ${audioUrl}`);
    
    if (!audioUrl) {
      console.error(`Impossible de déterminer l'URL audio pour: ${episode.title}`);
      onProgress(100);
      return false;
    }

    // Essayer d'abord un téléchargement direct (plus simple et plus fiable)
    onProgress(30);
    
    try {
      console.log(`Tentative de téléchargement direct depuis: ${audioUrl}`);
      const result = await downloadDirectly(audioUrl, fileName);
      if (result) {
        onProgress(100);
        console.log(`Téléchargement direct réussi pour: ${episode.title}`);
        return true;
      }
    } catch (directError) {
      console.error(`Échec du téléchargement direct: ${directError}`);
      // Continue vers la méthode Supabase Edge Function
    }

    // Récupérer les données du client Supabase
    const supabaseUrl = supabase.supabaseUrl;
    const supabaseKey = supabase.supabaseKey;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Configuration Supabase manquante");
      return await fallbackToDirectDownload({ ...episode, audioUrl }, fileName, onProgress);
    }

    // Construction de l'URL de la fonction edge Supabase avec l'URL audio en paramètre
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/download-episode?url=${encodeURIComponent(audioUrl)}`;
    console.log(`Appel de la fonction edge: ${edgeFunctionUrl}`);
    
    // Préparation de la requête avec le token d'authentification
    onProgress(40);
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Mise à jour de la progression
    onProgress(60);

    if (!response.ok) {
      // En cas d'erreur, on récupère les détails
      console.error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        console.error("Impossible de lire les détails de l'erreur");
      }
      
      // En cas d'échec, tenter un téléchargement direct
      return await fallbackToDirectDownload({ ...episode, audioUrl }, fileName, onProgress);
    }

    // Récupération du blob audio
    const blob = await response.blob();
    onProgress(80);

    // Vérification du contenu reçu
    if (blob.size === 0) {
      console.error("Fichier vide reçu");
      return await fallbackToDirectDownload({ ...episode, audioUrl }, fileName, onProgress);
    }

    // Création d'un lien de téléchargement pour le fichier
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // On définit le nom du fichier
    link.download = fileName;
    
    // Déclenchement du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libération de la ressource
    window.URL.revokeObjectURL(url);
    
    // Téléchargement terminé avec succès
    onProgress(100);
    console.log(`Épisode ${episode.title} téléchargé avec succès sous le nom ${fileName}`);
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error}`);
    
    // En cas d'erreur, tenter un téléchargement direct
    try {
      const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      const audioUrl = getProbableAudioUrl(episode);
      return await fallbackToDirectDownload({ ...episode, audioUrl }, fileName, onProgress);
    } catch (directError) {
      console.error("Échec également du téléchargement direct:", directError);
      return false;
    }
  }
};

// Fonction pour télécharger directement depuis l'URL
async function downloadDirectly(url: string, fileName: string): Promise<boolean> {
  // Créer un lien direct vers le fichier audio
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Comme nous ne pouvons pas vraiment vérifier si le téléchargement a réussi,
  // nous supposons qu'il a réussi si aucune erreur n'a été levée
  return true;
}

// Fonction de repli pour le téléchargement direct
async function fallbackToDirectDownload(
  episode: Episode, 
  fileName: string,
  onProgress: (progress: number) => void
): Promise<boolean> {
  try {
    console.log(`Téléchargement direct depuis ${episode.audioUrl}`);
    
    // Simuler une progression
    onProgress(85);
    
    // Utiliser la fonction de téléchargement direct
    const result = await downloadDirectly(episode.audioUrl, fileName);
    
    // Téléchargement terminé
    onProgress(100);
    console.log(`Téléchargement direct ${result ? "réussi" : "échoué"} pour ${episode.title}`);
    
    return result;
  } catch (error) {
    console.error(`Échec du téléchargement direct: ${error}`);
    onProgress(100); // Marquer comme terminé même en cas d'échec
    return false;
  }
}
