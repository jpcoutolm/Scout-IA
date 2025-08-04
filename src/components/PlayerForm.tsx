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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  goals: z.coerce.number().int().min(0, { message: "Must be 0 or more." }),
  accuratePasses: z.coerce.number().int().min(0, { message: "Must be 0 or more." }),
  missedPasses: z.coerce.number().int().min(0, { message: "Must be 0 or more." }),
  shotsOnTarget: z.coerce.number().int().min(0, { message: "Must be 0 or more." }),
  fouls: z.coerce.number().int().min(0, { message: "Must be 0 or more." }),
  minutesPlayed: z.coerce.number().int().min(0, { message: "Must be 0 or more." }).max(120, { message: "Cannot exceed 120 minutes." }),
});

interface PlayerFormProps {
  addPlayer: (data: PlayerFormData) => void;
}

export function PlayerForm({ addPlayer }: PlayerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goals: 0,
      accuratePasses: 0,
      missedPasses: 0,
      shotsOnTarget: 0,
      fouls: 0,
      minutesPlayed: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addPlayer(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Player Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lionel Messi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shotsOnTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shots on Target</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accuratePasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accurate Passes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="missedPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Missed Passes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fouls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fouls</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutesPlayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes Played</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Add Player</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}