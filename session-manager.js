import { auth, onAuthStateChanged, db, doc, getDoc, updateDoc, Timestamp, signOut } from './firebase-config.js';

export async function initSession() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileRef = doc(db, 'profiles', user.uid);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    const profile = profileSnap.data();
                    const sessionData = {
                        id: user.uid,
                        name: profile.name,
                        email: user.email,
                        grade: profile.grade,
                        section: profile.section,
                        stream: profile.stream,
                        role: profile.role || 'student',
                        idNumber: profile.idNumber
                    };
                    localStorage.setItem("current_user_session", JSON.stringify(sessionData));
                    resolve(sessionData);
                } else {
                    localStorage.removeItem("current_user_session");
                    reject('No profile found');
                }
            } else {
                localStorage.removeItem("current_user_session");
                if (!window.location.pathname.includes('signin.html')) {
                    window.location.href = 'signin.html';
                }
                reject('No user');
            }
        });
    });
}

export async function updateStats() {
    const sessionData = localStorage.getItem("current_user_session");
    if (!sessionData) return;
    const user = JSON.parse(sessionData);
    const statsRef = doc(db, 'student_stats', user.id);
    try {
        await updateDoc(statsRef, { timeSpent: (user.timeSpent || 0) + 1, lastSeen: Timestamp.now() });
        user.timeSpent = (user.timeSpent || 0) + 1;
        localStorage.setItem("current_user_session", JSON.stringify(user));
    } catch (error) {
        const { setDoc } = await import('./firebase-config.js');
        await setDoc(statsRef, { name: user.name, grade: user.grade, timeSpent: 1, lastSeen: Timestamp.now() });
    }
}

export function startHeartbeat() { updateStats(); setInterval(updateStats, 60000); }

export async function logout() {
    await signOut(auth);
    localStorage.removeItem("current_user_session");
    window.location.href = 'signin.html';
}

window.logout = logout;