
import { Episode } from "@/types";
import { mockEpisodesDatabase } from "./mockData";

// Fonction pour parser le HTML et extraire les épisodes
export const parseEpisodesFromHTML = (html: string): { episodes: Episode[], hasMore: boolean } => {
  // Note: Cette fonction est mockée car nous ne pouvons pas exécuter de véritable parsing côté client
  console.log("Parsing HTML content...");
  
  return {
    episodes: mockEpisodesDatabase.slice(0, 5), // Retourne 5 épisodes à la fois
    hasMore: true
  };
};

// Fonction pour scraper une page spécifique du podcast
export const scrapePage = async (page: number): Promise<{ episodes: Episode[], hasMore: boolean }> => {
  try {
    console.log(`Scraping page ${page}...`);
    
    // Simulation d'une requête avec délai
    return new Promise((resolve) => {
      setTimeout(() => {
        // Génère 5 épisodes par page
        const EPISODES_PER_PAGE = 5;
        const startIndex = (page - 1) * EPISODES_PER_PAGE;
        const endIndex = page * EPISODES_PER_PAGE;
        const hasMore = endIndex < mockEpisodesDatabase.length;
        
        resolve({
          episodes: mockEpisodesDatabase.slice(startIndex, endIndex),
          hasMore
        });
      }, 800); // Simule le temps de chargement (réduit pour améliorer l'expérience utilisateur)
    });
  } catch (error) {
    console.error("Erreur lors du scraping de la page:", error);
    throw new Error(`Erreur lors du scraping de la page ${page}`);
  }
};

// Fonction principale pour récupérer les épisodes avec pagination
export const fetchEpisodes = async (page: number = 1): Promise<{ episodes: Episode[], hasMore: boolean }> => {
  return scrapePage(page);
};
