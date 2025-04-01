
import { Episode, ScrapingState } from "@/types";

// URL de base pour le podcast
const BASE_URL = "https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin";

// Fonction pour parser le HTML et extraire les épisodes
const parseEpisodesFromHTML = (html: string): { episodes: Episode[], hasMore: boolean } => {
  // Note: Cette fonction est mockée car nous ne pouvons pas exécuter de véritable parsing côté client
  // Dans une implémentation réelle, nous utiliserions un DOM parser ou une bibliothèque comme Cheerio côté serveur
  
  console.log("Parsing HTML content...");
  
  // Simulation d'une extraction d'épisodes à partir du HTML
  // Dans une vraie implémentation, nous analyserions le DOM pour extraire les informations
  return {
    episodes: mockEpisodes.slice(0, 5), // Retourne 5 épisodes à la fois
    hasMore: true // Indique s'il y a plus d'épisodes à charger
  };
};

// Fonction pour scraper une page spécifique du podcast
export const scrapePage = async (page: number): Promise<{ episodes: Episode[], hasMore: boolean }> => {
  try {
    // Dans une implémentation réelle, nous ferions une requête AJAX vers le site
    // Mais pour des raisons de CORS, nous simulons ici
    
    console.log(`Scraping page ${page}...`);
    
    // Simulation d'une requête avec délai variable selon la page
    return new Promise((resolve) => {
      setTimeout(() => {
        // Génère 5 épisodes supplémentaires pour chaque page
        const startIndex = (page - 1) * 5;
        const endIndex = page * 5;
        const hasMore = endIndex < mockEpisodes.length;
        
        resolve({
          episodes: mockEpisodes.slice(startIndex, endIndex),
          hasMore
        });
      }, 1500); // Simule le temps de chargement
    });
  } catch (error) {
    console.error("Erreur lors du scraping de la page:", error);
    throw new Error(`Erreur lors du scraping de la page ${page}`);
  }
};

// Fonction principale pour récupérer les épisodes avec pagination
export const fetchEpisodes = async (page: number = 1): Promise<{ episodes: Episode[], hasMore: boolean }> => {
  return scrapePage(page);
};

// Fonction pour télécharger un épisode
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  console.log(`Téléchargement de l'épisode: ${episode.title}`);
  
  // Simulation du téléchargement avec progression
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Ici, nous devrions enregistrer le fichier localement
        // Mais comme nous ne pouvons pas écrire sur le système de fichiers depuis le navigateur,
        // nous simulons simplement le succès
        console.log(`Épisode ${episode.title} téléchargé avec succès`);
        resolve(true);
      }
    }, 500);
  });
};

