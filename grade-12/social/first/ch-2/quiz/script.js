// grade-9/first/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '12his';
const CHAPTER = 'ch2';

// 1. Get User
const sessionData = localStorage.getItem("current_user_session");
const currentUser = sessionData ? JSON.parse(sessionData) : null;
const USER_ID = currentUser ? currentUser.id : null;

if (!currentUser) window.location.href = "../../../../signin.html";

const INDEX_KEY = `${SUBJECT}_${CHAPTER}_index`;
const SCORE_KEY = `${SUBJECT}_${CHAPTER}_score`;
const FINISHED_KEY = `${SUBJECT}_${CHAPTER}_finished`;
const STREAK_KEY = `${SUBJECT}_${CHAPTER}_streak`;

// 2. Quiz Questions
const quizQuestions = [
 {
        question: 'Who was the first emperor of the Roman Empire?',
        explanation: 'Augustus Caesar became the first emperor of Rome in 27 BCE.',
        answers: [
            {text: 'Julius Caesar', correct: false},
            {text: 'Augustus Caesar', correct: true},
            {text: 'Nero', correct: false},
            {text: 'Caligula', correct: false}
        ]
    },
    {
        question: 'What was the main purpose of the Silk Road?',
        explanation: 'The Silk Road was a trade route connecting China with Europe, facilitating the exchange of goods, ideas, and culture.',
        answers: [
            {text: 'To spread religions only', correct: false},
            {text: 'To trade goods and culture', correct: true},
            {text: 'To build roads in Rome', correct: false},
            {text: 'To fight wars', correct: false}
        ]
    },
    {
        question: 'Who was known as the “Father of History”?',
        explanation: 'Herodotus, a Greek historian, is considered the Father of History for his systematic collection of historical events.',
        answers: [
            {text: 'Plato', correct: false},
            {text: 'Aristotle', correct: false},
            {text: 'Herodotus', correct: true},
            {text: 'Socrates', correct: false}
        ]
    },
    {
        question: 'What was the Renaissance?',
        explanation: 'The Renaissance was a period of cultural, artistic, and intellectual revival in Europe between the 14th and 17th centuries.',
        answers: [
            {text: 'A war in Europe', correct: false},
            {text: 'A period of revival in arts and learning', correct: true},
            {text: 'A religious cult', correct: false},
            {text: 'A type of government', correct: false}
        ]
    },
    {
        question: 'What invention by Johannes Gutenberg revolutionized Europe?',
        explanation: 'Gutenberg invented the printing press, which allowed books to be mass-produced and knowledge to spread quickly.',
        answers: [
            {text: 'Telescope', correct: false},
            {text: 'Printing press', correct: true},
            {text: 'Compass', correct: false},
            {text: 'Steam engine', correct: false}
        ]
    },
    {
        question: 'Who was the leader of the Mongol Empire?',
        explanation: 'Genghis Khan united the Mongol tribes and created one of the largest empires in history.',
        answers: [
            {text: 'Kublai Khan', correct: false},
            {text: 'Genghis Khan', correct: true},
            {text: 'Attila the Hun', correct: false},
            {text: 'Alexander the Great', correct: false}
        ]
    },
    {
        question: 'What was the primary reason for the Age of Exploration?',
        explanation: 'European nations explored new territories to find trade routes, acquire wealth, and expand their empires.',
        answers: [
            {text: 'To spread diseases', correct: false},
            {text: 'To find trade routes and wealth', correct: true},
            {text: 'To build schools', correct: false},
            {text: 'To colonize Africa only', correct: false}
        ]
    },
    {
        question: 'Which civilization built the pyramids in Egypt?',
        explanation: 'The ancient Egyptians constructed the pyramids as tombs for their pharaohs.',
        answers: [
            {text: 'Romans', correct: false},
            {text: 'Greeks', correct: false},
            {text: 'Egyptians', correct: true},
            {text: 'Babylonians', correct: false}
        ]
    },
    {
        question: 'What was the main cause of World War I?',
        explanation: 'The assassination of Archduke Franz Ferdinand triggered a series of alliances leading to World War I.',
        answers: [
            {text: 'Assassination of Archduke Franz Ferdinand', correct: true},
            {text: 'Invasion of Poland', correct: false},
            {text: 'Discovery of America', correct: false},
            {text: 'Fall of Rome', correct: false}
        ]
    },
    {
        question: 'Who was Martin Luther?',
        explanation: 'Martin Luther was a German theologian who initiated the Protestant Reformation in 1517 by challenging the Catholic Church.',
        answers: [
            {text: 'A king of England', correct: false},
            {text: 'A German theologian who started the Reformation', correct: true},
            {text: 'A Roman emperor', correct: false},
            {text: 'A Greek philosopher', correct: false}
        ]
    }
];

