
import React from 'react';
import { Info, RefreshCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface InfoCardProps {
  onRefresh: () => void;
  onScrapeFull: () => void;
  onDownloadAll: () => void;
  isLoading: boolean;
  scrapingActive: boolean;
  episodeCount: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  onRefresh, 
  onScrapeFull, 
  onDownloadAll, 
  isLoading, 
  scrapingActive,
  episodeCount 
}) => {
  return (
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
            onClick={onRefresh} 
            disabled={isLoading || scrapingActive}
            className="bg-white text-blue-700 border-blue-200"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onScrapeFull} 
            disabled={isLoading || scrapingActive}
            className="bg-white text-blue-700 border-blue-200"
          >
            {scrapingActive ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent mr-2"></div>
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Scraper tous les épisodes
          </Button>
          
          <Button 
            className="france-inter-bg hover:bg-blue-700"
            onClick={onDownloadAll}
            disabled={episodeCount === 0 || isLoading || scrapingActive}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger tous les épisodes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InfoCard;
