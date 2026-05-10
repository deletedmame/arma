// grade-9/first/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '12bio';
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
const quizQuestions = [
    {
        question: 'What is the definition of Biology?',
        explanation: 'Biology is the scientific study of life and living organisms.',
        answers: [
            {text: 'Study of rocks and minerals', correct: false},
            {text: 'Study of life and living organisms', correct: true},
            {text: 'Study of the universe', correct: false},
            {text: 'Study of matter and energy', correct: false}
        ]
    },
    {
        question: 'Why do we study Biology?',
        explanation: 'We study Biology to understand the natural world, learn about our bodies, and find solutions to problems like diseases.',
        answers: [
            {text: 'To learn about stars', correct: false},
            {text: 'To understand life and find medical solutions', correct: true},
            {text: 'To build better buildings', correct: false},
            {text: 'To study ancient history', correct: false}
        ]
    },
    {
        question: 'What is the correct order of the Scientific Method?',
        explanation: 'The scientific method typically follows: Observation, Question, Hypothesis, Experiment, Analysis, Conclusion.',
        answers: [
            {text: 'Conclusion, Experiment, Hypothesis', correct: false},
            {text: 'Hypothesis, Observation, Conclusion', correct: false},
            {text: 'Observation, Hypothesis, Experiment, Conclusion', correct: true},
            {text: 'Experiment, Observation, Conclusion', correct: false}
        ]
    },
    {
        question: 'Which of the following is a laboratory tool used by a biologist?',
        explanation: 'A microscope is a fundamental tool used in a biology lab to observe small specimens.',
        answers: [
            {text: 'Compass', correct: false},
            {text: 'Microscope', correct: true},
            {text: 'GPS Device', correct: false},
            {text: 'Hammer', correct: false}
        ]
    },
    {
        question: 'Which of these is considered a field tool for a biologist?',
        explanation: 'Field tools are used to study organisms in their natural environment. Binoculars help observe animals from a distance.',
        answers: [
            {text: 'Binoculars', correct: true},
            {text: 'Petri Dish', correct: false},
            {text: 'Test Tube', correct: false},
            {text: 'Microscope', correct: false}
        ]
    },
    {
        question: 'What is the main function of the "eyepiece" (ocular lens) on a light microscope?',
        explanation: 'The eyepiece is the lens at the top that you look through. It usually has a magnification of 10x.',
        answers: [
            {text: 'To focus the light', correct: false},
            {text: 'To hold the slide in place', correct: false},
            {text: 'To magnify the image for the viewer', correct: true},
            {text: 'To adjust the brightness', correct: false}
        ]
    },
    {
        question: 'What part of the light microscope is used to regulate the amount of light reaching the specimen?',
        explanation: 'The diaphragm (or iris diaphragm) is located under the stage and controls the light intensity.',
        answers: [
            {text: 'Objective lens', correct: false},
            {text: 'Diaphragm', correct: true},
            {text: 'Stage clips', correct: false},
            {text: 'Revolving nosepiece', correct: false}
        ]
    },
    {
        question: 'When handling a light microscope, how should you carry it?',
        explanation: 'To avoid dropping it, always carry the microscope with one hand on the arm and the other supporting the base.',
        answers: [
            {text: 'By the stage only', correct: false},
            {text: 'With two hands, one on the arm and one on the base', correct: true},
            {text: 'By the eyepiece', correct: false},
            {text: 'Upside down', correct: false}
        ]
    },
    {
        question: 'What should you do first if a chemical splashes into your eyes in the lab?',
        explanation: 'According to general laboratory safety rules, you must immediately flush your eyes with water at an eyewash station for at least 15 minutes.',
        answers: [
            {text: 'Tell the teacher after finishing the experiment', correct: false},
            {text: 'Rub your eyes', correct: false},
            {text: 'Immediately flush with water', correct: true},
            {text: 'Go to the nurse', correct: false}
        ]
    },
    {
        question: 'What is a hypothesis in the scientific method?',
        explanation: 'A hypothesis is a proposed, testable explanation for an observation, often written as an "If... then..." statement.',
        answers: [
            {text: 'The final result', correct: false},
            {text: 'A testable prediction or explanation', correct: true},
            {text: 'A random guess', correct: false},
            {text: 'A tool used in the lab', correct: false}
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