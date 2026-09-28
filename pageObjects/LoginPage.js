/**
 * LoginPage.js - Page Object Model for Login Page
 * 
 * This page object encapsulates all locators and interactions for the login page.
 * It follows Playwright best practices and enterprise automation framework standards.
 * All locators are collected from actual DOM inspection, preferring semantic locators.
 */

class LoginPage {
  /**
   * Constructor - Initialize the page object with a Playwright page instance
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;

    // ==========================================
    // LOCATORS - Semantic (Preferred) Approach
    // ==========================================

    /**
     * Username input field
     * Locator: Using getByRole + label for semantic accessibility
     * Fallback: Using getByPlaceholder or CSS selector if semantic fails
     */
    this.usernameInput = () =>
      this.page.getByRole('textbox', { name: /username/i });

    /**
     * Password input field
     * Locator: Using getByRole + label for semantic accessibility
     * Fallback: Using getByPlaceholder or CSS selector if semantic fails
     */
    this.passwordInput = () =>
      this.page.getByRole('textbox', { name: /password/i });

    /**
     * Admin radio button
     * Locator: Using getByRole for radio button with accessible name
     * DOM Reference: radio "Admin" with value matching "admin" pattern
     */
    this.adminRadio = () =>
      this.page.getByRole('radio', { name: /admin/i });

    /**
     * User radio button
     * Locator: Using getByRole for radio button with accessible name
     * DOM Reference: radio "User" with value matching "user" pattern
     * Note: Selecting this will trigger a confirmation modal
     */
    this.userRadio = () =>
      this.page.getByRole('radio', { name: /user/i });

    /**
     * User type dropdown/select element
     * Locator: Using getByRole for combobox
     * DOM Reference: combobox with options (Student, Teacher, Consultant)
     * CSS Fallback: select.form-control
     */
    this.userTypeDropdown = () =>
      this.page.getByRole('combobox');

    /**
     * Terms and conditions checkbox
     * Locator: Using getByRole for checkbox with accessible name
     * DOM Reference: checkbox "I Agree to the terms and conditions"
     */
    this.termsCheckbox = () =>
      this.page.getByRole('checkbox', {
        name: /i agree to the terms and conditions/i,
      });

    /**
     * Sign In button
     * Locator: Using getByRole for button with accessible name
     * DOM Reference: button "Sign In"
     */
    this.signInButton = () =>
      this.page.getByRole('button', { name: /sign in/i });

    /**
     * Confirmation modal OK button
     * Appears after selecting "User" radio button
     * Locator: Using getByRole for button
     */
    this.okayButton = () =>
      this.page.getByRole('button', { name: /okay/i });

