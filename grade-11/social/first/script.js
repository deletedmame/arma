// grade-9/first/script.js
import { auth, db, collection, query, where, getDocs, onAuthStateChanged } from '../../firebase-config.js';

const sessionData = localStorage.getItem("current_user_session");
if (!sessionData) {
    window.location.href = "../../signin.html";
    return;
}

const currentUser = JSON.parse(sessionData);
const USER_ID = currentUser.id;

const SUBJECT_CODE = '11his';
const TOTAL_QUESTIONS_PER_CHAPTER = 10;
const TOTAL_FINAL_QUESTIONS = 40;

async function fetchQuizResultsFromFirestore() {
    try {
        const q = query(
            collection(db, "quiz_results"),
            where("studentId", "==", USER_ID),
            where("subjectCode", "==", SUBJECT_CODE)
        );

        const querySnapshot = await getDocs(q);
        const results = { ch1: null, ch2: null, ch3: null, final: null };

        console.log("Fetching results for user:", USER_ID);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const chapter = data.chapter;
            const score = data.score;
            const totalQuestions = data.totalQuestions;
            const isFinalExam = data.isFinalExam;

            console.log("Found result:", { chapter, score, totalQuestions, isFinalExam });

            if (isFinalExam) {
                if (!results.final || (data.completedAt?.toDate?.() > results.final?.date)) {
                    results.final = { score: score, total: totalQuestions };
                }
            } else if (chapter === 'ch1') {
                if (!results.ch1 || (data.completedAt?.toDate?.() > results.ch1?.date)) {
                    results.ch1 = { score: score, total: totalQuestions };
                }
            } else if (chapter === 'ch2') {
                if (!results.ch2 || (data.completedAt?.toDate?.() > results.ch2?.date)) {
                    results.ch2 = { score: score, total: totalQuestions };
                }
            } else if (chapter === 'ch3') {
                if (!results.ch3 || (data.completedAt?.toDate?.() > results.ch3?.date)) {
                    results.ch3 = { score: score, total: totalQuestions };
                }
            }
        });

        console.log("Final results:", results);
        return results;
    } catch (error) {
        console.error('Error fetching:', error);
        return { ch1: null, ch2: null, ch3: null, final: null };
    }
}

function updateBadge(elementId, result, defaultTotal) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (!result || result.score === undefined || result.score === null) {
        element.innerHTML = '—';
        return;
    }

    const score = result.score;
    const total = result.total || defaultTotal;
    const percent = (score / total) * 100;
    let rating = Math.round((percent / 100) * 50 / 5) * 5;
    if (rating > 50) rating = 50;
    if (rating < 0) rating = 0;

    element.innerHTML = `
        <i class="fas fa-star" style="color: #ffca28;"></i>
        ${score}/${total}
        <img src="../../images/ratings/rating-${rating}.png" class="rating-mini" draggable="false" onerror="this.style.display='none'">
    `;
}

async function updateAllScores() {
    console.log("Updating all scores...");
    const results = await fetchQuizResultsFromFirestore();

    updateBadge('home-score1', results.ch1, TOTAL_QUESTIONS_PER_CHAPTER);
    updateBadge('home-score2', results.ch2, TOTAL_QUESTIONS_PER_CHAPTER);
    updateBadge('home-score3', results.ch3, TOTAL_QUESTIONS_PER_CHAPTER);
    updateBadge('home-final-score', results.final, TOTAL_FINAL_QUESTIONS);
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        localStorage.removeItem("current_user_session");
        window.location.href = "../../signin.html";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateAllScores();
    setInterval(updateAllScores, 30000);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateAllScores();
});