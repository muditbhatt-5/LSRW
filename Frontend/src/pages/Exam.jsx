import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, PenTool, Clock, Award, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const Exam = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const questionsPerPage = 5;

  useEffect(() => {
    if (timer > 0 && !examStarted) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !examStarted) {
      setExamStarted(true);
    }
  }, [timer, examStarted]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://localhost:7106/api/Mcqs');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (mcqID, answer) => {
    setAnswers((prev) => ({ ...prev, [mcqID]: answer }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.mcqID] === question.answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setExamCompleted(true);
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Exam Results', 20, 20);
    doc.setFontSize(14);
    doc.text(`Score: ${score}%`, 20, 40);
    doc.text('Questions and Answers:', 20, 60);

    let yPosition = 80;
    questions.forEach((question, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Your Answer: ${answers[question.mcqID] || 'Not answered'}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Correct Answer: ${question.answer}`, 30, yPosition);
      yPosition += 20;
    });

    doc.save('exam-results.pdf');
  };

  // Screen 1: Countdown Timer Screen
  if (!examStarted) {
    return (
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-2xl glass-panel-3d p-8 sm:p-12 text-center relative z-10 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-sky-500/30 border border-white/20">
            <Clock className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Get Ready for Exam</h1>
          <p className="text-slate-300 text-sm">Your assessment will begin automatically in a few seconds. All the best!</p>

          <div className="py-6">
            <span className="text-7xl font-extrabold text-gradient-cyan tracking-wider drop-shadow-lg">
              {timer}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Exam Results Completed View
  if (examCompleted) {
    return (
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-xl glass-panel-3d p-8 sm:p-10 text-center relative z-10 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 border border-white/20">
            <Award className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-extrabold text-white">Exam Completed!</h2>
          
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">Final Score</span>
            <span className="text-5xl font-black text-emerald-400">{score.toFixed(1)}%</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="downloadBtn" onClick={downloadResult}>
              <Download className="w-5 h-5 mr-2" />
              Download Results PDF
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-3d-glass px-6 py-3 text-sm font-semibold flex items-center justify-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Screen 3: Main Exam Questions View
  return (
    <div className="flex-1 flex flex-col w-full h-full">
        {/* Questions Listing */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {currentQuestions.map((question, qIdx) => (
            <div key={question.mcqID} className="glass-card-3d p-6 border-white/10 hover:border-sky-500/30">
              <p className="text-base font-semibold text-white mb-4 flex items-start space-x-2">
                <span className="text-sky-400 font-mono">Q{startIndex + qIdx + 1}.</span>
                <span>{question.question}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[question.optionA, question.optionB, question.optionC, question.optionD].map((option) => {
                  const isChecked = answers[question.mcqID] === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                          : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-sky-500/30 hover:bg-slate-900/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.mcqID}`}
                        value={option}
                        checked={isChecked}
                        onChange={() => handleAnswerSelect(question.mcqID, option)}
                        className="w-4 h-4 text-sky-400 accent-sky-400"
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination & Submit Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-white/10 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="btn-3d-glass px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1 disabled:opacity-40"
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            Page <span className="text-sky-400">{currentPage + 1}</span> of {Math.ceil(questions.length / questionsPerPage) || 1}
          </span>

          <button
            onClick={() =>
              currentPage < Math.ceil(questions.length / questionsPerPage) - 1
                ? setCurrentPage((prev) => prev + 1)
                : handleSubmit()
            }
            className="btn-3d-cyan px-6 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1"
          >
            <span>
              {currentPage < Math.ceil(questions.length / questionsPerPage) - 1
                ? 'Next Page'
                : 'Submit Exam'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

    </div>
  );
};

export default Exam;
