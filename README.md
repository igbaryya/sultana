# Sultana — Crisis Intervention & Youth Case-Management Platform

> A volunteer-built, donation project created in the aftermath of the
> October 7th, 2023 events to help the municipality of Sderot locate, support,
> and protect at-risk and displaced teenagers.

**Built with:** React · TypeScript · Redux Toolkit · Firebase · Material UI

## What is Sultana?

**Sultana** is a crisis intervention and youth case-management platform
developed by a small team of Amdocs engineers to help the municipality of
Sderot support at-risk and displaced teenagers during a national emergency.

When the war broke out, thousands of youths from Sderot and the surrounding
communities were evacuated and scattered across Israel — many separated from
their families and in real distress. Information about them was fragmented
across spreadsheets, phone calls, and field reports. Sultana was built to bring
all of that into **one place**, so the people responsible for these teenagers
could actually find them, check on them, and help.

The system centralizes information about thousands of youths and enables social
workers, youth counselors, and education officials to track cases, document
interactions, assess risk levels, and coordinate interventions.

## Who it's for

The platform serves three main groups of people:

- **Youth counselors** — manage and document meetings with teenagers, track
  progress over time, and report concerns from the field.
- **Program managers and supervisors** — gain visibility into all active cases,
  monitor risk indicators, and prioritize where help is needed most.
- **Municipal education leadership** — access aggregated analytics, identify
  trends, allocate resources, and monitor the overall wellbeing of the city's
  youth.

## Why it matters

One of the key capabilities of the system is turning scattered field reports
into actionable insight. By consolidating data from many sources and analyzing
each case, the platform helps surface high-risk situations early — enabling
faster, professional intervention.

What started as a rapid-response tool for locating displaced youth grew into a
full case-management and analytics platform. According to the Sderot Education
Department, the system helped identify several critical cases in time —
including teenagers facing severe mental-health challenges — allowing
professionals to step in before situations escalated.

The first working version was designed, developed, tested, and deployed
**within 72 hours** by a team of four developers working through the weekend —
a demonstration of how technology can be rapidly mobilized during a national
emergency to create real, measurable social impact.

You can read more about the story in this
[Calcalist article (Hebrew)](https://www.calcalist.co.il/article/syaz5yirr).

## A note on privacy

This repository contains **only the application source code**. It intentionally
does **not** include any real youth records, personal data, database exports, or
spreadsheets. All such information lived in a protected, access-controlled
environment and has been kept out of this codebase. Any configuration needed to
run the app (such as Firebase credentials) is supplied through a local,
git-ignored `.env` file — never committed to source control.

## Running the project (for developers)

This is a [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
application using [Redux Toolkit](https://redux-toolkit.js.org/) and
[Firebase](https://firebase.google.com/).

1. Install dependencies:

```bash
npm install
```

2. Create your environment file from the template and fill in your own
   Firebase project values:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm start
```

4. Build for production:

```bash
npm run build
```
