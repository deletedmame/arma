// 1. Configuration
const SUPABASE_URL = 'https://rzlhtfciftbjnnqoalhn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9uyeX4Pw4ErOy94YpenkZg_7vrs7QkF'; 
let supabase = null;

// Initialize Supabase Client
if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error("Supabase library not found!");
}

// 2. Initialization
document.addEventListener('DOMContentLoaded', async () => {
    if (!supabase) return;

    // Check if user is logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
        window.location.href = "signin.html";
        return;
    }

    // Fetch user profile from the consolidated 'profiles' table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        console.error("Error loading profile:", profileError);
        return;
    }

    // Initialize UI and Tracking
    renderPortal(profile);
    syncOnlineStatus(profile, true);
    setupScoring(profile);
});

// FEATURE: Online Status Heartbeat (Updates profiles table)
async function syncOnlineStatus(user, status) {
    await supabase.from('profiles').update({ 
        is_online: status,
        last_seen: new Date().toISOString()
    }).eq('id', user.id);

    if (status) {
        // Keeps the "Last Seen" fresh every 60 seconds while on page
        setInterval(async () => {
            await supabase.from('profiles').update({ 
                last_seen: new Date().toISOString() 
            }).eq('id', user.id);
        }, 60000);
    }
}

// FEATURE: Scoring & "Better At" Mechanism (Updates profiles table)
function setupScoring(user) {
    const links = document.querySelectorAll('.sub-link');
    
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            const subjectName = e.target.textContent;

            // Fetch current score to increment it correctly
            const { data: current } = await supabase
                .from('profiles')
                .select('total_score')
                .eq('id', user.id)
                .single();

            const newScore = (current?.total_score || 0) + 1;

            // Update profile with new score and focus subject
            const { error } = await supabase.from('profiles').update({ 
                total_score: newScore,
                best_subject: subjectName,
                last_seen: new Date().toISOString(),
                is_online: true
            }).eq('id', user.id);

            if (!error) {
                document.getElementById('best-subject-display').textContent = subjectName;
                console.log(`Progress saved: +1 XP for ${subjectName}`);
            }
        });
    });
}

// UI Logic: Handles name display and subject grid visibility
function renderPortal(user) {
    const grade = parseInt(user.grade);
    const stream = (user.stream || "natural").toLowerCase();

    // Display basic info
    document.getElementById("user-display-name").textContent = user.full_name;
    document.getElementById("user-display-grade").textContent = `Grade ${grade} ${user.stream || ""}`;
    document.getElementById('best-subject-display').textContent = user.best_subject || "None";

    // Hide all subject grids first
    document.querySelectorAll('.subject-grid').forEach(g => g.classList.add('hidden'));
    
    // Determine which grid to show based on Grade and Stream
    let targetId = (grade <= 10) ? `g${grade}` : `g${grade}-${stream}`;
    const grid = document.getElementById(targetId);
    
    if (grid) {
        grid.classList.remove('hidden');
        const titleElement = document.getElementById("title");
        if (titleElement) titleElement.textContent = `Grade ${grade} Subjects`;
    }
}

// Global Logout Function
window.logout = async function() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // Mark user as offline in database before signing out
        await syncOnlineStatus(session.user, false);
    }
    await supabase.auth.signOut();
    window.location.href = "signin.html";
};

// UI Element: Dropdown Toggle
document.getElementById('accountIcon')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('accountDropdown')?.classList.toggle('active');
});

document.addEventListener('click', () => {
    document.getElementById('accountDropdown')?.classList.remove('active');
});