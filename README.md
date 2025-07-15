# InternEase: AI-Powered Application Assistant

InternEase is a web application designed to solve a common and tedious problem for students and recent graduates: tailoring job applications for each specific internship. It automates the creation of personalized resumes, cover letters, and emails, helping applicants save time and present themselves in the best possible light.

## Problem Solved

Crafting a unique resume and cover letter for every application is time-consuming and challenging. Applicants often struggle to identify and highlight the most relevant skills and experiences from the job description. InternEase streamlines this entire process, using AI to generate high-quality, tailored application materials in seconds.

## Overview of the Solution

The application is built as a modern, server-rendered web app using Next.js.

1.  **Data Collection:** The user fills out a single form with their personal details, skills, projects, current resume, and the job description of the internship they are applying for.
2.  **AI Processing:** On submission, the data is sent to a backend powered by **Genkit**, which orchestrates calls to the **Gemini AI model**. It first optimizes the resume against the job description, then uses that new resume to generate a consistent and compelling cover letter, and finally drafts a professional email to accompany the application.
3.  **Displaying Results:** The user is then redirected to a results page where the generated documents are neatly presented in tabs, ready to be copied or downloaded as PDFs.

## Key Features

-   **AI-Powered Content Generation:** Creates high-quality, personalized resumes, cover letters, and emails.
-   **Resume Optimization:** Tailors the user's resume to a specific job description to improve its effectiveness and pass-through Applicant Tracking Systems (ATS).
-   **Professional Templates:** Ensures all generated documents adhere to clean, professional, and field-tested layouts.
-   **PDF Downloads:** Allows users to download the finalized resume and cover letter as high-quality, multi-page PDF documents.
-   **User-Friendly Interface:** A clean and intuitive UI built with ShadCN components makes the process seamless.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components
-   **AI Framework:** [Genkit](https://firebase.google.com/docs/genkit)
-   **AI Model:** [Google Gemini](https://deepmind.google/technologies/gemini/)
-   **Deployment:** Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Local Setup and Installation

Follow these steps to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

The application uses the Google Gemini API, which requires an API key.

1.  Create a `.env` file in the root of the project.
2.  Obtain a Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the key to your `.env` file:

    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

### 4. Run the Application

You need to run two separate processes concurrently in two different terminal windows for the application to work correctly.

**Terminal 1: Run the Next.js Frontend**

This command starts the user interface and the web server.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

**Terminal 2: Run the Genkit AI Flows**

This command starts the Genkit server that exposes the AI models and flows to the Next.js application.

```bash
npm run genkit:dev
```

This will start the Genkit development UI, typically on `http://localhost:4000`, where you can inspect and test your AI flows.

With both services running, you can now use the application fully on your local machine.
