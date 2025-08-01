
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
function DownloadButton({ contentRef, filename, isResume = false }: { contentRef: React.RefObject<HTMLDivElement>, filename: string, isResume?: boolean }) {
  const handleDownloadPdf = async () => {
    const element = contentRef.current;
    if (!element) return;

    // Temporarily apply print-friendly styles
    element.classList.add('print-friendly');
    if (isResume) {
        element.classList.add('resume-pdf-export');
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Remove print-friendly styles
    element.classList.remove('print-friendly');
    if (isResume) {
        element.classList.remove('resume-pdf-export');
    }

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 25.4; // 1 inch in mm
    
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;
    const maxPages = isResume ? 2 : Infinity;
    let pageCount = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
    heightLeft -= contentHeight;
    pageCount++;

    while (heightLeft > 0 && pageCount < maxPages) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pageCount++;
      // The y position must be negative
      pdf.addImage(imgData, 'PNG', margin, position - margin, contentWidth, imgHeight);
      heightLeft -= contentHeight;
    }
    
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
                <div ref={contentRef} className="bg-card p-8 font-serif text-sm printable-content">
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
              <div ref={contentRef} className="bg-card p-6 font-sans text-sm printable-content">
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
                  <DownloadButton contentRef={contentRef} filename="optimized-resume" isResume={true} />
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
      <style jsx global>{`
        .print-friendly {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .print-friendly * {
          color: #000000 !important;
          border-color: #000000 !important;
        }
        .print-friendly .text-primary {
          color: #000000 !important;
        }
        .print-friendly .text-muted-foreground {
          color: #333333 !important;
        }
        .print-friendly .hover\\:text-primary:hover {
            color: #000000 !important;
        }
        .resume-pdf-export {
            font-size: 10px !important;
        }
        .resume-pdf-export h1 {
            font-size: 20px !important;
        }
        .resume-pdf-export h2 {
            font-size: 10px !important;
        }
        .resume-pdf-export h3 {
            font-size: 10px !important;
        }
        .resume-pdf-export p, .resume-pdf-export div, .resume-pdf-export span, .resume-pdf-export a, .resume-pdf-export li {
            font-size: 9px !important;
        }
        .resume-pdf-export .text-xs {
            font-size: 8px !important;
        }

      `}</style>
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
