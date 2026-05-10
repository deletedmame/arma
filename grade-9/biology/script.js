// grade-9/biology/ch-1/quiz/script.js
import { auth, db, collection, addDoc, Timestamp, doc, getDoc } from '../../../../firebase-config.js';

const SUBJECT = '9bio';
const CHAPTER = 'ch1';

const sessionData = localStorage.getItem("current_user_session");
const currentUser = sessionData ? JSON.parse(sessionData) : null;
const USER_ID = currentUser ? currentUser.id : null;

if (!currentUser) window.location.href = "../../../../signin.html";

const INDEX_KEY = `${SUBJECT}_${CHAPTER}_index`;
const SCORE_KEY = `${SUBJECT}_${CHAPTER}_score`;
const FINISHED_KEY = `${SUBJECT}_${CHAPTER}_finished`;
const STREAK_KEY = `${SUBJECT}_${CHAPTER}_streak`;
const QUIZ_SET_KEY = `${SUBJECT}_${CHAPTER}_quiz_set`;

// Chapter names for each chapter key
const CHAPTER_NAMES = {
    ch1: 'Introduction to Biology',
    ch2: 'Characteristics and Classification of Organisms',
    ch3: 'Cells',
    ch4: 'Reproduction',
    ch5: 'Human Health, Nutrition and Diseases',
    ch6: 'Ecology'
};

