
/**
 * Utilitaire pour extraire et normaliser les URL audio des épisodes
 */

// La formule correcte pour les podcasts France Inter selon leur site web
export const buildProbableAudioUrl = (episodeId: string, date: string): string => {
  // Convertir la date au format requis
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  // Format actualisé pour les URL de France Inter
  // Format: YYYYMMDD_EMISSION-ID (le format utilisé sur le site web)
  return `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}_FRANCEINTER-${episodeId}.mp3`;
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
  
  // Formats utilisés par Radio France au fil du temps
  return [
    // Nouveau format 1: YYYYMMDD_FRANCEINTER-episode.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}_FRANCEINTER-${episodeId}.mp3`,
    
    // Nouveau format 2: YYYYMMDD_FRANCEINTER-0.mp3 (sans spécifier l'épisode)
    `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}_FRANCEINTER-0.mp3`,
    
    // Nouveau format 3: YYYYMMDD_SUR-LES-EPAULES-DE-DARWIN.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}_SUR-LES-EPAULES-DE-DARWIN.mp3`,
    
    // Ancien format 1: day.month.year-SUR-LES-EPAULES-DE-DARWIN-episode.mp3
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN-${episodeId}.mp3`,
    
    // Ancien format 2: day.month.year-SUR-LES-EPAULES-DE-DARWIN.mp3 (sans numéro d'épisode)
    `https://media.radiofrance-podcast.net/podcast09/18772-${day}.${month}.${year}-SUR-LES-EPAULES-DE-DARWIN.mp3`,
    
    // Format brut avec date complète: YYYYMMDD
    `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}.mp3`,
    
    // Format avec ID explicite de l'émission
    `https://media.radiofrance-podcast.net/podcast09/18772-DARWIN-${year}${month}${day}.mp3`,
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
  
  // Si nous n'avons pas d'URL directe, utiliser le format actualisé
  const dateObj = new Date(episode.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  // Utiliser l'ID d'épisode s'il est disponible, sinon utiliser l'ID par défaut
  const episodeId = extractEpisodeIdFromTitle(episode.title) || episode.id;
  
  // Format le plus probable actuel pour les podcasts France Inter
  return `https://media.radiofrance-podcast.net/podcast09/18772-${year}${month}${day}_FRANCEINTER-${episodeId}.mp3`;
};
