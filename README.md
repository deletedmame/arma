# Arma • AI School Platform

Arma is a comprehensive, AI-native school management platform designed to connect administrators, teachers, students, and families. It provides a unified ecosystem for managing multiple educational institutions, automating assessments, and facilitating real-time collaboration.

## 🚀 Key Features

- **Multi-Role Portals:** Dedicated dashboards for Admins, Teachers, Students, and Parents.
- **Automated Assessments:** Support for various assessment types (Classwork, Homework, Quizzes, Final Exams) with a weighted grading system.
- **Smart Transcripts:** Automatic generation of term reports and transcripts with CSV export capabilities.
- **Real-Time Collaboration:** Secure, real-time chat and instant grade alerts.
- **Schedule Management:** Dynamic class schedule editor and viewer (8:00 AM - 6:20 PM).
- **Attendance Tracking:** Streamlined attendance marking for teachers and overview for admins.
- **Exam Management:** Tools for forcing final exams and monitoring exam integrity (tab switching detection).
- **Gamification:** Student leaderboards and performance rankings.
- **Multi-School Ready:** Designed to handle K-12 schools, tutor centers, and academies under one hub.

## 🛠️ Technology Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (with Inter font and Font Awesome icons).
- **Backend:**
    - **Firebase:** Primary backend for Authentication, Firestore (NoSQL database), and real-time listeners.
    - **Supabase:** Used for online status heartbeats and basic profile tracking.
- **Styling:** Custom CSS with support for light and dark modes.

## 📂 Project Structure

- `admin.html`: The central hub for school administrators.
- `teacher-dashboard.html`: Comprehensive tools for teachers to manage their classes and students.
- `subject-portal.html`: The main dashboard for students to access their subjects and progress.
- `parent.html`: A dedicated portal for parents to monitor their children's performance.
- `signin.html`: Unified authentication entry point.
- `grade-9/` to `grade-12/`: Hierarchical directories containing grade-specific content, notes, and quizzes.
- `firebase-*.js`: Specialized service modules for different Firebase operations (admin, quiz, config, etc.).
- `styles/`: Directory containing CSS stylesheets for different components and themes.
- `images/`: Static assets and icons used throughout the platform.

## 🚦 Getting Started

1. **Prerequisites:** A modern web browser.
2. **Setup:**
    - Clone the repository.
    - The project is designed to run as a static site. You can serve it using any local web server (e.g., `Live Server` in VS Code).
3. **Authentication:** Use `signin.html` to create an account. Note that new accounts require admin approval (can be toggled in `admin.html` if you have an admin account).

## 🛡️ Security Note

This repository currently contains hardcoded API keys for Firebase and Supabase for development purposes. For production environments, these should be moved to environment variables or a secure secret management system.

## 📝 License

© 2026 Bikolos Nur Academy (BNA) & Arma. All rights reserved.
