# Video Generator

AI-powered video generation platform built with Next.js, TypeScript, and Supabase.

## Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd video-generator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Preview the build

### Quality Assurance
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Project Structure

See [Architecture Documentation](./.claude/docs/ARCHITECTURE.md) for detailed information about the project structure and design patterns.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Jest + React Testing Library

## Development Guidelines

### Code Style
- Use TypeScript strictly (no `any` type)
- Follow naming conventions:
  - Components: `PascalCase`
  - Functions/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files/Folders: `kebab-case`

### Component Guidelines
- Max 500 lines per file
- Max 50 lines per function
- One responsibility per component
- Always define prop interfaces

### Testing
- Write tests for new features
- Target 80%+ code coverage
- Use AAA pattern (Arrange, Act, Assert)

## Contributing

1. Create a feature branch: `git checkout -b feature/TICKET-123-description`
2. Make your changes following the guidelines
3. Run tests: `npm run test`
4. Run linting: `npm run lint:fix`
5. Commit with conventional commits: `git commit -m "feat(scope): description"`
6. Push to your branch
7. Create a Pull Request

## Security

- Never commit `.env.local` files
- Validate all user inputs
- Use parameterized queries for databases
- Keep dependencies updated

## Support

For issues and questions:
1. Check existing documentation in `.claude/docs/`
2. Review the [Architecture](./.claude/docs/ARCHITECTURE.md)
3. Consult [CLAUDE.md](./CLAUDE.md) for development principles

## License

MIT
