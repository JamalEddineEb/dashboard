
# Roadmap & Cool Features

This file contains prioritized ideas to improve the Dashboard project. Each entry includes a short rationale and implementation notes.

1) Authentication & User Accounts (High)
- Why: Personalize dashboards, save preferences, and secure user data.
- Notes: Add Spring Security (backend) with JWT; frontend login page and protected routes; store preferences in a simple DB (H2 for dev / Postgres for prod).

2) Docker Compose Full-Stack Dev Setup (High)
- Why: Easy reproducible local environment for demos and screenshots.
- Notes: Add `docker-compose.yml` that runs the Java backend, the FastAPI service (or build small image), and a static-serving container for the frontend (or run dev mode). Provide `.env.example`.

3) Seed Data & Demo Mode (High)
- Why: Allow demos without external API keys (use cached/sample responses).
- Notes: Add `--demo` flag to `financial_insights` to load JSON samples; add sample dataset and sample user in backend.

4) Caching & Rate Limit Handling (Medium)
- Why: Avoid hitting third-party limits and speed up UI responses.
- Notes: Add in-memory caching (Redis or local TTL cache) for endpoints like news and overview. Implement exponential backoff / fallback.

5) Improve Market Sentiment (Medium)
- Why: Richer sentiment analysis across multiple sources (Twitter / news / Reddit) improves signals.
- Notes: Add optional lightweight on-device models (distilBERT) or use paid sentiment APIs. Add batching and async processing for Reddit/Twitter scraping.

6) Saved Dashboards & Sharing (Medium)
- Why: Users can create named dashboards and share URLs.
- Notes: Add backend endpoints to persist dashboard layouts and share tokens/links.

7) UI/UX Polish (Medium)
- Why: Improve look and feel and mobile responsiveness.
- Notes: Add dark mode toggle, mobile layout breakpoints, keyboard shortcuts, and better loading states.

8) Export/Reports (Low)
- Why: Allow CSV/PNG/PDF export for charts and reports.
- Notes: Add an export button in the UI; use client-side chart to image libs or server-side rendering.

9) Monitoring & CI (Low)
- Why: Maintain reliability for contributors and demos.
- Notes: Add GitHub Actions to run `npm build` and `mvn -q -DskipTests package` on PRs; add simple health checks for services.

10) Accessibility & Localization (Low)
- Why: Broaden audience and improve UX compliance.
- Notes: Add aria attributes, keyboard navigation, and i18n support for UI strings.

11) Lightweight Mobile App / PWA (Stretch)
- Why: Allow quick access on mobile and offline support.
- Notes: Convert frontend to PWA with caching strategies and add an install prompt.

12) Demo screenshots & recorded walkthrough (High)
- Why: Useful for README, demos, and onboarding new contributors.
- Notes: Add a `docs/screenshots/` directory and a short `docs/demo.md` describing the flows. Use the Docker Compose setup to run reproducible demos to screenshot.

---

If you'd like, I can implement any of the above starting with either the `README` improvements (done) or adding the Docker Compose + `.env.example` for an easy demo. Which feature should I prioritize next?
