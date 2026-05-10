// assessment-redirect.js - Central redirect script
// Place this in your root directory (same level as your HTML files)

(function() {
    'use strict';
    
    // Get student session
    const session = localStorage.getItem("current_user_session");
    if (!session) return;
    
    let student;
    try {
        student = JSON.parse(session);
    } catch(e) {
        return;
    }
    
    if (student.role !== 'student') return;
    
    // Prevent redirect loops - check max once per 30 seconds
    const lastCheck = sessionStorage.getItem('_ar_check');
    const now = Date.now();
    if (lastCheck && (now - parseInt(lastCheck)) < 30000) return;
    sessionStorage.setItem('_ar_check', now.toString());
    
    // Don't redirect if already on assessment page
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('assessment-') || 
        currentPath.includes('exam-') || 
        currentPath.includes('test-')) {
        return;
    }
    
    // Check for forced assessment
    checkForcedAssessment(student);
    
    async function checkForcedAssessment(student) {
        try {
            // Dynamically import Firebase config
            // Adjust this path based on where your firebase-config.js is located
            const firebasePath = getFirebaseConfigPath();
            const { db, collection, query, where, getDocs } = await import(firebasePath);
            
            // Query for forced assessments
            const q = query(
                collection(db, 'assessment_scores'),
                where('studentId', '==', student.id),
                where('status', '==', 'forced')
            );
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) return;
            
            // Find the most recent forced assessment (within last 2 hours)
            let latestAssessment = null;
            let latestTime = 0;
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const assignedTime = data.assignedAt?.toDate?.()?.getTime() || 
                                    data.assignedAt?.seconds * 1000 || 0;
                
                if (assignedTime > latestTime) {
                    latestTime = assignedTime;
                    latestAssessment = { id: doc.id, ...data };
                }
            });
            
            // Check if within last 2 hours
            const twoHoursAgo = now - (2 * 60 * 60 * 1000);
            if (!latestAssessment || latestTime < twoHoursAgo) return;
            
            // Get the assessment URL
            let assessmentUrl = latestAssessment.assessmentUrl;
            
            // Fallback URL mapping if no URL stored
            if (!assessmentUrl) {
                assessmentUrl = getAssessmentUrl(student.grade, student.stream);
            }
            
            // Build full URL with parameters
            const fullUrl = buildAssessmentUrl(assessmentUrl, latestAssessment.assessmentId, student.id);
            
            // Show confirmation dialog
            showRedirectDialog(latestAssessment.assessmentTitle, fullUrl);
            
        } catch (error) {
            console.warn('Assessment redirect check failed:', error.message);
        }
    }
    
    function getFirebaseConfigPath() {
        // Determine correct path to firebase-config.js based on current location
        const path = window.location.pathname;
        
        if (path.includes('/student/') || path.includes('/students/')) {
            return '../firebase-config.js';
        } else if (path.includes('/portal/') || path.includes('/dashboard/')) {
            return '../firebase-config.js';
        } else if (path.includes('/pages/')) {
            return '../firebase-config.js';
        } else {
            // Default: same directory
            return './firebase-config.js';
        }
    }
    
    function getAssessmentUrl(grade, stream) {
        const baseUrl = window.location.origin;
        const urlMap = {
            '9': '/assessment-9.html',
            '10': '/assessment-10.html',
            '11': stream === 'Social' ? '/assessment-social-11.html' : '/assessment-natural-11.html',
            '12': stream === 'Social' ? '/assessment-social-12.html' : '/assessment-natural-12.html'
        };
        return urlMap[String(grade)] || '/assessment-9.html';
    }
    
    function buildAssessmentUrl(assessmentUrl, assessmentId, studentId) {
        // Handle relative paths
        let url;
        if (assessmentUrl.startsWith('http')) {
            url = new URL(assessmentUrl);
        } else {
            // Make sure we have the correct base
            const base = window.location.origin;
            const path = assessmentUrl.startsWith('/') ? assessmentUrl : '/' + assessmentUrl;
            url = new URL(path, base);
        }
        
        // Add parameters
        if (assessmentId) url.searchParams.set('assessmentId', assessmentId);
        if (studentId) url.searchParams.set('studentId', studentId);
        
        return url.toString();
    }
    
    function showRedirectDialog(title, url) {
        const message = [
            '⚠️ MANDATORY ASSESSMENT',
            '',
            `"${title || 'Untitled Assessment'}"`,
            '',
            'You have been assigned a mandatory assessment.',
            'Click OK to be redirected now.',
            '',
            '⚠️ Do not close or refresh during the assessment!'
        ].join('\n');
        
        if (confirm(message)) {
            window.location.href = url;
        } else {
            // If cancelled, check again in 10 seconds
            setTimeout(() => {
                sessionStorage.removeItem('_ar_check');
            }, 10000);
        }
    }
    
})();