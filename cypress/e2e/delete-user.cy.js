describe('Delete User Functionality', () => {
  beforeEach(() => {
    // Clear any previous state
    cy.visit("/admin");
    cy.clearLocalStorage()
    cy.clearCookies()
    
    // Wait for redirect and verify we're on admin page
    cy.url().should('include', '/admin')
    // Wait for the admin page to load
    cy.get('[data-testid="users-table"]').should('be.visible')
  })

  it('should successfully delete a user after confirmation', () => {
    // Find an existing user in the table
    cy.get('[data-testid="users-table"]')
      .contains('tr', 'aryashdubey2@gmail.com')
      .within(() => {
        cy.get('[data-testid="delete-user-button"]').click()
      })

    // Confirm deletion in the alert
    cy.on('window:confirm', (text) => {
      expect(text).to.contain('Are you sure you want to delete the user')
      return true
    })

    // Verify success message
    cy.on('window:alert', (text) => {
      expect(text).to.equal('User deleted successfully')
    })

    // Verify user is removed from the table
    cy.contains('aryashdubey2@gmail.com').should('not.exist')
  })

  it('should not delete user when canceling confirmation', () => {
    // Find an existing user in the table
    cy.get('[data-testid="users-table"]')
      .contains('tr', 'aryashdubey2@gmail.com')
      .within(() => {
        cy.get('[data-testid="delete-user-button"]').click()
      })

    // Cancel the deletion in the confirmation dialog
    cy.on('window:confirm', () => false)

    // Verify user still exists in the table
    cy.contains('aryashdubey2@gmail.com').should('exist')
  })

  it('should show error message when deletion fails', () => {
    // Stub the console.error to track error logging
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError')
    })

    // Intercept the Firestore delete operation and force it to fail
    cy.intercept('POST', '**/google.firestore.v1.Firestore/Delete*', {
      statusCode: 500,
      body: 'Error deleting user'
    }).as('deleteUser')

    // Find an existing user and click delete
    cy.get('[data-testid="users-table"]')
      .contains('tr', 'aryashdubey2@gmail.com')
      .within(() => {
        cy.get('[data-testid="delete-user-button"]').click()
      })

    // Confirm deletion
    cy.on('window:confirm', () => true)

    // Verify error message
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Error deleting user')
    })

    // Verify error was logged
    cy.get('@consoleError').should('have.been.called')
  })
})
