import { db, collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, Timestamp, writeBatch } from './firebase-config.js';

// ==================== USER MANAGEMENT ====================
export async function getUserProfile(userId) {
    if (!userId) return null;
    try {
        const docRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

export async function updateUserProfile(userId, data) {
    try {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, data);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllStudents(approvedOnly = true) {
    try {
        let q = collection(db, "profiles");
        if (approvedOnly) q = query(q, where("role", "==", "student"), where("approved", "==", true));
        else q = query(q, where("role", "==", "student"));
        const snapshot = await getDocs(q);
        const students = [];
        snapshot.forEach(doc => students.push({ id: doc.id, ...doc.data() }));
        return students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}

export async function getAllTeachers(approvedOnly = true) {
    try {
        let q = collection(db, "profiles");
        if (approvedOnly) q = query(q, where("role", "==", "teacher"), where("approved", "==", true));
        else q = query(q, where("role", "==", "teacher"));
        const snapshot = await getDocs(q);
        const teachers = [];
        snapshot.forEach(doc => teachers.push({ id: doc.id, ...doc.data() }));
        return teachers;
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
}

export async function approveUser(userId) {
    try {
        await updateDoc(doc(db, "profiles", userId), { approved: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "profiles", userId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== QUIZ RESULTS ====================
export async function saveQuizResult(data) {
    try {
        const result = {
            studentId: data.studentId,
            studentName: data.studentName,
            studentIdNumber: data.studentIdNumber,
            grade: data.grade,
            section: data.section,
            subject: data.subject,
            subjectCode: data.subjectCode,
            chapter: data.chapter,
            chapterName: data.chapterName,
            score: data.score,
            totalQuestions: data.totalQuestions,
            percentage: Math.round((data.score / data.totalQuestions) * 100),
            isFinalExam: data.isFinalExam || false,
            includeInAverage: data.includeInAverage !== false,
            completedAt: Timestamp.now()
        };
        const docRef = await addDoc(collection(db, "quiz_results"), result);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving quiz:", error);
        return { success: false, error: error.message };
    }
}

export async function getStudentQuizResults(studentId, subjectCode = null) {
    try {
        let q = query(collection(db, "quiz_results"), where("studentId", "==", studentId));
        if (subjectCode) q = query(q, where("subjectCode", "==", subjectCode));
        const snapshot = await getDocs(q);
        const results = [];
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results.sort((a, b) => b.completedAt?.toDate?.() - a.completedAt?.toDate?.());
    } catch (error) {
        console.error("Error getting quiz results:", error);
        return [];
    }
}

export async function getStudentAverage(studentId, subjectCode = null) {
    const results = await getStudentQuizResults(studentId, subjectCode);
    const gradedResults = results.filter(r => r.includeInAverage !== false);
    if (gradedResults.length === 0) return 0;
    let total = 0;
    gradedResults.forEach(r => total += r.percentage || 0);
    return Math.round(total / gradedResults.length);
}

// ==================== ASSESSMENTS ====================
export async function createAssessment(data) {
    try {
        await addDoc(collection(db, "assessments"), {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAssessments(subjectCode, grade, section) {
    try {
        let q = query(collection(db, "assessments"), where("subjectCode", "==", subjectCode));
        if (grade) q = query(q, where("grade", "==", grade));
        if (section) q = query(q, where("section", "==", section));
        const snapshot = await getDocs(q);
        const assessments = [];
        snapshot.forEach(doc => assessments.push({ id: doc.id, ...doc.data() }));
        return assessments.sort((a, b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.());
    } catch (error) {
        console.error("Error getting assessments:", error);
        return [];
    }
}

export async function saveAssessmentScore(studentId, assessmentId, score, totalPoints) {
    try {
        const existing = await getDocs(query(collection(db, "assessment_scores"), 
            where("studentId", "==", studentId), where("assessmentId", "==", assessmentId)));
        const percentage = Math.round((score / totalPoints) * 100);
        if (!existing.empty) {
            await updateDoc(doc(db, "assessment_scores", existing.docs[0].id), {
                score, totalPoints, percentage, status: 'completed', completedAt: Timestamp.now()
            });
        } else {
            await addDoc(collection(db, "assessment_scores"), {
                studentId, assessmentId, score, totalPoints, percentage, status: 'completed', completedAt: Timestamp.now()
            });
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== ATTENDANCE ====================
export async function saveAttendance(grade, section, date, records, teacherId) {
    try {
        const existing = await getDocs(query(collection(db, "attendance"), 
            where("grade", "==", grade), where("section", "==", section), where("date", "==", date)));
        const attendanceData = { grade, section, date, records, teacherId, updatedAt: Timestamp.now() };
        if (!existing.empty) {
            await updateDoc(doc(db, "attendance", existing.docs[0].id), attendanceData);
        } else {
            await addDoc(collection(db, "attendance"), { ...attendanceData, createdAt: Timestamp.now() });
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAttendance(grade, section, date) {
    try {
        const q = query(collection(db, "attendance"), where("grade", "==", grade), 
            where("section", "==", section), where("date", "==", date));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) return snapshot.docs[0].data();
        return null;
    } catch (error) {
        console.error("Error getting attendance:", error);
        return null;
    }
}

export async function getStudentAttendance(studentId, startDate, endDate) {
    try {
        const snapshot = await getDocs(collection(db, "attendance"));
        const records = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const studentRecord = data.records?.find(r => r.studentId === studentId);
            if (studentRecord) records.push({ date: data.date, status: studentRecord.status });
        });
        return records;
    } catch (error) {
        console.error("Error getting student attendance:", error);
        return [];
    }
}

// ==================== MESSAGES ====================
export async function sendMessage(data) {
    try {
        const message = {
            message: data.message,
            senderId: data.senderId,
            senderName: data.senderName,
            receiverId: data.receiverId,
            chatId: data.chatId,
            timestamp: Timestamp.now(),
            read: false
        };
        const docRef = await addDoc(collection(db, "private_messages"), message);
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getMessages(chatId) {
    try {
        const q = query(collection(db, "private_messages"), where("chatId", "==", chatId));
        const snapshot = await getDocs(q);
        const messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        return messages.sort((a, b) => a.timestamp?.toDate?.() - b.timestamp?.toDate?.());
    } catch (error) {
        console.error("Error getting messages:", error);
        return [];
    }
}

export async function markMessagesAsRead(chatId, userId) {
    try {
        const q = query(collection(db, "private_messages"), where("chatId", "==", chatId), where("receiverId", "==", userId), where("read", "==", false));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(doc => batch.update(doc.ref, { read: true }));
        await batch.commit();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== LEADERBOARD ====================
export async function getLeaderboard(gradeFilter = null, sectionFilter = null, minAssessments = 3) {
    try {
        const students = await getAllStudents(true);
        const studentAverages = [];
        
        for (const student of students) {
            if (gradeFilter && student.grade != gradeFilter) continue;
            if (sectionFilter && student.section !== sectionFilter) continue;
            
            const quizResults = await getStudentQuizResults(student.id);
            const gradedQuizResults = quizResults.filter(r => r.includeInAverage !== false);
            const assessmentSnap = await getDocs(query(collection(db, "assessment_scores"), where("studentId", "==", student.id)));
            const gradedAssessmentRows = [];
            assessmentSnap.forEach(d => {
                const row = d.data();
                if (row.includeInAverage === false) return;
                if (row.status && row.status !== 'completed') return;
                gradedAssessmentRows.push(row);
            });

            const totalCount = gradedQuizResults.length + gradedAssessmentRows.length;
            if (totalCount >= minAssessments) {
                let earned = 0;
                let possible = 0;
                gradedQuizResults.forEach(r => {
                    earned += Number(r.score) || 0;
                    possible += Number(r.totalQuestions) || 0;
                });
                gradedAssessmentRows.forEach(r => {
                    earned += Number(r.score) || 0;
                    possible += Number(r.total) || Number(r.totalPoints) || 0;
                });
                const average = possible > 0 ? Math.round((earned / possible) * 100) : 0;
                studentAverages.push({ ...student, average, assessmentCount: totalCount });
            }
        }
        return studentAverages.sort((a, b) => b.average - a.average);
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
}

// ==================== PARENT FUNCTIONS ====================
export async function addChildToParent(parentId, childId) {
    try {
        const childProfile = await getUserProfile(childId);
        if (!childProfile) return { success: false, error: "Child not found" };
        
        await addDoc(collection(db, "parent_children"), {
            parentId, childId, childName: childProfile.name,
            childGrade: childProfile.grade, childSection: childProfile.section,
            addedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getParentChildren(parentId) {
    try {
        const q = query(collection(db, "parent_children"), where("parentId", "==", parentId));
        const snapshot = await getDocs(q);
        const children = [];
        snapshot.forEach(doc => children.push({ id: doc.id, ...doc.data() }));
        return children;
    } catch (error) {
        console.error("Error getting parent children:", error);
        return [];
    }
}

export async function removeChildFromParent(linkId) {
    try {
        await deleteDoc(doc(db, "parent_children", linkId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== SCHEDULE ====================
export async function getSchedule(grade, section) {
    try {
        const q = query(collection(db, "schedules"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const schedule = [];
        snapshot.forEach(doc => schedule.push({ id: doc.id, ...doc.data() }));
        return schedule.sort((a, b) => a.period - b.period);
    } catch (error) {
        console.error("Error getting schedule:", error);
        return [];
    }
}

export async function saveSchedule(scheduleData) {
    try {
        await addDoc(collection(db, "schedules"), { ...scheduleData, createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== UTILITIES ====================
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function formatDate(date) {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
}

export function formatTime(date) {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getRelativeTime(date) {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
}