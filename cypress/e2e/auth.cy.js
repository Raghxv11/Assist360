describe('Authentication Flow', () => {
    beforeEach(() => {
      // Clear any previous state
      cy.clearLocalStorage()
      cy.clearCookies()
    })
  
    describe('Login Page', () => {
      beforeEach(() => {
        cy.visit('/login')
      })
  
      it('should display all login form elements', () => {
        // Check for main elements
        cy.contains('h3', 'Welcome Back')
        cy.get('input[type="email"]').should('be.visible')
        cy.get('input[type="password"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        
        // Check for navigation links
        cy.contains('Sign up').should('be.visible')
          .and('have.attr', 'href', '/register')
      })
  
      it('should validate email format', () => {
        // Try submitting with invalid email formats
        const testCases = [
          'invalidemail',
          'invalid@',
          '@invalid.com',
          'invalid@.com',
        ]
  
        testCases.forEach(email => {
          cy.get('input[type="email"]').clear().type(email)
          cy.get('input[type="password"]').type('password123')
          cy.get('button[type="submit"]').click()
          // Browser's native email validation should prevent submission
          cy.url().should('include', '/login')
        })
      })
  
      it('should handle empty form submission', () => {
        cy.get('button[type="submit"]').click()
        // Form should not submit with empty required fields
        cy.url().should('include', '/login')
      })
  
      it('should show loading state during login attempt', () => {
        cy.get('input[type="email"]').type('test@example.com')
        cy.get('input[type="password"]').type('password123')
        cy.get('button[type="submit"]').click()
  
        // Button should show loading state
        cy.get('button[type="submit"]')
          .should('be.disabled')
          .and('contain.text', 'Signing In...')
      })
  
      it('should show error message for invalid credentials', () => {
        cy.get('input[type="email"]').type('wrong@email.com')
        cy.get('input[type="password"]').type('wrongpassword')
        cy.get('button[type="submit"]').click()
  
        cy.contains('Invalid email or password')
          .should('be.visible')
          .and('have.class', 'text-red-600')
      })
  
      it('should successfully login with valid credentials', () => {
        // Use test account credentials
        const testEmail = Cypress.env('TEST_USER_EMAIL')
        const testPassword = Cypress.env('TEST_USER_PASSWORD')
  
        cy.get('input[type="email"]').type(testEmail)
        cy.get('input[type="password"]').type(testPassword)
        cy.get('button[type="submit"]').click()
  
        // Should redirect to home page
        cy.url().should('include', '/home')
        
        // Should show logged-in state
        cy.contains('Logout').should('be.visible')
      })
    })
    describe('Authentication State', () => {
        it('should maintain login state across page refreshes', () => {
          // Login with test account
          const testEmail = `aryashdubey2@gmail.com`
          const testPassword = '123456'
    
          cy.visit('/login')
          cy.get('input[type="email"]').type(testEmail)
          cy.get('input[type="password"]').type(testPassword)
          cy.get('button[type="submit"]').click()
    
          // Verify logged in state
          cy.url().should('include', '/home')
    
          // Refresh page
          cy.reload()
    
          // Should still be logged in
          cy.url().should('include', '/home')
          cy.contains('Logout').should('be.visible')
        })
    
        it('should redirect to login when accessing protected routes while logged out', () => {
          cy.visit('/home')
          cy.url().should('include', '/login')
    
          cy.visit('/admin')
          cy.url().should('include', '/login')
    
          cy.visit('/student')
          cy.url().should('include', '/login')
        })
      })
  });
    