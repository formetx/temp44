
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadCompleteProps {
  filename: string | null;
}

const DownloadComplete: React.FC<DownloadCompleteProps> = ({ filename }) => {
  const { toast } = useToast();
  
  const showLocationHelp = () => {
    toast({
      title: "Emplacement du fichier",
      description: (
        <div>
          <p>Votre fichier a été téléchargé sous le nom <strong>{filename}</strong>.</p>
          <p className="mt-2">Pour trouver ce fichier :</p>
          <ul className="mt-1 list-disc list-inside">
            <li>Chrome/Edge : Dossier "Téléchargements" ou "Downloads"</li>
            <li>Firefox : Ouvrez le gestionnaire de téléchargements (Ctrl+J)</li>
            <li>Safari : Cliquez sur l'icône de téléchargement</li>
          </ul>
        </div>
      ),
      duration: 8000,
    });
  };

  return (
    <div className="space-y-2 w-full">
      <Button variant="outline" className="bg-green-50 text-green-600 border-green-200 w-full" disabled>
        <Check className="h-4 w-4 mr-2" />
        Téléchargé {filename && `(${filename})`}
      </Button>
      <p className="text-xs text-muted-foreground">
        Le fichier est dans votre dossier de téléchargements du navigateur.
        <button 
          onClick={showLocationHelp}
          className="ml-1 text-xs underline hover:text-blue-600"
        >
          Où se trouve mon fichier ?
        </button>
      </p>
    </div>
  );
};

export default DownloadComplete;
