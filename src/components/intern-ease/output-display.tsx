'use client';

import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import type { GenerationResult } from '@/app/actions';

interface OutputDisplayProps {
  data?: GenerationResult | null; // Make data optional
}

function OutputSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OutputDisplay({ data }: OutputDisplayProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return <OutputSkeleton />;
  }
  
  // Always show the placeholder on the main page
  return (
      <Card className="flex flex-col items-center justify-center text-center h-full min-h-[500px] border-dashed">
          <CardHeader>
              <div className="mx-auto bg-secondary p-3 rounded-full">
                  <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Your documents will appear here</CardTitle>
              <CardDescription>Fill out the form to generate your application materials.</CardDescription>
          </CardHeader>
      </Card>
  )
}
