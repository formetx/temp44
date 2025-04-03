
import { Episode } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getProbableAudioUrl, getAlternativeUrls } from "./audioExtractor";

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
    const mainAudioUrl = getProbableAudioUrl(episode);
    console.log(`URL audio principale: ${mainAudioUrl}`);
    
    // Récupérer des URL alternatives au cas où la principale échoue
    const alternativeUrls = getAlternativeUrls(episode);
    
    // Essayer d'abord un téléchargement direct avec l'URL principale
    onProgress(30);
    
    try {
      console.log(`Tentative de téléchargement direct depuis: ${mainAudioUrl}`);
      const result = await downloadDirectly(mainAudioUrl, fileName);
      if (result) {
        onProgress(100);
        console.log(`Téléchargement direct réussi pour: ${episode.title}`);
        return true;
      }
    } catch (directError) {
      console.error(`Échec du téléchargement direct avec l'URL principale: ${directError}`);
      
      // Essayer les URL alternatives
      for (const url of alternativeUrls) {
        if (url === mainAudioUrl) continue; // Skip the main URL as we already tried it
        
        try {
          console.log(`Tentative avec URL alternative: ${url}`);
          const result = await downloadDirectly(url, fileName);
          if (result) {
            onProgress(100);
            console.log(`Téléchargement réussi avec URL alternative pour: ${episode.title}`);
            return true;
          }
        } catch (altError) {
          console.error(`Échec avec URL alternative: ${url}`, altError);
        }
      }
      
      // Si on arrive ici, aucune URL n'a fonctionné
      console.error("Toutes les URL ont échoué, passage à la méthode Supabase Edge Function");
    }

    // Récupérer les données du client Supabase
    const supabaseUrl = supabase.supabaseUrl;
    const supabaseKey = supabase.supabaseKey;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Configuration Supabase manquante");
      return await fallbackToDirectDownload({ ...episode, audioUrl: mainAudioUrl }, fileName, onProgress, alternativeUrls);
    }

    // Construction de l'URL de la fonction edge Supabase avec l'URL audio en paramètre
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/download-episode?url=${encodeURIComponent(mainAudioUrl)}`;
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
      
      // En cas d'échec, tenter un téléchargement direct avec les URLs alternatives
      return await fallbackToDirectDownload({ ...episode, audioUrl: mainAudioUrl }, fileName, onProgress, alternativeUrls);
    }

    // Récupération du blob audio
    const blob = await response.blob();
    onProgress(80);

    // Vérification du contenu reçu
    if (blob.size === 0) {
      console.error("Fichier vide reçu");
      return await fallbackToDirectDownload({ ...episode, audioUrl: mainAudioUrl }, fileName, onProgress, alternativeUrls);
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
    
    // En cas d'erreur, tenter un téléchargement direct avec toutes les URLs
    try {
      const fileName = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      const mainAudioUrl = getProbableAudioUrl(episode);
      const alternativeUrls = getAlternativeUrls(episode);
      return await fallbackToDirectDownload({ ...episode, audioUrl: mainAudioUrl }, fileName, onProgress, alternativeUrls);
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
  onProgress: (progress: number) => void,
  alternativeUrls: string[] = []
): Promise<boolean> {
  try {
    console.log(`Tentative de téléchargement direct depuis ${episode.audioUrl}`);
    
    // Simuler une progression
    onProgress(85);
    
    // D'abord essayer l'URL principale
    try {
      const result = await downloadDirectly(episode.audioUrl, fileName);
      if (result) {
        onProgress(100);
        console.log(`Téléchargement direct réussi pour ${episode.title}`);
        return true;
      }
    } catch (error) {
      console.error(`Échec du téléchargement direct avec l'URL principale: ${error}`);
    }
    
    // Si l'URL principale échoue, essayer les URL alternatives
    for (const altUrl of alternativeUrls) {
      try {
        console.log(`Tentative avec URL alternative: ${altUrl}`);
        const result = await downloadDirectly(altUrl, fileName);
        if (result) {
          onProgress(100);
          console.log(`Téléchargement réussi avec URL alternative pour ${episode.title}`);
          return true;
        }
      } catch (altError) {
        console.error(`Échec avec URL alternative: ${altError}`);
      }
    }
    
    // Si toutes les tentatives ont échoué
    console.error("Toutes les URLs ont échoué");
    onProgress(100); // Marquer comme terminé même en cas d'échec
    return false;
  } catch (error) {
    console.error(`Échec du téléchargement direct: ${error}`);
    onProgress(100); // Marquer comme terminé même en cas d'échec
    return false;
  }
}
