
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  currentPage?: number;
  totalPages?: number;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
  onClick, 
  isLoading, 
  hasMore, 
  currentPage = 0,
  totalPages = 0
}) => {
  if (!hasMore) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Tous les épisodes ont été chargés
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-8 gap-2">
      {currentPage > 0 && totalPages > 0 && (
        <div className="text-sm text-muted-foreground mb-2">
          Page {currentPage} sur ~{totalPages} {totalPages > 0 ? `(${Math.round((currentPage/totalPages)*100)}%)` : ''}
        </div>
      )}
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
            Chargement...
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Voir plus d'épisodes
          </>
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
