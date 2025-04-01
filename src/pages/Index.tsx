
import React from 'react';
import Header from '@/components/Header';
import EpisodeList from '@/components/EpisodeList';
import ScrapingStatus from '@/components/ScrapingStatus';
import InfoCard from '@/components/InfoCard';
import { usePodcastScraper } from '@/hooks/usePodcastScraper';

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
