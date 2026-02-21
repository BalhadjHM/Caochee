# Caochee LMS Demo

An AI-powered learning platform where users can create subject-specific companions, start real-time voice sessions, and track learning progress.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How to Use](#how-to-use)
- [Data Model](#data-model)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

Caochee is built with Next.js App Router and focuses on guided, voice-based learning. Users can:

- Browse and search companions by subject/topic
- Create personalized companions (voice, style, duration)
- Join real-time conversation sessions via Vapi
- Review progress in a personal dashboard
- Upgrade plans through Clerk billing UI

## Features

- **Authentication & protected routes** with Clerk
- **Companion library** with subject filter + search
- **Companion builder** with validation (React Hook Form + Zod)
- **Voice sessions** with mute control and live transcript updates
- **Session history tracking** in Supabase
- **My Journey dashboard** with completed sessions and created companions
- **Subscription page** using Clerk `<PricingTable />`

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, shadcn/ui, Radix UI
- **Auth & Billing:** Clerk
- **Database:** Supabase
- **Voice AI:** Vapi Web SDK
- **Forms & Validation:** React Hook Form + Zod


## Getting Started

### 1) Prerequisites

- Node.js 20+
- npm 10+
- A Clerk app
- A Supabase project
- A Vapi account/token

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env.local` file in the project root.

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=

# Vapi
NEXT_PUBLIC_VAPI_WEB_TOKEN=
```

### 4) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## How to Use

1. **Sign in** from `/sign-in`.
2. **Browse companions** on `/companions` and filter by subject or topic.
3. **Create a companion** on `/companions/new` with name, subject, topic, voice, style, and duration.
4. **Start a session** from a companion page (`/companions/[id]`) and use call/mic controls.
5. **Track progress** in `/my-journey` (recent sessions + your companions).
6. **Manage plan** at `/subscription`.

## Data Model

This app expects at least the following Supabase tables:

### `companions`

- `id` (uuid or text primary key)
- `author` (Clerk `userId`)
- `name`
- `subject`
- `topic`
- `voice`
- `style`
- `duration`

### `session_history`

- `id`
- `user_id` (Clerk `userId`)
- `companion_id` (FK/reference to companion)
- `created_at`

## Available Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Deployment

Recommended: deploy on Vercel.

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add all environment variables from this README.
4. Deploy.

## Troubleshooting

- **Auth redirect loops:** verify Clerk redirect URLs and middleware matcher configuration.
- **No companions shown:** verify Supabase credentials and required tables/columns.
- **Voice call not starting:** check browser microphone permission and `NEXT_PUBLIC_VAPI_WEB_TOKEN`.
- **Session history missing:** confirm insert permissions/row-level security for `session_history`.
