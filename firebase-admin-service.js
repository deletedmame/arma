import { db, collection, getDocs, updateDoc, deleteDoc, doc, addDoc, Timestamp, query, where } from './firebase-config.js';

// ==================== USER MANAGEMENT ====================
export async function getAllStudents() {
    try {
        const snapshot = await getDocs(collection(db, "profiles"));
        const students = [];
        snapshot.forEach(doc => { const data = doc.data(); if (data.role === 'student') students.push({ id: doc.id, ...data }); });
        return students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (error) { console.error("Error fetching students:", error); return []; }
}

export async function getAllTeachers() {
    try {
        const snapshot = await getDocs(collection(db, "profiles"));
        const teachers = [];
        snapshot.forEach(doc => { const data = doc.data(); if (data.role === 'teacher') teachers.push({ id: doc.id, ...data }); });
        return teachers;
    } catch (error) { console.error("Error fetching teachers:", error); return []; }
}

export async function getPendingUsers() {
    try {
        const q = query(collection(db, "profiles"), where("approved", "==", false));
        const snapshot = await getDocs(q);
        const users = [];
        snapshot.forEach(doc => { const data = doc.data(); if (data.role !== 'admin') users.push({ id: doc.id, ...data }); });
        return users;
    } catch (error) { console.error("Error fetching pending users:", error); return []; }
}

export async function approveUser(userId) {
    try {
        await updateDoc(doc(db, "profiles", userId), { approved: true });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "profiles", userId));
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

// ==================== SCHEDULE MANAGEMENT ====================
export async function getSchedule(grade, section) {
    try {
        const q = query(collection(db, "schedules"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const schedule = [];
        snapshot.forEach(doc => schedule.push({ id: doc.id, ...doc.data() }));
        return schedule.sort((a,b) => a.period - b.period);
    } catch (error) { console.error("Error fetching schedule:", error); return []; }
}

export async function saveSchedule(scheduleData) {
    try {
        const existing = await getDocs(query(collection(db, "schedules"), where("grade", "==", scheduleData.grade), where("section", "==", scheduleData.section), where("period", "==", scheduleData.period)));
        if (!existing.empty) {
            await updateDoc(doc(db, "schedules", existing.docs[0].id), scheduleData);
            return { success: true, updated: true };
        } else {
            await addDoc(collection(db, "schedules"), { ...scheduleData, createdAt: Timestamp.now() });
            return { success: true, updated: false };
        }
    } catch (error) { return { success: false, error: error.message }; }
}

// ==================== HOMEROOM TEACHERS ====================
export async function assignHomeroomTeacher(grade, section, teacherId, teacherName) {
    try {
        const existing = await getDocs(query(collection(db, "homeroom"), where("grade", "==", grade), where("section", "==", section)));
        if (!existing.empty) {
            await updateDoc(doc(db, "homeroom", existing.docs[0].id), { teacherId, teacherName, updatedAt: Timestamp.now() });
        } else {
            await addDoc(collection(db, "homeroom"), { grade, section, teacherId, teacherName, createdAt: Timestamp.now() });
        }
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function getHomeroomTeacher(grade, section) {
    try {
        const q = query(collection(db, "homeroom"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs[0].data();
        return null;
    } catch (error) { return null; }
}

// ==================== ATTENDANCE ====================
export async function markAttendance(grade, section, date, records) {
    try {
        const existing = await getDocs(query(collection(db, "attendance"), where("grade", "==", grade), where("section", "==", section), where("date", "==", date)));
        if (!existing.empty) {
            await updateDoc(doc(db, "attendance", existing.docs[0].id), { records, updatedAt: Timestamp.now() });
        } else {
            await addDoc(collection(db, "attendance"), { grade, section, date, records, createdAt: Timestamp.now() });
        }
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function getAttendance(grade, section, date) {
    try {
        const q = query(collection(db, "attendance"), where("grade", "==", grade), where("section", "==", section), where("date", "==", date));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs[0].data();
        return null;
    } catch (error) { return null; }
}

export async function getAllAbsentStudents(date) {
    try {
        const snapshot = await getDocs(collection(db, "attendance"));
        const absentStudents = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.date === date) {
                data.records.forEach(record => {
                    if (record.status === 'A') absentStudents.push(record);
                });
            }
        });
        return absentStudents;
    } catch (error) { return []; }
}

// ==================== ASSESSMENTS ====================
export async function addAssessment(assessmentData) {
    try {
        await addDoc(collection(db, "assessments"), { ...assessmentData, createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function getAssessments(subjectCode, grade, section) {
    try {
        const q = query(collection(db, "assessments"), where("subjectCode", "==", subjectCode), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const assessments = [];
        snapshot.forEach(doc => assessments.push({ id: doc.id, ...doc.data() }));
        return assessments.sort((a,b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.());
    } catch (error) { return []; }
}

export async function saveAssessmentScore(studentId, assessmentId, score, total) {
    try {
        const existing = await getDocs(query(collection(db, "assessment_scores"), where("studentId", "==", studentId), where("assessmentId", "==", assessmentId)));
        if (!existing.empty) {
            await updateDoc(doc(db, "assessment_scores", existing.docs[0].id), { score, total, status: 'completed', completedAt: Timestamp.now() });
        } else {
            await addDoc(collection(db, "assessment_scores"), { studentId, assessmentId, score, total, status: 'completed', completedAt: Timestamp.now() });
        }
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

// ==================== FINAL EXAMS (Admin Only) ====================
export async function activateFinalExam(examData) {
    try {
        await addDoc(collection(db, "final_exams"), { ...examData, active: true, createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function getActiveFinalExam(subjectCode, grade) {
    try {
        const q = query(collection(db, "final_exams"), where("subjectCode", "==", subjectCode), where("grade", "==", grade), where("active", "==", true));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs[0].data();
        return null;
    } catch (error) { return null; }
}

// ==================== PERMISSION REQUESTS ====================
export async function submitPermissionRequest(studentId, studentName, reason, date) {
    try {
        await addDoc(collection(db, "permission_requests"), { studentId, studentName, reason, date, status: 'pending', createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}

export async function getPendingPermissionRequests() {
    try {
        const q = query(collection(db, "permission_requests"), where("status", "==", "pending"));
        const snapshot = await getDocs(q);
        const requests = [];
        snapshot.forEach(doc => requests.push({ id: doc.id, ...doc.data() }));
        return requests;
    } catch (error) { return []; }
}

export async function approvePermissionRequest(requestId, approved) {
    try {
        await updateDoc(doc(db, "permission_requests", requestId), { status: approved ? 'approved' : 'denied', processedAt: Timestamp.now() });
        return { success: true };
    } catch (error) { return { success: false, error: error.message }; }
}