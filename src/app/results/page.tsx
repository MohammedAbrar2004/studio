'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Mail, FileCheck2, Copy } from 'lucide-react';
import type { GenerationResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { copyToClipboard } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function OutputActions({ content, filename, isPdf = false }: { content: string; filename: string, isPdf?: boolean }) {
  const { toast } = useToast();

  const handleCopy = () => {
    copyToClipboard(content);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    // Split text into lines that fit the page width
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 15, 20);
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      {isPdf && (
         <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download .pdf
        </Button>
      )}
    </div>
  );
}


export default function ResultsPage() {
  const [data, setData] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const result = sessionStorage.getItem('generationResult');
    if (result) {
      setData(JSON.parse(result));
      // Optional: remove the item so it's not available on page refresh
      // sessionStorage.removeItem('generationResult');
    } else {
      // If there's no data, maybe redirect back to home
      toast({
        title: 'No data found',
        description: 'Redirecting to homepage.',
        variant: 'destructive',
      });
      router.push('/');
    }
    setLoading(false);
  }, [router, toast]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading results...</div>;
  }

  if (!data) {
    // This will be shown briefly before redirect kicks in
    return null;
  }

  const { optimizedResume, coverLetter, email } = data;

  return (
    <div className="min-h-screen bg-background font-sans p-4 sm:p-8">
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Your Generated Materials</CardTitle>
            <CardDescription>
              Review your generated resume, cover letter, and email. You can copy or download them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="resume"><FileCheck2 className="mr-2 h-4 w-4" />Optimized Resume</TabsTrigger>
                <TabsTrigger value="cover-letter"><FileText className="mr-2 h-4 w-4" />Cover Letter</TabsTrigger>
                <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" />Email</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                     <pre className="whitespace-pre-wrap font-sans text-sm p-4 border rounded-md min-h-[400px] bg-secondary/30">{optimizedResume}</pre>
                     <div className="mt-4">
                       <OutputActions content={optimizedResume} filename="optimized-resume" isPdf={true} />
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cover-letter" className="mt-4">
                 <Card>
                  <CardContent className="p-6">
                     <pre className="whitespace-pre-wrap font-sans text-sm p-4 border rounded-md min-h-[400px] bg-secondary/30">{coverLetter}</pre>
                     <div className="mt-4">
                        <OutputActions content={coverLetter} filename="cover-letter" isPdf={true} />
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <Textarea 
                      readOnly 
                      value={email} 
                      className="whitespace-pre-wrap font-sans text-sm min-h-[400px] bg-secondary/30"
                    />
                     <div className="mt-4">
                       <OutputActions content={email} filename="application-email" />
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
             <div className="mt-8 text-center">
                <Button onClick={() => router.push('/')}>Go Back and Edit</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
