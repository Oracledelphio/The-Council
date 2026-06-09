# Contributing to Council AI

First off, thank you for considering contributing to Council AI! It's people like you that make Council AI such a great decision intelligence platform.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful, inclusive, and professional in all interactions.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.
- **Ensure the bug was not already reported** by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.
- Open a new issue with the `enhancement` label.
- Provide a clear and detailed explanation of the feature.
- Explain why this enhancement would be useful to most Council AI users.

### Pull Requests
- Fill in the required template.
- Do not include issue numbers in the PR title.
- Follow the established coding conventions:
  - React/Next.js: Functional components, Hooks, Tailwind CSS.
  - Python/FastAPI: Type hints, async functions, PEP 8 compliance.
- End files with a newline.
- Ensure that your code passes all existing tests and add tests for any new features.

## Development Setup

1. Fork the repo and create your branch from `main`.
2. Follow the `README.md` instructions to set up the Python backend and Next.js frontend.
3. Make sure to format your code before submitting:
   - Frontend: `npm run lint`
   - Backend: Use `black` and `flake8`
4. Test your changes manually by running the full deliberation lifecycle to ensure no LLM streaming bugs were introduced.

Thank you for contributing!
