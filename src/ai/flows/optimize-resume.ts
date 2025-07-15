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
  userDetails: z.string().describe('User details like skills, projects , etc'),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const OptimizeResumeOutputSchema = z.object({
  optimizedResume: z.string().describe('The optimized resume.'),
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

The resume MUST follow this exact template, filling in the bracketed information based on the provided data. Do not deviate from this structure.

**[Full Name]**
[ACADEMIC TITLE/UNIVERSITY MAJOR]

[Phone Number] | [Email Address] | [City, State] | [LinkedIn Profile URL (if available)]
***

**EDUCATION**
[Degree] | [Graduation Year]
[Name of College or High School]
[City, State]

**SKILLS**
- [Skill 1]
- [Skill 2]
- [Skill 3]
- [Skill 4]
- [Skill 5]
- ... (list most relevant skills)

**AWARDS**
[MONTH YEAR]
**[Award Name]** | [Location]
[Description or reason for award]

---
*Column separator for layout*
---

**CAREER OBJECTIVE**
[Write a focused 2-3 sentence statement that demonstrates your interest and candidacy for the position you hope to land, tailored to the specific job description.]

**EXPERIENCE**
**[Job Title]**
[MONTH YEAR] - [MONTH YEAR or PRESENT]
- Focus on your contributions, not your responsibilities. Use active verbs. Example: "Grew digital marketing ROI by 14%".
- Keep bullet points to three lines or under. Write past experience in the past tense.

**[Previous Job Title]**
[MONTH YEAR] - [MONTH YEAR]
- [Description of accomplishment 1]
- [Description of accomplishment 2]

**PROJECTS**
**[Project Name]**
[MONTH YEAR] - [MONTH YEAR or PRESENT]
- [Describe the project, your role, and the outcome. Use active verbs.]
- [Mention key technologies or methodologies used.]
- [Quantify results where possible.]

Use the following information to generate the resume:
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
