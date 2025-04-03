
import { Episode } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Configuration du client Supabase avec vérification des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifions que les variables d'environnement sont définies
if (!supabaseUrl) {
  console.error("VITE_SUPABASE_URL n'est pas défini dans les variables d'environnement");
}

if (!supabaseKey) {
  console.error("VITE_SUPABASE_ANON_KEY n'est pas défini dans les variables d'environnement");
}

// Création du client Supabase avec des valeurs par défaut si les variables d'environnement ne sont pas disponibles
const supabase = createClient(
  supabaseUrl as string || "https://votre-projet.supabase.co", 
  supabaseKey as string || "votre-clé-anon-par-défaut"
);

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

    // En mode développement, simulons le téléchargement sans appeler Supabase
    // Cela permet de tester l'application sans avoir besoin des variables d'environnement
    if (!supabaseUrl || !supabaseKey) {
      console.log("Mode développement: simulation du téléchargement");
      
      // Simuler une progression de téléchargement
      const simulateProgress = () => {
        let progress = 10;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 500);
      };
      
      simulateProgress();
      
      // Simuler le temps de téléchargement
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Épisode ${episode.title} téléchargé avec succès (simulation) sous le nom ${fileName}`);
      return true;
    }

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
    return false;
  }
};
