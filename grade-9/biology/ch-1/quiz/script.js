// grade-9/biology/ch-1/quiz/script.js
// UPDATED VERSION - Shows "See Result" button after last question

import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

// ===== CONFIGURATION =====
const SUBJECT = '9bio';
const CHAPTER = 'ch1';
const QUESTIONS_PER_QUIZ = 10;

// Chapter display names
const CHAPTER_NAMES = {
    ch1: 'Introduction to Biology',
    ch2: 'Characteristics and Classification',
    ch3: 'Cells',
    ch4: 'Reproduction',
    ch5: 'Health, Nutrition & Diseases',
    ch6: 'Ecology'
};

// ===== SESSION CHECK =====
const sessionData = localStorage.getItem("current_user_session");
const currentUser = sessionData ? JSON.parse(sessionData) : null;
const USER_ID = currentUser?.id || null;

if (!currentUser) {
    window.location.href = "../../../../signin.html";
}

// ===== STORAGE KEYS =====
const STORAGE = {
    index: `${SUBJECT}_${CHAPTER}_index`,
    score: `${SUBJECT}_${CHAPTER}_score`,
    finished: `${SUBJECT}_${CHAPTER}_finished`,
    streak: `${SUBJECT}_${CHAPTER}_streak`,
    questions: `${SUBJECT}_${CHAPTER}_questions`,
    usedIds: `${SUBJECT}_${CHAPTER}_used_ids`
};

// ===== STATE =====
let allQuestions = [];
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let answersLocked = false;
let quizCompleted = false;

