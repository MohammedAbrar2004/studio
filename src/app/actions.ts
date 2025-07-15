'use server';

import { z } from 'zod';
import { optimizeResume, type OptimizeResumeInput, type OptimizeResumeOutput } from '@/ai/flows/optimize-resume';
import { generateCoverLetter, type GenerateCoverLetterInput, type GenerateCoverLetterOutput } from '@/ai/flows/generate-cover-letter';
import { generateEmail, type GenerateEmailInput, type GenerateEmailOutput } from '@/ai/flows/generate-email';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  graduationYear: z.string().min(4, 'Graduation year is required.'),
  region: z.string().min(1, 'Region is required.'),
  skills: z.string().min(10, 'Please describe your skills in at least 10 characters.'),
  projects: z.string().min(10, 'Please describe your projects in at least 10 characters.'),
  resumeDataUri: z.string().startsWith('data:', 'Resume is required. Please upload your resume.'),
  jobDescription: z.string().min(20, 'Job description must be at least 20 characters long.'),
});

export type GenerationResult = {
  optimizedResume: OptimizeResumeOutput;
  coverLetter: GenerateCoverLetterOutput;
  email: string;
}

export type State = {
  data: GenerationResult | null;
  error: string | null;
};

export async function generateContent(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(' ');
    return {
      data: null,
      error: errorMessages || 'Invalid form data. Please check your inputs.',
    };
  }

  const { name, email, phone, graduationYear, region, skills, projects, resumeDataUri, jobDescription } = validatedFields.data;

  const userDetails = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Address/Region: ${region}
    Graduation Year: ${graduationYear}
    Skills: ${skills}
    Projects: ${projects}
  `.trim();

  const optimizeResumeInput: OptimizeResumeInput = {
    resumeDataUri,
    jobDescription,
    userDetails,
  };

  try {
    const optimizedResume  = await optimizeResume(optimizeResumeInput);
    if (!optimizedResume) {
      throw new Error("The AI failed to generate the optimized resume.");
    }

    const coverLetterInput: GenerateCoverLetterInput = {
        personalDetails: userDetails,
        jobDescription,
        resume: optimizedResume,
    };
    const coverLetter = await generateCoverLetter(coverLetterInput);
    if (!coverLetter) {
        throw new Error("The AI failed to generate the cover letter.");
    }
    
    // We need to re-construct the resume string for the email generation for now.
    const resumeString = `
      ${optimizedResume.fullName} - ${optimizedResume.academicTitle}
      Objective: ${optimizedResume.careerObjective}
      Skills: ${optimizedResume.skills.join(', ')}
    `.trim();

    const coverLetterString = `
      ${coverLetter.body.join('\n\n')}
    `.trim();

    const emailInput: GenerateEmailInput = {
        jobDescription,
        resume: resumeString,
        coverLetter: coverLetterString,
        personalDetails: { name, email, phone }
    };
    const { email: emailContent } = await generateEmail(emailInput);
    if (!emailContent) {
        throw new Error("The AI failed to generate the email.");
    }

    const output: GenerationResult = {
      optimizedResume,
      coverLetter,
      email: emailContent,
    };
    
    return { data: output, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred while generating content.' };
  }
}
