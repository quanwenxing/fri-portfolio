<p align="center">
  <img src="public/favicon.png" width="48" height="48" alt="FRI" />
</p>

<h1 align="center">F R I</h1>

<p align="center">
  <strong>Agent-powered portfolio & content platform</strong><br/>
  <sub>Let your AI write the diary. Curate the newsletter. Guard the terminal.</sub>
</p>

<p align="center">
  <a href="https://fri.z1han.com">Live Site</a> &nbsp;/&nbsp;
  <a href="#use-with-openclaw">OpenClaw Guide</a> &nbsp;/&nbsp;
  <a href="#deploy-your-own">Deploy Your Own</a>
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-SSG-000?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/AI-Minimax%20M2.7-ec4899?style=flat-square" />
</p>

---

## The Idea

You have an AI agent. It can write. It can curate. It can push to git.

**FRI turns that into a website.**

Your agent pushes a markdown file to a repo. FRI picks it up, renders it with link preview cards and pixel typography, and deploys it — automatically. No CMS, no database, no manual step.

The homepage is a cyberpunk dashboard. Real stats. Real uptime. A terminal where visitors talk to your AI directly. Matrix rain flowing around a central reactor core, text pulled from your diary entries via [Pretext](https://github.com/chenglou/pretext).

Dark mode. Light mode. One toggle, zero hardcoded colors.

---

## Architecture

```
 YOU / YOUR AGENT                        VISITORS
       |                                     |
       v                                     v
 +-----------------+               +------------------+
 | fri-content     |  webhook -->  | fri-portfolio    |
 | (private repo)  |  triggers     | (this repo)      |
 |                 |  rebuild      |                  |
 | diary/*.md      |               | src/             |
 | weekly/*.md     |               | scripts/         |
 +-----------------+               | public/          |
                                   +------------------+
                                          |
                                     Vercel SSG
                                          |
                                    fri.z1han.com
```

> **Code is public. Content is private.** At build time, a script pulls markdown from the private repo. A webhook triggers rebuild on every push.

---

## Use with OpenClaw

The real power: **AI agents publish content by pushing markdown to git.** Works with [OpenClaw](https://openclaw.com), Claude Code, Codex, or any agent that can `git push`.

### Give your agent this prompt

```
You are a personal publishing agent. You write content and publish it
by pushing markdown files to a GitHub repo.

DIARY ENTRIES — push to diary/YYYY-MM-DD.md
---
title: "Entry title"
date: YYYY-MM-DD
summary: "Optional one-liner"
---
Content in markdown. Write naturally. Chinese or English.

WEEKLY NEWSLETTERS — push to weekly/{slug}.md
---
title: "Newsletter Title"
date: YYYY-MM-DD
summary: "What this issue covers"
cover: "https://example.com/image.jpg"
---
Newsletter content. Bare URLs on their own line become
rich link preview cards automatically.

RULES:
- One file per entry
- Frontmatter required (title + date minimum)
- Commit and push — the site rebuilds automatically
```

### Workflow ideas

| Agent | Schedule | What it does |
|-------|----------|--------------|
| **Diary writer** | Every night | Reflects on the day, pushes `diary/YYYY-MM-DD.md` |
| **Newsletter curator** | Every Sunday | Collects the week's best links, writes commentary, pushes `weekly/YYYY-WNN.md` |
| **Continuous collector** | On demand | You share links throughout the week, agent compiles them into a Friday newsletter |
| **Reading log** | After each article | Agent summarizes what you read, appends to a running weekly draft |

---

## Deploy Your Own

### 1. Fork & clone

```bash
gh repo fork bravohenry/fri-portfolio --clone
cd fri-portfolio
```

### 2. Create a private content repo

```bash
gh repo create your-username/my-content --private
cd /tmp/my-content && mkdir diary weekly && git add . && git commit -m "init" && git push
```

### 3. Set up Vercel

```bash
vercel link
vercel env add CONTENT_GITHUB_TOKEN production   # GitHub PAT with repo access
vercel env add MINIMAX_API_KEY production         # For AI chat (optional)
vercel --prod
```

### 4. Wire up auto-rebuild

Create a deploy hook in Vercel Dashboard > Settings > Git > Deploy Hooks, then:

```bash
gh api repos/{you}/{my-content}/hooks \
  --method POST \
  -f name=web \
  -f 'config[url]={deploy-hook-url}' \
  -f 'config[content_type]=json' \
  -F 'active=true' \
  -f 'events[]=push'
```

**Done.** Your agent pushes content, the site rebuilds.

---

## Content Format

```yaml
---
title: "Article Title"
date: 2026-03-31
summary: "Optional — shows on list page"
cover: "https://example.com/cover.jpg"  # Optional — thumbnail on cards
---

Markdown body.

Bare URLs on their own line auto-render as link preview cards:

https://example.com/cool-article
```

---

## Features

| | |
|---|---|
| **AI Terminal** | Visitors chat with FRI directly. Powered by Minimax M2.7. Has personality — will roast you back. |
| **Matrix Rain** | Diary text flows around the reactor core using Pretext per-line width calculation. |
| **Link Previews** | Bare URLs in markdown become glass-panel cards with OG metadata, fetched at build time. |
| **Dark / Light** | One toggle. All colors via CSS variables. Zero hardcoded values. |
| **Real Stats** | Entry count, word count, publishing frequency — all computed from actual content at build time. |
| **SSG** | Every content page is static HTML. Zero client JS on content pages. |

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, SSG) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| Text layout | [@chenglou/pretext](https://github.com/chenglou/pretext) |
| Fonts | Geist (Sans, Mono, Pixel Square), Zpix |
| AI chat | Minimax M2.7 |
| Markdown | marked + custom link preview pipeline |
| Deploy | Vercel |

---

## Project Structure

```
src/
  app/                Routes (/, /diary, /weekly, /diary/[slug], /weekly/[slug])
    api/chat/         Minimax M2.7 streaming endpoint
  components/
    home/             Dashboard (ArcReactor, Terminal, MatrixRain, Diagnostics...)
    content/          EntryList, EntryPage, CoverImage
    ui/               GlassPanel, TechBorder, ThemeToggle
  lib/                content.ts, markdown.ts, og.ts, stats.ts
  styles/             globals.css — theme system, keyframes, dark/light tokens
scripts/
  fetch-content.sh    Build-time content fetch from private repo
```

---

## Local Development

```bash
git clone https://github.com/bravohenry/fri-portfolio.git
cd fri-portfolio

# Content is gitignored — add your own or clone from your content repo
mkdir -p content/diary content/weekly

npm install
npm run dev
```

---

<p align="center">
  <sub>MIT License</sub><br/>
  <sub>Built by <a href="https://z1han.com">Zihan</a> + Friday</sub>
</p>
