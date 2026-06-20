# Git workflow for this website

This repository tracks the website source files.

## Common commands

Check changed files:

```bash
git status
```

Review exact changes:

```bash
git diff
```

Save a stable version:

```bash
git add .
git commit -m "Describe the change"
```

View history:

```bash
git log --oneline
```

View what changed in one commit:

```bash
git show <commit-id>
```

## What should be tracked

- `source/`
- `scripts/`
- `themes/`
- `_config.yml`
- `_config.icarus.yml`
- `package.json`
- `package-lock.json`

## What should not be tracked

- `node_modules/`
- `themes/icarus/node_modules/`
- `public/`
- `.deploy_git/`
- `db.json`
- `.DS_Store`

These files are generated or local-only files.
