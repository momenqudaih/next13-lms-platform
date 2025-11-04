import { rest } from 'msw'

export const handlers = [
  // Mock Clerk authentication
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 'test-user-id',
          firstName: 'Test',
          lastName: 'User',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
        },
      })
    )
  }),

  // Mock Stripe checkout session
  rest.post('https://api.stripe.com/v1/checkout/sessions', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      })
    )
  }),

  // Mock Mux API
  rest.post('https://api.mux.com/video/v1/assets', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: 'test-asset-id',
          playback_ids: [{ id: 'test-playback-id' }],
        },
      })
    )
  }),

  // Mock UploadThing
  rest.post('/api/uploadthing', (req, res, ctx) => {
    return res(
      ctx.json({
        url: 'https://uploadthing.com/test-file.jpg',
        key: 'test-file-key',
      })
    )
  }),
]



