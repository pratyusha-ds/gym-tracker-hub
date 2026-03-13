# Gym Tracker

[![Deployment Status](https://deploy-badge.vercel.app/?url=https://gymtrackerhub.vercel.app&name=GymTracker)](https://gymtrackerhub.vercel.app)
[![Backend Continuous Integration](https://github.com/pratyusha-ds/gym-tracker-2026/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/pratyusha-ds/gym-tracker-2026/actions/workflows/backend-ci.yml)
[![Frontend Continuous Integration](https://github.com/pratyusha-ds/gym-tracker-2026/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/pratyusha-ds/gym-tracker-2026/actions/workflows/frontend-ci.yml)

[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io)
[![Zod Validated](https://img.shields.io/badge/Validation-Zod-blue?style=for-the-badge&logo=zod)](https://zod.dev)
![Docker Dev](https://img.shields.io/badge/Dev--Environment-Docker-blue?logo=docker&logoColor=white)

##

StarkRep solves the friction of logging workouts by providing a high-performance, mobile-first interface. It moves beyond simple note-taking by categorizing movements and managing exercise libraries. Engineered with a **Next.js frontend** and a **Java Spring Boot** backend, this project demonstrates a bridge between modern React server patterns and enterprise-grade Java backend architecture.

---

## Technical Stack

### Frontend

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Validation:** Zod (Type-safe schemas)
- **Testing:** Vitest, Playwright E2E
- **Deployment:** Vercel

### Backend

- **Framework:** Spring Boot
- **Database:** PostgreSQL (Hosted on Neon)
- **ORM:** Spring Data JPA (Hibernate)
- **Testing:** JUnit, Mockito, H2 In-memory DB
- **Deployment:** Render

### DevOps & Infrastructure

- **Containerization:** Docker & Dev Containers
- **CI/CD:** GitHub Actions (Automated Testing)

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    autonumber

    %% Use distinct actors
    participant U as User
    participant C as React Form
    participant SA as Next.js Action
    participant J as Java API

    Note over U, J: PHASE 1: INITIAL LOAD (Streaming)
    U->>SA: Requests /categories
    SA->>J: GET /api/categories
    J-->>SA: JSON Response
    SA-->>U: Instant HTML + Streaming Data

    Note over U, J: PHASE 2: DATA MUTATION (The Bridge)
    U->>C: Clicks "Save Workout"
    C->>C: Zod Validation (Client)
    C->>SA: Invoke Action(data)
    SA->>SA: Zod Validation (Server)
    SA->>J: POST /api/categories
    J-->>SA: 201 Created

    Note over U, J: PHASE 3: REVALIDATION
    SA->>SA: revalidatePath('/categories')
    SA-->>U: UI Updates (No Refresh)
```

---

## **Core Features**

- **Exercise Library:** Searchable database of exercises linked to specific categories with strict data integrity.
- **Server-Side Rendering (SSR):** Powered by Next.js for instant page loads and SEO-friendly exercise documentation.
- **Robust Architecture:** Uses Next.js Server Actions to securely communicate with a high-concurrency Spring Boot API.

###  DevOps & Infrastructure

- **Dev Containers:** Dockerized development environment for 100% setup consistency.
- **CI/CD Pipeline:** GitHub Actions runs the full test suite on every push.
- **Cloud Hosting:** Vercel (Frontend) + Render (Backend) + Neon (DB).

### Quality Assurance (Testing)

### **1\. Backend (JUnit & Mockito)**

- **Slices:** `@WebMvcTest` (API) and `@DataJpaTest` (DB).
- **Logic:** Mockito for services; Reflection for private field injection.

### **2\. Frontend (Vitest)**

- **Unit:** Component and Server Action validation.

### **3\. E2E (Playwright)**

- **Real-World:** Simulates full user journeys across Chromium, Firefox, and Safari.
- **Integrity:** Validates the connection between Vercel and Render.
