import { NextResponse } from 'next/server';
import mockQuestions from '@/data/mock_questions.json';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const resume = formData.get('resume');
    const jobDescription = formData.get('job_description') || '';
    const company = formData.get('company') || 'Google';
    const role = formData.get('role') || 'Software Engineer';

    // Basic validation
    if (!resume) {
      return NextResponse.json(
        { detail: "Uploaded resume file is missing." },
        { status: 400 }
      );
    }

    if (resume.type !== 'application/pdf' && resume.type !== 'application/octet-stream') {
      return NextResponse.json(
        { detail: `Unsupported file type '${resume.type}'. Please upload a PDF.` },
        { status: 415 }
      );
    }

    if (resume.size === 0) {
      return NextResponse.json(
        { detail: "Uploaded resume file is empty." },
        { status: 400 }
      );
    }

    // Load questions & filter by company
    let filtered = mockQuestions.filter(
      (q) => (q.company || '').toLowerCase() === company.toLowerCase()
    );

    if (filtered.length === 0) {
      filtered = mockQuestions; // fallback — return everything
    }

    // Build response payload
    return NextResponse.json({
      status: "success",
      resume_filename: resume.name,
      resume_size_bytes: resume.size,
      target_company: company,
      target_role: role,
      job_description_preview: jobDescription.length > 200 ? jobDescription.substring(0, 200) + '…' : jobDescription,
      questions: filtered,
      total_questions: filtered.length,
      message: (
        "Mock questions returned. In production, responses will be " +
        "personalised using LangChain + OpenAI based on your resume."
      ),
    });

  } catch (error) {
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}
