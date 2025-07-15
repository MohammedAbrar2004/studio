// src/ai/flows/optimize-resume.ts
'use server';
/**
 * @fileOverview A resume optimization AI agent.
 *
 * - optimizeResume - A function that handles the resume optimization process.
 * - OptimizeResumeInput - The input type for the optimizeResume function.
 * - OptimizeResumeOutput - The return type for the optimizeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The current resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  jobDescription: z.string().describe('The job description for the desired job.'),
  userDetails: z.string().describe('User details like name, skills, projects , etc'),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const OptimizeResumeOutputSchema = z.object({
  fullName: z.string(),
  academicTitle: z.string(),
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    location: z.string(),
    linkedin: z.string().optional(),
  }),
  education: z.object({
    degree: z.string(),
    graduationYear: z.string(),
    school: z.string(),
    location: z.string(),
  }),
  skills: z.array(z.string()),
  awards: z.array(
    z.object({
      date: z.string(),
      name: z.string(),
      location: z.string(),
      description: z.string(),
    })
  ),
  careerObjective: z.string(),
  experience: z.array(
    z.object({
      title: z.string(),
      dateRange: z.string(),
      accomplishments: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      dateRange: z.string(),
      description: z.array(z.string()),
    })
  ),
});
export type OptimizeResumeOutput = z.infer<typeof OptimizeResumeOutputSchema>;

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizeResumeOutput> {
  return optimizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: OptimizeResumeInputSchema},
  output: {schema: OptimizeResumeOutputSchema},
  prompt: `You are an expert resume optimizer specializing in helping students get internships.

You will take the user's current resume, job description, and user details, and you will generate a new resume that highlights the skills and experience most relevant to the job, optimizing for ATS scores.

You must extract the information and provide it in the structured JSON format defined by the output schema. Populate all fields.

Use the following information to generate the resume content:
Current Resume: {{media url=resumeDataUri}}
Job Description: {{{jobDescription}}}
User Details: {{{userDetails}}}`,
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: OptimizeResumeInputSchema,
    outputSchema: OptimizeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
