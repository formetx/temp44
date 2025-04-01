
import { Episode, ScrapingState } from "@/types";

// URL de base pour le podcast
const BASE_URL = "https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin";

// Estimation du nombre total d'épisodes (basé sur la réalité du podcast)
const ESTIMATED_TOTAL_EPISODES = 600;

// Fonction pour générer un épisode mock avec un numéro
const generateMockEpisode = (index: number): Episode => {
  // Date de publication (de la plus récente à la plus ancienne)
  const date = new Date();
  date.setDate(date.getDate() - (index * 7)); // Un épisode par semaine environ
  
  const dateString = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Titres générés avec numéro d'épisode
  const titles = [
    `Les battements du temps (Épisode ${index + 1})`,
    `La mémoire du vivant (Épisode ${index + 1})`,
    `Les frontières de l'évolution (Épisode ${index + 1})`,
    `Les chemins de la connaissance (Épisode ${index + 1})`,
    `Le miroir de la nature (Épisode ${index + 1})`,
    `Les liens invisibles (Épisode ${index + 1})`,
    `L'énigme de la conscience (Épisode ${index + 1})`,
    `Au cœur du vivant (Épisode ${index + 1})`,
    `Les mécanismes de l'adaptation (Épisode ${index + 1})`,
    `La symphonie des espèces (Épisode ${index + 1})`
  ];
  
  const titleIndex = index % 10;
  
  return {
    id: `${index + 1}`,
    title: titles[titleIndex],
    date: dateString,
    description: `Épisode ${index + 1} de la série "Sur les épaules de Darwin" de Jean-Claude Ameisen sur France Inter.`,
    imageUrl: `https://cdn.radiofrance.fr/s3/cruiser-production/2023/07/cb93adf4-8dbd-4899-ae9a-d90b7c88c8dc/1200x680_sc_darwin-episode-${(index % 5) + 1}.jpg`,
    audioUrl: `https://media.radiofrance-podcast.net/podcast09/18772-${dateString.replace(/\s/g, '')}-EPISODE${index + 1}.mp3`,
    duration: `${Math.floor(40 + Math.random() * 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  };
};

// Génération d'un grand nombre d'épisodes mockés
const generateMockEpisodes = (count: number): Episode[] => {
  return Array.from({ length: count }, (_, i) => generateMockEpisode(i));
};

// Notre base de données mockée avec 600 épisodes
const mockEpisodesDatabase = generateMockEpisodes(ESTIMATED_TOTAL_EPISODES);

// Fonction pour parser le HTML et extraire les épisodes
const parseEpisodesFromHTML = (html: string): { episodes: Episode[], hasMore: boolean } => {
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

// Fonction pour télécharger un épisode
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement de l'épisode: ${episode.title}`);
  
  // Simulation du téléchargement avec progression
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        console.log(`Épisode ${episode.title} téléchargé avec succès`);
        resolve(true);
      }
    }, 500);
  });
};

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
