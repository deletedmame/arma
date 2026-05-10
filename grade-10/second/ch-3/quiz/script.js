// grade-9/first/ch-1/quiz/script.js
const SUBJECT = '10phy';
const CHAPTER = 'ch3';

// 1. Storage Keys
const sessionData = localStorage.getItem("current_user_session");
const currentUser = sessionData ? JSON.parse(sessionData) : null;
const USER_ID = currentUser ? currentUser._uid : 'guest';

if (!currentUser) window.location.href = "../../../profile.html";

const INDEX_KEY = `${SUBJECT}_${CHAPTER}_index_${USER_ID}`;
const SCORE_KEY = `${SUBJECT}_${CHAPTER}_score_${USER_ID}`;
const FINISHED_KEY = `${SUBJECT}_${CHAPTER}_finished_${USER_ID}`;
const INPROGRESS_KEY = `${SUBJECT}_${CHAPTER}_inprogress_${USER_ID}`;
const STREAK_KEY = `${SUBJECT}_${CHAPTER}_streak_${USER_ID}`;

// 2. Data
const quizQuestions = [
    { 
        question: 'Who created me?', 
        explanation: 'The developer created this.', 
        answers: [
            {text: 'deleted_mame', correct: true}, 
            {text: 'you', correct: false}, 
            {text: 'someone', correct: false}, 
            {text: 'anyone', correct: false}
        ] 
    },
    { 
        question: 'Which one is the best club?', 
        explanation: 'Real Madrid has 15 UCL titles.', 
        answers: [
            {text: 'barcelona', correct: false}, 
            {text: 'Real Madrid', correct: true}, 
            {text: 'Arsenal', correct: false}, 
            {text: 'liverpool', correct: false}
        ] 
    },
    { 
        question: 'Which one is not a programming language?', 
        explanation: 'Banana is a fruit.', 
        answers: [
            {text: 'banana', correct: true}, 
            {text: 'JavaScript', correct: false}, 
            {text: 'python', correct: false}, 
            {text: 'c++', correct: false}
        ] 
    },
    { 
        question: 'Which is capital "A"?', 
        explanation: '"A" is uppercase.', 
        answers: [
            {text: 'aa', correct: false}, 
            {text: 'B', correct: false}, 
            {text: 'D', correct: false}, 
            {text: 'A', correct: true}
        ] 
    },
    { 
        question: 'Which one is part of natural science?', 
        explanation: 'Physics is a natural science.', 
        answers: [
            {text: 'History', correct: false}, 
            {text: 'Geography', correct: false}, 
            {text: 'Physics', correct: true}, 
            {text: 'economics', correct: false}
        ] 
    },
    { 
        question: 'Which one is the lowest value?', 
        explanation: '-100 is smallest.', 
        answers: [
            {text: '2/3', correct: false}, 
            {text: '5/10', correct: false}, 
            {text: '-100', correct: true}, 
            {text: '0.00000001', correct: false}
        ] 
    },
    { 
        question: 'What is the best phone model ever?', 
        explanation: 'Nokia 3310 is indestructible.', 
        answers: [
            {text: 'iPhone', correct: false}, 
            {text: 'Samsung', correct: false}, 
            {text: 'Tecno', correct: false}, 
            {text: 'Nokia', correct: true}
        ] 
    },
    { 
        question: 'Arsenal vs Ethiopian Buna?', 
        explanation: 'Ethiopian Buna!', 
        answers: [
            {text: 'arsenal', correct: false}, 
            {text: 'buna', correct: true}, 
            {text: 'draw', correct: false}, 
            {text: 'forfeit', correct: false}
        ] 
    },
    { 
        question: 'Best laptop model?', 
        explanation: 'HP is strong.', 
        answers: [
            {text: 'hp', correct: true}, 
            {text: 'Acer', correct: false}, 
            {text: 'Macbook', correct: false}, 
            {text: 'Toshiba', correct: false}
        ] 
    },
    { 
        question: 'Which is the best operating system?', 
        explanation: 'Windows is #1.', 
        answers: [
            {text: 'Linux', correct: false}, 
            {text: 'Windows', correct: true}, 
            {text: 'Mac-OS', correct: false}, 
            {text: 'Android', correct: false}
        ] 
    }
];

let currentQuestionIndex = parseInt(localStorage.getItem(INDEX_KEY)) || 0;
let score = parseInt(localStorage.getItem(SCORE_KEY)) || 0;
let streak = parseInt(localStorage.getItem(STREAK_KEY)) || 0;
let answersLocked = false;

// 3. Shortcuts (Restored)
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

// 4. Core Functions
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
    document.getElementById("progress").style.width = (currentQuestionIndex / quizQuestions.length) * 100 + "%";
    
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
        // Highlight correct answer
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

// 5. Navigation & UI Initializers
document.addEventListener('DOMContentLoaded', () => {
    // Dropdown Logic
    const icon = document.getElementById('accountIcon');
    const dropdown = document.getElementById('accountDropdown');
    const themeSelect = document.getElementById('theme-selector');

    icon.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('active'); };
    dropdown.onclick = (e) => e.stopPropagation();
    document.onclick = () => dropdown.classList.remove('active');

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeSelect.value = savedTheme;
    themeSelect.onchange = (e) => {
        document.body.setAttribute('data-theme', e.target.value);
        localStorage.setItem('theme', e.target.value);
    };

    // User Data
    if (currentUser) {
        document.querySelector('.user-name-dropdown').textContent = currentUser.name;
        document.querySelector('.user-grade-dropdown').textContent = `Grade ${currentUser.grade}`;
        document.querySelector('.user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    }

    if (localStorage.getItem(FINISHED_KEY) === "true") showResult();
    else showQuestion();
});

document.getElementById("next-btn").onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        localStorage.setItem(INDEX_KEY, currentQuestionIndex);
        showQuestion();
    } else {
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
  
    document.getElementById("final-score").textContent = score;
}

window.logout = () => { localStorage.removeItem("current_user_session"); window.location.href = "../../../../profile.html"; };
document.getElementById("restart-btn").onclick = () => { 
    [INDEX_KEY, SCORE_KEY, FINISHED_KEY, STREAK_KEY].forEach(k => localStorage.removeItem(k));
    window.location.reload(); 
};
document.getElementById("home-btn").onclick = () => window.location.href = "../../index.html";