import { test, expect } from '@playwright/test'

test.describe('Teacher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated teacher user
    await page.goto('/teacher')
  })

  test('should create a new course', async ({ page }) => {
    // Navigate to create course page
    await page.click('[data-testid="create-course-button"]')
    
    // Fill course creation form
    await page.fill('[data-testid="course-title-input"]', 'New Test Course')
    await page.click('[data-testid="create-button"]')
    
    // Should redirect to course edit page
    await page.waitForURL(/\/teacher\/courses\/.*/)
    
    // Verify course title is displayed
    await expect(page.locator('h1')).toContainText('New Test Course')
    
    // Verify course is in draft state
    await expect(page.locator('[data-testid="course-status"]')).toContainText('Draft')
  })

  test('should edit course details', async ({ page }) => {
    // Navigate to existing course
    await page.goto('/teacher/courses/test-course-id')
    
    // Edit course title
    await page.click('[data-testid="edit-title-button"]')
    await page.fill('[data-testid="title-input"]', 'Updated Course Title')
    await page.click('[data-testid="save-title-button"]')
    
    // Verify title is updated
    await expect(page.locator('h1')).toContainText('Updated Course Title')
    
    // Edit course description
    await page.click('[data-testid="edit-description-button"]')
    await page.fill('[data-testid="description-editor"]', 'This is an updated course description')
    await page.click('[data-testid="save-description-button"]')
    
    // Verify description is updated
    await expect(page.locator('[data-testid="course-description"]')).toContainText('updated course description')
  })

  test('should add and manage chapters', async ({ page }) => {
    await page.goto('/teacher/courses/test-course-id')
    
    // Add new chapter
    await page.click('[data-testid="add-chapter-button"]')
    await page.fill('[data-testid="chapter-title-input"]', 'Introduction Chapter')
    await page.click('[data-testid="create-chapter-button"]')
    
    // Verify chapter appears in list
    await expect(page.locator('[data-testid="chapter-list"]')).toContainText('Introduction Chapter')
    
    // Edit chapter
    await page.click('[data-testid="chapter-item"]:first-child')
    
    // Should navigate to chapter edit page
    await page.waitForURL(/\/chapters\/.*/)
    
    // Add chapter description
    await page.click('[data-testid="edit-description-button"]')
    await page.fill('[data-testid="description-editor"]', 'This is the introduction chapter')
    await page.click('[data-testid="save-description-button"]')
    
    // Upload video
    await page.click('[data-testid="add-video-button"]')
    // In real test, you'd upload a file here
    
    // Publish chapter
    await page.click('[data-testid="publish-chapter-button"]')
    await expect(page.locator('[data-testid="chapter-status"]')).toContainText('Published')
  })

  test('should publish course when requirements are met', async ({ page }) => {
    await page.goto('/teacher/courses/test-course-id')
    
    // Verify course requirements
    const requirements = [
      'course-title',
      'course-description', 
      'course-image',
      'course-category',
      'course-price',
      'published-chapter'
    ]
    
    // Check each requirement is met (green checkmarks)
    for (const requirement of requirements) {
      await expect(page.locator(`[data-testid="${requirement}-check"]`)).toBeVisible()
    }
    
    // Publish course
    await page.click('[data-testid="publish-course-button"]')
    
    // Confirm publication
    await page.click('[data-testid="confirm-publish-button"]')
    
    // Verify course is published
    await expect(page.locator('[data-testid="course-status"]')).toContainText('Published')
    
    // Verify course appears in public course list
    await page.goto('/search')
    await expect(page.locator('[data-testid="course-card"]')).toContainText('Test Course')
  })

  test('should view analytics for published course', async ({ page }) => {
    await page.goto('/teacher/analytics')
    
    // Verify analytics dashboard loads
    await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible()
    
    // Check revenue chart
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible()
    
    // Check sales data
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-sales"]')).toBeVisible()
    
    // Test AI analytics if available
    const aiAnalytics = page.locator('[data-testid="ai-analytics"]')
    if (await aiAnalytics.isVisible()) {
      await expect(aiAnalytics).toContainText('AI Insights')
    }
  })
})



