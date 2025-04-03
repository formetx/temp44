
import { Episode } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Configuration du client Supabase (utilise les variables d'environnement injectées automatiquement)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour télécharger un épisode via Supabase Edge Function
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement de l'épisode: ${episode.title}`);
  
  try {
    // Début du suivi de progression
    onProgress(10);

    // Construction de l'URL de la fonction edge Supabase avec l'URL audio en paramètre
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/download-episode?url=${encodeURIComponent(episode.audioUrl)}`;
    
    // Préparation de la requête avec le token d'authentification
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Mise à jour de la progression
    onProgress(50);

    if (!response.ok) {
      // En cas d'erreur, on récupère les détails
      const errorData = await response.json();
      console.error(`Erreur lors du téléchargement: ${errorData.error || response.statusText}`);
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
