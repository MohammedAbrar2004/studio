'use server';

import { z } from 'zod';
import { optimizeResume, type OptimizeResumeInput, type OptimizeResumeOutput } from '@/ai/flows/optimize-resume';

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

export type State = {
  data: OptimizeResumeOutput | null;
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
    Graduation Year: ${graduationYear}
    Region: ${region}
    Skills: ${skills}
    Projects: ${projects}
  `.trim();

  const input: OptimizeResumeInput = {
    resumeDataUri,
    jobDescription,
    userDetails,
  };

  try {
    const output = await optimizeResume(input);
    if (!output || !output.optimizedResume) {
      throw new Error("The AI failed to generate content. Please try again with more detailed inputs.");
    }
    return { data: output, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred while generating content.' };
  }
}
