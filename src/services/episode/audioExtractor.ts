
/**
 * Utilitaire pour extraire et normaliser les URL audio des épisodes
 */

// La formule correcte pour les podcasts France Inter
export const buildProbableAudioUrl = (episodeId: string, date: string): string => {
  // Convertir la date au format requis
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  // Format correct pour les URL de France Inter
  // Les podcasts de Sur les épaules de Darwin utilisent généralement ce format
  return `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN-${episodeId}.mp3`;
};

// Fonction pour tenter d'extraire l'ID depuis le titre
export const extractEpisodeIdFromTitle = (title: string): string | null => {
  // Recherche de patterns comme "Épisode 5" dans le titre
  const episodeMatch = title.match(/[éeE]pisode\s+(\d+)/i);
  if (episodeMatch && episodeMatch[1]) {
    return episodeMatch[1];
  }
  
  // Recherche de patterns comme "5/10" dans le titre
  const fractionMatch = title.match(/(\d+)\/\d+/);
  if (fractionMatch && fractionMatch[1]) {
    return fractionMatch[1];
  }
  
  // Si nous ne trouvons pas d'ID évident, retournons null
  return null;
};

// Alternative URLs to try if the first one fails
export const getAlternativeUrls = (episode: { 
  id: string; 
  title: string; 
  date: string;
}): string[] => {
  const dateObj = new Date(episode.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  const episodeId = extractEpisodeIdFromTitle(episode.title) || episode.id;
  
  return [
    // Format 1: day.month.year-SUR-LES-EPAULES-DE-DARWIN-episode.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN-${episodeId}.mp3`,
    
    // Format 2: day.month.year-SUR-LES-EPAULES-DE-DARWIN.mp3 (sans numéro d'épisode)
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN.mp3`,
    
    // Format 3: daymonthyear-EPISODE-id.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}${month}${year}-EPISODE${episodeId}.mp3`,
    
    // Format 4: daymonthyear-SUR-LES-EPAULES-DE-DARWIN.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}${month}${year}-SUR-LES-EPAULES-DE-DARWIN.mp3`,
  ];
};

// Fonction principale pour obtenir l'URL audio la plus probable
export const getProbableAudioUrl = (episode: { 
  id: string; 
  title: string; 
  date: string; 
  audioUrl?: string;
}): string => {
  // Si l'URL audio est déjà définie et valide, on la retourne
  if (episode.audioUrl && episode.audioUrl.startsWith('http')) {
    return episode.audioUrl;
  }
  
  // Si nous n'avons pas d'URL directe, utiliser le premier format d'URL
  const dateObj = new Date(episode.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  // Utiliser l'ID d'épisode s'il est disponible, sinon utiliser l'ID par défaut
  const episodeId = extractEpisodeIdFromTitle(episode.title) || episode.id;
  
  // Format le plus probable pour Sur les épaules de Darwin
  return `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN-${episodeId}.mp3`;
};
