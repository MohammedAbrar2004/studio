'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, Mail, FileCheck2 } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { OptimizeResumeOutput } from '@/ai/flows/optimize-resume';

interface OutputDisplayProps {
  data: OptimizeResumeOutput | null;
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

function OutputActions({ content, filename }: { content: string; filename: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    copyToClipboard(content);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    downloadFile(content, `${filename}.txt`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download .txt
      </Button>
    </div>
  );
}


export function OutputDisplay({ data }: OutputDisplayProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return <OutputSkeleton />;
  }

  if (!data) {
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

  const { optimizedResume, coverLetter, email } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Materials</CardTitle>
        <CardDescription>
          Review your generated resume, cover letter, and email. You can edit, copy, or download them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resume">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume"><FileCheck2 className="mr-2 h-4 w-4" />Resume</TabsTrigger>
            <TabsTrigger value="cover-letter"><FileText className="mr-2 h-4 w-4" />Cover Letter</TabsTrigger>
            <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />Email</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 p-4 border rounded-md min-h-[300px] bg-secondary/30">
            <TabsContent value="resume">
                <pre className="whitespace-pre-wrap font-sans text-sm">{optimizedResume}</pre>
            </TabsContent>
            <TabsContent value="cover-letter">
                <pre className="whitespace-pre-wrap font-sans text-sm">{coverLetter}</pre>
            </TabsContent>
            <TabsContent value="email">
                <pre className="whitespace-pre-wrap font-sans text-sm">{email}</pre>
            </TabsContent>
          </div>
          
          <TabsContent value="resume" className="mt-4">
            <OutputActions content={optimizedResume} filename="optimized-resume" />
          </TabsContent>
          <TabsContent value="cover-letter" className="mt-4">
            <OutputActions content={coverLetter} filename="cover-letter" />
          </TabsContent>
          <TabsContent value="email" className="mt-4">
            <OutputActions content={email} filename="application-email" />
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
