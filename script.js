// Global helper functions for all pages

// Format date for display
window.formatDate = function(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
};

// Format time
window.formatTime = function(time) {
    if (!time) return 'N/A';
    const t = new Date(time);
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get relative time (Today, Yesterday, etc.)
window.getRelativeTime = function(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

// Escape HTML to prevent XSS
window.escapeHtml = function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Show toast notification
window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Play bell sound for schedule period end
window.playBell = function() {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
};

// Check if user is authenticated
window.checkAuth = function() {
    const session = localStorage.getItem("current_user_session");
    if (!session) {
        window.location.href = "signin.html";
        return null;
    }
    return JSON.parse(session);
};

// Add CSS for toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);