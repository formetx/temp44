
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EpisodeList from '@/components/EpisodeList';
import { Episode } from '@/types';
import { fetchEpisodes } from '@/services/scraper';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEpisodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchEpisodes();
      setEpisodes(data);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des épisodes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
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
                <strong>Note</strong>: Dans cette version de démonstration, les téléchargements sont simulés. Dans une implémentation réelle, un serveur backend serait nécessaire pour scraper et télécharger les fichiers.
              </CardDescription>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold darwin-font">Épisodes disponibles</h2>
            <Button 
              variant="outline" 
              onClick={loadEpisodes} 
              disabled={isLoading}
              className="text-blue-700"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <EpisodeList episodes={episodes} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
