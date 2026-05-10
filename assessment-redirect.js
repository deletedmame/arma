// assessment-redirect.js - Central redirect for mandatory (forced) assessments
// Place at site root (same level as firebase-config.js).

(function() {
    'use strict';

    const session = localStorage.getItem('current_user_session');
    if (!session) return;

    let student;
    try {
        student = JSON.parse(session);
    } catch (e) {
        return;
    }

    if (student.role !== 'student') return;

    const lastCheck = sessionStorage.getItem('_ar_check');
    const now = Date.now();
    if (lastCheck && (now - parseInt(lastCheck, 10)) < 15000) return;
    sessionStorage.setItem('_ar_check', now.toString());

    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('/assessment.html') ||
        currentPath.includes('assessment-') ||
        currentPath.includes('exam-') ||
        currentPath.includes('test-')) {
        return;
    }

    checkForcedAssessment(student);

    async function checkForcedAssessment(student) {
        try {
            const firebasePath = `${window.location.origin}/firebase-config.js`;
            const { db, collection, query, where, getDocs } = await import(firebasePath);

            const q = query(
                collection(db, 'assessment_scores'),
                where('studentId', '==', student.id),
                where('status', '==', 'forced')
            );

            const snapshot = await getDocs(q);
            if (snapshot.empty) return;

            let latestAssessment = null;
            let latestTime = 0;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const assignedTime = data.assignedAt?.toDate?.()?.getTime() ||
                    (data.assignedAt?.seconds ? data.assignedAt.seconds * 1000 : 0);

                if (assignedTime >= latestTime) {
                    latestTime = assignedTime;
                    latestAssessment = { id: docSnap.id, ...data };
                }
            });

            if (!latestAssessment) return;

            const seventyTwoHoursAgo = now - (72 * 60 * 60 * 1000);
            if (latestTime > 0 && latestTime < seventyTwoHoursAgo) return;

            let assessmentUrl = latestAssessment.assessmentUrl;
            if (!assessmentUrl) {
                assessmentUrl = getAssessmentUrl(student.grade, student.stream);
            }

            const fullUrl = buildAssessmentUrl(assessmentUrl, latestAssessment.assessmentId, student.id);
            showMandatoryOverlay(latestAssessment.assessmentTitle);
            window.location.replace(fullUrl);
        } catch (error) {
            console.warn('Assessment redirect check failed:', error.message);
        }
    }

    function getAssessmentUrl(grade, streamRaw) {
        const g = String(grade != null ? grade : '9');
        const stream = String(streamRaw || '').toLowerCase();
        const map = {
            '9': '/grade-9/assessment.html',
            '10': '/grade-10/assessment.html',
            '11': stream.includes('social') ? '/grade-11/social/assessment.html' : '/grade-11/natural/assessment.html',
            '12': stream.includes('social') ? '/grade-12/social/assessment.html' : '/grade-12/natural/assessment.html'
        };
        return map[g] || '/grade-9/assessment.html';
    }

    function buildAssessmentUrl(assessmentUrl, assessmentId, studentId) {
        let url;
        if (assessmentUrl.startsWith('http')) {
            url = new URL(assessmentUrl);
        } else {
            const path = assessmentUrl.startsWith('/') ? assessmentUrl : '/' + assessmentUrl;
            url = new URL(path, window.location.origin);
        }

        if (assessmentId) url.searchParams.set('assessmentId', assessmentId);
        if (studentId) url.searchParams.set('studentId', studentId);
        url.searchParams.set('autoOpen', '1');
        return url.toString();
    }

    function showMandatoryOverlay(title) {
        const el = document.createElement('div');
        el.setAttribute('id', 'mandatory-assessment-overlay');
        el.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,0.92);color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:system-ui,sans-serif;';
        el.innerHTML = '<div><p style="font-size:14px;opacity:0.85;margin-bottom:12px;">Mandatory assessment</p><p style="font-size:18px;font-weight:700;max-width:420px;line-height:1.4;">' +
            escapeHtml(title || 'Opening your assessment…') + '</p><p style="margin-top:16px;font-size:13px;opacity:0.75;">Redirecting…</p></div>';
        document.body.appendChild(el);
    }

    function escapeHtml(t) {
        const d = document.createElement('div');
        d.textContent = t == null ? '' : String(t);
        return d.innerHTML;
    }
})();
