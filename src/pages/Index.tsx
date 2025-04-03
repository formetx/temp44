
import React from 'react';
import Header from '@/components/Header';
import EpisodeList from '@/components/EpisodeList';
import ScrapingStatus from '@/components/ScrapingStatus';
import InfoCard from '@/components/InfoCard';
import { usePodcastScraper } from '@/hooks/usePodcastScraper';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Index = () => {
  const {
    episodes,
    isLoading,
    error,
    hasMore,
    currentPage,
    totalPages,
    scrapingState,
    loadInitialEpisodes,
    loadMoreEpisodes,
    startFullScraping,
    downloadAllEpisodes
  } = usePodcastScraper();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-4 mb-6 bg-gray-100 p-4 rounded-lg text-sm">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-medium mb-1">Source du podcast : Sur les épaules de Darwin</h3>
              <p className="text-muted-foreground">
                Cette application vous permet de télécharger les épisodes du podcast "Sur les épaules de Darwin" de France Inter.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="ml-4"
              onClick={() => window.open('https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir sur France Inter
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <InfoCard 
            onRefresh={loadInitialEpisodes}
            onScrapeFull={startFullScraping}
            onDownloadAll={downloadAllEpisodes}
            isLoading={isLoading}
            scrapingActive={scrapingState.isActive}
            episodeCount={episodes.length}
          />

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
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
