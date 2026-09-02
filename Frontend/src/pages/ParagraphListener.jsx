import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, CheckCircle2, Award, Sparkles, Send } from "lucide-react";
import "./DashboardDesign.css";
import levenshtein from "fast-levenshtein";

const ParagraphListener = () => {
  const navigate = useNavigate();
  const [paragraph, setParagraph] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [spokenWords, setSpokenWords] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const recognitionRef = useRef(null);
  const paragraphWordsRef = useRef([]);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    const savedParagraph = localStorage.getItem("selectedParagraph");
    if (!savedParagraph) {
      navigate("/paragraph-reader");
    } else {
      setParagraph(savedParagraph);
      paragraphWordsRef.current = cleanText(savedParagraph).split(" ");
    }
  }, [navigate]);

  // Clean text for processing
  const cleanText = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Levenshtein for word match
  const levenshteinMatch = (inputWord, targetWord) => {
    const distance = levenshtein.get(inputWord, targetWord);
    const maxAllowedDistance = Math.max(1, Math.floor(targetWord.length / 4));
    return distance <= maxAllowedDistance ? targetWord : inputWord;
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenWords([]);
        console.log("Listening started...");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ")
          .toLowerCase();

        const words = cleanText(transcript).split(" ");

        const correctedWords = words.map((word, index) => {
          if (index < paragraphWordsRef.current.length) {
            return levenshteinMatch(word, paragraphWordsRef.current[index]);
          }
          return word;
        });

        setSpokenWords(correctedWords);
        resetSilenceTimeout();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      resetSilenceTimeout();
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetSilenceTimeout = () => {
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  };

  // Compare and assign colors in real-time
  const compareWords = (word, index) => {
    if (index < spokenWords.length) {
      return word.toLowerCase() === spokenWords[index].toLowerCase()
        ? "text-emerald-400 font-semibold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
        : "text-rose-400 font-semibold drop-shadow-[0_0_8px_rgba(251,113,113,0.5)]";
    }
    return "text-slate-300";
  };

  const calculateAccuracy = () => {
    const paragraphWords = paragraphWordsRef.current;
    let correctCount = 0;

    paragraphWords.forEach((word, index) => {
      if (
        index < spokenWords.length &&
        word.toLowerCase() === spokenWords[index].toLowerCase()
      ) {
        correctCount++;
      }
    });

    return ((correctCount / paragraphWords.length) * 100).toFixed(2);
  };

  const handleSubmit = async () => {
    const userData = localStorage.getItem("user");
    let userID = null;

    if (userData) {
      try {
        const userObject = JSON.parse(userData);
        userID = userObject.userID;
      } catch (error) {
        alert("Failed to parse user data.");
        return;
      }
    }

    if (!userID) {
      alert("User not logged in.");
      return;
    }

    const paragraph_ReadID = 2;
    const accuracyScore = calculateAccuracy();
    setAccuracy(accuracyScore);

    const payload = {
      paragraph_SpeakID: 5,
      paragraph_Speak_UserName: spokenWords.join(" "),
      paragraph_ReadID,
      userID: parseInt(userID, 10),
      accuracy: accuracyScore,
    };

    try {
      const response = await fetch(
        "https://localhost:7106/api/Paragraph_Listener",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      alert("An error occurred while submitting data.");
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">

        {/* Interactive Speech Card */}
        <div className="glass-card-3d p-6 flex flex-col justify-between flex-1 space-y-6">
          
          {/* Paragraph Speech Display Box */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Target Paragraph</span>
              </span>
              {isListening && (
                <span className="flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Listening Active...</span>
                </span>
              )}
            </div>

            <div className="paragraph-box text-base leading-relaxed font-sans bg-slate-950/60 p-6 rounded-xl border border-white/10 shadow-inner min-h-[160px]">
              {paragraph.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={`${compareWords(word, index)} inline-block mx-1 transition-colors duration-200`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons & Result Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-sm font-semibold text-white transition-all shadow-lg w-full sm:w-auto ${
                  isListening
                    ? "btn-3d-danger animate-pulse"
                    : "btn-3d-cyan"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                className="custom-button px-6 py-3 text-sm font-semibold flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>

            {accuracy !== null && (
              <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900/60 border border-emerald-500/40 text-emerald-400 flex items-center space-x-3 shadow-lg">
                <Award className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Evaluation Score</span>
                  <span className="text-lg font-extrabold text-white">{accuracy}% Accuracy</span>
                </div>
              </div>
            )}
          </div>

        </div>

    </div>
  );
};

export default ParagraphListener;
