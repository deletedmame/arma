// grade-9/first/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '9bio';
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
const QUIZ_SET_KEY = `${SUBJECT}_${CHAPTER}_quiz_set`;

// 2. ALL 30 QUIZ QUESTIONS
const allQuizQuestions = [
    // Q1
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
    // Q2
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
    // Q3
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
    // Q4
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
    // Q5
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
    // Q6
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
    // Q7
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
    // Q8
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
    // Q9
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
    // Q10
    {
        question: 'What is a hypothesis in the scientific method?',
        explanation: 'A hypothesis is a proposed, testable explanation for an observation, often written as an "If... then..." statement.',
        answers: [
            {text: 'The final result', correct: false},
            {text: 'A testable prediction or explanation', correct: true},
            {text: 'A random guess', correct: false},
            {text: 'A tool used in the lab', correct: false}
        ]
    },
    // Q11
    {
        question: 'Who is known as the "Father of Biology"?',
        explanation: 'Aristotle is widely regarded as the Father of Biology for his extensive work on classification of living things.',
        answers: [
            {text: 'Charles Darwin', correct: false},
            {text: 'Gregor Mendel', correct: false},
            {text: 'Aristotle', correct: true},
            {text: 'Louis Pasteur', correct: false}
        ]
    },
    // Q12
    {
        question: 'What does a biologist use a petri dish for?',
        explanation: 'A petri dish is used to culture microorganisms like bacteria and fungi in a controlled environment.',
        answers: [
            {text: 'Measuring liquid volume', correct: false},
            {text: 'Growing bacteria and cells', correct: true},
            {text: 'Observing stars', correct: false},
            {text: 'Cutting specimens', correct: false}
        ]
    },
    // Q13
    {
        question: 'What is the total magnification when using a 10x eyepiece and a 40x objective lens?',
        explanation: 'Total magnification = eyepiece magnification × objective magnification = 10 × 40 = 400x.',
        answers: [
            {text: '50x', correct: false},
            {text: '400x', correct: true},
            {text: '40x', correct: false},
            {text: '4000x', correct: false}
        ]
    },
    // Q14
    {
        question: 'Which branch of biology deals with the study of plants?',
        explanation: 'Botany is the scientific study of plants, including their structure, growth, reproduction, and classification.',
        answers: [
            {text: 'Zoology', correct: false},
            {text: 'Microbiology', correct: false},
            {text: 'Botany', correct: true},
            {text: 'Ecology', correct: false}
        ]
    },
    // Q15
    {
        question: 'What is the study of animals called?',
        explanation: 'Zoology is the branch of biology that focuses on the study of animals, their behavior, structure, and classification.',
        answers: [
            {text: 'Botany', correct: false},
            {text: 'Zoology', correct: true},
            {text: 'Genetics', correct: false},
            {text: 'Cytology', correct: false}
        ]
    },
    // Q16
    {
        question: 'What does the coarse adjustment knob do on a microscope?',
        explanation: 'The coarse adjustment knob moves the stage up and down quickly for initial focusing, usually used with the low-power objective.',
        answers: [
            {text: 'Fine tunes the focus', correct: false},
            {text: 'Moves the stage for rough focusing', correct: true},
            {text: 'Changes the light intensity', correct: false},
            {text: 'Rotates the objective lenses', correct: false}
        ]
    },
    // Q17
    {
        question: 'What is the purpose of a control group in an experiment?',
        explanation: 'A control group does not receive the experimental treatment, allowing scientists to compare results and see the effect of the variable.',
        answers: [
            {text: 'To make the experiment harder', correct: false},
            {text: 'To provide a baseline for comparison', correct: true},
            {text: 'To confuse the results', correct: false},
            {text: 'To add more variables', correct: false}
        ]
    },
    // Q18
    {
        question: 'Which of these is NOT a characteristic of living things?',
        explanation: 'Living things grow, reproduce, respond to stimuli, and maintain homeostasis. Being made of metal is not a characteristic of life.',
        answers: [
            {text: 'Growth and development', correct: false},
            {text: 'Response to stimuli', correct: false},
            {text: 'Made of metal', correct: true},
            {text: 'Ability to reproduce', correct: false}
        ]
    },
    // Q19
    {
        question: 'What should you wear in a biology lab for safety?',
        explanation: 'Safety goggles protect your eyes from chemical splashes and broken glass. Gloves and lab coats are also important PPE.',
        answers: [
            {text: 'Sandals', correct: false},
            {text: 'Safety goggles', correct: true},
            {text: 'Regular glasses only', correct: false},
            {text: 'No protection needed', correct: false}
        ]
    },
    // Q20
    {
        question: 'What does "homeostasis" mean in biology?',
        explanation: 'Homeostasis is the ability of an organism to maintain a stable internal environment despite external changes.',
        answers: [
            {text: 'Rapid growth', correct: false},
            {text: 'Maintaining internal stability', correct: true},
            {text: 'Changing color', correct: false},
            {text: 'Moving to new locations', correct: false}
        ]
    },
    // Q21
    {
        question: 'Which microscope part supports the slide being viewed?',
        explanation: 'The stage is the flat platform where you place the glass slide containing the specimen.',
        answers: [
            {text: 'Eyepiece', correct: false},
            {text: 'Stage', correct: true},
            {text: 'Arm', correct: false},
            {text: 'Base', correct: false}
        ]
    },
    // Q22
    {
        question: 'What is the function of stage clips on a microscope?',
        explanation: 'Stage clips hold the glass slide in place on the stage so it doesn\'t move while you are viewing the specimen.',
        answers: [
            {text: 'To hold the slide securely', correct: true},
            {text: 'To adjust focus', correct: false},
            {text: 'To change magnification', correct: false},
            {text: 'To provide light', correct: false}
        ]
    },
    // Q23
    {
        question: 'What does "microbiology" study?',
        explanation: 'Microbiology is the branch of biology that studies microscopic organisms like bacteria, viruses, fungi, and protozoa.',
        answers: [
            {text: 'Large animals', correct: false},
            {text: 'Microscopic organisms', correct: true},
            {text: 'Rocks and minerals', correct: false},
            {text: 'Weather patterns', correct: false}
        ]
    },
    // Q24
    {
        question: 'Which of these is a safe practice in a biology lab?',
        explanation: 'Always wash your hands after handling any biological materials or chemicals to prevent contamination and spread of germs.',
        answers: [
            {text: 'Eating at your workstation', correct: false},
            {text: 'Washing hands after experiments', correct: true},
            {text: 'Tasting chemicals', correct: false},
            {text: 'Running in the lab', correct: false}
        ]
    },
    // Q25
    {
        question: 'What is ecology the study of?',
        explanation: 'Ecology is the study of how living organisms interact with each other and with their physical environment.',
        answers: [
            {text: 'Individual cells', correct: false},
            {text: 'Organisms and their environment', correct: true},
            {text: 'Only plants', correct: false},
            {text: 'Only animals', correct: false}
        ]
    },
    // Q26
    {
        question: 'What is the revolving nosepiece on a microscope used for?',
        explanation: 'The revolving nosepiece (or turret) holds the objective lenses and rotates to change magnification power.',
        answers: [
            {text: 'To adjust brightness', correct: false},
            {text: 'To change objective lenses', correct: true},
            {text: 'To move the stage', correct: false},
            {text: 'To hold the slide', correct: false}
        ]
    },
    // Q27
    {
        question: 'What does a biologist use a quadrat for in field work?',
        explanation: 'A quadrat is a square frame used to mark off a specific area for sampling plant or animal populations in their natural habitat.',
        answers: [
            {text: 'Measuring temperature', correct: false},
            {text: 'Sampling population in an area', correct: true},
            {text: 'Catching insects', correct: false},
            {text: 'Taking photos', correct: false}
        ]
    },
    // Q28
    {
        question: 'What is the first step of the scientific method?',
        explanation: 'The scientific method begins with making an observation about something in the natural world that sparks curiosity.',
        answers: [
            {text: 'Conclusion', correct: false},
            {text: 'Observation', correct: true},
            {text: 'Experiment', correct: false},
            {text: 'Hypothesis', correct: false}
        ]
    },
    // Q29
    {
        question: 'Why should you never pipette by mouth in a lab?',
        explanation: 'Mouth pipetting can lead to accidentally ingesting dangerous chemicals or infectious biological materials. Always use a pipette bulb.',
        answers: [
            {text: 'It is slow', correct: false},
            {text: 'It can cause ingestion of harmful substances', correct: true},
            {text: 'It is inaccurate', correct: false},
            {text: 'It breaks the pipette', correct: false}
        ]
    },
    // Q30
    {
        question: 'What does "genetics" study?',
        explanation: 'Genetics is the branch of biology that studies heredity, genes, and how traits are passed from parents to offspring.',
        answers: [
            {text: 'Rocks', correct: false},
            {text: 'Heredity and genes', correct: true},
            {text: 'Weather', correct: false},
            {text: 'Oceans', correct: false}
        ]
    }
];

