import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/webhook/route'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@/lib/stripe')
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

const mockDb = db as jest.Mocked<typeof db>
const mockStripe = stripe as jest.Mocked<typeof stripe>
const mockHeaders = require('next/headers').headers as jest.MockedFunction<any>

describe('/api/webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Stripe Webhook', () => {
    it('should create purchase on successful checkout', async () => {
      // Setup mocks
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {
              userId: 'user-123',
              courseId: 'course-123',
            },
          },
        },
      }

      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('test-signature'),
      })

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any)
      mockDb.purchase.create.mockResolvedValue({
        id: 'purchase-123',
        userId: 'user-123',
        courseId: 'course-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: 'raw-stripe-payload',
        headers: {
          'stripe-signature': 'test-signature',
        },
      })

      // Mock req.text() method
      Object.defineProperty(req, 'text', {
        value: jest.fn().mockResolvedValue('raw-stripe-payload'),
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(200)
      expect(mockDb.purchase.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          courseId: 'course-123',
        },
      })
    })

    it('should return 400 when webhook signature is invalid', async () => {
      // Setup mocks
      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('invalid-signature'),
      })

      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: 'raw-stripe-payload',
      })

      // Mock req.text() method
      Object.defineProperty(req, 'text', {
        value: jest.fn().mockResolvedValue('raw-stripe-payload'),
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(400)
      expect(mockDb.purchase.create).not.toHaveBeenCalled()
    })

    it('should return 400 when metadata is missing', async () => {
      // Setup mocks
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {
              userId: null,
              courseId: 'course-123',
            },
          },
        },
      }

      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('test-signature'),
      })

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any)

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: 'raw-stripe-payload',
      })

      // Mock req.text() method
      Object.defineProperty(req, 'text', {
        value: jest.fn().mockResolvedValue('raw-stripe-payload'),
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(400)
      expect(mockDb.purchase.create).not.toHaveBeenCalled()
    })

    it('should handle unhandled event types', async () => {
      // Setup mocks
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {},
        },
      }

      mockHeaders.mockReturnValue({
        get: jest.fn().mockReturnValue('test-signature'),
      })

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any)

      // Create request
      const { req } = createMocks({
        method: 'POST',
        body: 'raw-stripe-payload',
      })

      // Mock req.text() method
      Object.defineProperty(req, 'text', {
        value: jest.fn().mockResolvedValue('raw-stripe-payload'),
      })

      // Execute
      const response = await POST(req as any)

      // Assertions
      expect(response.status).toBe(200)
      expect(mockDb.purchase.create).not.toHaveBeenCalled()
    })
  })
}



