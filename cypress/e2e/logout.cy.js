describe('Logout Functionality', () => {
    beforeEach(() => {
      // Clear any previous state
      cy.clearLocalStorage()
      cy.clearCookies()
      
      // Login with test account first
      cy.visit('/login')
      cy.get('input[type="email"]').type('raghavb@gmail.com')
      cy.get('input[type="password"]').type('raghav123')
      cy.get('button[type="submit"]').click()
      
      // Wait for redirect to home page
      cy.url().should('include', '/home')
      cy.visit('/admin')
    })
  
    it('should successfully logout when clicking logout button', () => {
      // Click logout button
      cy.contains('Logout').click()
  
      // Should redirect to login page
      cy.url().should('include', '/login')
  
      // Verify user can't access protected routes after logout
      cy.visit('/home')
      cy.url().should('include', '/login')
  
      cy.visit('/admin')
      cy.url().should('include', '/login')
  
      // Verify local storage is cleared
      cy.getAllLocalStorage().should('be.empty')
    })
  
    it('should maintain logged out state after page refresh', () => {
      // Logout first
      cy.contains('Logout').click()
      cy.url().should('include', '/login')
  
      // Refresh page
      cy.reload()
  
      // Should still be on login page
      cy.url().should('include', '/login')
  
      // Try accessing protected route
      cy.visit('/home')
      cy.url().should('include', '/login')
    })
  })