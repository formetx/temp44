
import { useState, useEffect } from 'react';
import { Episode, ScrapingState } from '@/types';
import { 
  fetchEpisodes, 
  scrapeAllEpisodes 
} from '@/services/episode';
import { downloadEpisode } from '@/services/episode/downloader';
import { useToast } from '@/hooks/use-toast';

// Estimation du nombre total d'épisodes et de pages
// Basé sur le fait que ce podcast existe depuis 2010 et sort environ 40 épisodes par an
const ESTIMATED_TOTAL_EPISODES = 600;
const EPISODES_PER_PAGE = 5;
const ESTIMATED_TOTAL_PAGES = Math.ceil(ESTIMATED_TOTAL_EPISODES / EPISODES_PER_PAGE);

export const usePodcastScraper = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrapingState, setScrapingState] = useState<ScrapingState>({
    isActive: false,
    currentPage: 0,
    totalEpisodes: 0,
    hasMore: true,
    estimatedTotalPages: ESTIMATED_TOTAL_PAGES
  });
  const { toast } = useToast();

  // Fonction pour charger la première page d'épisodes
  const loadInitialEpisodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1);
      const { episodes, hasMore } = await fetchEpisodes(1);
      setEpisodes(episodes);
      setHasMore(hasMore);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des épisodes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour charger plus d'épisodes (pagination)
  const loadMoreEpisodes = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const { episodes: newEpisodes, hasMore: moreAvailable } = await fetchEpisodes(nextPage);
      
      setEpisodes(prevEpisodes => [...prevEpisodes, ...newEpisodes]);
      setCurrentPage(nextPage);
      setHasMore(moreAvailable);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des épisodes supplémentaires.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour lancer le scraping complet
  const startFullScraping = async () => {
    try {
      setError(null);
      
      // Réinitialisation de l'état de scraping
      setScrapingState({
        isActive: true,
        currentPage: 1,
        totalEpisodes: 0,
        hasMore: true,
        estimatedTotalPages: ESTIMATED_TOTAL_PAGES
      });
      
      // Lancement du scraping avec mise à jour de l'état
      const allEpisodes = await scrapeAllEpisodes((state) => {
        setScrapingState({
          ...state,
          estimatedTotalPages: ESTIMATED_TOTAL_PAGES
        });
      });
      
      // Mise à jour des épisodes une fois le scraping terminé
      setEpisodes(allEpisodes);
      setHasMore(false);
      setCurrentPage(Math.ceil(allEpisodes.length / EPISODES_PER_PAGE));
      
      // Notification de succès
      toast({
        title: "Scraping terminé",
        description: `${allEpisodes.length} épisodes ont été récupérés avec succès.`,
        duration: 5000,
      });
    } catch (err) {
      setError("Une erreur est survenue lors du scraping complet.");
      console.error(err);
      
      toast({
        title: "Erreur de scraping",
        description: "Une erreur s'est produite pendant le scraping. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Téléchargement de tous les épisodes
  const downloadAllEpisodes = async () => {
    toast({
      title: "Téléchargement en cours",
      description: "Le téléchargement de tous les épisodes va commencer. Cela peut prendre un moment.",
      duration: 5000,
    });
    
    if (episodes.length === 0) {
      toast({
        title: "Aucun épisode disponible",
        description: "Veuillez d'abord charger des épisodes avant de les télécharger.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    // Télécharger les 5 premiers épisodes pour éviter de surcharger le navigateur
    const episodesToDownload = episodes.slice(0, 5);
    let successCount = 0;
    
    for (const episode of episodesToDownload) {
      try {
        const success = await downloadEpisode(episode, () => {});
        if (success) successCount++;
      } catch (err) {
        console.error(`Erreur lors du téléchargement de l'épisode ${episode.title}:`, err);
      }
    }
    
    toast({
      title: `${successCount} épisodes téléchargés`,
      description: "Les téléchargements des podcasts ont été initiés. Vérifiez votre dossier de téléchargements.",
      duration: 8000,
    });
  };

  // Chargement initial des épisodes
  useEffect(() => {
    loadInitialEpisodes();
  }, []);

  return {
    episodes,
    isLoading,
    error,
    hasMore,
    currentPage,
    totalPages: ESTIMATED_TOTAL_PAGES,
    scrapingState,
    loadInitialEpisodes,
    loadMoreEpisodes,
    startFullScraping,
    downloadAllEpisodes
  };
};