let currentQuestionIndex = parseInt(localStorage.getItem(INDEX_KEY)) || 0;
let score = parseInt(localStorage.getItem(SCORE_KEY)) || 0;
let streak = parseInt(localStorage.getItem(STREAK_KEY)) || 0;
let answersLocked = false;

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

// Save quiz to Firebase
async function saveQuizToFirebase() {
    if (!USER_ID) {
        console.log('No user ID, skipping save');
        return;
    }

    const profile = await getUserProfile();

    try {
        const quizResult = {
            studentId: USER_ID,
            studentName: currentUser?.name || profile?.name || 'Student',
            idNumber: profile?.idNumber || currentUser?.idNumber || '-',
            grade: profile?.grade || currentUser?.grade || 9,
            stream: profile?.stream || currentUser?.stream || null,
            subject: 'Biology',
            subjectCode: SUBJECT,
            chapter: CHAPTER,
            chapterName: 'Introduction to Biology',
            score: score,
            totalQuestions: quizQuestions.length,
            percentage: Math.round((score / quizQuestions.length) * 100),
            isFinalExam: false,
            streak: streak,
            completedAt: Timestamp.now()
        };

        await addDoc(collection(db, "quiz_results"), quizResult);
        console.log("✅ Quiz saved to Firebase! Score:", score, "/", quizQuestions.length);
        console.log("Saved with chapter:", CHAPTER);
        return true;
    } catch (error) {
        console.error("❌ Error saving quiz:", error);
        return false;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (['a','b','c','d'].includes(key) && !answersLocked) {
        const index = key.charCodeAt(0) - 97;
        const btns = document.querySelectorAll('.answer-btn');
        if (btns[index]) btns[index].click();
    }
    if (e.key === 'Enter' && answersLocked) {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.click();
    }
});

function showQuestion() {
    answersLocked = false;
    document.getElementById("explanation-container").classList.add("hidden");
    document.getElementById("explain-link-container").classList.add("hidden");
    document.getElementById("next-container").classList.add("hidden");

    const q = quizQuestions[currentQuestionIndex];
    document.getElementById("question-text").textContent = q.question;
    document.getElementById("current-question").textContent = currentQuestionIndex + 1;
    document.querySelectorAll(".fullq").forEach(el => el.textContent = quizQuestions.length);
    document.getElementById("score").textContent = score;
    document.getElementById("progress").style.width = ((currentQuestionIndex + 1) / quizQuestions.length) * 100 + "%";

    updateStreakView();

    const container = document.getElementById("answers-container");
    container.innerHTML = "";
    q.answers.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = `${String.fromCharCode(65 + i)}. ${ans.text}`;
        btn.className = "answer-btn";
        btn.onclick = () => selectAnswer(ans.correct, btn);
        container.appendChild(btn);
    });
}