// Function to randomly select 10 questions from all 30
function getRandomQuestions(questions, count = 10) {
    // Create a copy to avoid modifying original
    const shuffled = [...questions];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Return first 'count' questions
    return shuffled.slice(0, count);
}

// Global variables
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let answersLocked = false;

// Initialize or load existing quiz
function initQuiz() {
    const finished = localStorage.getItem(FINISHED_KEY);
    const savedIndex = localStorage.getItem(INDEX_KEY);
    const savedScore = localStorage.getItem(SCORE_KEY);
    const savedStreak = localStorage.getItem(STREAK_KEY);
    const savedQuizSet = localStorage.getItem(QUIZ_SET_KEY);

    // If quiz is completed, show results
    if (finished === "true") {
        if (savedQuizSet) {
            quizQuestions = JSON.parse(savedQuizSet);
            score = parseInt(savedScore) || 0;
        }
        showResult();
        return;
    }

    // Check if we have an INCOMPLETE quiz (not finished)
    if (savedQuizSet && savedIndex !== null && finished !== "true") {
        // Resume existing quiz
        quizQuestions = JSON.parse(savedQuizSet);
        currentQuestionIndex = parseInt(savedIndex) || 0;
        score = parseInt(savedScore) || 0;
        streak = parseInt(savedStreak) || 0;
        console.log("📌 Resuming existing quiz - Question", currentQuestionIndex + 1, "of", quizQuestions.length);
    } else {
        // Start BRAND NEW quiz with random questions
        startNewQuiz();
    }

    showQuestion();
}

