import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerFormData } from "@/types/player";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  position: z.string().min(1, { message: "Selecione uma posição." }),
  goals: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }),
  accuratePasses: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }),
  missedPasses: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }),
  shotsOnTarget: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }),
  fouls: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }),
  minutesPlayed: z.coerce.number().int().min(0, { message: "Deve ser 0 ou mais." }).max(120, { message: "Não pode exceder 120 minutos." }),
  // Goalkeeper fields
  saves: z.coerce.number().int().min(0).optional(),
  goalsConceded: z.coerce.number().int().min(0).optional(),
  successfulExits: z.coerce.number().int().min(0).optional(),
  criticalErrors: z.coerce.number().int().min(0).optional(),
});

interface PlayerFormProps {
  addPlayer: (data: PlayerFormData) => void;
}

export function PlayerForm({ addPlayer }: PlayerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      goals: 0,
      accuratePasses: 0,
      missedPasses: 0,
      shotsOnTarget: 0,
      fouls: 0,
      minutesPlayed: 0,
      saves: 0,
      goalsConceded: 0,
      successfulExits: 0,
      criticalErrors: 0,
    },
  });

  const selectedPosition = form.watch("position");

  function onSubmit(values: z.infer<typeof formSchema>) {
    addPlayer(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Desempenho do Jogador</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Jogador</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Lionel Messi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição do Jogador</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma posição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Goleiro">Goleiro</SelectItem>
                        <SelectItem value="Zagueiro">Zagueiro</SelectItem>
                        <SelectItem value="Lateral">Lateral</SelectItem>
                        <SelectItem value="Volante">Volante</SelectItem>
                        <SelectItem value="Meia">Meia</SelectItem>
                        <SelectItem value="Atacante">Atacante</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {selectedPosition !== 'Goleiro' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="goals" render={({ field }) => (<FormItem><FormLabel>Gols</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="shotsOnTarget" render={({ field }) => (<FormItem><FormLabel>Chutes a Gol</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="accuratePasses" render={({ field }) => (<FormItem><FormLabel>Passes Certos</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="missedPasses" render={({ field }) => (<FormItem><FormLabel>Passes Errados</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fouls" render={({ field }) => (<FormItem><FormLabel>Faltas</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="minutesPlayed" render={({ field }) => (<FormItem><FormLabel>Minutos Jogados</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            )}

            {selectedPosition === 'Goleiro' && (
              <>
                <div className="pt-4 mt-4 border-t">
                  <h3 className="text-md font-semibold text-muted-foreground">Estatísticas de Goleiro</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="saves" render={({ field }) => (<FormItem><FormLabel>Defesas</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="goalsConceded" render={({ field }) => (<FormItem><FormLabel>Gols Sofridos</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="successfulExits" render={({ field }) => (<FormItem><FormLabel>Saídas Bem-sucedidas</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="criticalErrors" render={({ field }) => (<FormItem><FormLabel>Erros Críticos (resultaram em gol)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="minutesPlayed" render={({ field }) => (<FormItem><FormLabel>Minutos Jogados</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">Adicionar Jogador</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}