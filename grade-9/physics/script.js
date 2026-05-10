// grade-9/first/script.js

const sessionData = localStorage.getItem("current_user_session");
if (!sessionData) {
    window.location.href = "../../profile.html";
}
const currentUser = JSON.parse(sessionData);
const UID = currentUser._uid;

function updateScores() {
    // Update Chapter 1-3
    for (let i = 1; i <= 3; i++) {
        const score = localStorage.getItem(`9phy_ch${i}_score_${UID}`);
        const finished = localStorage.getItem(`9phy_ch${i}_finished_${UID}`) === "true";
        const total = 10; // Assuming 5 questions per chapter quiz
        updateBadge(`home-score${i}`, score, finished, total);
    }

    // Update Final Exam
    const finalScore = localStorage.getItem(`9phy_final_score_${UID}`);
    const finalFinished = localStorage.getItem(`9phy_final_finished_${UID}`) === "true";
    const finalTotal = 40; // Assuming 10 questions for final
    updateBadge('home-final-score', finalScore, finalFinished, finalTotal);
}

function updateBadge(elementId, score, finished, total) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const val = parseInt(score) || 0;

    if (finished) {
        const percent = (val / total) * 100;
        let rating = Math.round((percent / 100) * 50 / 5) * 5;
        if (rating > 50) rating = 50;

        element.innerHTML = `
            <i class="fas fa-star" style="color: #ffca28;"></i>
            ${val}/${total}
            <img src="../../images/ratings/rating-${rating}.png" class="rating-mini" draggable="false">
        `;
    } else if (val > 0) {
        element.innerHTML = `<span style="font-size: 0.8rem; opacity: 0.8;">Saving... ${val}/${total}</span>`;
    } else {
        element.innerHTML = '—';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', updateScores);
window.addEventListener('pageshow', updateScores);