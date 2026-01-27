# Contributing to Ark.Alliance.React.Component.UI

Thank you for your interest in contributing to **Ark.Alliance.React.Component.UI**. We welcome contributions from the community to help make this the best Enterprise-Grade React Component Library.

Please read this document carefully before making changes.

## 🏛️ Governance & Branch Protection

To ensure code quality and stability, we enforce strict protection rules on our primary branches.

### Branch Strategy

- **`main` / `master`**: Production-ready code. Deploys to NPM and Showcases. Protected.
- **`Develop`**: Integration branch for next release. Protected.
- **`feature/*`**: Feature branches. PR into `Develop`.
- **`fix/*`**: Bug fix branches. PR into `Develop` (or `master` for hotfixes).

### Protection Rules

The following rules are enforced on both `main` and `Develop` branches:

1.  **Require Pull Request Reviews**:
    - **Develop**: All Pull Requests must be reviewed.
    - **Owner Approval**: PRs created by contributors **MUST** be approved by the repository owner (`ArmandRicheletKleinberg`) before merging.
    - **Dismiss Stale Reviews**: New commits dismiss previous approvals.

2.  **Status Checks Passed**:
    - **Node.js CI**: Builds and Tests must pass (`npm run build`, `npm test`).
    - **License Check**: All new files must comply with project license.

3.  **No Direct Commits**: Contributors cannot push directly to protected branches.

## 🛠️ Development Process

1.  **Fork & Clone**: Fork the repo and clone locally.
2.  **Branch**: Create a branch from `Develop` (`git checkout -b feature/my-feature`).
3.  **Install**: Run `npm install` in the library directory.
4.  **Code**: Implement changes following [Architecture Guidelines](./README.md#architecture-overview).
5.  **Test**: Ensure all tests pass (`npm test`). Add new tests for new features.
6.  **Commit**: Use conventional commits (e.g., `feat(button): add neon variant`).
7.  **Push**: Push to your fork.
8.  **Pull Request**: Open a PR against `Develop`.

## 📦 Publishing (Maintainers Only)

Publishing to NPM is automated via GitHub Actions when a new Release is created.

1.  Update version in `package.json`.
2.  Draft a new Release in GitHub.
3.  Tag with `vX.Y.Z`.
4.  The `NPM Publish` workflow will trigger automatically.

## 🎨 Coding Standards

- **React**: Functional components, Hooks, Standard MVVM pattern.
- **Styling**: CSS Modules / Tailwind. Use CSS variables for theming.
- **TypeScript**: Strict mode enabled. No `any` types.
- **Validation**: Zod schemas for all models.

## 🐛 Reporting Issues

Please use the Issue Templates to report bugs or request features. Provide reproduction steps and environment details.

---

**Happy Coding!** 🚀