// Function to start a completely new quiz
function startNewQuiz() {
    quizQuestions = getRandomQuestions(allQuizQuestions, 10);
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;

    // Save new quiz set
    localStorage.setItem(QUIZ_SET_KEY, JSON.stringify(quizQuestions));
    localStorage.setItem(INDEX_KEY, currentQuestionIndex);
    localStorage.setItem(SCORE_KEY, score);
    localStorage.setItem(STREAK_KEY, streak);
    localStorage.setItem(FINISHED_KEY, "false");

    console.log("🆕 Started NEW quiz with 10 random questions");
    console.log("📋 Questions selected:", quizQuestions.map((q, i) => `${i+1}. ${q.question.substring(0, 40)}...`));
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

// Save quiz to Firebase
async function saveQuizToFirebase() {
    if (!USER_ID) {
        console.log('No user ID, skipping save');
        return false;
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
            completedAt: Timestamp.now(),
            timestamp: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, "quiz_results"), quizResult);
        console.log("✅ Quiz saved to Firebase! ID:", docRef.id);
        console.log("✅ Score:", score, "/", quizQuestions.length);
        console.log("✅ Percentage:", Math.round((score / quizQuestions.length) * 100), "%");
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
        score++;
        streak++;
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

    // Initialize quiz
    initQuiz();
});

document.getElementById("next-btn").onclick = async () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        localStorage.setItem(INDEX_KEY, currentQuestionIndex);
        showQuestion();
    } else {
        // Quiz completed - save to Firebase
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

// RESTART BUTTON - Creates NEW random questions EVERY TIME
document.getElementById("restart-btn").onclick = () => {
    console.log("🔄 Restarting quiz - generating NEW random questions...");

    // Clear ALL quiz-related localStorage
    localStorage.removeItem(INDEX_KEY);
    localStorage.removeItem(SCORE_KEY);
    localStorage.removeItem(FINISHED_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(QUIZ_SET_KEY);

    // Generate new random questions
    quizQuestions = getRandomQuestions(allQuizQuestions, 10);
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    answersLocked = false;

    // Save new quiz state
    localStorage.setItem(QUIZ_SET_KEY, JSON.stringify(quizQuestions));
    localStorage.setItem(INDEX_KEY, currentQuestionIndex);
    localStorage.setItem(SCORE_KEY, score);
    localStorage.setItem(STREAK_KEY, streak);
    localStorage.setItem(FINISHED_KEY, "false");

    console.log("🆕 New random questions generated!");
    console.log("📋 New questions:", quizQuestions.map((q, i) => `${i+1}. ${q.question.substring(0, 40)}...`));

    // Switch back to quiz screen and show first question
    document.getElementById("result-screen").classList.remove("active");
    document.getElementById("quiz-screen").classList.add("active");
    showQuestion();
};

document.getElementById("home-btn").onclick = () => window.location.href = "../../index.html";