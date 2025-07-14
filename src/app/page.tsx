'use client';

import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { generateContent } from '@/app/actions';
import { Header } from '@/components/intern-ease/header';
import { FormFields } from '@/components/intern-ease/form-fields';
import { SubmitButton } from '@/components/intern-ease/submit-button';
import { OutputDisplay } from '@/components/intern-ease/output-display';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const initialState = {
  data: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useActionState(generateContent, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'An error occurred',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form action={formAction}>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
            
            <Card className="lg:sticky lg:top-8 self-start">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormFields />
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </Card>

            <div className="mt-8 lg:mt-0">
              <OutputDisplay data={state.data} />
            </div>
            
          </div>
        </form>
      </main>
    </div>
  );
}