// ===== EMBEDDED QUESTIONS DATA =====
const EMBEDDED_QUESTIONS = {
    "chapter": "ch1",
    "chapterName": "Introduction to Biology",
    "totalQuestions": 20,
    "questions": [
      {
        "id": 1,
        "question": "What is the definition of Biology?",
        "explanation": "Biology is the scientific study of life and living organisms.",
        "options": ["Study of rocks", "Study of life and living organisms", "Study of universe", "Study of matter"],
        "correct": 1
      },
      {
        "id": 2,
        "question": "Why do we study Biology?",
        "explanation": "Biology helps us understand life processes, find medical solutions, conserve environment, and improve agriculture.",
        "options": ["To learn about stars", "To understand life and find medical solutions", "To build buildings", "To study history"],
        "correct": 1
      },
      {
        "id": 3,
        "question": "What is the first step in the scientific method?",
        "explanation": "The scientific method begins with making observations about the natural world.",
        "options": ["Hypothesis", "Experiment", "Observation", "Conclusion"],
        "correct": 2
      },
      {
        "id": 4,
        "question": "What is a hypothesis?",
        "explanation": "A hypothesis is a testable explanation or prediction that can be verified through experimentation.",
        "options": ["Final result", "Testable prediction", "Random guess", "Laboratory tool"],
        "correct": 1
      },
      {
        "id": 5,
        "question": "What is the correct order of the Scientific Method?",
        "explanation": "Observation → Question → Hypothesis → Experiment → Conclusion → Communication.",
        "options": ["Hypothesis → Experiment → Observation", "Observation → Hypothesis → Experiment → Conclusion", "Conclusion → Hypothesis → Observation", "Experiment → Observation → Hypothesis"],
        "correct": 1
      },
      {
        "id": 6,
        "question": "Which of these is a laboratory tool used in Biology?",
        "explanation": "A microscope is the most important tool for biologists to observe small organisms and cells.",
        "options": ["Compass", "Microscope", "GPS device", "Hammer"],
        "correct": 1
      },
      {
        "id": 7,
        "question": "Which tool is used for field observations?",
        "explanation": "Binoculars help biologists observe animals and plants from a safe distance.",
        "options": ["Binoculars", "Petri dish", "Test tube", "Centrifuge"],
        "correct": 0
      },
      {
        "id": 8,
        "question": "What does the eyepiece of a microscope do?",
        "explanation": "The eyepiece (ocular lens) magnifies the image formed by the objective lens.",
        "options": ["Focuses light", "Holds the slide", "Magnifies the image", "Adjusts brightness"],
        "correct": 2
      },
      {
        "id": 9,
        "question": "Which part of the microscope regulates the amount of light?",
        "explanation": "The diaphragm controls the intensity and amount of light reaching the specimen.",
        "options": ["Objective lens", "Diaphragm", "Stage clips", "Nosepiece"],
        "correct": 1
      },
      {
        "id": 10,
        "question": "What is the correct way to carry a microscope?",
        "explanation": "Always use two hands: one hand on the arm and one hand supporting the base.",
        "options": ["By the stage only", "One hand on arm, one on base", "By the eyepiece", "Upside down"],
        "correct": 1
      },
      {
        "id": 11,
        "question": "What should you do if a chemical splashes in your eyes?",
        "explanation": "Immediately flush eyes with water for at least 15 minutes and inform the teacher.",
        "options": ["Tell teacher later", "Rub your eyes", "Flush with water immediately", "Continue working"],
        "correct": 2
      },
      {
        "id": 12,
        "question": "What is magnification?",
        "explanation": "Magnification is the process of making an object appear larger than its actual size.",
        "options": ["Making objects smaller", "Making objects appear larger", "Changing object color", "Measuring objects"],
        "correct": 1
      },
      {
        "id": 13,
        "question": "Total magnification of a microscope is calculated by:",
        "explanation": "Total magnification = Eyepiece magnification × Objective lens magnification.",
        "options": ["Eyepiece + Objective", "Eyepiece × Objective", "Eyepiece ÷ Objective", "Objective - Eyepiece"],
        "correct": 1
      },
      {
        "id": 14,
        "question": "Which objective lens provides the highest magnification?",
        "explanation": "The oil immersion lens (usually 100x) provides the highest magnification.",
        "options": ["4x (Scanning)", "10x (Low power)", "40x (High power)", "100x (Oil immersion)"],
        "correct": 3
      },
      {
        "id": 15,
        "question": "What is the function of the stage on a microscope?",
        "explanation": "The stage is the flat platform where the microscope slide is placed.",
        "options": ["Magnify image", "Hold the slide", "Adjust focus", "Control light"],
        "correct": 1
      },
      {
        "id": 16,
        "question": "Which knob should you use first when focusing a microscope?",
        "explanation": "Always start with the coarse adjustment knob to bring the specimen into general focus.",
        "options": ["Fine adjustment", "Coarse adjustment", "Diaphragm", "Stage clips"],
        "correct": 1
      },
      {
        "id": 17,
        "question": "What is resolution in microscopy?",
        "explanation": "Resolution is the ability to distinguish two close objects as separate entities.",
        "options": ["Magnification power", "Ability to distinguish details", "Light intensity", "Lens size"],
        "correct": 1
      },
      {
        "id": 18,
        "question": "Which of these is NOT a laboratory safety rule?",
        "explanation": "Eating and drinking in the lab is strictly prohibited due to contamination risks.",
        "options": ["Wear safety goggles", "Tie back long hair", "Eat snacks during experiment", "Wash hands after lab"],
        "correct": 2
      },
      {
        "id": 19,
        "question": "What does the term 'Biology' literally mean?",
        "explanation": "Bios = life, Logos = study. Biology means the study of life.",
        "options": ["Study of Earth", "Study of life", "Study of chemicals", "Study of animals only"],
        "correct": 1
      },
      {
        "id": 20,
        "question": "Who is considered the 'Father of Biology'?",
        "explanation": "Aristotle made extensive observations and classifications of living organisms.",
        "options": ["Aristotle", "Charles Darwin", "Gregor Mendel", "Louis Pasteur"],
        "correct": 0
      }
    ]
};

// ===== FAST RANDOM SELECTION =====
function getRandomQuestions(count) {
    if (!allQuestions.length) return [];
    
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
}

