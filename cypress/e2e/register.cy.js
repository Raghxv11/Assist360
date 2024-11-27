describe('Registration Page', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.clearCookies()
      cy.visit('/register')
    })

    it('should display all registration form elements', () => {
      // Check for main elements
      cy.contains('h3', 'Create a New Account')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('have.length', 2) // Password and confirm password
      cy.get('input[type="text"]').should('be.visible') // Invitation code
      cy.get('button[type="submit"]').should('be.visible')
      
      // Check for navigation links
      cy.contains('Login').should('be.visible')
    })

    it('should validate password matching', () => {
      const email = `test${Date.now()}@example.com`
      
      // Fill out form with non-matching passwords
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[type="password"]').last().type('different123')
      cy.get('input[type="text"]').type('VALID-CODE')
      cy.get('button[type="submit"]').click()

      // Should show error message
      cy.contains("Passwords don't match").should('be.visible')
    })

    it('should validate invitation code', () => {
      const email = `test${Date.now()}@example.com`
      
      // Fill out form with invalid invite code
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[type="password"]').last().type('password123')
      cy.get('input[type="text"]').type('INVALID-CODE')
      cy.get('button[type="submit"]').click()

      // Should show error message
      cy.contains('Invalid invite code').should('be.visible')
    })

    it('should show loading state during registration attempt', () => {
      const email = `test${Date.now()}@example.com`
      
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[type="password"]').last().type('password123')
      cy.get('input[type="text"]').type('6VZWRBZC')
      cy.get('button[type="submit"]').click()

      // Button should show loading state
      cy.get('button[type="submit"]')
        .should('be.disabled')
        .and('contain.text', 'Processing...')
    })

    it('should successfully register with valid data', () => {
      // Generate unique test email
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'TestPassword123!'
      const validInviteCode = Cypress.env('VALID_INVITE_CODE')

      // Fill out registration form
      cy.get('input[type="email"]').type(testEmail)
      cy.get('input[type="password"]').first().type(testPassword)
      cy.get('input[type="password"]').last().type(testPassword)
      cy.get('input[type="text"]').type(validInviteCode)
      cy.get('button[type="submit"]').click()

      // Should redirect to home page
      cy.url().should('include', '/home')
      
      // Should show success message and logged-in state
      cy.contains('Registration successful').should('be.visible')
      cy.contains('Logout').should('be.visible')
    })
  })

  // Remove the Logout Functionality describe block and move it to a new file: cypress/e2e/logout.cy.js
  