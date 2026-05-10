// grade-9/first/final-exam/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc, query, where, getDocs } from '../../../firebase-config.js';

// 1. Setup & Environment
const subject = '12his';
const SUBJECT = subject;
const SUBJECT_NAME = 'history';
const IS_FINAL_EXAM = true;

const sessionData = localStorage.getItem("current_user_session");
const currentUser = sessionData ? JSON.parse(sessionData) : null;
const USER_ID = currentUser ? currentUser.id : null;

if (!currentUser) {
    window.location.href = "../../../signin.html";
}

// 2. Storage Keys
const FINAL_SCORE_KEY = `${SUBJECT}_final_score`;
const FINAL_FINISHED_KEY = `${SUBJECT}_final_finished`;
const FINAL_INPROGRESS_KEY = `${SUBJECT}_final_inprogress`;
const FINAL_ANSWERS_KEY = `${SUBJECT}_final_answers`;
const FINAL_CURRENT_INDEX_KEY = `${SUBJECT}_final_index`;

// 3. Question Data - 40 Questions
const finalQuestions = [
    { question: 'Who was the first emperor of Rome?', answers: ['Julius Caesar', 'Augustus Caesar', 'Nero', 'Caligula'], correct: 1 },
    { question: 'What was the main purpose of the Silk Road?', answers: ['To spread religions only', 'To trade goods and culture', 'To build roads in Rome', 'To fight wars'], correct: 1 },
    { question: 'Who is called the Father of History?', answers: ['Plato', 'Aristotle', 'Herodotus', 'Socrates'], correct: 2 },
    { question: 'What was the Renaissance?', answers: ['A war in Europe', 'A period of revival in arts and learning', 'A religious cult', 'A type of government'], correct: 1 },
    { question: 'What invention by Johannes Gutenberg changed Europe?', answers: ['Telescope', 'Printing press', 'Compass', 'Steam engine'], correct: 1 },
    { question: 'Who led the Mongol Empire?', answers: ['Kublai Khan', 'Genghis Khan', 'Attila the Hun', 'Alexander the Great'], correct: 1 },
    { question: 'What was the main reason for the Age of Exploration?', answers: ['To spread diseases', 'To find trade routes and wealth', 'To build schools', 'To colonize Africa only'], correct: 1 },
    { question: 'Which civilization built the pyramids?', answers: ['Romans', 'Greeks', 'Egyptians', 'Babylonians'], correct: 2 },
    { question: 'What triggered World War I?', answers: ['Assassination of Archduke Franz Ferdinand', 'Invasion of Poland', 'Discovery of America', 'Fall of Rome'], correct: 0 },
    { question: 'Who was Martin Luther?', answers: ['King of England', 'German theologian who started the Reformation', 'Roman emperor', 'Greek philosopher'], correct: 1 },
    { question: 'Which ancient civilization developed democracy?', answers: ['Rome', 'Greece', 'Egypt', 'China'], correct: 1 },
    { question: 'Who was the first President of the United States?', answers: ['Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'John Adams'], correct: 2 },
    { question: 'What empire did Alexander the Great build?', answers: ['Macedonian Empire', 'Persian Empire', 'Roman Empire', 'Ottoman Empire'], correct: 0 },
    { question: 'What was the main language of the Roman Empire?', answers: ['Greek', 'Latin', 'Arabic', 'Hebrew'], correct: 1 },
    { question: 'Which war was fought between the North and South in the USA?', answers: ['World War I', 'Civil War', 'Revolutionary War', 'Cold War'], correct: 1 },
    { question: 'What was the purpose of the Magna Carta?', answers: ['To create a monarchy', 'To limit the king\'s power', 'To declare war', 'To establish taxes'], correct: 1 },
    { question: 'Who was known as the Sun King?', answers: ['Louis XIV', 'Henry VIII', 'Napoleon Bonaparte', 'Charles I'], correct: 0 },
    { question: 'What was the main cause of the French Revolution?', answers: ['Religious conflict', 'Economic inequality and monarchy abuses', 'War with England', 'Scientific discoveries'], correct: 1 },
    { question: 'Which explorer sailed to India by going around Africa?', answers: ['Christopher Columbus', 'Vasco da Gama', 'Magellan', 'Marco Polo'], correct: 1 },
    { question: 'Who wrote "The Prince"?', answers: ['Machiavelli', 'Shakespeare', 'Plato', 'Aristotle'], correct: 0 },
    { question: 'Which empire built the Colosseum?', answers: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Egyptian Empire'], correct: 1 },
    { question: 'What was the main cause of World War II?', answers: ['Assassination of a king', 'Rise of totalitarian regimes and invasions', 'Colonial disputes', 'Scientific advancements'], correct: 1 },
    { question: 'Who was the British Prime Minister during most of WWII?', answers: ['Winston Churchill', 'Neville Chamberlain', 'Margaret Thatcher', 'Tony Blair'], correct: 0 },
    { question: 'What was the Renaissance a revival of?', answers: ['Military strategies', 'Arts, science, and learning', 'Religion only', 'Empire building'], correct: 1 },
    { question: 'Who discovered America in 1492?', answers: ['Vasco da Gama', 'Christopher Columbus', 'Ferdinand Magellan', 'Marco Polo'], correct: 1 },
    { question: 'Which empire was ruled by pharaohs?', answers: ['Greek Empire', 'Roman Empire', 'Egyptian Empire', 'Mongol Empire'], correct: 2 },
    { question: 'Who was Cleopatra?', answers: ['Queen of Egypt', 'Empress of Rome', 'Queen of Greece', 'Wife of Julius Caesar only'], correct: 0 },
    { question: 'What was the Industrial Revolution?', answers: ['Shift to agriculture', 'Shift to machine-based production', 'War period', 'Religious movement'], correct: 1 },
    { question: 'Who painted the Mona Lisa?', answers: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1 },
    { question: 'Which city was the center of the Byzantine Empire?', answers: ['Rome', 'Athens', 'Constantinople', 'Alexandria'], correct: 2 },
    { question: 'Who was Charlemagne?', answers: ['King of France', 'Emperor of the Holy Roman Empire', 'King of Spain', 'Roman senator'], correct: 1 },
    { question: 'Which civilization invented writing (cuneiform)?', answers: ['Egyptians', 'Sumerians', 'Greeks', 'Romans'], correct: 1 },
    { question: 'Who led the Bolshevik Revolution in Russia?', answers: ['Lenin', 'Trotsky', 'Stalin', 'Nicholas II'], correct: 0 },
    { question: 'What was the Cold War?', answers: ['War between USA and USSR', 'Political tension without direct war between USA and USSR', 'Civil war in Russia', 'WWII'], correct: 1 },
    { question: 'Who discovered the law of gravity?', answers: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Copernicus'], correct: 1 },
    { question: 'Which empire was defeated at the Battle of Hastings?', answers: ['Norman', 'Anglo-Saxon', 'Roman', 'Persian'], correct: 1 },
    { question: 'Who was Napoleon Bonaparte?', answers: ['French military leader and emperor', 'King of France', 'Italian general', 'Spanish ruler'], correct: 0 },
    { question: 'What was the Great Wall of China built for?', answers: ['Tourism', 'Defense against invasions', 'Trade route', 'Religious purposes'], correct: 1 },
    { question: 'Who was the first President of South Africa?', answers: ['Nelson Mandela', 'Cecil Rhodes', 'Thabo Mbeki', 'F.W. de Klerk'], correct: 0 },
    { question: 'Which ancient civilization built Machu Picchu?', answers: ['Inca', 'Maya', 'Aztec', 'Olmec'], correct: 0 },
    { question: 'Who wrote the Declaration of Independence?', answers: ['Benjamin Franklin', 'George Washington', 'Thomas Jefferson', 'John Adams'], correct: 2 },
    { question: 'What was the purpose of the Berlin Wall?', answers: ['To separate East and West Berlin during the Cold War', 'To protect against invasions', 'To mark borders in WWI', 'To show German unity'], correct: 0 }
];

// 4. State Variables
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let answersLocked = false;
let skippedIndices = [];
let questionOrder = [];
let currentUserData = null;
let existingResultDocId = null;
let existingResultData = null;

// Check if student already took final exam AND get saved answers
async function checkIfAlreadyTaken() {
    if (!USER_ID) return false;
    try {
        const q = query(
            collection(db, "quiz_results"),
            where("studentId", "==", USER_ID),
            where("subjectCode", "==", SUBJECT),
            where("isFinalExam", "==", true)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            let latest = null;
            let latestId = null;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (!latest || (data.completedAt?.toDate?.() > latest.completedAt?.toDate?.())) {
                    latest = data;
                    latestId = doc.id;
                }
            });
            if (latest) {
                existingResultDocId = latestId;
                existingResultData = latest;
                // Load saved answers from Firestore
                if (latest.answers && latest.answers.length > 0) {
                    userAnswers = latest.answers;
                    score = latest.score;
                    console.log("✅ Loaded", userAnswers.length, "answers from Firestore");
                    console.log("Sample answer:", userAnswers[0]);
                } else {
                    console.log("No answers found in Firestore document");
                }
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking existing result:", error);
        return false;
    }
}

// Get user profile data
async function getUserProfile() {
    if (!USER_ID) return null;
    try {
        const profileRef = doc(db, 'profiles', USER_ID);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
            return profileSnap.data();
        }
    } catch (error) {
        console.error('Error getting profile:', error);
    }
    return null;
}

// Save final exam to Firestore (with answers)
async function saveFinalExamToFirestore() {
    if (!USER_ID) return false;
    if (existingResultDocId) {
        console.log("Final exam already saved.");
        return false;
    }
    
    try {
        const profile = currentUserData || await getUserProfile();
        
        // Make sure we have answers to save
        if (userAnswers.length === 0) {
            console.error("No answers to save!");
            return false;
        }
        
        const result = {
            studentId: USER_ID,
            studentName: currentUser?.name || profile?.name || 'Student',
            idNumber: profile?.idNumber || currentUser?.idNumber || '-',
            grade: profile?.grade || currentUser?.grade || 9,
            stream: profile?.stream || currentUser?.stream || null,
            subject: SUBJECT_NAME,
            subjectCode: SUBJECT,
            chapter: 'final',
            chapterName: 'Final Exam (Full Book)',
            score: score,
            totalQuestions: finalQuestions.length,
            percentage: Math.round((score / finalQuestions.length) * 100),
            isFinalExam: true,
            answers: userAnswers,  // SAVE ALL ANSWERS TO FIRESTORE
            completedAt: Timestamp.now()
        };
        
        const docRef = await addDoc(collection(db, "quiz_results"), result);
        existingResultDocId = docRef.id;
        existingResultData = result;
        console.log("✅ Final exam saved! Score:", score, "/", finalQuestions.length);
        console.log("✅ Saved", userAnswers.length, "answers to Firestore");
        return true;
    } catch (error) {
        console.error("❌ Error saving final exam:", error);
        return false;
    }
}

// Display answers in the result screen
function displayAnswers(type) {
    const container = document.getElementById(type === 'correct' ? 'correct-answers' : 'wrong-answers');
    if (!container) return;
    container.innerHTML = '';
    
    console.log("Displaying answers for type:", type);
    console.log("userAnswers length:", userAnswers ? userAnswers.length : 0);
    
    if (!userAnswers || userAnswers.length === 0) {
        container.innerHTML = `<p style="padding: 20px; opacity: 0.6; text-align: center;">No ${type} answers to show.</p>`;
        return;
    }
    
    const filtered = userAnswers.filter(ans => type === 'correct' ? ans.isCorrect : !ans.isCorrect);
    
    console.log("Filtered answers count:", filtered.length);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="padding: 20px; opacity: 0.6; text-align: center;">No ${type} answers to show.</p>`;
        return;
    }

    filtered.forEach((ans, idx) => {
        const div = document.createElement('div');
        div.className = `review-item ${ans.isCorrect ? 'correct-item' : 'incorrect-item'}`;
        div.style.cssText = `
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: ${ans.isCorrect ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
            border-left: 4px solid ${ans.isCorrect ? '#28a745' : '#dc3545'};
        `;
        div.innerHTML = `
            <div class="review-question" style="font-weight: bold; margin-bottom: 8px;">${idx + 1}. ${ans.question}</div>
            <div class="review-answer" style="margin-top: 8px;">
                <i class="fas ${ans.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}" style="color: ${ans.isCorrect ? '#28a745' : '#dc3545'}; margin-right: 8px;"></i>
                <strong>Your answer:</strong> ${ans.selected}
            </div>
            ${!ans.isCorrect ? `<div class="review-answer" style="margin-top: 5px;"><i class="fas fa-check" style="color: #28a745; margin-right: 8px;"></i> <strong>Correct answer:</strong> ${ans.correct}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

// Show result screen
function showResultScreen() {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    if (startScreen) startScreen.classList.remove('active');
    if (quizScreen) quizScreen.classList.remove('active');
    if (resultScreen) resultScreen.classList.add('active');
    
    const finalScoreEl = document.getElementById('final-score');
    if (finalScoreEl) {
        finalScoreEl.textContent = `${score}/${finalQuestions.length}`;
    }
    
    // Hide start button if already taken
    const startBtn = document.querySelector('#start-screen .btn-final');
    if (startBtn && existingResultData) {
        startBtn.style.display = 'none';
        const completedMsg = document.createElement('p');
        completedMsg.innerHTML = '<i class="fas fa-check-circle"></i> You have already completed this final exam.';
        completedMsg.style.color = '#28a745';
        completedMsg.style.marginTop = '15px';
        completedMsg.style.fontWeight = 'bold';
        const startScreenDiv = document.getElementById('start-screen');
        if (startScreenDiv && !startScreenDiv.querySelector('.completed-msg')) {
            completedMsg.className = 'completed-msg';
            startScreenDiv.appendChild(completedMsg);
        }
    }
    
    // Display answers
    displayAnswers('correct');
    displayAnswers('wrong');
}

window.showTab = function(tab) {
    const correctTab = document.getElementById('tab-correct');
    const wrongTab = document.getElementById('tab-wrong');
    const correctDiv = document.getElementById('correct-answers');
    const wrongDiv = document.getElementById('wrong-answers');
    
    if (correctTab) correctTab.classList.toggle('active', tab === 'correct');
    if (wrongTab) wrongTab.classList.toggle('active', tab === 'wrong');
    if (correctDiv) correctDiv.classList.toggle('hidden', tab !== 'correct');
    if (wrongDiv) wrongDiv.classList.toggle('hidden', tab !== 'wrong');
};

// START EXAM
window.startExam = async function() {
    const alreadyTaken = await checkIfAlreadyTaken();
    if (alreadyTaken) {
        alert("You have already completed the final exam.");
        showResultScreen();
        return;
    }
    
    currentUserData = await getUserProfile();
    localStorage.setItem(FINAL_INPROGRESS_KEY, "true");
    
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    
    if (startScreen) startScreen.classList.remove('active');
    if (quizScreen) quizScreen.classList.add('active');
    
    // Shuffle questions
    questionOrder = Array.from({length: finalQuestions.length}, (_, i) => i);
    for (let i = questionOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionOrder[i], questionOrder[j]] = [questionOrder[j], questionOrder[i]];
    }
    currentIndex = 0;
    score = 0;
    userAnswers = [];
    skippedIndices = [];
    
    saveState();
    showQuestion();
};

function saveState() {
    localStorage.setItem(FINAL_ANSWERS_KEY, JSON.stringify(userAnswers));
    localStorage.setItem(FINAL_SCORE_KEY, score.toString());
    localStorage.setItem(FINAL_CURRENT_INDEX_KEY, currentIndex.toString());
}

function showQuestion() {
    if (currentIndex >= questionOrder.length) {
        if (skippedIndices.length > 0) {
            questionOrder = [...skippedIndices];
            skippedIndices = [];
            currentIndex = 0;
            saveState();
        } else {
            finishExam();
            return;
        }
    }
    
    const actualIndex = questionOrder[currentIndex];
    const q = finalQuestions[actualIndex];
    
    const currentQSpan = document.getElementById('current-q');
    const totalQSpan = document.getElementById('total-q');
    const questionText = document.getElementById('question-text');
    const progressBar = document.getElementById('progress');
    
    if (currentQSpan) currentQSpan.textContent = userAnswers.length + 1;
    if (totalQSpan) totalQSpan.textContent = finalQuestions.length;
    if (questionText) questionText.textContent = q.question;
    if (progressBar) progressBar.style.width = (userAnswers.length / finalQuestions.length) * 100 + '%';
    
    answersLocked = false;
    const container = document.getElementById('answers-container');
    if (container) {
        container.innerHTML = '';
        
        q.answers.forEach((answer, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = `${String.fromCharCode(65 + i)}. ${answer}`;
            btn.onclick = () => selectAnswer(i, actualIndex);
            container.appendChild(btn);
        });
    }

    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) skipBtn.onclick = skipQuestion;
}

function skipQuestion() {
    if (answersLocked) return;
    const actualIndex = questionOrder[currentIndex];
    skippedIndices.push(actualIndex);
    questionOrder.splice(currentIndex, 1);
    saveState();
    showQuestion();
}

function selectAnswer(selectedIndex, actualIndex) {
    if (answersLocked) return;
    answersLocked = true;

    const btns = document.querySelectorAll('.answer-btn');
    btns.forEach((btn, i) => {
        btn.style.pointerEvents = 'none';
        if (i === selectedIndex) {
            btn.classList.add('selected-feedback');
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            btn.style.opacity = '0.4';
        }
    });

    const q = finalQuestions[actualIndex];
    const isCorrect = selectedIndex === q.correct;
    
    userAnswers.push({
        question: q.question,
        selected: q.answers[selectedIndex],
        correct: q.answers[q.correct],
        isCorrect: isCorrect,
        questionIndex: actualIndex
    });

    if (isCorrect) score++;
    saveState();
    
    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 300);
}

async function finishExam() {
    console.log("Finishing exam. Total answers:", userAnswers.length);
    await saveFinalExamToFirestore();
    
    localStorage.setItem(FINAL_SCORE_KEY, score);
    localStorage.setItem(FINAL_FINISHED_KEY, "true");
    localStorage.removeItem(FINAL_INPROGRESS_KEY);
    localStorage.removeItem(FINAL_CURRENT_INDEX_KEY);
    localStorage.setItem(FINAL_ANSWERS_KEY, JSON.stringify(userAnswers));

    userAnswers.sort((a, b) => a.questionIndex - b.questionIndex);
    
    showResultScreen();
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Page loaded, checking for existing results...");
    const alreadyTaken = await checkIfAlreadyTaken();
    
    if (alreadyTaken && existingResultData) {
        // Load answers from Firestore
        if (existingResultData.answers && existingResultData.answers.length > 0) {
            userAnswers = existingResultData.answers;
            score = existingResultData.score;
            console.log("✅ Loaded", userAnswers.length, "answers from Firestore");
        } else {
            console.log("⚠️ No answers in Firestore, checking localStorage...");
            const savedAnswers = localStorage.getItem(FINAL_ANSWERS_KEY);
            if (savedAnswers) {
                userAnswers = JSON.parse(savedAnswers);
                score = parseInt(localStorage.getItem(FINAL_SCORE_KEY)) || 0;
                console.log("Loaded from localStorage:", userAnswers.length);
            }
        }
        showResultScreen();
        const startBtn = document.querySelector('#start-screen .btn-final');
        if (startBtn) startBtn.style.display = 'none';
    } else {
        const isInProgress = localStorage.getItem(FINAL_INPROGRESS_KEY) === "true";
        
        if (isInProgress) {
            const savedAnswers = localStorage.getItem(FINAL_ANSWERS_KEY);
            userAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];
            score = parseInt(localStorage.getItem(FINAL_SCORE_KEY)) || 0;
            
            const answeredIndices = userAnswers.map(ans => ans.questionIndex);
            questionOrder = Array.from({length: finalQuestions.length}, (_, i) => i)
                                 .filter(idx => !answeredIndices.includes(idx));
            
            currentIndex = 0;
            const startScreen = document.getElementById('start-screen');
            const quizScreen = document.getElementById('quiz-screen');
            if (startScreen) startScreen.classList.remove('active');
            if (quizScreen) quizScreen.classList.add('active');
            showQuestion();
        }
    }
    
    // Update user info in dropdown
    const nameDisplay = document.querySelector('.user-name-dropdown');
    const gradeDisplay = document.querySelector('.user-grade-dropdown');
    const avatarDisplay = document.querySelector('.user-avatar');
    
    if (nameDisplay && currentUser) nameDisplay.textContent = currentUser.name;
    if (gradeDisplay && currentUser) gradeDisplay.textContent = `Grade ${currentUser.grade}`;
    if (avatarDisplay && currentUser) avatarDisplay.textContent = currentUser.name?.charAt(0).toUpperCase() || '?';
    
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const themeSelect = document.getElementById('theme-selector');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.onchange = (e) => {
            document.body.setAttribute('data-theme', e.target.value);
            localStorage.setItem('theme', e.target.value);
        };
    }
    
    // Dropdown
    const accountIcon = document.getElementById('accountIcon');
    const accountDropdown = document.getElementById('accountDropdown');
    if (accountIcon) {
        accountIcon.onclick = (e) => {
            e.stopPropagation();
            if (accountDropdown) accountDropdown.classList.toggle('active');
        };
    }
    if (accountDropdown) {
        accountDropdown.onclick = (e) => e.stopPropagation();
        document.onclick = () => {
            if (accountDropdown) accountDropdown.classList.remove('active');
        };
    }
});

window.exitFinal = function() {
    window.location.href = '../index.html';
};

window.logout = function() {
    localStorage.removeItem("current_user_session");
    window.location.href = "../../../signin.html";
};