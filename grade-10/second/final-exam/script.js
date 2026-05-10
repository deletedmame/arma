// grade-9/first/final-exam/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc, query, where, getDocs } from '../../../firebase-config.js';

// 1. Setup & Environment
const subject = '10phy';
const SUBJECT = subject;
const SUBJECT_NAME = 'Physics';
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
    { question: 'What is Physics?', answers: ['Study of life', 'Study of matter and energy', 'Study of history', 'Study of language'], correct: 1 },
    { question: 'What is a force?', answers: ['Push or pull', 'Energy', 'Mass', 'Speed'], correct: 0 },
    { question: 'SI unit of force?', answers: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
    { question: 'What is mass?', answers: ['Force', 'Weight', 'Amount of matter', 'Energy'], correct: 2 },
    { question: 'What is weight?', answers: ['Mass', 'Gravity force', 'Speed', 'Energy'], correct: 1 },
    { question: 'Unit of mass?', answers: ['Newton', 'Kg', 'Meter', 'Second'], correct: 1 },
    { question: 'Speed formula?', answers: ['d/t', 'm×a', 'F×d', 'v/t'], correct: 0 },
    { question: 'Velocity is?', answers: ['Speed only', 'Speed + direction', 'Force', 'Energy'], correct: 1 },
    { question: 'Acceleration is?', answers: ['Change in velocity', 'Distance', 'Mass', 'Force'], correct: 0 },
    { question: 'Unit of acceleration?', answers: ['m/s', 'm/s²', 'N', 'kg'], correct: 1 },

    { question: 'First law of Newton?', answers: ['F=ma', 'Inertia', 'Action-reaction', 'Energy law'], correct: 1 },
    { question: 'Second law of Newton?', answers: ['F=ma', 'Inertia', 'Balance', 'Motion'], correct: 0 },
    { question: 'Third law of Newton?', answers: ['F=ma', 'Inertia', 'Action = Reaction', 'Gravity'], correct: 2 },
    { question: 'Unit of energy?', answers: ['Joule', 'Watt', 'Newton', 'Volt'], correct: 0 },
    { question: 'Energy is?', answers: ['Force', 'Work ability', 'Speed', 'Mass'], correct: 1 },
    { question: 'Work formula?', answers: ['F×d', 'm×a', 'v/t', 'd/t'], correct: 0 },
    { question: 'Power is?', answers: ['Energy', 'Work/time', 'Force', 'Speed'], correct: 1 },
    { question: 'Unit of power?', answers: ['Joule', 'Newton', 'Watt', 'Volt'], correct: 2 },
    { question: 'Kinetic energy?', answers: ['Stored', 'Motion energy', 'Heat', 'Light'], correct: 1 },
    { question: 'Potential energy?', answers: ['Motion', 'Stored energy', 'Heat', 'Sound'], correct: 1 },

    { question: 'Gravity is?', answers: ['Push force', 'Attractive force', 'Energy', 'Mass'], correct: 1 },
    { question: 'g value on Earth?', answers: ['9.8 m/s²', '10 kg', '8 m/s', '5 N'], correct: 0 },
    { question: 'Friction is?', answers: ['Motion force', 'Opposing force', 'Energy', 'Speed'], correct: 1 },
    { question: 'Heat is?', answers: ['Cold', 'Energy transfer', 'Mass', 'Force'], correct: 1 },
    { question: 'Temperature unit?', answers: ['Joule', 'Kelvin', 'Newton', 'Meter'], correct: 1 },
    { question: 'Thermometer measures?', answers: ['Heat', 'Temperature', 'Energy', 'Mass'], correct: 1 },
    { question: 'Conduction is?', answers: ['Heat through contact', 'Through air', 'Through waves', 'Light'], correct: 0 },
    { question: 'Convection is?', answers: ['Heat in liquids/gases', 'Solid only', 'Light', 'Energy'], correct: 0 },
    { question: 'Radiation is?', answers: ['Heat by waves', 'Contact', 'Liquid flow', 'Force'], correct: 0 },
    { question: 'Electric current is?', answers: ['Flow of charge', 'Energy', 'Heat', 'Mass'], correct: 0 },

    { question: 'Unit of current?', answers: ['Volt', 'Ampere', 'Watt', 'Ohm'], correct: 1 },
    { question: 'Voltage is?', answers: ['Current', 'Potential difference', 'Energy', 'Force'], correct: 1 },
    { question: 'Ohm’s law?', answers: ['V=IR', 'F=ma', 'P=IV', 'E=mc²'], correct: 0 },
    { question: 'Resistance unit?', answers: ['Volt', 'Ohm', 'Ampere', 'Watt'], correct: 1 },
    { question: 'Series circuit?', answers: ['One path', 'Many paths', 'No path', 'Parallel'], correct: 0 },
    { question: 'Parallel circuit?', answers: ['One path', 'Multiple paths', 'No current', 'Single wire'], correct: 1 },
    { question: 'Magnet attracts?', answers: ['Plastic', 'Iron', 'Wood', 'Glass'], correct: 1 },
    { question: 'Light travels as?', answers: ['Wave', 'Particle', 'Both', 'None'], correct: 2 },
    { question: 'Speed of light?', answers: ['3×10⁸ m/s', '100 m/s', '1000 m/s', '10 m/s'], correct: 0 },
    { question: 'Sound travels fastest in?', answers: ['Air', 'Water', 'Solid', 'Vacuum'], correct: 2 }
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