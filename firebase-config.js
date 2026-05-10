import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    updatePassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    orderBy, 
    Timestamp, 
    onSnapshot,
    limit,
    startAfter,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAweOspPV0FOlsUZS2jTFkabEUPYlvoz2w",
    authDomain: "arma-7f596.firebaseapp.com",
    projectId: "arma-7f596",
    storageBucket: "arma-7f596.firebasestorage.app",
    messagingSenderId: "465723818385",
    appId: "1:465723818385:web:8c8c04746b233861719a30",
    measurementId: "G-67XS4FKPKR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export everything
export {
    // Auth
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    // Firestore
    db,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    Timestamp,
    onSnapshot,
    limit,
    startAfter,
    writeBatch
};