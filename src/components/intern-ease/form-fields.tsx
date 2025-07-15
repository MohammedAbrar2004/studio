'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';

export function FormFields() {
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeDataUri, setResumeDataUri] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Basic validation for file type. The AI can handle various text-based formats.
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
          alert('Please upload a PDF, DOC, DOCX, or TXT file.');
          return;
      }

      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  return (
    <div className="space-y-6">
      <input type="hidden" name="resumeDataUri" value={resumeDataUri} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" placeholder="" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduation-year">Graduation Year</Label>
          <Input id="graduation-year" name="graduationYear" placeholder="" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Input id="region" name="region" placeholder="" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Textarea id="skills" name="skills" placeholder="List your technical and soft skills, e.g., React, Node.js, Python, Team Leadership..." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projects">Projects</Label>
        <Textarea id="projects" name="projects" placeholder="Describe your key projects, technologies used, and your role." required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume-file">Current Resume</Label>
        <label
          htmlFor="resume-file"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${isDragging ? 'border-primary' : 'border-border'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, DOC, or TXT</p>
          </div>
          <Input id="resume-file" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} accept=".pdf,.doc,.docx,.txt" />
        </label>
        {resumeFileName && <p className="text-sm text-muted-foreground pt-2">Uploaded: {resumeFileName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea id="job-description" name="jobDescription" placeholder="Paste the full job description here, including company background and requirements." className="min-h-[150px]" required />
      </div>
    </div>
  );
}
