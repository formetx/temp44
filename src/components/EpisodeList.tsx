
import React from 'react';
import { Episode } from '@/types';
import EpisodeCard from './EpisodeCard';
import LoadMoreButton from './LoadMoreButton';

interface EpisodeListProps {
  episodes: Episode[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  isLoading, 
  hasMore,
  onLoadMore 
}) => {
  if (isLoading && episodes.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Aucun épisode trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>
      
      <LoadMoreButton 
        onClick={onLoadMore} 
        isLoading={isLoading} 
        hasMore={hasMore}
      />
    </>
  );
};

export default EpisodeList;
