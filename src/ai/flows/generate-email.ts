// src/ai/flows/generate-email.ts
'use server';
/**
 * @fileOverview A flow for generating personalized emails to accompany resume and cover letter submissions.
 *
 * - generateEmail - A function that generates a personalized email.
 * - GenerateEmailInput - The input type for the generateEmail function.
 * - GenerateEmailOutput - The return type for the generateEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job being applied for, including company background and requirements.'),
  resume: z.string().describe('The user\'s current resume content.'),
  coverLetter: z.string().describe('The cover letter generated for the job application.'),
  personalDetails: z
    .object({
      name: z.string().describe('The applicant\'s full name.'),
      email: z.string().email().describe('The applicant\'s email address.'),
      phone: z.string().describe('The applicant\'s phone number.'),
    })
    .describe('The applicant\'s personal details.'),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

const GenerateEmailOutputSchema = z.object({
  email: z.string().describe('The generated email content.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;

export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
  return generateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: {schema: GenerateEmailInputSchema},
  output: {schema: GenerateEmailOutputSchema},
  prompt: `You are an AI assistant specialized in crafting personalized emails for job applications.

  Given the job description, resume, and cover letter, create a concise and compelling email to send to the HR department along with the resume and cover letter.
  The email should complement the resume and cover letter, emphasizing the applicant\'s suitability for the internship position.
  Consider the company background and job requirements when generating the email. The email should be professional and engaging.

  Here are the details:
  Applicant Name: {{{personalDetails.name}}}
  Applicant Email: {{{personalDetails.email}}}
  Applicant Phone: {{{personalDetails.phone}}}
  Job Description: {{{jobDescription}}}
  Resume: {{{resume}}}
  Cover Letter: {{{coverLetter}}}

  Please generate the email.
  `,
});

const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailInputSchema,
    outputSchema: GenerateEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
