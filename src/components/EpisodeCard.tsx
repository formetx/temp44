
import React, { useState } from 'react';
import { Episode } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Clock, Image } from 'lucide-react';
import DownloadButton from './DownloadButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Image de fallback en cas d'erreur
  const fallbackImageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <AspectRatio ratio={16/9} className="bg-gray-100">
        {!imageError ? (
          <img 
            src={episode.imageUrl} 
            alt={episode.title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <img
              src={fallbackImageUrl}
              alt={episode.title}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
      </AspectRatio>
      
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