// ===== LOAD QUESTIONS =====
function loadQuestions() {
    try {
        allQuestions = EMBEDDED_QUESTIONS.questions || [];
        console.log(`✅ Loaded ${allQuestions.length} questions for Chapter 1`);
        return true;
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        return false;
    }
}

// ===== INITIALIZE QUIZ =====
function initQuiz() {
    const overlay = document.getElementById('loading-overlay');
    
    const loaded = loadQuestions();
    if (!loaded) {
        alert('Failed to load quiz questions.');
        window.location.href = '../../index.html';
        return;
    }
    
    if (overlay) overlay.style.display = 'none';
    
    const finished = localStorage.getItem(STORAGE.finished);
    
    if (finished === "true") {
        const savedScore = parseInt(localStorage.getItem(STORAGE.score)) || 0;
        const savedQuestions = localStorage.getItem(STORAGE.questions);
        const savedStreak = parseInt(localStorage.getItem(STORAGE.streak)) || 0;
        
        if (savedQuestions) {
            quizQuestions = JSON.parse(savedQuestions);
            score = savedScore;
            bestStreak = savedStreak;
            quizCompleted = true;
            showResultPanel();
            return;
        }
    }
    
    const savedIndex = localStorage.getItem(STORAGE.index);
    const savedScore = localStorage.getItem(STORAGE.score);
    const savedQuestions = localStorage.getItem(STORAGE.questions);
    const savedStreak = localStorage.getItem(STORAGE.streak);
    
    if (savedQuestions && savedIndex !== null) {
        quizQuestions = JSON.parse(savedQuestions);
        currentIndex = parseInt(savedIndex);
        score = parseInt(savedScore) || 0;
        streak = parseInt(savedStreak) || 0;
        bestStreak = parseInt(localStorage.getItem(`${STORAGE.streak}_best`)) || streak;
    } else {
        startNewQuiz();
    }
    
    showQuestion();
}

function startNewQuiz() {
    quizQuestions = getRandomQuestions(QUESTIONS_PER_QUIZ);
    currentIndex = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    quizCompleted = false;
    
    localStorage.setItem(STORAGE.questions, JSON.stringify(quizQuestions));
    localStorage.setItem(STORAGE.index, currentIndex);
    localStorage.setItem(STORAGE.score, score);
    localStorage.setItem(STORAGE.streak, streak);
    localStorage.setItem(`${STORAGE.streak}_best`, bestStreak);
    localStorage.setItem(STORAGE.finished, "false");
}

// ===== SAVE TO FIREBASE =====
async function saveQuizToFirebase() {
    if (!USER_ID) return false;
    
    try {
        const profile = await getUserProfile();
        
        const quizResult = {
            studentId: USER_ID,
            studentName: currentUser?.name || profile?.name || 'Student',
            idNumber: profile?.idNumber || currentUser?.idNumber || '-',
            grade: profile?.grade || currentUser?.grade || 9,
            section: profile?.section || currentUser?.section || null,
            subject: 'Biology',
            subjectCode: SUBJECT,
            chapter: CHAPTER,
            chapterName: CHAPTER_NAMES[CHAPTER] || 'Biology',
            score: score,
            totalQuestions: quizQuestions.length,
            percentage: Math.round((score / quizQuestions.length) * 100),
            streak: bestStreak,
            completedAt: Timestamp.now()
        };
        
        await addDoc(collection(db, "quiz_results"), quizResult);
        console.log("✅ Quiz saved to Firebase!");
        return true;
    } catch (error) {
        console.error("Error saving:", error);
        return false;
    }
}

async function getUserProfile() {
    if (!USER_ID) return null;
    try {
        const profileSnap = await getDoc(doc(db, 'profiles', USER_ID));
        return profileSnap.exists() ? profileSnap.data() : null;
    } catch { 
        return null; 
    }
}

