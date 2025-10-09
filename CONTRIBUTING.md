# Contributing to FHEVM Universal SDK

Thank you for your interest in contributing to the FHEVM Universal SDK! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive criticism
- Accept feedback gracefully
- Put the community first

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic understanding of TypeScript
- Familiarity with FHE concepts

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd fhevm-universal-sdk

# Install dependencies
npm run install:all

# Build the SDK
npm run build:sdk

# Run tests
npm test
```

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/fhevm-universal-sdk.git
cd fhevm-universal-sdk

# Add upstream remote
git remote add upstream https://github.com/original/fhevm-universal-sdk.git
```

### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bug fix branch
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new encryption method"
```

#### Commit Message Format

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(client): add batch encryption support
fix(hooks): resolve memory leak in useFhevm
docs(readme): update installation instructions
test(encryption): add edge case tests
```

### 5. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub and create a Pull Request
- Provide clear description of changes
- Reference any related issues
- Wait for review and address feedback

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type when possible
- Use interfaces for object shapes

**Good:**
```typescript
interface EncryptionOptions {
  type: FhevmType;
  value: number | bigint | boolean | string;
}

async function encryptInput(options: EncryptionOptions): Promise<EncryptedInput> {
  // Implementation
}
```

**Bad:**
```typescript
async function encryptInput(options: any): Promise<any> {
  // Implementation
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use meaningful variable names
- Keep functions small and focused

**Good:**
```typescript
export async function encryptValue(
  client: FhevmClient,
  value: number,
  type: FhevmType
): Promise<EncryptedInput> {
  const builder = client.createEncryptedInput(contractAddress, userAddress);

  switch (type) {
    case 'euint8':
      return await builder.add8(value).encrypt();
    case 'euint32':
      return await builder.add32(value).encrypt();
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
```

### Documentation

- Add JSDoc comments to all public APIs
- Include parameter descriptions
- Provide usage examples
- Document return values

**Example:**
```typescript
/**
 * Encrypt input value for FHE operations
 *
 * @param client - The FHEVM client instance
 * @param contractAddress - Address of the target contract
 * @param userAddress - Address of the user
 * @param options - Encryption options including type and value
 * @returns Promise resolving to encrypted input with handles and proof
 *
 * @example
 * ```typescript
 * const encrypted = await encryptInput(client, contractAddr, userAddr, {
 *   type: 'euint32',
 *   value: 1000
 * });
 * ```
 */
export async function encryptInput(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string,
  options: EncryptionOptions
): Promise<EncryptedInput> {
  // Implementation
}
```

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test edge cases and error conditions

**Example:**
```typescript
describe('encryptInput', () => {
  it('should encrypt euint32 value correctly', async () => {
    const result = await encryptInput(client, contractAddress, userAddress, {
      type: 'euint32',
      value: 1000
    });

    expect(result.handles).to.have.lengthOf(1);
    expect(result.inputProof).to.be.a('string');
  });

  it('should throw error for invalid type', async () => {
    await expect(
      encryptInput(client, contractAddress, userAddress, {
        type: 'invalid' as FhevmType,
        value: 1000
      })
    ).to.be.rejectedWith('Unsupported type');
  });
});
```

## Submitting Changes

### Pull Request Checklist

Before submitting a pull request, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

### Review Process

1. Automated tests will run on your PR
2. Maintainers will review your code
3. Address any requested changes
4. Once approved, PR will be merged

### What to Expect

- Initial response within 3 business days
- Constructive feedback on code
- Possible requests for changes
- Merge when all checks pass

## Reporting Issues

### Bug Reports

When reporting bugs, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Code samples if applicable
- Error messages and stack traces

**Template:**
```markdown
**Description**
Brief description of the issue

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: macOS 13.0
- Node: 18.17.0
- SDK Version: 1.0.0

**Additional Context**
Any other relevant information
```

### Feature Requests

When requesting features, include:

- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Examples from other libraries

## Development Guidelines

### SDK Core

- Keep core framework-agnostic
- Avoid React-specific code in core
- Ensure Node.js compatibility
- Test in multiple environments

### React Integration

- Place React code in separate files
- Use hooks for reusable logic
- Follow React best practices
- Support both class and functional components

### Documentation

- Update README for major changes
- Add examples for new features
- Keep API reference current
- Include migration guides when needed

## Questions?

If you have questions:

- Check existing documentation
- Search closed issues
- Open a new issue with "Question:" prefix
- Join community discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FHEVM Universal SDK! 🚀
