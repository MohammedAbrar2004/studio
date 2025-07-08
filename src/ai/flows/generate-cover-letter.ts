'use server';

/**
 * @fileOverview AI agent that generates personalized cover letters for internship applications.
 *
 * - generateCoverLetter - A function to generate a cover letter based on user data and job requirements.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  personalDetails: z
    .string()
    .describe('The personal details of the student, including name, contact information, etc.'),
  jobDescription: z
    .string()
    .describe('The description of the internship position, including company background and requirements.'),
  resume: z.string().describe('The optimized resume of the student.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter for the internship application.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert in crafting personalized cover letters for internship applications. Use the student's personal details, their optimized resume, and the job description to generate a compelling cover letter that highlights the student's suitability for the position.

Personal Details: {{{personalDetails}}}
Job Description: {{{jobDescription}}}
Resume: {{{resume}}}

Cover Letter:`, // The prompt should end with 'Cover Letter:' to help guide the model to output the cover letter directly.
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
