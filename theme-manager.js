const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.updateAllSelectors(savedTheme);
    },
    
    change(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateAllSelectors(theme);
    },
    
    updateAllSelectors(theme) {
        document.querySelectorAll('.theme-select').forEach(select => {
            if (select) select.value = theme;
        });
    }
};

window.changeTheme = function(theme) {
    ThemeManager.change(theme);
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

export default ThemeManager;