// ===== DISPLAY QUESTION =====
function showQuestion() {
    answersLocked = false;
    
    const explanationContainer = document.getElementById("explanation-container");
    const nextBtn = document.getElementById("next-btn");
    if (explanationContainer) explanationContainer.classList.add("hidden");
    
    const q = quizQuestions[currentIndex];
    if (!q) {
        console.error('Question not found at index:', currentIndex);
        return;
    }
    
    // Update button text based on position
    if (nextBtn) {
        if (currentIndex === quizQuestions.length - 1) {
            nextBtn.innerHTML = 'See Results <i class="fas fa-chart-bar"></i>';
        } else {
            nextBtn.innerHTML = 'Next Question <i class="fas fa-arrow-right"></i>';
        }
        nextBtn.classList.add("hidden");
    }
    
    const questionText = document.getElementById("question-text");
    const currentQ = document.getElementById("current-question");
    const fullQEls = document.querySelectorAll(".fullq");
    const scoreEl = document.getElementById("score");
    const progressEl = document.getElementById("progress");
    const percentEl = document.getElementById("progress-percent");
    
    if (questionText) questionText.textContent = q.question;
    if (currentQ) currentQ.textContent = currentIndex + 1;
    fullQEls.forEach(el => el.textContent = quizQuestions.length);
    if (scoreEl) scoreEl.textContent = score;
    
    const progressPercent = ((currentIndex + 1) / quizQuestions.length) * 100;
    if (progressEl) progressEl.style.width = progressPercent + "%";
    if (percentEl) percentEl.textContent = Math.round(progressPercent) + "%";
    
    updateStreakDisplay();
    
    const container = document.getElementById("answers-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span>${opt}`;
        btn.onclick = () => selectAnswer(i === q.correct, btn);
        container.appendChild(btn);
    });
}

function selectAnswer(isCorrect, btn) {
    if (answersLocked) return;
    answersLocked = true;
    
    const q = quizQuestions[currentIndex];
    
    if (isCorrect) {
        score++;
        streak++;
        if (streak > bestStreak) {
            bestStreak = streak;
            localStorage.setItem(`${STORAGE.streak}_best`, bestStreak);
        }
        btn.classList.add("correct", "pulse");
    } else {
        streak = 0;
        btn.classList.add("incorrect", "shake");
        
        const buttons = document.querySelectorAll('.answer-btn');
        if (buttons[q.correct]) {
            buttons[q.correct].classList.add("correct");
        }
    }
    
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
    
    localStorage.setItem(STORAGE.score, score);
    localStorage.setItem(STORAGE.streak, streak);
    
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score;
    
    updateStreakDisplay();
    
    const explanationText = document.getElementById("explanation-text");
    const explanationContainer = document.getElementById("explanation-container");
    const nextBtn = document.getElementById("next-btn");
    
    if (explanationText) explanationText.textContent = q.explanation;
    if (explanationContainer) explanationContainer.classList.remove("hidden");
    if (nextBtn) nextBtn.classList.remove("hidden");
}

function updateStreakDisplay() {
    const display = document.getElementById("streakDisplay");
    const span = display?.querySelector('span');
    if (span) span.textContent = streak + " Streak";
    if (display) {
        streak >= 2 ? display.classList.remove("hidden") : display.classList.add("hidden");
    }
}

// ===== HANDLE NEXT OR SEE RESULTS =====
function handleNextOrResults() {
    if (currentIndex === quizQuestions.length - 1) {
        // Last question answered - mark as completed and show results panel
        quizCompleted = true;
        localStorage.setItem(STORAGE.finished, "true");
        localStorage.removeItem(STORAGE.index);
        
        // Save to Firebase
        saveQuizToFirebase();
        
        // Show result panel
        showResultPanel();
    } else {
        // Move to next question
        currentIndex++;
        localStorage.setItem(STORAGE.index, currentIndex);
        showQuestion();
    }
}