function selectAnswer(isCorrect, btn) {
    if (answersLocked) return;
    answersLocked = true;

    if (isCorrect) {
        score++; streak++;
        btn.classList.add("correct", "pulse");
    } else {
        streak = 0;
        btn.classList.add("incorrect", "shake");
        Array.from(document.getElementById("answers-container").children).forEach(b => {
            const idx = b.textContent.charCodeAt(0) - 65;
            if (quizQuestions[currentQuestionIndex].answers[idx].correct) b.classList.add("correct");
        });
    }

    localStorage.setItem(SCORE_KEY, score);
    localStorage.setItem(STREAK_KEY, streak);
    document.getElementById("score").textContent = score;
    updateStreakView();

    document.getElementById("explanation-text").textContent = quizQuestions[currentQuestionIndex].explanation;
    document.getElementById("explain-link-container").classList.remove("hidden");
    document.getElementById("next-container").classList.remove("hidden");
}

function updateStreakView() {
    const display = document.getElementById("streak-display");
    if (display) display.textContent = streak >= 2 ? `🔥 ${streak} Streak!` : "";
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('accountIcon');
    const dropdown = document.getElementById('accountDropdown');
    const themeSelect = document.getElementById('theme-selector');

    if (icon) {
        icon.onclick = (e) => { e.stopPropagation(); if(dropdown) dropdown.classList.toggle('active'); };
    }
    if (dropdown) dropdown.onclick = (e) => e.stopPropagation();
    document.onclick = () => { if(dropdown) dropdown.classList.remove('active'); };

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.onchange = (e) => {
            document.body.setAttribute('data-theme', e.target.value);
            localStorage.setItem('theme', e.target.value);
        };
    }

    if (currentUser) {
        const nameDisplay = document.querySelector('.user-name-dropdown');
        const gradeDisplay = document.querySelector('.user-grade-dropdown');
        const avatarDisplay = document.querySelector('.user-avatar');
        if (nameDisplay) nameDisplay.textContent = currentUser.name;
        if (gradeDisplay) gradeDisplay.textContent = `Grade ${currentUser.grade}`;
        if (avatarDisplay) avatarDisplay.textContent = currentUser.name.charAt(0).toUpperCase();
    }

    if (localStorage.getItem(FINISHED_KEY) === "true") showResult();
    else showQuestion();
});

document.getElementById("next-btn").onclick = async () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        localStorage.setItem(INDEX_KEY, currentQuestionIndex);
        showQuestion();
    } else {
        await saveQuizToFirebase();
        localStorage.setItem(FINISHED_KEY, "true");
        localStorage.removeItem(INDEX_KEY);
        showResult();
    }
};

document.getElementById("show-explain-link").onclick = (e) => {
    e.preventDefault();
    document.getElementById("explanation-container").classList.toggle("hidden");
};

function showResult() {
    document.getElementById("quiz-screen").classList.remove("active");
    document.getElementById("result-screen").classList.add("active");
    document.getElementById("final-score").textContent = `${score}/${quizQuestions.length}`;

    const percentage = (score / quizQuestions.length) * 100;
    const ratingImg = document.querySelector('.rating-img');
    if (ratingImg) {
        if (percentage >= 90) ratingImg.alt = '🎉 Excellent';
        else if (percentage >= 75) ratingImg.alt = '🌟 Very Good';
        else if (percentage >= 60) ratingImg.alt = '👍 Good';
        else if (percentage >= 45) ratingImg.alt = '📚 Fair';
        else ratingImg.alt = '📖 Need Improvement';
        ratingImg.src = `../../../../images/ratings/rating-${Math.round(percentage / 2)}.png`;
        ratingImg.onerror = () => { ratingImg.style.display = 'none'; };
    }
}

window.logout = () => {
    localStorage.removeItem("current_user_session");
    window.location.href = "../../../../signin.html";
};

document.getElementById("restart-btn").onclick = () => {
    [INDEX_KEY, SCORE_KEY, FINISHED_KEY, STREAK_KEY].forEach(k => localStorage.removeItem(k));
    window.location.reload();
};

document.getElementById("home-btn").onclick = () => window.location.href = "../../index.html";