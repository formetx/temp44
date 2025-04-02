
import { Episode } from "@/types";

// URL de base pour le podcast
export const BASE_URL = "https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin";

// Estimation du nombre total d'épisodes (basé sur la réalité du podcast)
export const ESTIMATED_TOTAL_EPISODES = 600;

// Images placeholders valides
export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
];

// Fonction pour générer un épisode mock avec un numéro
export const generateMockEpisode = (index: number): Episode => {
  // Date de publication (de la plus récente à la plus ancienne)
  const date = new Date();
  date.setDate(date.getDate() - (index * 7)); // Un épisode par semaine environ
  
  const dateString = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Titres générés avec numéro d'épisode
  const titles = [
    `Les battements du temps (Épisode ${index + 1})`,
    `La mémoire du vivant (Épisode ${index + 1})`,
    `Les frontières de l'évolution (Épisode ${index + 1})`,
    `Les chemins de la connaissance (Épisode ${index + 1})`,
    `Le miroir de la nature (Épisode ${index + 1})`,
    `Les liens invisibles (Épisode ${index + 1})`,
    `L'énigme de la conscience (Épisode ${index + 1})`,
    `Au cœur du vivant (Épisode ${index + 1})`,
    `Les mécanismes de l'adaptation (Épisode ${index + 1})`,
    `La symphonie des espèces (Épisode ${index + 1})`
  ];
  
  const titleIndex = index % 10;
  const imageIndex = index % PLACEHOLDER_IMAGES.length;
  
  return {
    id: `${index + 1}`,
    title: titles[titleIndex],
    date: dateString,
    description: `Épisode ${index + 1} de la série "Sur les épaules de Darwin" de Jean-Claude Ameisen sur France Inter.`,
    imageUrl: PLACEHOLDER_IMAGES[imageIndex],
    audioUrl: `https://media.radiofrance-podcast.net/podcast09/18772-${dateString.replace(/\s/g, '')}-EPISODE${index + 1}.mp3`,
    duration: `${Math.floor(40 + Math.random() * 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  };
};

// Génération d'un grand nombre d'épisodes mockés
export const generateMockEpisodes = (count: number): Episode[] => {
  return Array.from({ length: count }, (_, i) => generateMockEpisode(i));
};

// Notre base de données mockée avec 600 épisodes
export const mockEpisodesDatabase = generateMockEpisodes(ESTIMATED_TOTAL_EPISODES);
