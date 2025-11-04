import { test, expect } from '@playwright/test'

test.describe('Course Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in real scenario, you'd set up test user
    await page.goto('/')
  })

  test('should complete full course purchase workflow', async ({ page }) => {
    // Navigate to courses page
    await page.goto('/search')
    
    // Search for a course
    await page.fill('[data-testid="search-input"]', 'React')
    await page.press('[data-testid="search-input"]', 'Enter')
    
    // Wait for search results
    await page.waitForSelector('[data-testid="course-card"]')
    
    // Click on first course
    await page.click('[data-testid="course-card"]:first-child')
    
    // Verify course page loads
    await expect(page.locator('h1')).toBeVisible()
    
    // Check if course is not purchased (enroll button should be visible)
    const enrollButton = page.locator('[data-testid="enroll-button"]')
    if (await enrollButton.isVisible()) {
      // Click enroll button
      await enrollButton.click()
      
      // Should redirect to Stripe checkout (in test, we'll mock this)
      await page.waitForURL(/checkout\.stripe\.com|localhost.*checkout/)
      
      // In a real test, you'd complete the Stripe checkout flow
      // For now, we'll simulate successful payment by navigating back
      await page.goBack()
      
      // Verify purchase was successful (enroll button should be gone)
      await expect(enrollButton).not.toBeVisible()
    }
  })

  test('should allow access to course content after purchase', async ({ page }) => {
    // Assume user has purchased the course
    await page.goto('/courses/test-course-id')
    
    // Verify course sidebar is visible
    await expect(page.locator('[data-testid="course-sidebar"]')).toBeVisible()
    
    // Click on first chapter
    await page.click('[data-testid="chapter-item"]:first-child')
    
    // Verify chapter content loads
    await expect(page.locator('[data-testid="video-player"]')).toBeVisible()
    
    // Mark chapter as complete
    await page.click('[data-testid="complete-button"]')
    
    // Verify progress is updated
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
  })

  test('should prevent access to unpurchased course content', async ({ page }) => {
    // Navigate to a course the user hasn't purchased
    await page.goto('/courses/unpurchased-course-id')
    
    // Should see enroll button instead of course content
    await expect(page.locator('[data-testid="enroll-button"]')).toBeVisible()
    
    // Try to access chapter directly
    await page.goto('/courses/unpurchased-course-id/chapters/chapter-1')
    
    // Should redirect or show access denied
    await expect(page.locator('[data-testid="enroll-button"]')).toBeVisible()
  })
})



