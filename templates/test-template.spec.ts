import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ComponentName } from '@/components/ComponentName';
import { exampleRoute } from '@/routes/example';

/**
 * @test-suite ComponentName
 * @description Testy dla komponentu ComponentName
 * 
 * @coverage
 * - Statements: 100%
 * - Branches: 100%
 * - Functions: 100%
 * - Lines: 100%
 */
describe('ComponentName', () => {
  // Setup
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    onAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * @test-case
   * Sprawdza czy komponent renderuje się poprawnie
   */
  it('should render correctly', () => {
    render(<ComponentName {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  /**
   * @test-case
   * Sprawdza czy callback jest wywoływany po kliknięciu
   */
  it('should call onAction when button is clicked', async () => {
    render(<ComponentName {...defaultProps} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
  });

  /**
   * @test-case
   * Sprawdza obsługę błędów
   */
  it('should handle errors gracefully', () => {
    const errorProps = {
      ...defaultProps,
      onAction: () => {
        throw new Error('Test error');
      },
    };

    render(<ComponentName {...errorProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(/wystąpił błąd/i)).toBeInTheDocument();
  });
});

/**
 * @test-suite API Integration
 * @description Testy integracyjne dla API
 */
describe('API Integration', () => {
  // Mock server setup
  const server = setupServer(
    rest.post('/api/example', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: {
            id: '123',
            ...req.body,
            processedAt: new Date().toISOString(),
          },
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  /**
   * @test-case
   * Sprawdza czy API zwraca poprawną odpowiedź
   */
  it('should return correct response', async () => {
    const response = await fetch('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('id');
    expect(data.data).toHaveProperty('name', 'Test User');
    expect(data.data).toHaveProperty('email', 'test@example.com');
  });

  /**
   * @test-case
   * Sprawdza walidację danych wejściowych
   */
  it('should validate input data', async () => {
    const response = await fetch('/api/example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'T', // Too short
        email: 'invalid-email', // Invalid email
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
  });
});

/**
 * @test-suite Route Handler
 * @description Testy dla handlera routingu
 */
describe('Route Handler', () => {
  let fastify: any;

  beforeEach(() => {
    fastify = {
      post: jest.fn(),
      register: jest.fn(),
    };
  });

  /**
   * @test-case
   * Sprawdza czy route jest zarejestrowany poprawnie
   */
  it('should register route correctly', async () => {
    await exampleRoute(fastify);

    expect(fastify.register).toHaveBeenCalled();
    expect(fastify.post).toHaveBeenCalledWith(
      '/api/example',
      expect.any(Object),
      expect.any(Function)
    );
  });
});

// Mock implementations
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  authenticate: jest.fn((req, res, next) => next()),
})); 