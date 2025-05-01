# DinoAI - Interactive Language Learning Companion

<div align="center">
  <img src="https://github.com/user-attachments/assets/ffffa9dd-dbe9-40fd-bc6e-47baba844fae" alt="dinoAI Logo" width="400">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/-Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</div>

## 📋 Table of Contents

1.  ✨ [Introduction](#introduction)
2.  ✅ [Tech Stack](#tech-stack)
3.  ⚙️ [Installation (Backend)](#installation-backend)
4.  ▶️ [Running the Backend](#running-the-backend)
5.  ⚙️ [Installation (Frontend)](#installation-frontend)
6.  ▶️ [Running the Frontend](#running-the-frontend)
7.  🕹️ [Features](#features)
8.  🌐 [Live Demo](#live-demo)
9.  📱 [Screenshots](#screenshots)
10. 🧑‍🚀 [Contributors](#contributors)

## ✨ Introduction <a name="introduction"></a>

DinoAI is an intelligent language learning application that helps users improve their language skills through interactive conversations with an AI language partner. Unlike other language platforms that overwhelm with features, DinoAI focuses on providing clear, concise feedback during natural conversations, making language learning more engaging and effective.

DinoAI offers real-time grammar correction, vocabulary suggestions, and performance tracking to help users track their progress. Whether you're a beginner or advanced learner, DinoAI adapts to your skill level to provide personalized learning experiences.

## ✅ Tech Stack <a name="tech-stack"></a>

### Frontend
- React
- Tailwind CSS
- DaisyUI
- Vite

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication

### Database
- PostgreSQL (hosted on Supabase)

### AI Integration
- Google Gemini API

### Deployment
- Render (Backend & Frontend)

## ⚙️ Installation (Backend) <a name="installation-backend"></a>

Follow these steps to set up the backend development environment.

### Prerequisites

*   **Git:** To clone the repository.
*   **Java Development Kit (JDK):** Version 21 or later.
*   **Maven:** Apache Maven build tool.
*   **Temple University Email Account:** Required to access necessary configuration secrets.
### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Capstone-Projects-2025-Spring/section-005-karlmorris-projects-dinoai-chat.git
    cd section-005-karlmorris-projects-dinoai-chat/backend
    ```

2.  **Configure Environment Variables via Google Doc:**
    This project uses `spring-dotenv` to manage configuration via a `.env` file in the project's root directory (`backend/`). The required secrets (like database credentials and API keys) are stored in a secure Google Document accessible only via Temple University email accounts.

    *   **Access the Secret Document:**
        *   Go to: [https://docs.google.com/document/d/1W7ydmfVxAKlYkk1w-BC4p5UYtBWhDWl3nB8Djt6pULg/edit?usp=sharing](https://docs.google.com/document/d/1W7ydmfVxAKlYkk1w-BC4p5UYtBWhDWl3nB8Djt6pULg/edit?usp=sharing)
        *   You **must** be logged into Google with a `@temple.edu` email address to view this document.

    *   **Create a local `.env` file:**
        *   In the root directory of the backend project (e.g., `backend/`), create a new file named `.env`.

    *   **Populate the `.env` file:**
        *   Copy the key-value pairs from the Google Document into your newly created `.env` file.
        *   The structure should look similar to this (replace `<value_from_google_doc>` with the actual values you copied):
          ```dotenv
          # Database Configuration
          SUPABASE_PASSWORD=<value_from_google_doc>
          # Google Gemini API Key
          GEMINI_API_KEY=<value_from_google_doc>
          ```

    *   **Security:** **DO NOT commit your `.env` file to Git.** Ensure that `.env` is listed in your project's `.gitignore` file.

3.  **Build the Project:**
    This step downloads dependencies, compiles the code, and packages the application.
    ```bash
    ./mvnw clean install -DskipTests
    ```
    *   This will create a JAR file in the `target/` directory.

## ▶️ Running the Backend <a name="running-the-backend"></a>

Once installed and configured with the `.env` file, you can run the backend server:

### 1. Using Maven (Recommended for Development)

This command compiles and runs the application directly using the Spring Boot Maven plugin. It uses the configuration from your `.env` file.

```bash
./mvnw spring-boot:run
```

## ⚙️ Installation (Frontend) <a name="installation-frontend"></a>

Follow these steps to set up the frontend development environment.

### Prerequisites (Frontend)

*   **Node.js:** Version 18.x or later recommended. (Includes npm)
*   **npm (Node Package Manager):** Comes with Node.js.

### Steps (Frontend)

1.  **Navigate to Frontend Directory:**
    Make sure you are in the root directory of the cloned repository (`section-005-karlmorris-projects-dinoai-chat`).
    ```bash
    # Navigate into the frontend directory:
    cd frontend
    ```

2.  **Install Dependencies:**
    This command reads the `package.json` file and installs all the necessary libraries for the frontend.
    ```bash
    npm install
    ```

## ▶️ Running the Frontend <a name="running-the-frontend"></a>

Once the dependencies are installed (ensure you are in the `frontend` directory):

1.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

2.  **Access the Frontend:**
    *   The terminal will usually display the URL where the frontend is running.
    *   Open your web browser and navigate to the provided URL.

**Note:** For the frontend to interact correctly with the backend, the backend server must also be running (as described in the "Running the Backend" section).

## 🕹️ Features <a name="features"></a>

### Core Features

👉 **Interactive AI Conversations** - Engage in natural dialogue with an AI language partner that responds in your target language.

👉 **Real-time Grammar Feedback** - Receive instant correction on grammatical errors without disrupting the conversation flow.

👉 **Multiple Language Support** - Practice in various languages including English, Spanish, French, German, Italian, Chinese, Japanese, and more.

👉 **Conversation History** - Review past chat sessions and track your progress over time.

👉 **Performance Scoring** - Get ratings and scores after each conversation session to measure improvement.

👉 **User Profiles** - Manage your learning preferences, native language, and target language settings.

👉 **Vocabulary Recommendations** - Receive personalized vocabulary suggestions based on your conversations.

### Accessibility Features

👉 **Responsive Design** - Optimized for both desktop and mobile devices.

## 🌐 Live Demo <a name="live-demo"></a>

Experience DinoAI in action:
[https://dinoai.onrender.com](https://dinoai.onrender.com)

## 📱 Screenshots <a name="screenshots"></a>

<div align="center">
  <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
    <div>
      <img src="https://github.com/user-attachments/assets/ad7501af-f8b1-4082-8877-4ed35f4928d1" width="270" alt="DinoAI Login" />
      <p><em>Secure user authentication</em></p>
    </div>
    <div>
      <img src="https://github.com/user-attachments/assets/8af34bd7-89b4-437e-9c6f-ce63edddb541" width="270" alt="DinoAI Home Screen" />
      <p><em>Home screen with language selection</em></p>
    </div>
  </div>
  
  <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
    <div>
      <img src="https://github.com/user-attachments/assets/e601c639-2e79-473e-80ac-c5315e02cf0f" width="270" alt="DinoAI Chat" />
      <p><em>Interactive chat with grammar feedback</em></p>
    </div>
    <div>
      <img src="https://github.com/user-attachments/assets/a939e282-f1a4-4bc7-852b-4968c653e7d7" width="270" alt="DinoAI Profile Page" />
      <p><em>User profile management</em></p>
    </div>
  </div>
  
  <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
    <div>
      <img src="https://github.com/user-attachments/assets/03401401-ee90-4376-9fa8-106a8b271e38" width="270" alt="DinoAI Conversation History" />
      <p><em>Conversation history tracking</em></p>
    </div>
    <div>
      <img src="https://github.com/user-attachments/assets/fbc44233-8db3-432a-8954-06671770ddad" width="270" alt="DinoAI Feedback Score" />
      <p><em>Performance feedback and scoring</em></p>
    </div>
  </div>
</div>

## 🧑‍🚀 Contributors <a name="contributors"></a>

<div align="center">
  <a href="https://github.com/toast212">
    <img src="https://avatars.githubusercontent.com/u/156926783?s=60&v=4" width="100" alt="toast212" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/PeterLy2">
    <img src="https://avatars.githubusercontent.com/u/156947353?s=60&v=4" width="100" alt="PeterLy2" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/HarrryHe">
    <img src="https://avatars.githubusercontent.com/u/93626337?s=60&v=4" width="100" alt="HarrryHe" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/tui81718">
    <img src="https://avatars.githubusercontent.com/u/123013543?s=60&v=4" width="100" alt="tui81718" />
  </a>
  <br />
  <a href="https://github.com/yuseftohamy">
    <img src="https://avatars.githubusercontent.com/u/108779199?s=60&v=4" width="100" alt="yuseftohamy" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/rosegly">
    <img src="https://avatars.githubusercontent.com/u/180560787?s=60&v=4" width="100" alt="rosegly" />
  </a>
</div>

---

<p align="center">
  DinoAI: Your interactive language learning companion.
</p>
