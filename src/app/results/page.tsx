'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Mail, FileCheck2, Copy } from 'lucide-react';
import type { GenerationResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { copyToClipboard } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper component for the PDF download button
function DownloadButton({ contentRef, filename }: { contentRef: React.RefObject<HTMLDivElement>, filename: string }) {
  const handleDownloadPdf = async () => {
    const element = contentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    let newImgWidth = pdfWidth;
    let newImgHeight = newImgWidth / ratio;
    
    if (newImgHeight > pdfHeight) {
      newImgHeight = pdfHeight;
      newImgWidth = newImgHeight * ratio;
    }

    const x = (pdfWidth - newImgWidth) / 2;
    const y = 0; // Start from top

    pdf.addImage(data, 'PNG', x, y, newImgWidth, newImgHeight);
    pdf.save(`${filename}.pdf`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
      <Download className="mr-2 h-4 w-4" />
      Download .pdf
    </Button>
  );
}

// Display component for Cover Letter
function CoverLetterDisplay({ data }: { data: GenerationResult['coverLetter'] }) {
    const { applicant, date, recipient, salutation, body, closing } = data;
    const contentRef = useRef<HTMLDivElement>(null);

    const fullLetterText = [
        `${applicant.name}\n${applicant.address}\n${applicant.phone}\n${applicant.email}`,
        date,
        `${recipient.name}\n${recipient.company}\n${recipient.address}`,
        salutation,
        body.join('\n\n'),
        closing,
        applicant.name
    ].join('\n\n');

    return (
        <Card>
            <CardContent className="p-6">
                <div ref={contentRef} className="bg-card p-8 font-serif text-sm">
                    <div className="mb-8 text-left">
                        <p className="font-bold">{applicant.name}</p>
                        <p>{applicant.address}</p>
                        <p>{applicant.phone}</p>
                        <p>{applicant.email}</p>
                    </div>
                    <div className="mb-8 text-left">
                        <p>{date}</p>
                    </div>
                    <div className="mb-8 text-left">
                        <p className="font-bold">{recipient.name}</p>
                        <p>{recipient.company}</p>
                        <p>{recipient.address}</p>
                    </div>
                    <div className="mb-8">
                        <p className="mb-4">{salutation}</p>
                        {body.map((paragraph, i) => <p key={i} className="mb-4 text-justify">{paragraph}</p>)}
                    </div>
                    <div className="text-left">
                        <p>{closing}</p>
                        <p className="mt-4">{applicant.name}</p>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <DownloadButton contentRef={contentRef} filename="cover-letter" />
                     <Button variant="outline" size="sm" onClick={() => copyToClipboard(fullLetterText)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Display component for Resume
function ResumeDisplay({ data }: { data: GenerationResult['optimizedResume'] }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { fullName, academicTitle, contact, education, skills, awards, careerObjective, experience, projects } = data;

  return (
      <Card>
          <CardContent className="p-6">
              <div ref={contentRef} className="bg-card p-6 font-sans text-sm">
                  <header className="text-center mb-6">
                      <h1 className="text-2xl font-bold tracking-wider uppercase">{fullName}</h1>
                      <p className="text-md text-primary font-semibold">{academicTitle}</p>
                      {contact && (
                        <div className="flex justify-center items-center space-x-2 text-xs mt-2 text-muted-foreground">
                            <span>{contact.phone}</span>
                            <span>|</span>
                            <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
                            <span>|</span>
                            <span>{contact.location}</span>
                            {contact.linkedin && <><span>|</span><a href={contact.linkedin} className="hover:text-primary">LinkedIn</a></>}
                        </div>
                      )}
                  </header>
                  <hr className="my-4 border-t-2" />

                  <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1 space-y-6">
                          {education && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Education</h2>
                                <p className="font-bold">{education.degree}</p>
                                <p>{education.school}, {education.location}</p>
                                <p className="text-muted-foreground">{education.graduationYear}</p>
                            </div>
                          )}
                          {skills && skills.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Skills</h2>
                                <ul className="list-disc list-inside">
                                    {skills.map(skill => <li key={skill}>{skill}</li>)}
                                </ul>
                            </div>
                          )}
                          {awards && awards.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Awards</h2>
                                {awards.map(award => (
                                    <div key={award.name} className="mb-2">
                                        <p className="font-bold">{award.name}</p>
                                        <p className="text-xs text-muted-foreground">{award.date} | {award.location}</p>
                                        <p className="text-xs">{award.description}</p>
                                    </div>
                                ))}
                            </div>
                          )}
                      </div>

                      <div className="col-span-2 space-y-6">
                           {careerObjective && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Career Objective</h2>
                                <p className="text-justify">{careerObjective}</p>
                            </div>
                           )}
                          {experience && experience.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Experience</h2>
                                {experience.map(job => (
                                    <div key={job.title} className="mb-4">
                                        <div className="flex justify-between items-baseline">
                                          <h3 className="font-bold">{job.title}</h3>
                                          <p className="text-xs text-muted-foreground">{job.dateRange}</p>
                                        </div>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            {job.accomplishments.map(acc => <li key={acc}>{acc}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                          )}
                          {projects && projects.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Projects</h2>
                                {projects.map(proj => (
                                    <div key={proj.name} className="mb-4">
                                        <div className="flex justify-between items-baseline">
                                          <h3 className="font-bold">{proj.name}</h3>
                                          <p className="text-xs text-muted-foreground">{proj.dateRange}</p>
                                        </div>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            {proj.description.map(desc => <li key={desc}>{desc}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                          )}
                      </div>
                  </div>
              </div>
              <div className="mt-4 flex space-x-2">
                  <DownloadButton contentRef={contentRef} filename="optimized-resume" />
              </div>
          </CardContent>
      </Card>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const result = sessionStorage.getItem('generationResult');
      if (result) {
        setData(JSON.parse(result));
      } else {
        toast({
          title: 'No data found',
          description: 'Redirecting to homepage.',
          variant: 'destructive',
        });
        router.push('/');
      }
    } catch (error) {
       toast({
          title: 'Error loading data',
          description: 'Could not parse results. Redirecting to homepage.',
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
    return null; // Shown briefly before redirect
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
                <ResumeDisplay data={optimizedResume} />
              </TabsContent>

              <TabsContent value="cover-letter" className="mt-4">
                <CoverLetterDisplay data={coverLetter} />
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
                      <Button variant="outline" size="sm" onClick={() => { copyToClipboard(email); toast({ title: 'Copied to clipboard!' }); }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                      </Button>
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
