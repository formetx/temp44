
import { Episode } from "@/types";

// This is a mock implementation as we can't actually scrape in the browser
// In a real implementation, this would be a server-side function
export const fetchEpisodes = async (): Promise<Episode[]> => {
  // In a real implementation, we would fetch the actual data from the website
  // For demo purposes, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
        }
      ]);
    }, 1000);
  });
};

// This would be a server-side function in a real implementation
export const downloadEpisode = async (
  episode: Episode, 
  onProgress: (progress: number) => void
): Promise<boolean> => {
  // In a real implementation, we would download the file
  // For demo purposes, we'll simulate a download
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve(true);
      }
    }, 500);
  });
};