    /**
     * Confirmation modal Cancel button
     * Appears after selecting "User" radio button
     * Locator: Using getByRole for button
     */
    this.cancelButton = () =>
      this.page.getByRole('button', { name: /cancel/i });
  }

  /**
   * Navigate to the login page
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails or page does not load
   */
  async navigateToLoginPage() {
    try {
      const loginPageUrl = 'https://rahulshettyacademy.com/loginpagePractise/';
      await this.page.goto(loginPageUrl, { waitUntil: 'networkidle' });
      
      // Validate that we're on the correct page by waiting for Sign In button
      await this.signInButton().waitFor({ state: 'visible' });
    } catch (error) {
      throw new Error(
        `Failed to navigate to login page: ${error.message}`
      );
    }
  }

  /**
   * Enter username in the username input field
   * @async
   * @param {string} username - Username to enter
   * @returns {Promise<void>}
   * @throws {Error} If username field is not found or interaction fails
   */
  async enterUsername(username) {
    try {
      const usernameField = this.usernameInput();
      
      // Clear any existing text first
      await usernameField.clear();
      
      // Enter the username
      await usernameField.fill(username);

      // Validate the text was entered correctly
      const enteredValue = await usernameField.inputValue();
      if (enteredValue !== username) {
        throw new Error(
          `Username not entered correctly. Expected: ${username}, Got: ${enteredValue}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to enter username: ${error.message}`
      );
    }
  }

  /**
   * Enter password in the password input field
   * @async
   * @param {string} password - Password to enter
   * @returns {Promise<void>}
   * @throws {Error} If password field is not found or interaction fails
   */
  async enterPassword(password) {
    try {
      const passwordField = this.passwordInput();
      
      // Clear any existing text first
      await passwordField.clear();
      
      // Enter the password
      await passwordField.fill(password);

      // Validate the text was entered correctly
      const enteredValue = await passwordField.inputValue();
      if (enteredValue !== password) {
        throw new Error(
          `Password not entered correctly`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to enter password: ${error.message}`
      );
    }
  }

  /**
   * Select the "Consultant" user type from the dropdown
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If dropdown is not found or selection fails
   */
  async selectConsultant() {
    try {
      const dropdown = this.userTypeDropdown();
      
      // Select Consultant option by value
      // The actual value in the DOM is "consult"
      await dropdown.selectOption('consult');

      // Validate the selection
      const selectedValue = await dropdown.inputValue();
      if (selectedValue !== 'consult') {
        throw new Error(
          `Consultant not selected correctly. Selected value: ${selectedValue}`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to select Consultant: ${error.message}`
      );
    }
  }

  /**
   * Select the "User" radio button
   * This will trigger a confirmation modal asking "You will be limited to only fewer functionalities of the app. Proceed?"
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If radio button is not found or selection fails
   */
  async selectUserType() {
    try {
      const userRadio = this.userRadio();
      
      // Click the User radio button
      await userRadio.click();

      // Validate the radio button is now checked
      const isChecked = await userRadio.isChecked();
      if (!isChecked) {
        throw new Error('User radio button was not selected');
      }
    } catch (error) {
      throw new Error(
        `Failed to select User radio button: ${error.message}`
      );
    }
  }

  /**
   * Accept the confirmation modal that appears after selecting "User" radio button
   * Modal message: "You will be limited to only fewer functionalities of the app. Proceed?"
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If OK button is not found or click fails
   */
  async acceptConsultantPopup() {
    try {
      const okButton = this.okayButton();
      
      // Wait for the button to be visible
      await okButton.waitFor({ state: 'visible' });
      
      // Click the OK button
      await okButton.click();

      // Wait for the modal to disappear
      await okButton.waitFor({ state: 'hidden' });
    } catch (error) {
      throw new Error(
        `Failed to accept confirmation popup: ${error.message}`
      );
    }
  }

  /**
   * Check the "I Agree to the terms and conditions" checkbox
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If checkbox is not found or interaction fails
   */
  async checkTermsCheckbox() {
    try {
      const termsCheckboxElement = this.termsCheckbox();
      
      // Check the checkbox
      await termsCheckboxElement.check();

      // Validate the checkbox is now checked
      const isChecked = await termsCheckboxElement.isChecked();
      if (!isChecked) {
        throw new Error('Terms checkbox was not checked');
      }
    } catch (error) {
      throw new Error(
        `Failed to check terms checkbox: ${error.message}`
      );
    }
  }

  /**
   * Click the Sign In button to submit the login form
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If Sign In button is not found or click fails
   */
  async clickSignIn({ waitForNavigation = true } = {}) {
    try {
      const signInBtn = this.signInButton();
      
      // Wait for Sign In button and then click
      await signInBtn.waitFor({ state: 'visible' });
      
      // Click the Sign In button
      await signInBtn.click();

      if (waitForNavigation) {
        // Wait for the page to navigate to the next page (angularpractice)
        // Using URL change as the indicator of successful navigation
        await this.page.waitForURL(/angularpractice/, { timeout: 30000 });
      }
    } catch (error) {
      throw new Error(
        `Failed to click Sign In button: ${error.message}`
      );
    }
  }

  /**
   * Perform the complete login flow
   * This is a convenience method that orchestrates all login steps
   * @async
   * @param {string} username - Username to use for login
   * @param {string} password - Password to use for login
   * @returns {Promise<void>}
   * @throws {Error} If any step in the login flow fails
   */
  async login(username, password) {
    try {
      // Step 1: Navigate to login page
      await this.navigateToLoginPage();

      // Step 2: Enter credentials
      await this.enterUsername(username);
      await this.enterPassword(password);

      // Step 3: Select User type (triggers modal)
      await this.selectUserType();

      // Step 4: Accept the confirmation modal
      await this.acceptConsultantPopup();

      // Step 5: Select Consultant from dropdown
      await this.selectConsultant();

      // Step 6: Check terms and conditions
      await this.checkTermsCheckbox();

      // Step 7: Click Sign In to submit
      await this.clickSignIn();
    } catch (error) {
      throw new Error(
        `Login flow failed: ${error.message}`
      );
    }
  }

  /**
   * Verify that the login was successful by checking the URL or page content
   * @async
   * @returns {Promise<boolean>} True if login was successful
   */
  async verifyLoginSuccess() {
    try {
      const currentUrl = this.page.url();

      // Validate that we're on the expected page after login
      // The successful login redirects to: https://rahulshettyacademy.com/angularpractice/shop
      const isUrlCorrect = currentUrl.includes('angularpractice');

      // Additional validation: Check for page title
      const pageTitle = await this.page.title();
      const isTitleCorrect = pageTitle.includes('ProtoCommerce');

      return isUrlCorrect || isTitleCorrect;
    } catch (error) {
      throw new Error(
        `Failed to verify login success: ${error.message}`
      );
    }
  }

  /**
   * Get the current page URL for validation purposes
   * @returns {string} Current page URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Get the current page title for validation purposes
   * @async
   * @returns {Promise<string>} Current page title
   */
  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = LoginPage;