// ===== CREATE AND SHOW RESULT PANEL =====
function showResultPanel() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    // Determine rating emoji and message
    let ratingEmoji, ratingMessage, ratingClass;
    if (percentage >= 90) {
        ratingEmoji = '🏆';
        ratingMessage = 'Excellent! You mastered this chapter!';
        ratingClass = 'excellent';
    } else if (percentage >= 75) {
        ratingEmoji = '🌟';
        ratingMessage = 'Great job! Keep up the good work!';
        ratingClass = 'great';
    } else if (percentage >= 60) {
        ratingEmoji = '👍';
        ratingMessage = 'Good effort! Review and try again.';
        ratingClass = 'good';
    } else if (percentage >= 45) {
        ratingEmoji = '📚';
        ratingMessage = 'Keep practicing! You\'re getting there.';
        ratingClass = 'practice';
    } else {
        ratingEmoji = '🌱';
        ratingMessage = 'Don\'t give up! Review the notes and try again.';
        ratingClass = 'try-again';
    }
    
    // Create result panel HTML
    const panelHTML = `
        <div class="result-panel-overlay" id="resultPanelOverlay">
            <div class="result-panel ${ratingClass}">
                <div class="result-panel-header">
                    <div class="result-panel-icon">${ratingEmoji}</div>
                    <h2>Quiz Complete!</h2>
                    <p>Chapter 1: Introduction to Biology</p>
                </div>
                
                <div class="result-panel-score">
                    <div class="final-score-large">${score}/${quizQuestions.length}</div>
                    <div class="percentage-badge">${percentage}%</div>
                </div>
                
                <div class="result-panel-stats">
                    <div class="stat-item">
                        <i class="fas fa-check-circle"></i>
                        <span class="stat-value">${score}</span>
                        <span class="stat-label">Correct</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-times-circle"></i>
                        <span class="stat-value">${quizQuestions.length - score}</span>
                        <span class="stat-label">Incorrect</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-fire"></i>
                        <span class="stat-value">${bestStreak}</span>
                        <span class="stat-label">Best Streak</span>
                    </div>
                </div>
                
                <div class="result-panel-message">
                    ${ratingMessage}
                </div>
                
                <div class="result-panel-actions">
                    <button class="panel-btn restart-btn" id="panelRestartBtn">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button class="panel-btn dashboard-btn" id="panelDashboardBtn">
                        <i class="fas fa-th-large"></i> Back to Dashboard
                    </button>
                </div>
                
                <div class="redirect-timer" id="redirectTimer">
                    Auto-redirecting to dashboard in <span id="timerSeconds">5</span>s...
                </div>
            </div>
        </div>
    `;
    
    // Remove existing panel if any
    const existingPanel = document.querySelector('.result-panel-overlay');
    if (existingPanel) existingPanel.remove();
    
    // Add panel to body
    document.body.insertAdjacentHTML('beforeend', panelHTML);
    
    // Add panel styles
    addResultPanelStyles();
    
    // Set up event listeners
    document.getElementById('panelRestartBtn').addEventListener('click', () => {
        document.querySelector('.result-panel-overlay').remove();
        restartQuiz();
    });
    
    document.getElementById('panelDashboardBtn').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });
    
    // Click outside to close
    document.getElementById('resultPanelOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'resultPanelOverlay') {
            // Still redirect but allow user to see result
        }
    });
    
    // Auto-redirect timer
    let secondsLeft = 5;
    const timerSpan = document.getElementById('timerSeconds');
    
    const timerInterval = setInterval(() => {
        secondsLeft--;
        if (timerSpan) timerSpan.textContent = secondsLeft;
        
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            window.location.href = '../../index.html';
        }
    }, 1000);
    
    // Cancel timer if user interacts with buttons
    document.getElementById('panelRestartBtn').addEventListener('click', () => clearInterval(timerInterval));
    document.getElementById('panelDashboardBtn').addEventListener('click', () => clearInterval(timerInterval));
}

