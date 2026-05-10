import { db, collection, addDoc, Timestamp } from './firebase-config.js';

export async function saveQuizResult(studentId, studentName, quizData) {
    try {
        const quizResult = {
            studentId: studentId,
            studentName: studentName,
            grade: quizData.grade,
            section: quizData.section || null,
            stream: quizData.stream || null,
            subject: quizData.subject,
            subjectCode: quizData.subjectCode,
            chapter: quizData.chapter,
            chapterName: quizData.chapterName,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            percentage: Math.round((quizData.score / quizData.totalQuestions) * 100),
            isFinalExam: quizData.isFinalExam || false,
            includeInAverage: quizData.includeInAverage !== false,
            completedAt: Timestamp.now()
        };
        const docRef = await addDoc(collection(db, "quiz_results"), quizResult);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving quiz:", error);
        return { success: false, error: error.message };
    }
}

export async function getStudentAverage(studentId) {
    try {
        const q = query(collection(db, "quiz_results"), where("studentId", "==", studentId), where("includeInAverage", "==", true));
        const snapshot = await getDocs(q);
        let totalPercentage = 0;
        let count = 0;
        snapshot.forEach(doc => {
            totalPercentage += doc.data().percentage || 0;
            count++;
        });
        return count > 0 ? Math.round(totalPercentage / count) : 0;
    } catch (error) {
        console.error("Error getting average:", error);
        return 0;
    }
}