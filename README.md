# Learning Disability Screening System

A web-based application designed to **screen and assess indicators of learning disabilities** using multiple interactive tests.  
This system is intended for **educational and assistive purposes only**, not for medical diagnosis.

The project integrates several cognitive and perceptual tests into a single dashboard to help identify potential learning challenges.

---

## Features

- Multi-module screening system
- Interactive and user-friendly dashboard
- Timed and accuracy-based test evaluation
- Modular design for easy extension

---

## Screening Modules

- **Speech Analysis**
  - User speech input
  - Backend-based analysis of speech patterns

- **Handwriting Analysis**
  - Image-based handwriting input
  - Pattern-oriented evaluation

- **Eye Movement Test**
  - Visual tracking and response-based interaction

- **Color Blindness Detection**
  - Ishihara-style plate test
  - Timed responses with accuracy checks

---

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- API-based processing

---

## Project Structure

/app # Frontend pages and UI components
/api # Backend API routes
/modules # Individual test modules
/public # Static assets (plates, images, etc.)


---

## How It Works

1. Users access the dashboard and select a screening module.
2. Each module presents an interactive test.
3. User responses are processed via backend APIs.
4. Results are generated based on predefined evaluation logic.
5. The system provides indicative feedback for screening purposes.

---

## Status

🚧 **Work in Progress**

Planned improvements:
- Result aggregation and reporting
- Improved evaluation logic
- Better UI accessibility
- Data visualization for results

---

## Ethical Note

This project is **not a diagnostic tool** and does not replace professional evaluation.  
It is intended solely as a **screening and educational support system**.

---

## Purpose

This project was developed to explore:
- Human–computer interaction
- Assistive technology design
- Frontend–backend integration
- Ethical handling of sensitive user data