// Fonction pour scraper tous les épisodes de manière récursive
export const scrapeAllEpisodes = async (
  onProgress: (state: ScrapingState) => void,
  startPage: number = 1
): Promise<Episode[]> => {
  let allEpisodes: Episode[] = [];
  let currentPage = startPage;
  let hasMore = true;
  
  // État initial du scraping
  const state: ScrapingState = {
    isActive: true,
    currentPage,
    totalEpisodes: 0,
    hasMore: true
  };
  
  // Notifie l'état initial
  onProgress(state);
  
  try {
    while (hasMore) {
      // Mise à jour de l'état
      state.currentPage = currentPage;
      onProgress({...state});
      
      // Récupère les épisodes de la page courante
      const { episodes, hasMore: moreAvailable } = await fetchEpisodes(currentPage);
      
      // Ajoute les épisodes à la liste complète
      allEpisodes = [...allEpisodes, ...episodes];
      
      // Met à jour l'état
      state.totalEpisodes = allEpisodes.length;
      state.hasMore = moreAvailable;
      onProgress({...state});
      
      // Vérifie s'il y a plus d'épisodes à charger
      hasMore = moreAvailable;
      
      // Passe à la page suivante
      currentPage++;
      
      // Simule un délai pour éviter de surcharger le serveur
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Scraping terminé
    state.isActive = false;
    onProgress({...state});
    
    return allEpisodes;
  } catch (error) {
    console.error("Erreur lors du scraping complet:", error);
    
    // Met à jour l'état avec l'erreur
    state.isActive = false;
    state.error = error instanceof Error ? error.message : "Erreur inconnue";
    onProgress({...state});
    
    throw error;
  }
};

// Données mockées pour simuler les épisodes
// Dans une implémentation réelle, ces données viendraient du scraping du site
const mockEpisodes: Episode[] = [
  {
    id: "1",
    title: "Les battements du temps",
    date: "29 juillet 2023",
    description: "Une méditation sur la vitesse de battement des ailes des oiseaux, leur rythme cardiaque, la durée de leur vie et la perception du temps.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/07/cb93adf4-8dbd-4899-ae9a-d90b7c88c8dc/1200x680_sc_darwin-les-battements-du-temps.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-29.07.2023-ITEMA_23428508-2023F23794S0212.mp3",
    duration: "54:32"
  },
  {
    id: "2",
    title: "La mémoire du Léviathan",
    date: "22 juillet 2023",
    description: "Rediffusion. Les baleines peuvent vivre près de deux cents ans. Quelle mémoire du monde portent-elles ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/07/2072a8dc-5aca-4325-9b17-30e22fd43dc5/1200x680_sc_darwin-la-memoire-du-leviathan.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-22.07.2023-ITEMA_23422607-2023F23794S0205.mp3",
    duration: "54:06"
  },
  {
    id: "3",
    title: "La matrice",
    date: "15 juillet 2023",
    description: "Rediffusion. Comment la cellule-œuf se développe et donne naissance à un organisme ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/07/04c0f9ba-8df2-4b58-825a-09e21e67eb94/1200x680_sc_darwin-la-matrice.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-15.07.2023-ITEMA_23416732-2023F23794S0198.mp3",
    duration: "53:35"
  },
  {
    id: "4",
    title: "Les oiseaux, les archives du temps",
    date: "8 juillet 2023",
    description: "Rediffusion. Les travaux sur la mémoire du temps, de l'espace, et sur la mémoire épisodique chez les oiseaux.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/07/3f9d5733-3c2f-43c6-90ca-cffa9ecaf6be/1200x680_sc_darwin-les-oiseaux-les-archives-du-temps.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-08.07.2023-ITEMA_23410935-2023F23794S0191.mp3",
    duration: "54:02"
  },
  {
    id: "5",
    title: "Les souvenirs du futur",
    date: "1 juillet 2023",
    description: "Rediffusion. Une histoire de la mémoire du futur. Comment les animaux anticipent-ils ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/06/a538e66e-8683-45e7-ac50-53b3242c6968/1200x680_sc_darwin-les-souvenirs-du-futur.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-01.07.2023-ITEMA_23406069-2023F23794S0184.mp3",
    duration: "54:05"
  },
  {
    id: "6",
    title: "Connaître, éprouver, survivre",
    date: "24 juin 2023",
    description: "Rediffusion. Existe-t-il chez les animaux des mécanismes psychologiques semblables à ceux de l'humain permettant de faire face au traumatisme ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/06/41b55c4c-6414-4f70-8a48-54b9e7c09bf7/1200x680_sc_darwin-connaitre-eprouver-survivre.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-24.06.2023-ITEMA_23400359-2023F23794S0177.mp3",
    duration: "54:37"
  },
  {
    id: "7",
    title: "Les mémoires de l'abeille",
    date: "17 juin 2023",
    description: "Un voyage dans le monde des abeilles et d'autres hyménoptères.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/06/d9cb85a2-dbe2-434e-9f9c-71e52fc19629/1200x680_sc_darwin-les-memoires-de-labeille.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-17.06.2023-ITEMA_23395051-2023F23794S0170.mp3",
    duration: "54:23"
  },
  {
    id: "8",
    title: "Au pays des oiseaux-mouches",
    date: "10 juin 2023",
    description: "Rediffusion. Ces petits bijoux ailés que sont les colibris.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/06/6faefde0-af14-4e16-868c-03ce9c2e38a0/1200x680_sc_darwin-au-pays-des-oiseaux-mouches.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-10.06.2023-ITEMA_23389252-2023F23794S0163.mp3",
    duration: "54:31"
  },
  {
    id: "9",
    title: "Les empreintes du temps",
    date: "3 juin 2023",
    description: "Comment l'immuable réalité du temps qui passe laisse-t-elle dans nos corps et dans nos vies des traces, des empreintes ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/05/bdb1c0b2-6b37-4aac-9ec0-b77e15effc28/1200x680_sc_darwin-les-empreintes-du-temps.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-03.06.2023-ITEMA_23383647-2023F23794S0156.mp3",
    duration: "54:25"
  },
  {
    id: "10",
    title: "La vie en mouvement",
    date: "27 mai 2023",
    description: "Rediffusion. Comment les êtres vivants se mettent-ils en mouvement ?",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/05/6a6d6629-ad87-4add-ad0e-5b24ddab6b27/1200x680_sc_darwin-la-vie-en-mouvement.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-27.05.2023-ITEMA_23378043-2023F23794S0149.mp3",
    duration: "54:19"
  },
  {
    id: "11",
    title: "Comment connaître le monde en son absence",
    date: "20 mai 2023",
    description: "Une méditation sur la perception du monde par les êtres vivants.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/05/40d304f1-7d7d-4cd4-8a54-7ca12e49ac01/1200x680_sc_darwin-comment-connaitre-le-monde-en-son-absence.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-20.05.2023-ITEMA_23372453-2023F23794S0142.mp3",
    duration: "54:46"
  },
  {
    id: "12",
    title: "L'enfant et le dauphin",
    date: "13 mai 2023",
    description: "Rediffusion. L'histoire d'un petit garçon de 12 ans, autiste, qui ne parlait pas, qui n'avait pas accès au langage, qui n'avait aucun contact avec les autres, et qui s'est ouvert au monde grâce à l'affection d'un dauphin.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/05/d6c7b057-8e5d-4c60-b0cc-5b1b3e10c44a/1200x680_sc_darwin-lenfant-et-le-dauphin.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-13.05.2023-ITEMA_23367016-2023F23794S0135.mp3",
    duration: "54:35"
  },
  {
    id: "13",
    title: "La mémoire des abeilles",
    date: "6 mai 2023",
    description: "Une exploration de la mémoire des abeilles.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/05/8733d7f7-7fab-4fe1-b66b-c5b9e5d8a7c7/1200x680_sc_darwin-la-memoire-des-abeilles.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-06.05.2023-ITEMA_23361582-2023F23794S0128.mp3",
    duration: "54:35"
  },
  {
    id: "14",
    title: "La sagesse des oiseaux",
    date: "29 avril 2023",
    description: "Une méditation sur la sagesse et l'intelligence des oiseaux.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/04/bcf3c89c-7626-4fba-95bb-dbd7ec2e3fda/1200x680_sc_darwin-la-sagesse-des-oiseaux.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-29.04.2023-ITEMA_23356158-2023F23794S0121.mp3",
    duration: "54:35"
  },
  {
    id: "15",
    title: "Dans le jardin d'Hestia",
    date: "22 avril 2023",
    description: "Une méditation sur nos liens avec le monde végétal.",
    imageUrl: "https://cdn.radiofrance.fr/s3/cruiser-production/2023/04/6f214b58-8ad7-4c06-bad2-1ad9be6cccda/1200x680_sc_darwin-dans-le-jardin-dhestia.jpg",
    audioUrl: "https://media.radiofrance-podcast.net/podcast09/18772-22.04.2023-ITEMA_23350754-2023F23794S0114.mp3",
    duration: "54:35"
  }
];
