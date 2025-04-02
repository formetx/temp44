import { Episode, ScrapingState } from "@/types";

// URL de base pour le podcast
const BASE_URL = "https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin";

// Estimation du nombre total d'épisodes (basé sur la réalité du podcast)
const ESTIMATED_TOTAL_EPISODES = 600;

// Images placeholders valides
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
];

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
  const imageIndex = index % PLACEHOLDER_IMAGES.length;
  
  return {
    id: `${index + 1}`,
    title: titles[titleIndex],
    date: dateString,
    description: `Épisode ${index + 1} de la série "Sur les épaules de Darwin" de Jean-Claude Ameisen sur France Inter.`,
    imageUrl: PLACEHOLDER_IMAGES[imageIndex],
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
  
  try {
    // Simuler la progression pour une meilleure expérience utilisateur
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Créer un élément a invisible pour déclencher le téléchargement
        const link = document.createElement('a');
        link.href = episode.audioUrl;
        link.download = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
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
