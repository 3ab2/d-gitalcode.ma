# Contributing to D-GITALCODE

Thank you for your interest in contributing to the D-GITALCODE platform.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Install dependencies and set up `.env` from `.env.example`.
5. Run the development server and verify your changes.

## Development Workflow

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Before submitting a pull request:

```bash
npm run lint
npm run build
```

## Code Standards

- Use **TypeScript** for all new code.
- Follow existing project structure and naming conventions.
- Keep components focused and reusable.
- Prefer server components unless client interactivity is required.
- Add translations for all user-facing strings (FR / EN / AR).
- Do not commit secrets, `.env` files, or generated build artifacts.

## Pull Request Guidelines

- Write clear, descriptive commit messages.
- Keep PRs focused on a single feature or fix.
- Include screenshots for UI changes when applicable.
- Ensure the build passes and there are no TypeScript errors.
- Update documentation if you change setup steps or environment variables.

## Reporting Issues

When opening an issue, please include:

- Steps to reproduce
- Expected vs actual behavior
- Browser / device (if UI-related)
- Relevant logs (without secrets)

## Security

Do not open public issues for security vulnerabilities. Contact the maintainer directly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
