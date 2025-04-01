
import React from 'react';
import { ScrapingState } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ScrapingStatusProps {
  state: ScrapingState;
}

const ScrapingStatus: React.FC<ScrapingStatusProps> = ({ state }) => {
  if (!state.isActive && !state.error) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {state.isActive ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="font-medium text-blue-600">
                  Scraping en cours - Page {state.currentPage}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {state.totalEpisodes} épisodes trouvés
              </span>
            </div>
            <Progress 
              value={state.hasMore ? undefined : 100} 
              className="h-2"
            />
          </div>
        ) : state.error ? (
          <div className="text-red-500">
            <p className="font-medium">Erreur de scraping:</p>
            <p className="text-sm mt-1">{state.error}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ScrapingStatus;
