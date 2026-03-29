# My Portfolio

Personal portfolio website for my work as an **Interactive Media Developer**.

## About

This project showcases who I am, what I build, and how to contact me.  
The site is built as a modern, fast, and responsive web experience.

## Tech Stack

- Next.js
- React
- TypeScript
- CSS

## Pages

- Home
- About
- Projects
- Contact

## Contact Form Email Setup

The contact form sends submissions using Resend from the API route at app/api/contact/route.ts.

Create a local env file:

- Copy .env.example to .env.local

Set the required values:

- RESEND_API_KEY: API key from your Resend account
- CONTACT_TO_EMAIL: The email address where contact requests should arrive
- CONTACT_FROM_EMAIL: Sender address (use a verified domain in production)

Notes:

- onboarding@resend.dev works for quick testing, but for production you should use your own verified sending domain.
- If env vars are missing, the API returns a configuration error instead of silently dropping messages.
