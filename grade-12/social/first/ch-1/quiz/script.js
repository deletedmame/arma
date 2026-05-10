// grade-9/first/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '12his';
const CHAPTER = 'ch1';

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
// 🏛️ History Questions
quizQuestions = [
    { 
        question: 'What is History?', 
        explanation: 'History is the study of past events, especially human activities and civilizations.', 
        answers: [
            {text: 'Study of the future', correct: false}, 
            {text: 'Study of past events', correct: true}, 
            {text: 'Study of numbers', correct: false}, 
            {text: 'Study of space', correct: false}
        ] 
    },
    { 
        question: 'Why do we study History?', 
        explanation: 'We study history to understand the past and learn from it to make better decisions in the future.', 
        answers: [
            {text: 'To forget the past', correct: false}, 
            {text: 'To understand and learn from past events', correct: true}, 
            {text: 'To study animals', correct: false}, 
            {text: 'To build machines', correct: false}
        ] 
    },
    { 
        question: 'Who studies history?', 
        explanation: 'A historian is a person who studies and writes about the past.', 
        answers: [
            {text: 'Scientist', correct: false}, 
            {text: 'Historian', correct: true}, 
            {text: 'Doctor', correct: false}, 
            {text: 'Engineer', correct: false}
        ] 
    },
    { 
        question: 'What is a primary source?', 
        explanation: 'A primary source is original evidence from the time of an event, such as letters, artifacts, or documents.', 
        answers: [
            {text: 'A copied book', correct: false}, 
            {text: 'Original evidence', correct: true}, 
            {text: 'A movie', correct: false}, 
            {text: 'A summary', correct: false}
        ] 
    },
    { 
        question: 'What is a secondary source?', 
        explanation: 'A secondary source is information created after an event, based on primary sources.', 
        answers: [
            {text: 'Original object', correct: false}, 
            {text: 'Later explanation of events', correct: true}, 
            {text: 'Ancient tool', correct: false}, 
            {text: 'Artifact', correct: false}
        ] 
    },
    { 
        question: 'What is archaeology?', 
        explanation: 'Archaeology is the study of past human life through artifacts and remains.', 
        answers: [
            {text: 'Study of animals', correct: false}, 
            {text: 'Study of past human remains', correct: true}, 
            {text: 'Study of plants', correct: false}, 
            {text: 'Study of space', correct: false}
        ] 
    },
    { 
        question: 'Which calendar is widely used today?', 
        explanation: 'The Gregorian calendar is the most widely used calendar system in the world today.', 
        answers: [
            {text: 'Julian', correct: false}, 
            {text: 'Gregorian', correct: true}, 
            {text: 'Lunar', correct: false}, 
            {text: 'Solar', correct: false}
        ] 
    },
    { 
        question: 'What does BC mean?', 
        explanation: 'BC stands for "Before Christ", referring to years before the birth of Jesus Christ.', 
        answers: [
            {text: 'Before Century', correct: false}, 
            {text: 'Before Christ', correct: true}, 
            {text: 'Basic Calendar', correct: false}, 
            {text: 'Big Century', correct: false}
        ] 
    },
    { 
        question: 'What does AD mean?', 
        explanation: 'AD stands for "Anno Domini", meaning "in the year of our Lord".', 
        answers: [
            {text: 'After Death', correct: false}, 
            {text: 'Anno Domini', correct: true}, 
            {text: 'Ancient Day', correct: false}, 
            {text: 'After Date', correct: false}
        ] 
    },
    { 
        question: 'What is a civilization?', 
        explanation: 'A civilization is a complex society with cities, government, culture, and technology.', 
        answers: [
            {text: 'Small group of animals', correct: false}, 
            {text: 'Advanced human society', correct: true}, 
            {text: 'Single person', correct: false}, 
            {text: 'Natural disaster', correct: false}
        ] 
    },
    { 
        question: 'Which is one of the oldest civilizations?', 
        explanation: 'Ancient Egypt is one of the earliest known civilizations in human history.', 
        answers: [
            {text: 'USA', correct: false}, 
            {text: 'Ancient Egypt', correct: true}, 
            {text: 'Germany', correct: false}, 
            {text: 'Canada', correct: false}
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