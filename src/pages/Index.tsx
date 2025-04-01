
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EpisodeList from '@/components/EpisodeList';
import ScrapingStatus from '@/components/ScrapingStatus';
import { Episode, ScrapingState } from '@/types';
import { fetchEpisodes, scrapeAllEpisodes } from '@/services/scraper';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Download, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrapingState, setScrapingState] = useState<ScrapingState>({
    isActive: false,
    currentPage: 0,
    totalEpisodes: 0,
    hasMore: true
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
        hasMore: true
      });
      
      // Lancement du scraping avec mise à jour de l'état
      const allEpisodes = await scrapeAllEpisodes((state) => {
        setScrapingState(state);
      });
      
      // Mise à jour des épisodes une fois le scraping terminé
      setEpisodes(allEpisodes);
      setHasMore(false);
      setCurrentPage(Math.ceil(allEpisodes.length / 5));
      
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
  const downloadAllEpisodes = () => {
    toast({
      title: "Téléchargement en cours",
      description: "Le téléchargement de tous les épisodes va commencer. Cela peut prendre un moment.",
      duration: 5000,
    });
    
    // Note: Cette fonctionnalité serait implémentée côté serveur dans une application réelle
    // car il n'est pas possible de télécharger des fichiers directement dans un dossier spécifique
    // depuis le navigateur pour des raisons de sécurité.
    
    toast({
      title: "Fonctionnalité simulée",
      description: "Dans cette version de démonstration, les téléchargements sont simulés. Dans une implémentation réelle, un serveur serait nécessaire.",
      duration: 8000,
    });
  };

  // Chargement initial des épisodes
  useEffect(() => {
    loadInitialEpisodes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-8">
          <Card className="mb-8 border-blue-100 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-700">
                <Info className="h-5 w-5 mr-2" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-blue-700">
                Cette application crée un miroir local du podcast "Sur les épaules de Darwin" de Jean-Claude Ameisen. 
                Les fichiers téléchargés seront sauvegardés dans le dossier <code className="bg-blue-100 px-1 rounded">./FIDarwin</code> sur votre ordinateur.
                <br/><br/>
                <strong>Note</strong>: Dans cette version de démonstration, les téléchargements et le scraping sont simulés. 
                Dans une implémentation réelle, un serveur backend serait nécessaire pour scraper et télécharger les fichiers.
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={loadInitialEpisodes} 
                  disabled={isLoading || scrapingState.isActive}
                  className="bg-white text-blue-700 border-blue-200"
                >
                  <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Rafraîchir
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={startFullScraping} 
                  disabled={isLoading || scrapingState.isActive}
                  className="bg-white text-blue-700 border-blue-200"
                >
                  {scrapingState.isActive ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent mr-2"></div>
                  ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                  )}
                  Scraper tous les épisodes
                </Button>
                
                <Button 
                  className="france-inter-bg hover:bg-blue-700"
                  onClick={downloadAllEpisodes}
                  disabled={episodes.length === 0 || isLoading || scrapingState.isActive}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tous les épisodes
                </Button>
              </div>
            </CardFooter>
          </Card>

          <ScrapingStatus state={scrapingState} />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold darwin-font">Épisodes disponibles</h2>
            <span className="text-sm text-muted-foreground">
              {episodes.length} épisodes trouvés
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <EpisodeList 
            episodes={episodes} 
            isLoading={isLoading} 
            hasMore={hasMore}
            onLoadMore={loadMoreEpisodes}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
