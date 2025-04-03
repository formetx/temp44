
/**
 * Utilitaire pour extraire et normaliser les URL audio des épisodes
 */

// Fonction pour construire une URL de téléchargement probable pour France Inter
export const buildProbableAudioUrl = (episodeId: string, date: string): string => {
  // Convertir la date au format requis
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  // Format typique des URL de France Inter pour Sur les épaules de Darwin
  return `https://media.radiofrance-podcast.net/podcast09/18772-${day}${month}${year}-EPISODE${episodeId}.mp3`;
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
  
  // Sinon, on essaie d'extraire un ID depuis le titre
  let episodeId = episode.id;
  const extractedId = extractEpisodeIdFromTitle(episode.title);
  if (extractedId) {
    episodeId = extractedId;
  }
  
  // On construit une URL probable
  return buildProbableAudioUrl(episodeId, episode.date);
};
