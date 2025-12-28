# Contributing to Ark Alliance React UI

Thank you for your interest in contributing to the Ark Alliance React UI library!

## Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ArmandRicheletKleinberg/Ark.Alliance.Trading.Bot-React.git
cd Ark.Alliance.Trading.Bot-React/Ark.Alliance.React.Component.UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Development Workflow

### Running Tests

Navigate to the test project:
```bash
cd ../Ark.Alliance.React.Component.UI.Tests
npm install
npm test
```

### Building the Library

```bash
npm run build:lib
```

### Linting

```bash
npm run lint
```

## Code Standards

- **TypeScript**: All code must be written in TypeScript
- **MVVM Pattern**: Components follow Model-View-ViewModel architecture
- **Zod Validation**: All models use Zod schemas
- **Testing**: 100% test coverage required for new components
- **Documentation**: All exported components must be documented

## Component Structure

Each component should follow this structure:

```
ComponentName/
├── ComponentName.tsx          # View
├── ComponentName.model.ts     # Model (Zod schema)
├── ComponentName.viewmodel.ts # ViewModel
├── ComponentName.module.scss  # Styles
└── index.ts                   # Exports
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests to maintain 100% coverage
5. Run linter and fix any issues
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### PR Requirements

- [ ] All tests pass
- [ ] Linter passes with no errors
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive

## Component Guidelines

### Model (Zod Schema)
- Define all component properties
- Include default values
- Use proper TypeScript types
- Export both schema and inferred type

### ViewModel
- Use `useBaseViewModel` hook
- Implement business logic
- Handle state management
- Export custom hook

### View (Component)
- Accept model as props
- Use ViewModel hook
- Render UI based on model
- Forward refs when appropriate

## Testing Guidelines

- Use React Testing Library
- Test real component behavior
- Mock user interactions
- Validate model schemas
- Test all visual variants
- Test accessibility

## Questions?

Feel free to open an issue for any questions or concerns.

---

**Author**: Armand Richelet-Kleinberg  
**Organization**: M2H.IO - Ark Alliance Eco System  
**License**: MIT
