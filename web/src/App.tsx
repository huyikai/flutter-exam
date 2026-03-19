import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StartPage } from '@/pages/StartPage'
import { QuizPage } from '@/pages/QuizPage'
import { ResultPage } from '@/pages/ResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
