# Arma Platform - Development Completion Plan

This document outlines the specific technical requirements to finalize the "Force Exam" and "Transcription" logic, and to standardize Note and Quiz pages across the platform.

## 1. Unified "Force" Mechanism
The "Force" action in `admin.html` and `teacher-dashboard.html` must:
- Update the `assessments` collection with `status: "active"`.
- Populate `assessment_scores` for all target students with `status: "forced"`.
- Trigger real-time redirects in `subject-portal.html` using Firestore listeners.

## 2. Transcription Backend & Auto-Sync
- **recaculateTranscriptScores:** Implement a centralized logic to pull from `assessment_scores` and `quiz_results`.
- **Weighted System:** Apply weights (CW: 10%, HW: 10%, Quiz: 10%, Final: 30%, Test: 10%, Assignment: 10%, Behavior: 10%, Bookmark: 10%).
- **Submission Flow:** Ensure Teacher -> Admin -> Parent/Student publication flow is robust.

## 3. Note & Quiz Standardization
- **Template:** All pages must match the layout and functionality of `grade-9/biology/ch-1/`.
- **AI Integration:** Every Note page requires the ARMA AI assistant with a unit-specific system prompt.
- **Quiz Engine:** Consolidate local `script.js` files into a single `quiz-engine.js` that loads JSON question data.

## 4. Security
- Migrate hardcoded API keys in `firebase-config.js` and `index.js` to environment variables or a secure config module.