// ALL 60 QUIZ QUESTIONS (10 per chapter for 6 chapters)
const allQuizQuestions = {
    ch1: [
        { question: 'What is the definition of Biology?', explanation: 'Biology is the scientific study of life and living organisms.', answers: [{text: 'Study of rocks', correct: false}, {text: 'Study of life and living organisms', correct: true}, {text: 'Study of universe', correct: false}, {text: 'Study of matter', correct: false}] },
        { question: 'Why do we study Biology?', explanation: 'To understand life and find medical solutions.', answers: [{text: 'To learn stars', correct: false}, {text: 'To understand life and find medical solutions', correct: true}, {text: 'To build buildings', correct: false}, {text: 'To study history', correct: false}] },
        { question: 'What is the correct order of the Scientific Method?', explanation: 'Observation, Hypothesis, Experiment, Conclusion.', answers: [{text: 'Conclusion, Hypothesis', correct: false}, {text: 'Hypothesis, Observation', correct: false}, {text: 'Observation, Hypothesis, Experiment, Conclusion', correct: true}, {text: 'Experiment, Observation', correct: false}] },
        { question: 'Which is a laboratory tool?', explanation: 'A microscope is a fundamental lab tool.', answers: [{text: 'Compass', correct: false}, {text: 'Microscope', correct: true}, {text: 'GPS', correct: false}, {text: 'Hammer', correct: false}] },
        { question: 'Which is a field tool?', explanation: 'Binoculars help observe animals from a distance.', answers: [{text: 'Binoculars', correct: true}, {text: 'Petri Dish', correct: false}, {text: 'Test Tube', correct: false}, {text: 'Microscope', correct: false}] },
        { question: 'What does the eyepiece do?', explanation: 'It magnifies the image for the viewer.', answers: [{text: 'Focuses light', correct: false}, {text: 'Holds slide', correct: false}, {text: 'Magnifies image', correct: true}, {text: 'Adjusts brightness', correct: false}] },
        { question: 'What part regulates light?', explanation: 'The diaphragm controls light intensity.', answers: [{text: 'Objective lens', correct: false}, {text: 'Diaphragm', correct: true}, {text: 'Stage clips', correct: false}, {text: 'Nosepiece', correct: false}] },
        { question: 'How to carry a microscope?', explanation: 'One hand on arm, one on base.', answers: [{text: 'By stage', correct: false}, {text: 'Two hands, arm and base', correct: true}, {text: 'By eyepiece', correct: false}, {text: 'Upside down', correct: false}] },
        { question: 'What to do if chemical splashes in eyes?', explanation: 'Immediately flush with water.', answers: [{text: 'Tell teacher later', correct: false}, {text: 'Rub eyes', correct: false}, {text: 'Flush with water', correct: true}, {text: 'Go to nurse', correct: false}] },
        { question: 'What is a hypothesis?', explanation: 'A testable prediction.', answers: [{text: 'Final result', correct: false}, {text: 'Testable explanation', correct: true}, {text: 'Random guess', correct: false}, {text: 'Lab tool', correct: false}] }
    ],
    ch2: [
        { question: 'Who is known as the "Father of Taxonomy"?', explanation: 'Carolus Linnaeus developed the binomial nomenclature system.', answers: [{text: 'Aristotle', correct: false}, {text: 'Carolus Linnaeus', correct: true}, {text: 'Charles Darwin', correct: false}, {text: 'Gregor Mendel', correct: false}] },
        { question: 'What is the correct order of taxonomic hierarchy?', explanation: 'Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species.', answers: [{text: 'Kingdom, Phylum, Class, Order, Family, Genus, Species', correct: true}, {text: 'Class, Order, Family, Genus, Species', correct: false}, {text: 'Phylum, Class, Order, Family, Genus', correct: false}, {text: 'Order, Family, Genus, Species', correct: false}] },
        { question: 'Which kingdom contains prokaryotic organisms?', explanation: 'Kingdom Monera contains bacteria and archaea, which are prokaryotic.', answers: [{text: 'Protista', correct: false}, {text: 'Fungi', correct: false}, {text: 'Monera', correct: true}, {text: 'Plantae', correct: false}] },
        { question: 'What is binomial nomenclature?', explanation: 'A two-name system for naming species (genus and species).', answers: [{text: 'One-name system', correct: false}, {text: 'Two-name system with genus and species', correct: true}, {text: 'Three-name system', correct: false}, {text: 'Common names only', correct: false}] },
        { question: 'Which Ethiopian animal is endemic to Ethiopia?', explanation: 'The Ethiopian Wolf (Canis simensis) is found only in Ethiopia.', answers: [{text: 'Lion', correct: false}, {text: 'Elephant', correct: false}, {text: 'Ethiopian Wolf', correct: true}, {text: 'Giraffe', correct: false}] },
        { question: 'What is a dichotomous key used for?', explanation: 'It is used to identify unfamiliar organisms by making choices between two characteristics.', answers: [{text: 'Measuring temperature', correct: false}, {text: 'Identifying organisms', correct: true}, {text: 'Counting populations', correct: false}, {text: 'Staining cells', correct: false}] },
        { question: 'Fungi are classified in which kingdom?', explanation: 'Fungi have their own kingdom - Kingdom Fungi.', answers: [{text: 'Plantae', correct: false}, {text: 'Animalia', correct: false}, {text: 'Protista', correct: false}, {text: 'Fungi', correct: true}] },
        { question: 'Which of these is a characteristic of all living things?', explanation: 'All living things are made of cells and can reproduce.', answers: [{text: 'Can fly', correct: false}, {text: 'Made of cells', correct: true}, {text: 'Have fur', correct: false}, {text: 'Live in water', correct: false}] },
        { question: 'What is the scientific name for humans?', explanation: 'Homo sapiens is the binomial name for humans.', answers: [{text: 'Canis familiaris', correct: false}, {text: 'Felis catus', correct: false}, {text: 'Homo sapiens', correct: true}, {text: 'Mus musculus', correct: false}] },
        { question: 'Which kingdom includes autotrophic organisms that perform photosynthesis?', explanation: 'Kingdom Plantae includes plants that perform photosynthesis.', answers: [{text: 'Animalia', correct: false}, {text: 'Fungi', correct: false}, {text: 'Plantae', correct: true}, {text: 'Monera', correct: false}] }
    ],
    ch3: [
        { question: 'Who was the first person to observe cells?', explanation: 'Robert Hooke observed cork cells under a microscope in 1665.', answers: [{text: 'Anton van Leeuwenhoek', correct: false}, {text: 'Robert Hooke', correct: true}, {text: 'Matthias Schleiden', correct: false}, {text: 'Theodor Schwann', correct: false}] },
        { question: 'What is the function of mitochondria?', explanation: 'Mitochondria are the "powerhouse" of the cell, producing energy through respiration.', answers: [{text: 'Protein synthesis', correct: false}, {text: 'Energy production', correct: true}, {text: 'Waste disposal', correct: false}, {text: 'Photosynthesis', correct: false}] },
        { question: 'Which organelle is found only in plant cells?', explanation: 'Chloroplasts are found only in plant cells for photosynthesis.', answers: [{text: 'Nucleus', correct: false}, {text: 'Mitochondria', correct: false}, {text: 'Chloroplast', correct: true}, {text: 'Ribosome', correct: false}] },
        { question: 'What is osmosis?', explanation: 'Osmosis is the diffusion of water across a semi-permeable membrane.', answers: [{text: 'Movement of gases', correct: false}, {text: 'Diffusion of water', correct: true}, {text: 'Active transport', correct: false}, {text: 'Cell division', correct: false}] },
        { question: 'What is the main difference between prokaryotic and eukaryotic cells?', explanation: 'Eukaryotic cells have a nucleus; prokaryotic cells do not.', answers: [{text: 'Size only', correct: false}, {text: 'Presence of nucleus', correct: true}, {text: 'Shape', correct: false}, {text: 'Color', correct: false}] },
        { question: 'What does the cell membrane do?', explanation: 'The cell membrane controls what enters and leaves the cell.', answers: [{text: 'Produces energy', correct: false}, {text: 'Controls entry/exit of materials', correct: true}, {text: 'Makes proteins', correct: false}, {text: 'Stores DNA', correct: false}] },
        { question: 'Which organelle synthesizes proteins?', explanation: 'Ribosomes are responsible for protein synthesis.', answers: [{text: 'Golgi apparatus', correct: false}, {text: 'Ribosomes', correct: true}, {text: 'Lysosomes', correct: false}, {text: 'Vacuoles', correct: false}] },
        { question: 'What is the function of the nucleus?', explanation: 'The nucleus controls all cell activities and contains DNA.', answers: [{text: 'Energy production', correct: false}, {text: 'Controls cell activities', correct: true}, {text: 'Protein synthesis', correct: false}, {text: 'Waste removal', correct: false}] },
        { question: 'Which of these is an example of active transport?', explanation: 'The sodium-potassium pump moves ions against their concentration gradient using energy.', answers: [{text: 'Diffusion', correct: false}, {text: 'Osmosis', correct: false}, {text: 'Sodium-potassium pump', correct: true}, {text: 'Facilitated diffusion', correct: false}] },
        { question: 'What is the correct order of biological organization?', explanation: 'Cells → Tissues → Organs → Organ Systems → Organism.', answers: [{text: 'Organs → Cells → Tissues', correct: false}, {text: 'Cells → Tissues → Organs → Organ Systems', correct: true}, {text: 'Tissues → Cells → Organs', correct: false}, {text: 'Organ Systems → Organs → Cells', correct: false}] }
    ],
    ch4: [
        { question: 'What is asexual reproduction?', explanation: 'Asexual reproduction involves one parent and produces genetically identical offspring.', answers: [{text: 'Two parents, different offspring', correct: false}, {text: 'One parent, identical offspring', correct: true}, {text: 'One parent, different offspring', correct: false}, {text: 'Two parents, identical offspring', correct: false}] },
        { question: 'What is binary fission?', explanation: 'Binary fission is when an organism divides into two equal parts.', answers: [{text: 'Division into two equal parts', correct: true}, {text: 'Division into many parts', correct: false}, {text: 'Budding', correct: false}, {text: 'Fragmentation', correct: false}] },
        { question: 'Where does fertilization occur in humans?', explanation: 'Fertilization occurs in the oviduct (Fallopian tube).', answers: [{text: 'Uterus', correct: false}, {text: 'Oviduct', correct: true}, {text: 'Vagina', correct: false}, {text: 'Ovary', correct: false}] },
        { question: 'What hormone is responsible for male secondary sexual characteristics?', explanation: 'Testosterone is the male sex hormone.', answers: [{text: 'Estrogen', correct: false}, {text: 'Progesterone', correct: false}, {text: 'Testosterone', correct: true}, {text: 'Insulin', correct: false}] },
        { question: 'What is the function of the placenta?', explanation: 'The placenta provides oxygen and nutrients from mother to fetus.', answers: [{text: 'Produces eggs', correct: false}, {text: 'Provides oxygen and nutrients to fetus', correct: true}, {text: 'Produces sperm', correct: false}, {text: 'Removes waste from mother', correct: false}] },
        { question: 'What is the menstrual cycle?', explanation: 'The menstrual cycle is the monthly series of changes in the female reproductive system.', answers: [{text: 'Daily changes in males', correct: false}, {text: 'Monthly changes in females', correct: true}, {text: 'Yearly changes', correct: false}, {text: 'Weekly changes', correct: false}] },
        { question: 'Which STI is caused by a virus?', explanation: 'HIV/AIDS is caused by a virus (Human Immunodeficiency Virus).', answers: [{text: 'Syphilis', correct: false}, {text: 'Gonorrhea', correct: false}, {text: 'HIV/AIDS', correct: true}, {text: 'Chlamydia', correct: false}] },
        { question: 'What is vegetative propagation?', explanation: 'Vegetative propagation is asexual reproduction in plants using structures like runners, tubers, or bulbs.', answers: [{text: 'Sexual reproduction in plants', correct: false}, {text: 'Asexual reproduction in plants', correct: true}, {text: 'Animal reproduction', correct: false}, {text: 'Fungal reproduction', correct: false}] },
        { question: 'What is parthenogenesis?', explanation: 'Parthenogenesis is development of an unfertilized egg into an adult.', answers: [{text: 'Fertilized egg development', correct: false}, {text: 'Unfertilized egg development', correct: true}, {text: 'Budding', correct: false}, {text: 'Fragmentation', correct: false}] },
        { question: 'What does a condom prevent?', explanation: 'Condoms prevent pregnancy and reduce STI transmission.', answers: [{text: 'Only pregnancy', correct: false}, {text: 'Pregnancy and STIs', correct: true}, {text: 'Only STIs', correct: false}, {text: 'Nothing', correct: false}] }
    ],
    ch5: [
        { question: 'Which nutrient provides the most energy per gram?', explanation: 'Lipids (fats and oils) provide 37 kJ/g, more than carbohydrates (16 kJ/g) or proteins (17 kJ/g).', answers: [{text: 'Carbohydrates', correct: false}, {text: 'Proteins', correct: false}, {text: 'Lipids', correct: true}, {text: 'Vitamins', correct: false}] },
        { question: 'What disease is caused by vitamin C deficiency?', explanation: 'Scurvy is caused by lack of vitamin C.', answers: [{text: 'Rickets', correct: false}, {text: 'Scurvy', correct: true}, {text: 'Anemia', correct: false}, {text: 'Kwashiorkor', correct: false}] },
        { question: 'What is a balanced diet?', explanation: 'A balanced diet contains all nutrients in the correct amounts and proportions.', answers: [{text: 'Eating only meat', correct: false}, {text: 'Eating only vegetables', correct: false}, {text: 'All nutrients in correct amounts', correct: true}, {text: 'Eating as much as possible', correct: false}] },
        { question: 'Which mineral is needed to form hemoglobin?', explanation: 'Iron is essential for hemoglobin formation in red blood cells.', answers: [{text: 'Calcium', correct: false}, {text: 'Iron', correct: true}, {text: 'Iodine', correct: false}, {text: 'Phosphorus', correct: false}] },
        { question: 'What does BMI stand for?', explanation: 'BMI stands for Body Mass Index.', answers: [{text: 'Body Measurement Index', correct: false}, {text: 'Body Mass Index', correct: true}, {text: 'Basic Metabolic Index', correct: false}, {text: 'Bone Mass Indicator', correct: false}] },
        { question: 'Which substance in tobacco causes addiction?', explanation: 'Nicotine is the addictive substance in tobacco.', answers: [{text: 'Tar', correct: false}, {text: 'Carbon monoxide', correct: false}, {text: 'Nicotine', correct: true}, {text: 'Methanol', correct: false}] },
        { question: 'What causes malaria?', explanation: 'Malaria is caused by Plasmodium protozoa transmitted by mosquitoes.', answers: [{text: 'Virus', correct: false}, {text: 'Bacteria', correct: false}, {text: 'Protozoa', correct: true}, {text: 'Fungi', correct: false}] },
        { question: 'What is kwashiorkor?', explanation: 'Kwashiorkor is a protein deficiency disease.', answers: [{text: 'Vitamin deficiency', correct: false}, {text: 'Protein deficiency', correct: true}, {text: 'Mineral deficiency', correct: false}, {text: 'Carbohydrate deficiency', correct: false}] },
        { question: 'How is HIV transmitted?', explanation: 'HIV is transmitted through body fluids like blood, semen, and breast milk.', answers: [{text: 'Air', correct: false}, {text: 'Water', correct: false}, {text: 'Body fluids', correct: true}, {text: 'Food', correct: false}] },
        { question: 'What is the function of dietary fiber?', explanation: 'Fiber prevents constipation and keeps the colon healthy.', answers: [{text: 'Provides energy', correct: false}, {text: 'Builds muscle', correct: false}, {text: 'Prevents constipation', correct: true}, {text: 'Produces vitamins', correct: false}] }
    ],
    ch6: [
        { question: 'What is ecology?', explanation: 'Ecology is the study of relationships between organisms and their environment.', answers: [{text: 'Study of cells', correct: false}, {text: 'Study of relationships between organisms and environment', correct: true}, {text: 'Study of rocks', correct: false}, {text: 'Study of atoms', correct: false}] },
        { question: 'What is an ecosystem?', explanation: 'An ecosystem includes all living and non-living components in an area.', answers: [{text: 'Only living things', correct: false}, {text: 'Only non-living things', correct: false}, {text: 'Living and non-living components', correct: true}, {text: 'Only plants', correct: false}] },
        { question: 'Which biome has the highest biodiversity?', explanation: 'Tropical rainforests have the highest biodiversity of any terrestrial biome.', answers: [{text: 'Desert', correct: false}, {text: 'Tundra', correct: false}, {text: 'Tropical rainforest', correct: true}, {text: 'Grassland', correct: false}] },
        { question: 'What is a population?', explanation: 'A population is a group of the same species living in the same area.', answers: [{text: 'Different species in an area', correct: false}, {text: 'Same species in an area', correct: true}, {text: 'All living things', correct: false}, {text: 'Only plants', correct: false}] },
        { question: 'What is the difference between primary and secondary succession?', explanation: 'Primary succession starts on lifeless area; secondary succession starts after disturbance.', answers: [{text: 'Primary is faster', correct: false}, {text: 'Primary starts on lifeless area', correct: true}, {text: 'Secondary starts on bare rock', correct: false}, {text: 'No difference', correct: false}] },
        { question: 'What is mutualism?', explanation: 'Mutualism is a relationship where both species benefit.', answers: [{text: 'One benefits, one harmed', correct: false}, {text: 'Both benefit', correct: true}, {text: 'One benefits, one unaffected', correct: false}, {text: 'Both harmed', correct: false}] },
        { question: 'Which is an abiotic factor?', explanation: 'Temperature is a non-living (abiotic) factor.', answers: [{text: 'Bacteria', correct: false}, {text: 'Plants', correct: false}, {text: 'Temperature', correct: true}, {text: 'Animals', correct: false}] },
        { question: 'What is a savanna?', explanation: 'Savanna is a tropical grassland with scattered trees, found in Africa.', answers: [{text: 'Forest', correct: false}, {text: 'Desert', correct: false}, {text: 'Tropical grassland with scattered trees', correct: true}, {text: 'Frozen tundra', correct: false}] },
        { question: 'What is a climax community?', explanation: 'A climax community is a stable community that undergoes little change.', answers: [{text: 'First stage of succession', correct: false}, {text: 'Stable final community', correct: true}, {text: 'Temporary community', correct: false}, {text: 'Damaged community', correct: false}] },
        { question: 'Which relationship describes a tick feeding on a dog?', explanation: 'Parasitism - the tick benefits, the dog is harmed.', answers: [{text: 'Mutualism', correct: false}, {text: 'Commensalism', correct: false}, {text: 'Parasitism', correct: true}, {text: 'Competition', correct: false}] }
    ]
};

