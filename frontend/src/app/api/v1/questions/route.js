import { NextResponse } from 'next/server';
import mockQuestions from '@/data/mock_questions.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  const questionType = searchParams.get('question_type');
  const difficulty = searchParams.get('difficulty');

  let questions = [...mockQuestions];

  if (company) {
    questions = questions.filter(q => q.company.toLowerCase() === company.toLowerCase());
  }
  if (questionType) {
    questions = questions.filter(q => q.question_type.toLowerCase() === questionType.toLowerCase());
  }
  if (difficulty) {
    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  return NextResponse.json({
    total: questions.length,
    questions: questions
  });
}
