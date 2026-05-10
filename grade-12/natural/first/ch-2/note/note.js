document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Video Toggle Logic ---
    const videoBtn = document.getElementById('toggleVideoBtn');
    const videoCard = document.getElementById('videoCard');
    const videoIframe = document.getElementById('videoIframe');

    videoBtn?.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(videoCard).display === 'none';

        if (isHidden) {
            videoCard.style.display = 'block';
            videoBtn.innerHTML = '<i class="fas fa-times-circle"></i> Hide Video';
        } else {
            videoCard.style.display = 'none';
            videoBtn.innerHTML = '<i class="fas fa-play-circle"></i> See Video';

            // Stop video when hiding by resetting src
            const currentSrc = videoIframe.src;
            videoIframe.src = '';
            videoIframe.src = currentSrc;
        }
    });

    // --- 2. Dropdown Logic ---

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


    // --- 4. User Session Display ---
    const sessionData = localStorage.getItem("current_user_session");
    if(sessionData) {
        const user = JSON.parse(sessionData);
        const nameDisplay = document.querySelector('.user-name-dropdown');
        const gradeDisplay = document.querySelector('.user-grade-dropdown');
        const avatarDisplay = document.querySelector('.user-avatar');

        if(nameDisplay) nameDisplay.textContent = user.name;
        if(gradeDisplay) gradeDisplay.textContent = `Grade ${user.grade}`;
        if(avatarDisplay) avatarDisplay.textContent = user.name.charAt(0).toUpperCase();
    }
});

// Navigation Functions
function goBack() {
    window.location.href = '../../index.html';
}

function logout() {
    localStorage.removeItem("current_user_session");
    window.location.href = '../../../../profile.html';
}