// ===== ADD RESULT PANEL STYLES =====
function addResultPanelStyles() {
    if (document.getElementById('resultPanelStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'resultPanelStyles';
    styles.textContent = `
        .result-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .result-panel {
            background: var(--card);
            border-radius: 28px;
            padding: 30px;
            max-width: 420px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideUp 0.4s ease;
            border: 1px solid var(--border);
        }
        
        .result-panel.excellent {
            border-top: 6px solid #28a745;
        }
        
        .result-panel.great {
            border-top: 6px solid var(--primary);
        }
        
        .result-panel.good {
            border-top: 6px solid #ffc107;
        }
        
        .result-panel.practice {
            border-top: 6px solid #fd7e14;
        }
        
        .result-panel.try-again {
            border-top: 6px solid #dc3545;
        }
        
        .result-panel-header {
            margin-bottom: 25px;
        }
        
        .result-panel-icon {
            font-size: 4rem;
            margin-bottom: 10px;
        }
        
        .result-panel-header h2 {
            color: var(--text);
            font-size: 1.8rem;
            margin-bottom: 5px;
        }
        
        .result-panel-header p {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .result-panel-score {
            margin-bottom: 25px;
        }
        
        .final-score-large {
            font-size: 4.5rem;
            font-weight: 800;
            color: var(--primary);
            line-height: 1.2;
        }
        
        .percentage-badge {
            font-size: 1.3rem;
            color: var(--text-light);
            font-weight: 500;
        }
        
        .result-panel-stats {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-bottom: 25px;
            padding: 15px;
            background: var(--bg);
            border-radius: 16px;
        }
        
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
        
        .stat-item i {
            font-size: 1.3rem;
            color: var(--primary);
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text);
        }
        
        .stat-label {
            font-size: 0.75rem;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .result-panel-message {
            padding: 15px;
            background: var(--bg);
            border-radius: 14px;
            margin-bottom: 25px;
            color: var(--text);
            font-weight: 500;
        }
        
        .result-panel-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 15px;
        }
        
        .panel-btn {
            flex: 1;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s;
        }
        
        .restart-btn {
            background: var(--bg);
            color: var(--text);
            border: 1px solid var(--border);
        }
        
        .restart-btn:hover {
            background: var(--border);
        }
        
        .dashboard-btn {
            background: var(--primary);
            color: white;
        }
        
        .dashboard-btn:hover {
            background: var(--primary-dark);
        }
        
        .redirect-timer {
            font-size: 0.8rem;
            color: var(--text-light);
        }
        
        .redirect-timer span {
            font-weight: 700;
            color: var(--primary);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 480px) {
            .result-panel {
                padding: 20px;
            }
            
            .result-panel-stats {
                gap: 15px;
            }
            
            .result-panel-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// ===== RESTART QUIZ =====
function restartQuiz() {
    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem(`${STORAGE.streak}_best`);
    
    startNewQuiz();
    showQuestion();
    
    const resultScreen = document.getElementById("result-screen");
    const quizScreen = document.getElementById("quiz-screen");
    
    if (resultScreen) resultScreen.classList.remove("active");
    if (quizScreen) quizScreen.classList.add("active");
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextOrResults);
    }
    
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    if (currentUser) {
        const initial = (currentUser.name || 'S').charAt(0).toUpperCase();
        document.querySelectorAll('#headerUserName, #dropdownUserName').forEach(el => {
            if (el) el.textContent = currentUser.name || 'Student';
        });
        document.querySelectorAll('#headerUserGrade, #dropdownUserGrade').forEach(el => {
            if (el) el.textContent = `Grade ${currentUser.grade || 9}`;
        });
        document.querySelectorAll('#headerAvatar, #dropdownAvatar').forEach(el => {
            if (el) el.textContent = initial;
        });
    }
    
    initQuiz();
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (['a', 'b', 'c', 'd'].includes(key) && !answersLocked) {
        const index = key.charCodeAt(0) - 97;
        const btns = document.querySelectorAll('.answer-btn:not(:disabled)');
        if (btns[index]) {
            e.preventDefault();
            btns[index].click();
        }
    }
    
    if (e.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && !nextBtn.classList.contains('hidden')) {
            e.preventDefault();
            nextBtn.click();
        }
    }
});

// ===== LOGOUT =====
window.logout = () => {
    localStorage.removeItem("current_user_session");
    window.location.href = "../../../../signin.html";
};