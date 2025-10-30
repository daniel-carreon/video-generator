# Claude Code Project Index

Welcome to the project documentation center!

## 📋 Project Setup Documentation

Start here to understand the project infrastructure:

### Quick References
1. **[INFRASTRUCTURE_SUMMARY.md](./INFRASTRUCTURE_SUMMARY.md)** - Overview of everything that was set up
2. **[docs/QUICK_START.md](./docs/QUICK_START.md)** - Quick start guide for common tasks

### Detailed Guides
1. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Complete architecture explanation
2. **[docs/FEATURE_TEMPLATE.md](./docs/FEATURE_TEMPLATE.md)** - Step-by-step feature creation guide
3. **[docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)** - Git branching and commit standards

---

## 🤖 AI Agent Commands

Custom slash commands for development workflows:

- **[commands/bucle-agentico.md](./commands/bucle-agentico.md)** - Agentic loop for feature development
- **[commands/explorador.md](./commands/explorador.md)** - Explore codebase patterns
- **[commands/ejecutar-prp.md](./commands/ejecutar-prp.md)** - Execute pull request workflow
- **[commands/generar-prp.md](./commands/generar-prp.md)** - Generate pull requests
- **[commands/arreglar-issue-github.md](./commands/arreglar-issue-github.md)** - Fix GitHub issues

---

## 🎯 Specialized Agents

Agents that automate specific tasks:

- **[agents/gestor-documentacion.md](./agents/gestor-documentacion.md)** - Documentation management
- **[agents/validacion-calidad.md](./agents/validacion-calidad.md)** - Quality validation and testing

---

## 🛠️ Skills & Tools

Specialized skills for building features:

### AI & ML
- **[skills/agent-builder-vercel-sdk/SKILL.md](./skills/agent-builder-vercel-sdk/SKILL.md)** - Build AI agents with Vercel SDK
- **[skills/agent-builder-pydantic-ai/SKILL.md](./skills/agent-builder-pydantic-ai/SKILL.md)** - Build AI agents with Pydantic
- **[skills/nano-banana-image-combine/SKILL.md](./skills/nano-banana-image-combine/SKILL.md)** - Image combination with AI
- **[skills/replicate-integration/SKILL.md](./skills/replicate-integration/SKILL.md)** - Replicate API integration

### Database & Auth
- **[skills/supabase-auth-memory/SKILL.md](./skills/supabase-auth-memory/SKILL.md)** - Supabase authentication and memory

### Web Development
- **[skills/nextjs-16-complete-guide/SKILL.md](./skills/nextjs-16-complete-guide/SKILL.md)** - Next.js 16 complete guide
- **[skills/skill-creator/SKILL.md](./skills/skill-creator/SKILL.md)** - Create custom skills

---

## 📚 Core Project Files

### Root Configuration
- **[../CLAUDE.md](../CLAUDE.md)** - Development principles and context
- **[../README.md](../README.md)** - Project overview
- **[../package.json](../package.json)** - Dependencies and scripts
- **[../tsconfig.json](../tsconfig.json)** - TypeScript configuration
- **[../next.config.js](../next.config.js)** - Next.js configuration
- **[../tailwind.config.ts](../tailwind.config.ts)** - Tailwind CSS config

### Source Code Structure
```
../src/
├── app/              # Next.js App Router (pages & routes)
├── features/         # Feature modules (your code goes here)
└── shared/           # Reusable utilities & components
```

---

## 🚀 Getting Started

### For New Features
1. Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. Follow [docs/FEATURE_TEMPLATE.md](./docs/FEATURE_TEMPLATE.md)
3. Use provided shell commands in [docs/QUICK_START.md](./docs/QUICK_START.md)

### For Development
1. Check [docs/QUICK_START.md](./docs/QUICK_START.md) for commands
2. Follow [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) for branching
3. Review [../CLAUDE.md](../CLAUDE.md) for coding standards

### For AI-Assisted Development
1. Use `/bucle-agentico` to start feature loops
2. Use `/explorador` to understand codebase
3. Use agents for quality validation and docs

---

## 📊 Project Stats

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State**: Zustand
- **Testing**: Jest + React Testing Library

---

## ✅ Quick Checklist

After setup is complete:

- [ ] Read INFRASTRUCTURE_SUMMARY.md
- [ ] Review ARCHITECTURE.md
- [ ] Understand project structure
- [ ] Run `npm install`
- [ ] Create `.env.local` from `.env.example`
- [ ] Run `npm run dev` to start development
- [ ] Review CLAUDE.md for coding standards

---

## 🎯 Next Actions

Choose what you want to do:

1. **Start a new feature** → Read [docs/FEATURE_TEMPLATE.md](./docs/FEATURE_TEMPLATE.md)
2. **Understand the architecture** → Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. **Need a quick command reference** → Check [docs/QUICK_START.md](./docs/QUICK_START.md)
4. **Git and branching questions** → See [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)
5. **Create a custom skill** → See [skills/skill-creator/SKILL.md](./skills/skill-creator/SKILL.md)

---

**Last Updated**: Oct 28, 2025
**Status**: ✅ Infrastructure Ready
