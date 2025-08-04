import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from 'lucide-react';

interface ReportCustomizationProps {
  onHeaderChange: (header: string) => void;
  onLogoChange: (logo: string | null) => void;
}

export function ReportCustomization({ onHeaderChange, onLogoChange }: ReportCustomizationProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        onLogoChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    onLogoChange(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customizar Relatório PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="customHeader">Título do Relatório</Label>
          <Input
            id="customHeader"
            placeholder="Ex: Relatório Jogo Amistoso"
            onChange={(e) => onHeaderChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="teamLogo">Logo do Time</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center bg-muted/50">
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="Prévia do logo" className="h-full w-full object-contain rounded-md" />
                  <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <Input id="teamLogo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            <label htmlFor="teamLogo" className="cursor-pointer text-sm text-primary underline">
              {logoPreview ? 'Trocar imagem' : 'Carregar imagem'}
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}