function getRandomQuestions(questionsArray, count = 10) {
    const shuffled = [...questionsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answersLocked = false;

function initQuiz() {
    const finished = localStorage.getItem(FINISHED_KEY);
    const savedQuizSet = localStorage.getItem(QUIZ_SET_KEY);

    if (finished === "true") {
        if (savedQuizSet) { quizQuestions = JSON.parse(savedQuizSet); score = parseInt(localStorage.getItem(SCORE_KEY)) || 0; }
        showResult();
        return;
    }

    if (savedQuizSet && localStorage.getItem(INDEX_KEY) !== null && finished !== "true") {
        quizQuestions = JSON.parse(savedQuizSet);
        currentQuestionIndex = parseInt(localStorage.getItem(INDEX_KEY)) || 0;
        score = parseInt(localStorage.getItem(SCORE_KEY)) || 0;
    } else {
        startNewQuiz();
    }
    showQuestion();
}

function startNewQuiz() {
    const chapterQuestions = allQuizQuestions[CHAPTER] || allQuizQuestions.ch1;
    quizQuestions = getRandomQuestions(chapterQuestions, 10);
    currentQuestionIndex = 0;
    score = 0;
    localStorage.setItem(QUIZ_SET_KEY, JSON.stringify(quizQuestions));
    localStorage.setItem(INDEX_KEY, currentQuestionIndex);
    localStorage.setItem(SCORE_KEY, score);
    localStorage.setItem(FINISHED_KEY, "false");
}

async function saveQuizToFirebase() {
    if (!USER_ID) return false;
    const profile = await getUserProfile();
    try {
        const quizResult = {
            studentId: USER_ID, studentName: currentUser?.name || profile?.name || 'Student',
            idNumber: profile?.idNumber || currentUser?.idNumber || '-',
            grade: profile?.grade || currentUser?.grade || 9,
            section: profile?.section || currentUser?.section || null,
            stream: profile?.stream || currentUser?.stream || null,
            subject: 'Biology', subjectCode: SUBJECT, chapter: CHAPTER,
            chapterName: CHAPTER_NAMES[CHAPTER] || 'Biology Chapter',
            score: score, totalQuestions: quizQuestions.length,
            percentage: Math.round((score / quizQuestions.length) * 100),
            isFinalExam: false, includeInAverage: true,
            completedAt: Timestamp.now()
        };
        await addDoc(collection(db, "quiz_results"), quizResult);
        return true;
    } catch (error) { console.error("Error saving quiz:", error); return false; }
}

async function getUserProfile() {
    if (!USER_ID) return null;
    try {
        const profileRef = doc(db, 'profiles', USER_ID);
        const profileSnap = await getDoc(profileRef);
        return profileSnap.exists() ? profileSnap.data() : null;
    } catch (error) { return null; }
}

function showQuestion() {
    answersLocked = false;
    document.getElementById("explanation-container")?.classList.add("hidden");
    document.getElementById("next-container")?.classList.add("hidden");

    const q = quizQuestions[currentQuestionIndex];
    document.getElementById("question-text").textContent = q.question;
    document.getElementById("current-question").textContent = currentQuestionIndex + 1;
    document.querySelectorAll(".fullq").forEach(el => el.textContent = quizQuestions.length);
    document.getElementById("score").textContent = score;
    document.getElementById("progress").style.width = ((currentQuestionIndex + 1) / quizQuestions.length) * 100 + "%";

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

    if (isCorrect) { score++; btn.classList.add("correct", "pulse"); }
    else {
        btn.classList.add("incorrect", "shake");
        Array.from(document.getElementById("answers-container").children).forEach(b => {
            const idx = b.textContent.charCodeAt(0) - 65;
            if (quizQuestions[currentQuestionIndex].answers[idx].correct) b.classList.add("correct");
        });
    }

    localStorage.setItem(SCORE_KEY, score);
    document.getElementById("score").textContent = score;
    document.getElementById("explanation-text").textContent = quizQuestions[currentQuestionIndex].explanation;
    document.getElementById("explanation-container").classList.remove("hidden");
    document.getElementById("next-container").classList.remove("hidden");
}

const nextBtn = document.getElementById("next-btn");
if (nextBtn) {
    nextBtn.onclick = async () => {
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
}

function showResult() {
    document.getElementById("quiz-screen").classList.remove("active");
    document.getElementById("result-screen").classList.add("active");
    document.getElementById("final-score").textContent = `${score}/${quizQuestions.length}`;
    const percentage = (score / quizQuestions.length) * 100;
    const ratingImg = document.querySelector('.rating-img');
    if (ratingImg) {
        let ratingText = percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Very Good' : percentage >= 60 ? 'Good' : percentage >= 45 ? 'Fair' : 'Need Improvement';
        ratingImg.alt = ratingText;
    }
}

const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.onclick = () => {
        localStorage.removeItem(INDEX_KEY); localStorage.removeItem(SCORE_KEY);
        localStorage.removeItem(FINISHED_KEY); localStorage.removeItem(QUIZ_SET_KEY);
        startNewQuiz(); showQuestion();
        document.getElementById("result-screen")?.classList.remove("active");
        document.getElementById("quiz-screen")?.classList.add("active");
    };
}

const homeBtn = document.getElementById("home-btn");
if (homeBtn) homeBtn.onclick = () => window.location.href = "../../index.html";

window.logout = () => { localStorage.removeItem("current_user_session"); window.location.href = "../../../../signin.html"; };

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    if (currentUser) {
        const nameEl = document.querySelector('.user-name-dropdown');
        const gradeEl = document.querySelector('.user-grade-dropdown');
        const avatarEl = document.querySelector('.user-avatar');
        if (nameEl) nameEl.textContent = currentUser.name;
        if (gradeEl) gradeEl.textContent = `Grade ${currentUser.grade} • Section ${currentUser.section || 'N/A'}`;
        if (avatarEl) avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    initQuiz();
});