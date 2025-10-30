# Git Workflow Guide

## Branch Strategy

This project follows a simplified Git workflow:

### Branch Types

- **main**: Production-ready code (stable, tested)
- **develop**: Integration branch (pre-release)
- **feature/**: Feature development branches
- **bugfix/**: Bug fix branches
- **hotfix/**: Emergency production fixes

### Branch Naming Convention

```
feature/TICKET-123-description
bugfix/TICKET-456-description
hotfix/TICKET-789-description
```

## Workflow Steps

### 1. Creating a New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/VIDEO-001-video-upload
```

### 2. Development

```bash
# Make changes to your code
# Test locally
npm run test
npm run lint:fix
npm run typecheck

# Stage changes
git add .

# Commit with conventional commits
git commit -m "feat(video-upload): add drag-and-drop upload"
```

### 3. Pushing Changes

```bash
# Push to remote
git push origin feature/VIDEO-001-video-upload
```

### 4. Creating a Pull Request

Go to GitHub and create a PR from your feature branch to `develop`.

**PR Checklist:**
- [ ] Tests pass locally
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Updated relevant documentation
- [ ] Followed code style guidelines

### 5. Code Review

Wait for code review and address any feedback:

```bash
# Make requested changes
git add .
git commit -m "refactor(video-upload): improve error handling"
git push origin feature/VIDEO-001-video-upload
```

### 6. Merge

After approval, merge the PR using "Squash and merge" to keep history clean.

### 7. Cleanup

```bash
# Delete local branch
git branch -d feature/VIDEO-001-video-upload

# Delete remote branch (GitHub automatically does this after merge)
git push origin --delete feature/VIDEO-001-video-upload
```

## Commit Convention

This project uses **Conventional Commits** format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Test additions or modifications
- **chore**: Build process, dependencies, etc.

### Examples

```bash
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(video-editor): handle null canvas reference"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(store): simplify state management"
git commit -m "test(components): add Button component tests"
```

## Common Scenarios

### Updating Your Branch with Latest Changes

```bash
git fetch origin
git rebase origin/develop
# or
git merge origin/develop
```

### Resolving Conflicts

```bash
# Check which files have conflicts
git status

# Resolve conflicts in your editor
# Then:
git add .
git commit -m "merge: resolve conflicts with develop"
git push origin feature/VIDEO-001-video-upload
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific file
git checkout HEAD -- src/path/to/file.ts
```

## Best Practices

1. **Keep commits small and focused**: Each commit should represent one logical change
2. **Use descriptive messages**: Make it clear what and why
3. **Don't commit incomplete work**: Tests should pass before pushing
4. **Review your own code first**: Check diffs before creating PR
5. **Keep branches short-lived**: Merge within 1-2 weeks
6. **Don't rewrite public history**: Avoid force push to shared branches
7. **Use branches for isolation**: Each feature in its own branch

## Useful Git Commands

```bash
# View commit history
git log --oneline -10

# View changes not yet staged
git diff

# View staged changes
git diff --cached

# View branch info
git branch -v

# Stash current changes
git stash
git stash pop

# Search commits
git log --grep="keyword"

# View who changed what
git blame src/path/to/file.ts
```

## Quick Reference

```bash
# Start new feature
git checkout develop && git pull && git checkout -b feature/TICKET-123-description

# Make changes and commit
git add .
git commit -m "type(scope): description"

# Push to remote
git push origin feature/TICKET-123-description

# Create PR on GitHub

# After approval, branch is automatically merged
git checkout develop && git pull
```

---

For more information about our code standards, see [ARCHITECTURE.md](./ARCHITECTURE.md)
