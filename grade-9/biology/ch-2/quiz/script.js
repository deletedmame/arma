// grade-9/first/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '9bio';
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
        question: 'What is a cell?',
        explanation: 'A cell is the basic unit of life capable of carrying out all vital functions.',
        answers: [
            {text: 'A type of tissue', correct: false},
            {text: 'The basic unit of life', correct: true},
            {text: 'A group of organs', correct: false},
            {text: 'A chemical reaction', correct: false}
        ]
    },
    {
        question: 'Which scientist first discovered cells?',
        explanation: 'Robert Hooke discovered cells in 1665 while observing cork under a microscope.',
        answers: [
            {text: 'Charles Darwin', correct: false},
            {text: 'Robert Hooke', correct: true},
            {text: 'Louis Pasteur', correct: false},
            {text: 'Isaac Newton', correct: false}
        ]
    },
    {
        question: 'What part of the cell controls all activities?',
        explanation: 'The nucleus controls cell activities and contains genetic material.',
        answers: [
            {text: 'Cell membrane', correct: false},
            {text: 'Cytoplasm', correct: false},
            {text: 'Nucleus', correct: true},
            {text: 'Vacuole', correct: false}
        ]
    },
    {
        question: 'Which organelle produces energy for the cell?',
        explanation: 'Mitochondria generate energy in the form of ATP.',
        answers: [
            {text: 'Ribosome', correct: false},
            {text: 'Nucleus', correct: false},
            {text: 'Mitochondria', correct: true},
            {text: 'Cell wall', correct: false}
        ]
    },
    {
        question: 'What is the function of the cell membrane?',
        explanation: 'The cell membrane controls what enters and leaves the cell.',
        answers: [
            {text: 'Produces energy', correct: false},
            {text: 'Controls movement in and out', correct: true},
            {text: 'Stores DNA', correct: false},
            {text: 'Gives shape only', correct: false}
        ]
    },
    {
        question: 'Which structure is found only in plant cells?',
        explanation: 'The cell wall is present only in plant cells and provides support.',
        answers: [
            {text: 'Nucleus', correct: false},
            {text: 'Cell wall', correct: true},
            {text: 'Cytoplasm', correct: false},
            {text: 'Cell membrane', correct: false}
        ]
    },
    {
        question: 'What is cytoplasm?',
        explanation: 'Cytoplasm is the jelly-like substance where organelles are found.',
        answers: [
            {text: 'Control center', correct: false},
            {text: 'Outer layer', correct: false},
            {text: 'Jelly-like substance inside the cell', correct: true},
            {text: 'Energy producer', correct: false}
        ]
    },
    {
        question: 'Which organelle is responsible for protein synthesis?',
        explanation: 'Ribosomes make proteins for the cell.',
        answers: [
            {text: 'Mitochondria', correct: false},
            {text: 'Ribosome', correct: true},
            {text: 'Nucleus', correct: false},
            {text: 'Vacuole', correct: false}
        ]
    },
    {
        question: 'What is the function of the vacuole?',
        explanation: 'Vacuoles store water, food, and waste materials.',
        answers: [
            {text: 'Controls cell', correct: false},
            {text: 'Produces energy', correct: false},
            {text: 'Storage', correct: true},
            {text: 'Protein synthesis', correct: false}
        ]
    },
    {
        question: 'Which cells have a cell wall?',
        explanation: 'Plant cells have a cell wall, while animal cells do not.',
        answers: [
            {text: 'Animal cells only', correct: false},
            {text: 'Plant cells only', correct: true},
            {text: 'Both plant and animal', correct: false},
            {text: 'None', correct: false}
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