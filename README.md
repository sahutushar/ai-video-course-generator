# 🎓 VidCourse — AI-Powered Video Course Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_OpenAI-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Turn any topic into a fully animated, narrated video course using AI — in seconds.**

[🚀 Live Demo](https://ai-video-course-generator.vercel.app) · [📖 Documentation](#-getting-started) · [🐛 Report Bug](https://github.com/sahutushar/ai-video-course-generator/issues)

</div>

---

## 📌 What is VidCourse?

VidCourse is a production-ready full-stack **Next.js 16** application that transforms any topic into a fully structured, narrated, and animated video course — completely powered by AI.

A user simply types a topic (e.g. *"React Hooks"* or *"Python for Beginners"*), and the app:

1. **Generates** a structured course layout with chapters and sub-topics using **Azure OpenAI GPT-4o**
2. **Creates** animated Tailwind HTML slides for each sub-topic
3. **Narrates** every slide with AI-generated MP3 audio via **Fonada TTS**
4. **Transcribes** audio into captions using **Groq Whisper Large v3**
5. **Plays** everything back as a real video timeline in the browser using **Remotion**

No video editing. No manual work. Just type and watch.

---

## ✨ Features

| # | Feature | Powered By |
|---|---|---|
| 1 | AI course structure (chapters, levels) | Azure OpenAI GPT-4o |
| 2 | Animated Tailwind HTML slides per sub-topic | Azure OpenAI GPT-4o |
| 3 | Text-to-Speech narration audio (MP3) | Fonada AI TTS |
| 4 | Auto-captions from audio | Groq Whisper Large v3 |
| 5 | In-browser video player with timeline | Remotion Player |
| 6 | Progressive slide reveal animations | postMessage + CSS |
| 7 | Auth + freemium billing | Clerk |
| 8 | Persistent storage | NeonDB + Drizzle ORM |
| 9 | Audio file hosting | Azure Blob Storage |
| 10 | Free tier (2 courses) + paid unlimited plan | Clerk Monthly Billing |

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety across the codebase |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first UI components |
| Auth & Billing | Clerk | Authentication + freemium plan management |
| AI — Course Layout | Azure OpenAI (GPT-4o) | Generate structured course JSON |
| AI — Slide HTML | Azure OpenAI (GPT-4o) | Generate animated HTML slides |
| AI — Captions | Groq (Whisper Large v3) | Transcribe MP3 audio to captions |
| TTS — Narration | Fonada AI TTS API | Convert text to MP3 narration |
| Video Rendering | Remotion (Player + Sequence + Audio) | In-browser video timeline |
| Database | NeonDB (serverless Postgres) | Store users, courses, slides |
| ORM | Drizzle ORM | Type-safe database queries |
| File Storage | Azure Blob Storage | Host generated MP3 audio files |
| HTTP Client | Axios | API request handling |
| Notifications | Sonner | Toast notifications |
| Date Formatting | Moment.js | Human-readable timestamps |

---

## 🏗️ High-Level System Architecture

> How every service connects together from the browser to the cloud.

```mermaid
graph TB
    subgraph Browser["🌐 Browser (Client)"]
        UI["Next.js App\n(React + Tailwind)"]
        RP["Remotion Player\n(in-browser video)"]
        IF["iframe HTML Slides"]
    end

    subgraph NextJS["⚙️ Next.js Server (API Routes)"]
        A1["/api/user POST"]
        A2["/api/course GET"]
        A3["/api/generate-course-layout\nPOST · maxDuration 60s"]
        A4["/api/generate-video-content\nPOST · maxDuration 300s"]
    end

    subgraph AI["🤖 AI Services"]
        GPT["Azure OpenAI GPT-4o"]
        TTS["Fonada AI TTS API"]
        WH["Groq Whisper Large v3"]
    end

    subgraph Storage["🗄️ Storage Layer"]
        DB["NeonDB Serverless Postgres\n(Drizzle ORM)"]
        BLOB["Azure Blob Storage\n(MP3 audio files)"]
    end

    subgraph Auth["🔐 Auth & Billing"]
        CLERK["Clerk\n(Auth + Monthly Plan)"]
    end

    UI -->|"POST topic + type"| A3
    UI -->|"POST chapter"| A4
    UI -->|"GET courses"| A2
    UI -->|"POST on mount"| A1

    A3 -->|"system prompt + topic"| GPT
    A4 -->|"system prompt + chapter"| GPT
    A4 -->|"narration text"| TTS
    TTS -->|"MP3 buffer"| A4
    A4 -->|"upload MP3"| BLOB
    A4 -->|"audio URL"| WH
    WH -->|"caption text"| A4

    A1 <-->|"upsert user"| DB
    A2 <-->|"fetch courses + slides"| DB
    A3 -->|"INSERT course"| DB
    A4 -->|"INSERT slides"| DB

    A3 <-->|"check plan / user count"| CLERK
    UI <-->|"sign-in / sign-up"| CLERK

    RP -->|"renders"| IF
    DB -->|"audioFileUrl"| RP
    BLOB -->|"serves MP3"| RP
```

---

## 🔄 Complete End-to-End Working Flow

> The full journey from "user opens the site" to "video plays in browser".

```mermaid
flowchart TD
    START([User Opens VidCourse]) --> CLERK_WRAP

    subgraph INIT["App Initialization"]
        CLERK_WRAP["ClerkProvider wraps app\nlayout.tsx"]
        PROVIDER["Provider.tsx mounts\nPOST /api/user"]
        CHECK_USER{User in DB?}
        INSERT_USER["INSERT usersTable\nname · email · credits=2"]
        RETURN_USER["Return existing user"]
        CTX["Set UserDetailContext"]
    end

    CLERK_WRAP --> PROVIDER
    PROVIDER --> CHECK_USER
    CHECK_USER -->|No| INSERT_USER --> CTX
    CHECK_USER -->|Yes| RETURN_USER --> CTX
    CTX --> HOME

    subgraph HOME["Home Page /"]
        HERO["Hero Component\nTextarea + Course Type Select"]
        SUGGESTIONS["Quick Suggestion Chips\nReact · Python · HTML · etc."]
        COURSELIST["CourseList Component\nGET /api/course → renders cards"]
    end

    HOME --> USER_INPUT

    subgraph GENERATE["Course Generation"]
        USER_INPUT["User types topic\nSelects: Full Course / Quick Explain"]
        CLICK_SEND["Click Send Button"]
        AUTH_CHECK{Signed in?}
        SIGN_IN_MODAL["Clerk SignInButton modal"]
        PLAN_CHECK{isPaidUser?}
        COUNT_CHECK{courses >= 2?}
        MAX_LIMIT["Toast: Max limit reached\nRedirect to /pricing"]
        CALL_GPT["POST /api/generate-course-layout\nAzure OpenAI GPT-4o"]
        GPT_RESP["GPT-4o returns JSON\ncourseName · level · chapters"]
        SAVE_COURSE["INSERT coursesTable\ncourseId · courseName · userId"]
        NAVIGATE["Navigate to /course/courseId"]
    end

    USER_INPUT --> CLICK_SEND
    CLICK_SEND --> AUTH_CHECK
    AUTH_CHECK -->|Not signed in| SIGN_IN_MODAL
    AUTH_CHECK -->|Signed in| PLAN_CHECK
    PLAN_CHECK -->|Free user| COUNT_CHECK
    COUNT_CHECK -->|>= 2 courses| MAX_LIMIT
    COUNT_CHECK -->|< 2 courses| CALL_GPT
    PLAN_CHECK -->|Paid user| CALL_GPT
    CALL_GPT --> GPT_RESP --> SAVE_COURSE --> NAVIGATE
    NAVIGATE --> COURSE_PAGE

    subgraph COURSE_PAGE["Course Page /course/courseId"]
        FETCH_COURSE["GET /api/course?courseId=xxx\nFetch course + all slides"]
        SLIDES_CHECK{Slides exist?}
        SHOW_PLAYER["Show Remotion Player"]
        TRIGGER_GEN["GenerateVideoContent()"]
    end

    FETCH_COURSE --> SLIDES_CHECK
    SLIDES_CHECK -->|Yes| SHOW_PLAYER
    SLIDES_CHECK -->|No| TRIGGER_GEN
    TRIGGER_GEN --> VIDEO_GEN

    subgraph VIDEO_GEN["Video Content Generation (per chapter)"]
        FOR_CHAPTER["For each chapter in courseLayout"]
        POST_VIDEO["POST /api/generate-video-content"]
        GPT_SLIDES["GPT-4o returns slides array"]
        FOR_SLIDE["For each slide"]
        TTS_CALL["Fonada AI TTS\nPOST narration.fullText → MP3"]
        AUDIO_BUF["Receive MP3 buffer"]
        BLOB_UPLOAD["Upload MP3 to Azure Blob Storage\nGet public URL"]
        GROQ_CALL["Groq Whisper Large v3\nTranscribe audio → captions"]
        INSERT_SLIDE["INSERT chapterContentSlides\nhtml · narration · audioFileUrl · caption"]
        WAIT["Wait 3s between chapters\nDB rate limit protection"]
        REFRESH["Refresh course detail"]
    end

    FOR_CHAPTER --> POST_VIDEO --> GPT_SLIDES --> FOR_SLIDE
    FOR_SLIDE --> TTS_CALL --> AUDIO_BUF --> BLOB_UPLOAD --> GROQ_CALL --> INSERT_SLIDE
    INSERT_SLIDE -->|next slide| FOR_SLIDE
    INSERT_SLIDE -->|all slides done| WAIT
    WAIT -->|next chapter| FOR_CHAPTER
    WAIT -->|all chapters done| REFRESH --> SHOW_PLAYER
    SHOW_PLAYER --> PLAYBACK

    subgraph PLAYBACK["Remotion Video Playback"]
        MEASURE["getAudioData per slide\nMeasure real audio duration"]
        DUR_MAP["Build durationsBySlideId map\nslideId → frames"]
        COMPOSITION["CourseComposition\nBuild timeline array"]
        SEQUENCE["Sequence per slide\nfrom=offset durationInFrames=dur"]
        IFRAME["SlideIFrameWithReveal\niframe srcDoc HTML + REVEAL_SCRIPT"]
        AUDIO_TAG["Audio src=audioFileUrl"]
        REVEAL["postMessage REVEAL events\nr1 → r2 → r3 at timed intervals"]
        CSS_ANIM[".reveal.is-on\nopacity + translateY transition"]
    end

    MEASURE --> DUR_MAP --> COMPOSITION --> SEQUENCE
    SEQUENCE --> IFRAME
    SEQUENCE --> AUDIO_TAG
    IFRAME --> REVEAL --> CSS_ANIM
```

---

## 🔐 Authentication & Billing Flow

```mermaid
flowchart LR
    subgraph Clerk["Clerk Auth + Billing"]
        SIGN["Sign In / Sign Up\nmodal or dedicated page"]
        SESSION["Active Session\nuseUser() hook"]
        PLAN["Plan Check\nauth().has({ plan: monthly })"]
        PRICING["Pricing Page /pricing\nPricingTable component"]
    end

    subgraph App["App Logic"]
        FREE["Free User\nmax 2 courses"]
        PAID["Paid User\nunlimited courses"]
        LIMIT["Return max limit\nShow upgrade toast"]
    end

    SIGN --> SESSION
    SESSION -->|"on every API call"| PLAN
    PLAN -->|"isPaidUser = false"| FREE
    PLAN -->|"isPaidUser = true"| PAID
    FREE -->|"count >= 2"| LIMIT
    LIMIT --> PRICING
    PRICING -->|"subscribe"| PAID
```

---

## 🎬 Remotion Slide Reveal System

> How a static HTML slide becomes a timed animated video sequence.

```mermaid
sequenceDiagram
    participant R as Remotion Player
    participant S as Sequence per slide
    participant I as iframe HTML Slide
    participant A as Audio Tag

    R->>S: Mount at frame offset
    S->>I: Render srcDoc HTML
    S->>A: Play audioFileUrl MP3
    loop Every N frames
        S->>I: postMessage REVEAL id r1
        I->>I: .reveal.is-on opacity + translateY
    end
    S-->>R: Sequence ends next slide
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email
        int credits
    }
    COURSES {
        string courseId PK
        string courseName
        json courseLayout
        string userId FK
        timestamp createdAt
    }
    CHAPTER_CONTENT_SLIDES {
        string slideId PK
        string courseId FK
        string chapterId
        text html
        json narration
        string audioFileUrl
        text caption
        json revelData
    }

    USERS ||--o{ COURSES : "creates"
    COURSES ||--o{ CHAPTER_CONTENT_SLIDES : "has"
```

---

## 📁 Project Structure

```
├── app/
│   ├── _components/            # Header, Hero, CourseList, CourseListCard
│   ├── (auth)/                 # Clerk sign-in / sign-up pages
│   ├── (routes)/
│   │   └── course/[courseId]/  # Course detail page + Remotion player
│   │       └── _components/    # CourseInfoCard, CourseChapters, ChapterVideo
│   ├── api/
│   │   ├── user/               # POST — upsert user on mount
│   │   ├── course/             # GET — fetch course + slides
│   │   ├── generate-course-layout/   # POST — GPT-4o course structure
│   │   └── generate-video-content/   # POST — GPT-4o slides + TTS + Whisper
│   ├── context/                # UserDetailContext (global user state)
│   ├── data/                   # Constants, AI prompts, dummy data
│   ├── pricing/                # Clerk PricingTable page
│   ├── type/                   # TypeScript interfaces (Course, Slide, etc.)
│   ├── globals.css
│   ├── layout.tsx              # ClerkProvider + Provider wrapper
│   ├── page.tsx                # Home page
│   └── provider.tsx            # User init + context provider
├── config/
│   ├── db.tsx                  # NeonDB + Drizzle connection
│   ├── openai.ts               # Azure OpenAI client config
│   └── schema.tsx              # Drizzle table schemas
├── components/ui/              # shadcn/ui component library
├── hooks/                      # use-mobile hook
├── public/                     # Static assets (logo, banners)
├── .env.example                # Environment variable reference
├── drizzle.config.ts           # Drizzle ORM config
├── next.config.ts              # Next.js config
└── vercel.json                 # Vercel function timeout config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts for: Azure OpenAI, Groq, Fonada TTS, Clerk, NeonDB, Azure Blob Storage

### 1. Clone & Install

```bash
git clone https://github.com/sahutushar/ai-video-course-generator.git
cd ai-video-course-generator
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in all values in `.env`:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Azure OpenAI
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=

# Groq (Whisper)
GROQ_API_KEY=

# Fonada TTS
FONADA_API_KEY=

# NeonDB
DATABASE_URL=

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=
```

### 3. Push Database Schema

```bash
npx drizzle-kit push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repo to GitHub
2. Import into Vercel
3. Add all environment variables from `.env.example`
4. Deploy — Vercel handles the rest

> The `vercel.json` in this repo already configures extended function timeouts (60s for layout generation, 300s for video content generation).

---

## 🔑 Key Technical Decisions

| Decision | Reason |
|---|---|
| Remotion over `<video>` | Enables frame-accurate sync between audio, slides, and reveal animations entirely in the browser — no server-side rendering needed |
| Azure Blob for MP3s | Remotion's Audio component requires a public HTTPS URL; blob storage provides permanent, fast CDN-backed URLs |
| Groq Whisper over OpenAI Whisper | 10–20× faster transcription at lower cost for real-time caption generation |
| Drizzle over Prisma | Lighter weight, better TypeScript inference, and native support for NeonDB serverless driver |
| Clerk over NextAuth | Built-in billing/plan management eliminates the need for a separate payment integration |

---

## 📄 License

MIT © [Tushar Sahu](https://github.com/sahutushar)
