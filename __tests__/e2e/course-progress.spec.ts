import { test, expect } from '@playwright/test'

test.describe('Course Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated user with purchased course
    await page.goto('/courses/test-course-id')
  })

  test('should track chapter completion progress', async ({ page }) => {
    // Verify initial progress is 0%
    const progressBar = page.locator('[data-testid="progress-bar"]')
    await expect(progressBar).toContainText('0%')
    
    // Navigate to first chapter
    await page.click('[data-testid="chapter-item"]:first-child')
    
    // Watch video (simulate video completion)
    const videoPlayer = page.locator('[data-testid="video-player"]')
    await expect(videoPlayer).toBeVisible()
    
    // Mark chapter as complete
    await page.click('[data-testid="complete-button"]')
    
    // Verify chapter is marked as completed
    await expect(page.locator('[data-testid="chapter-completed"]')).toBeVisible()
    
    // Go back to course overview
    await page.click('[data-testid="course-title"]')
    
    // Verify progress has increased
    await expect(progressBar).not.toContainText('0%')
  })

  test('should show course completion when all chapters are done', async ({ page }) => {
    // Complete all chapters (this would be a loop in real scenario)
    const chapters = await page.locator('[data-testid="chapter-item"]').count()
    
    for (let i = 0; i < chapters; i++) {
      await page.click(`[data-testid="chapter-item"]:nth-child(${i + 1})`)
      await page.click('[data-testid="complete-button"]')
    }
    
    // Verify course completion
    await expect(page.locator('[data-testid="course-completed"]')).toBeVisible()
    await expect(page.locator('[data-testid="progress-bar"]')).toContainText('100%')
    
    // Verify confetti animation (if implemented)
    await expect(page.locator('[data-testid="confetti"]')).toBeVisible()
  })

  test('should persist progress across sessions', async ({ page, context }) => {
    // Complete a chapter
    await page.click('[data-testid="chapter-item"]:first-child')
    await page.click('[data-testid="complete-button"]')
    
    // Close and reopen browser
    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/courses/test-course-id')
    
    // Verify progress is still there
    const progressBar = newPage.locator('[data-testid="progress-bar"]')
    await expect(progressBar).not.toContainText('0%')
    
    // Verify chapter is still marked as completed
    await expect(newPage.locator('[data-testid="chapter-completed"]')).toBeVisible()
  })

  test('should update progress in real-time', async ({ page }) => {
    // Open course in two tabs to test real-time updates
    const page2 = await page.context().newPage()
    await page2.goto('/courses/test-course-id')
    
    // Complete chapter in first tab
    await page.click('[data-testid="chapter-item"]:first-child')
    await page.click('[data-testid="complete-button"]')
    
    // Check if progress updates in second tab (would require WebSocket/polling)
    await page2.reload()
    const progressBar2 = page2.locator('[data-testid="progress-bar"]')
    await expect(progressBar2).not.toContainText('0%')
    
    await page2.close()
  })
})



