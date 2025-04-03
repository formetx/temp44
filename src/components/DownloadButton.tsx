
import React from 'react';
import { Episode } from '@/types';
import { ExternalLink } from 'lucide-react';
import { useDownload } from './download/useDownload';
import DownloadProgress from './download/DownloadProgress';
import DownloadComplete from './download/DownloadComplete';
import DownloadError from './download/DownloadError';
import DownloadActions from './download/DownloadActions';

interface DownloadButtonProps {
  episode: Episode;
  onDownloadComplete: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  episode,
  onDownloadComplete
}) => {
  const {
    downloadState,
    isDownloading,
    downloadedFilename,
    handleDownload,
    handleDirectDownload
  } = useDownload(episode, onDownloadComplete);

  if (downloadState.isComplete) {
    return <DownloadComplete filename={downloadedFilename} />;
  }

  if (downloadState.progress > 0 && downloadState.progress < 100) {
    return <DownloadProgress progress={downloadState.progress} />;
  }

  if (downloadState.error) {
    return (
      <DownloadError 
        onRetry={handleDownload} 
        onDirectDownload={handleDirectDownload} 
      />
    );
  }

  return (
    <DownloadActions 
      onDownload={handleDownload} 
      onDirectDownload={handleDirectDownload} 
      isDownloading={isDownloading} 
    />
  );
};

export default DownloadButton;
