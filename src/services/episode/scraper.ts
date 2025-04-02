
import { Episode, ScrapingState } from "@/types";
import { fetchEpisodes } from "./fetcher";
import { ESTIMATED_TOTAL_EPISODES } from "./mockData";

// Fonction pour scraper tous les épisodes de manière récursive
export const scrapeAllEpisodes = async (
  onProgress: (state: ScrapingState) => void,
  startPage: number = 1
): Promise<Episode[]> => {
  let allEpisodes: Episode[] = [];
  let currentPage = startPage;
  let hasMore = true;
  
  // Estimation du nombre total de pages
  const EPISODES_PER_PAGE = 5;
  const estimatedTotalPages = Math.ceil(ESTIMATED_TOTAL_EPISODES / EPISODES_PER_PAGE);
  
  // État initial du scraping
  const state: ScrapingState = {
    isActive: true,
    currentPage,
    totalEpisodes: 0,
    hasMore: true,
    estimatedTotalPages
  };
  
  // Notifie l'état initial
  onProgress(state);
  
  try {
    while (hasMore) {
      // Mise à jour de l'état
      state.currentPage = currentPage;
      onProgress({...state});
      
      // Récupère les épisodes de la page courante
      const { episodes, hasMore: moreAvailable } = await fetchEpisodes(currentPage);
      
      // Ajoute les épisodes à la liste complète
      allEpisodes = [...allEpisodes, ...episodes];
      
      // Met à jour l'état
      state.totalEpisodes = allEpisodes.length;
      state.hasMore = moreAvailable;
      onProgress({...state});
      
      // Vérifie s'il y a plus d'épisodes à charger
      hasMore = moreAvailable;
      
      // Passe à la page suivante
      currentPage++;
      
      // Simule un délai pour éviter de surcharger le serveur
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Scraping terminé
    state.isActive = false;
    onProgress({...state});
    
    return allEpisodes;
  } catch (error) {
    console.error("Erreur lors du scraping complet:", error);
    
    // Met à jour l'état avec l'erreur
    state.isActive = false;
    state.error = error instanceof Error ? error.message : "Erreur inconnue";
    onProgress({...state});
    
    throw error;
  }
};
