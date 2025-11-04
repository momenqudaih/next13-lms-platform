# Testing Strategy for Next.js LMS Platform

## Overview

This document outlines the comprehensive testing strategy implemented for the LMS platform, covering unit, integration, and end-to-end testing approaches.

## Testing Layers

### 1. Unit Testing

**Purpose**: Verify correctness of individual modules and functions in isolation.

**Framework**: Jest with React Testing Library

**Coverage Areas**:
- Utility functions (`lib/format.ts`, `lib/utils.ts`)
- Action functions (`actions/get-progress.ts`, `actions/get-courses.ts`)
- React components (`components/course-card.tsx`, `components/course-progress.tsx`)
- Custom hooks (`hooks/use-confetti-store.ts`, `hooks/use-debounce.ts`)

**Location**: `__tests__/unit/`

**Commands**:
```bash
npm run test:unit          # Run unit tests
npm run test:unit:watch    # Run in watch mode
npm run test:coverage      # Generate coverage report
```

**Example Test Structure**:
```typescript
describe('formatPrice', () => {
  it('should format price correctly with default currency', () => {
    expect(formatPrice(29.99)).toBe('$29.99')
  })
})
```

### 2. Integration Testing

**Purpose**: Test interaction between backend APIs, frontend components, and third-party services.

**Framework**: Jest with Supertest and MSW (Mock Service Worker)

**Coverage Areas**:
- API endpoints (`/api/courses`, `/api/webhook`, `/api/chapters`)
- Database operations with Prisma
- Authentication with Clerk
- Payment processing with Stripe
- Video streaming with Mux
- File uploads with UploadThing

**Location**: `__tests__/integration/`

**Commands**:
```bash
npm run test:integration   # Run integration tests
```

**Mock Services**:
- Database operations mocked with Jest
- External APIs mocked with MSW
- Authentication mocked with Clerk test utilities

### 3. System/End-to-End Testing

**Purpose**: Validate complete user workflows and system behavior.

**Framework**: Playwright

**Coverage Areas**:
- Course purchase workflow
- Progress tracking system
- Teacher dashboard functionality
- Student learning experience
- Authentication flows
- Payment processing

**Location**: `__tests__/e2e/`

**Commands**:
```bash
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # Run with UI mode
```

**Test Scenarios**:
1. **Course Purchase Flow**:
   - Browse courses
   - Enroll in course
   - Complete Stripe checkout
   - Access course content

2. **Progress Tracking**:
   - Mark chapters as complete
   - Track overall progress
   - Persist progress across sessions

3. **Teacher Dashboard**:
   - Create and edit courses
   - Manage chapters
   - Publish courses
   - View analytics

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Next.js integration
- TypeScript support
- Path mapping for imports
- Coverage thresholds (70% minimum)
- Custom test environment setup

### Playwright Configuration (`playwright.config.ts`)
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic retry on failure
- Trace collection for debugging

### Environment Setup
- Test database with MySQL
- Mock external services
- Environment variables for testing
- Seed data for consistent testing

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/test.yml`)

**Jobs**:
1. **Unit Tests**: Run on Node.js 18.x and 20.x
2. **Integration Tests**: Run with MySQL service
3. **E2E Tests**: Full application testing with Playwright
4. **Security Scan**: Vulnerability scanning with Trivy
5. **Performance Test**: Lighthouse CI for performance metrics

**Triggers**:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

**Artifacts**:
- Test coverage reports
- Playwright test results
- Security scan results
- Performance metrics

## Test Data Management

### Factories and Helpers (`__tests__/utils/`)
- Mock data factories for consistent test data
- Database setup and cleanup utilities
- Custom render functions for React components
- API response mocking helpers

### Database Testing
- Isolated test database
- Automatic cleanup between tests
- Seed data for E2E tests
- Transaction rollback for integration tests

## Coverage Requirements

**Minimum Coverage Thresholds**:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

**Critical Areas (90%+ coverage required)**:
- Payment processing
- Authentication
- Progress tracking
- Course enrollment

## Running Tests

### Local Development
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### CI Environment
Tests run automatically on:
- Every push to main/develop
- Pull request creation/updates
- Scheduled nightly runs

## Test Maintenance

### Best Practices
1. **Test Naming**: Descriptive test names explaining the scenario
2. **Arrange-Act-Assert**: Clear test structure
3. **Mock External Dependencies**: Isolate units under test
4. **Clean Test Data**: Reset state between tests
5. **Realistic Test Data**: Use representative data

### Regular Maintenance Tasks
- Update test dependencies monthly
- Review and update coverage thresholds
- Refactor tests when code changes
- Add tests for new features
- Remove obsolete tests

## Debugging Tests

### Jest Tests
```bash
# Debug specific test
npm test -- --testNamePattern="specific test name"

# Run with verbose output
npm test -- --verbose

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Tests
```bash
# Run with headed browser
npm run test:e2e -- --headed

# Debug specific test
npm run test:e2e -- --debug

# Generate test report
npx playwright show-report
```

## Monitoring and Reporting

### Coverage Reports
- Generated automatically in CI
- Uploaded to Codecov
- Viewable in GitHub PR checks

### Test Results
- Displayed in GitHub Actions
- Slack notifications for failures
- Daily summary reports

### Performance Metrics
- Lighthouse CI integration
- Performance budget enforcement
- Regression detection

## Security Testing

### Vulnerability Scanning
- Trivy security scanner in CI
- Dependency vulnerability checks
- SARIF report generation

### Authentication Testing
- Clerk integration testing
- Session management validation
- Authorization checks

## Future Enhancements

1. **Visual Regression Testing**: Add screenshot comparison tests
2. **Load Testing**: Implement performance testing with k6
3. **Accessibility Testing**: Automated a11y testing with axe-core
4. **API Contract Testing**: Add Pact.js for API contract validation
5. **Mutation Testing**: Implement Stryker.js for test quality assessment

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure test database is running
2. **Environment Variables**: Check all required env vars are set
3. **Port Conflicts**: Ensure test ports are available
4. **Mock Issues**: Verify mocks are properly configured

### Getting Help
- Check test logs in GitHub Actions
- Review Playwright trace files
- Consult team documentation
- Reach out to QA team for complex issues



