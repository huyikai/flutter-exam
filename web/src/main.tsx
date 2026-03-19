import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadQuestionBank } from '@/lib/questionBank'
import { QuizProvider } from '@/lib/quizStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuizProvider questions={loadQuestionBank().questions}>
      <App />
    </QuizProvider>
  </StrictMode>,
)
