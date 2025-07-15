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
  resume: z.any().describe('The structured, optimized resume of the student.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  applicant: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
  date: z.string().describe("Today's date in a 'Month Day, Year' format."),
  recipient: z.object({
    name: z.string().describe("Hiring manager's name. Use a generic title like 'Hiring Manager' if not available."),
    company: z.string(),
    address: z.string(),
  }),
  salutation: z.string().describe("e.g., 'Dear [Hiring Manager's Name],'"),
  body: z.array(z.string()).describe("The paragraphs of the cover letter body."),
  closing: z.string().describe("e.g., 'Sincerely,'"),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert in crafting professional cover letters for internship applications.
Use the student's personal details, their optimized resume, and the job description to generate a compelling cover letter.
You must extract the information and provide it in the structured JSON format defined by the output schema. Populate all fields based on the template below.

Template for content:
[Your Name]
[Your Address, City, State, Zip Code]
[Your Phone Number]
[Your Email]

[Today's Date]

[Hiring Manager's Name]
[Company Name]
[Company Address, City, State, Zip Code]

Dear [Hiring Manager's Name],

I am writing to apply for the [Position Title] position at [Company Name] that I discovered through [Source, e.g., your company website, LinkedIn, etc.]. Based on my skills and experience outlined in my resume, I am confident I can contribute significantly to your team.

In my academic and project work, I have focused on [mention 1-2 key areas from resume relevant to the job]. For example, in my project [Project Name from resume/user details], I was responsible for [describe your role and a key achievement]. This experience has equipped me with valuable skills in [mention a few skills like 'data analysis', 'web development', 'project management'].

I am particularly drawn to [Company Name] because of [mention something specific about the company from the job description, like their mission, a recent project, or their technology]. I am eager to apply my skills in a professional setting and believe my enthusiasm and fast-learning ability would make me a great fit for your internship program.

My educational background in [Your Field of Study] has given me a strong foundation in [mention a relevant subject area]. I am excited about the opportunity to contribute to your team and learn from experienced professionals.

Thank you for your time and consideration. I look forward to discussing my application with you further.

Sincerely,
[Your Name]

Provided Data:
Personal Details: {{{personalDetails}}}
Job Description: {{{jobDescription}}}
Resume Data: {{{resume}}}
`,
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
