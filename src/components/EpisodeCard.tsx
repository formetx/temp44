
import React, { useState } from 'react';
import { Episode } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={episode.imageUrl} 
          alt={episode.title} 
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="darwin-font text-xl font-bold leading-tight">{episode.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{episode.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{episode.duration}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="text-sm text-gray-600">
        <p>{episode.description}</p>
      </CardContent>
      
      <CardFooter className="pt-2">
        <DownloadButton 
          episode={episode} 
          onDownloadComplete={() => setIsDownloaded(true)} 
        />
      </CardFooter>
    </Card>
  );
};

export default EpisodeCard;
