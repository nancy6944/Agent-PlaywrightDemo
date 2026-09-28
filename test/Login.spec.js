/**
 * Login.spec.js - Complete Login Test Suite
 * 
 * This test file contains comprehensive login tests following Playwright best practices.
 * It tests the complete login flow with the Consultant user type.
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');
const { captureScreenshot } = require('../helpertools/screenshotHelper');
const { successIndicators } = require('../helpertools/successIndicators');
const TEST_DATA = require('../testData/LoginTestdata.json');

/**
 * Test suite for login functionality
 */
test.describe('Login Page - Complete Test Suite', () => {
  let loginPage;

  /**
   * Setup before each test
   * Initializes the LoginPage object and navigates to the login page
   */
  test.beforeEach(async ({ page }) => {
    // Initialize LoginPage object for this test
    loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.navigateToLoginPage();

    // Validate that the login page has loaded correctly
    const pageTitle = await loginPage.getPageTitle();
    expect(pageTitle).toContain('LoginPage Practise');
  });

  /**
   * Test Case 1: Complete Login Flow with Consultant User Type
   * 
   * This test validates:
   * 1. Navigation to login page
   * 2. Username entry
   * 3. Password entry
   * 4. User radio button selection (triggers modal)
   * 5. Modal acceptance
   * 6. Consultant selection from dropdown
   * 7. Terms checkbox
   * 8. Sign In button click
   * 9. Successful navigation to products page
   */
  test('TC-001: Should successfully login with Consultant user type', async ({ page }, testInfo) => {
    // Re-initialize to get fresh page state
    loginPage = new LoginPage(page);
    await captureScreenshot(page, testInfo, '01-login-page');

    // ACT: Perform login flow
    await loginPage.enterUsername(TEST_DATA.username);
    await captureScreenshot(page, testInfo, '02-username-entered');

    await loginPage.enterPassword(TEST_DATA.password);
    await captureScreenshot(page, testInfo, '03-password-entered');

    await loginPage.selectUserType();
    await captureScreenshot(page, testInfo, '04-user-selected-modal-open');

    await loginPage.acceptConsultantPopup();
    await captureScreenshot(page, testInfo, '05-modal-accepted');

    await loginPage.selectConsultant();
    await captureScreenshot(page, testInfo, '06-consultant-selected');

    await loginPage.checkTermsCheckbox();
    await captureScreenshot(page, testInfo, '07-terms-checked');

    await loginPage.clickSignIn();
    await page.waitForURL('**/angularpractice/shop**', { timeout: 10000 });
    await captureScreenshot(page, testInfo, '08-login-successful');

    // ASSERT: Validate successful login
    // Assertion 1: Check URL contains 'angularpractice'
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain(TEST_DATA.expectedPageUrlAfterLogin);

    // Assertion 2: Check page title indicates successful navigation
    const pageTitle = await loginPage.getPageTitle();
    expect(pageTitle).toContain(TEST_DATA.expectedPageTitle);
    const isLoginSuccessful = await loginPage.verifyLoginSuccess();
    expect(isLoginSuccessful).toBeTruthy();
    expect(currentUrl).toMatch("https://rahulshettyacademy.com/angularpractice/shop");

  });

  /**
   * Test Case 2: Username Entry Validation
   * 
   * This test validates that the username field correctly accepts and stores input
   */
  test('TC-002: Should correctly enter username in the username field', async ({ page }) => {
    // ACT: Enter username
    await loginPage.enterUsername(TEST_DATA.username);

    // ASSERT: Validate username is entered correctly
    const usernameInput = loginPage.usernameInput();
    const enteredUsername = await usernameInput.inputValue();
    
    expect(enteredUsername).toBe(TEST_DATA.username);
    expect(enteredUsername).toEqual('rahulshettyacademy');
  });

  /**
   * Test Case 3: Password Entry Validation
   * 
   * This test validates that the password field correctly accepts input
   */
  test('TC-003: Should correctly enter password in the password field', async ({ page }) => {
    // ACT: Enter password
    await loginPage.enterPassword(TEST_DATA.password);

    // ASSERT: Validate password is entered correctly
    const passwordInput = loginPage.passwordInput();
    const enteredPassword = await passwordInput.inputValue();
    
    expect(enteredPassword).toBe(TEST_DATA.password);
  });

  /**
   * Test Case 4: User Radio Button Selection and Modal Handling
   * 
   * This test validates:
   * 1. User radio button can be selected
   * 2. Selecting User triggers a confirmation modal
   * 3. Modal can be accepted
   */
  test('TC-004: Should select User radio button and handle confirmation modal', async ({ page }) => {
    // ACT: Select User radio button
    await loginPage.selectUserType();

    // ASSERT: Validate User radio button is selected
    const userRadio = loginPage.userRadio();
    expect(await userRadio.isChecked()).toBeTruthy();

    // ACT: Accept the confirmation modal that appears
    await loginPage.acceptConsultantPopup();

    // ASSERT: Validate modal is dismissed
    // The modal should no longer be visible after accepting
    const okButton = loginPage.okayButton();
    const isModalVisible = await okButton.isVisible().catch(() => false);
    
    // Modal should either be hidden or not exist
    if (isModalVisible) {
      expect(isModalVisible).toBeFalsy();
    }
  });

  /**
   * Test Case 5: Consultant Selection from Dropdown
   * 
   * This test validates that the Consultant option can be selected from the dropdown
   */
  test('TC-005: Should select Consultant from user type dropdown', async ({ page }) => {
    // ACT: Select Consultant from dropdown
    await loginPage.selectConsultant();

    // ASSERT: Validate Consultant is selected
    const dropdown = loginPage.userTypeDropdown();
    const selectedValue = await dropdown.inputValue();
    
    expect(selectedValue).toBe('consult');
  });

  /**
   * Test Case 6: Terms and Conditions Checkbox
   * 
   * This test validates that the terms and conditions checkbox can be checked
   */
  test('TC-006: Should check the terms and conditions checkbox', async ({ page }) => {
    // ACT: Check terms checkbox
    await loginPage.checkTermsCheckbox();

    // ASSERT: Validate checkbox is checked
    const termsCheckbox = loginPage.termsCheckbox();
    expect(await termsCheckbox.isChecked()).toBeTruthy();
  });

  /**
   * Test Case 7: Sign In Button Click
   * 
   * This test validates that the Sign In button is clickable and form submission starts
   */
  test('TC-007: Should click Sign In button successfully', async ({ page }) => {
    // ARRANGE: Setup complete form
    await loginPage.enterUsername(TEST_DATA.username);
    await loginPage.enterPassword(TEST_DATA.password);
    await loginPage.selectUserType();
    await loginPage.acceptConsultantPopup();
    await loginPage.selectConsultant();
    await loginPage.checkTermsCheckbox();

    // ACT: Click Sign In button
    await loginPage.clickSignIn();

    // ASSERT: Validate page navigation started
    // Wait for URL to change or page to load
    await page.waitForURL('**/angularpractice/shop**', { timeout: 10000 });
    
    const finalUrl = loginPage.getCurrentUrl();
    expect(finalUrl).toContain('angularpractice/shop');
  });

  /**
   * Test Case 8: URL validation after successful login
   */
  test('TC-008: Should redirect to the shop page after successful login', async ({ page }) => {
    await loginPage.login(TEST_DATA.username, TEST_DATA.password);

    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain(successIndicators.urlContains);
    expect(currentUrl).not.toContain(successIndicators.notOnLoginPage);
  });

  /**
   * Test Case 9: Page title and login-state validation
   */
  test('TC-009: Should show the expected page title and successful login state', async ({ page }) => {
    await loginPage.login(TEST_DATA.username, TEST_DATA.password);

    const pageTitle = await loginPage.getPageTitle();
    expect(pageTitle).toContain(successIndicators.titleContains);

    const isLoginSuccessful = await loginPage.verifyLoginSuccess();
    expect(isLoginSuccessful).toBe(true);
  });

  /**
   * Test Case 10: Login page input visibility
   */
  test('TC-010: Should display the username and password fields', async ({ page }) => {
    expect(await loginPage.usernameInput().isVisible()).toBeTruthy();
    expect(await loginPage.passwordInput().isVisible()).toBeTruthy();
  });

  /**
   * Test Case 11: User-selection visibility
   */
  test('TC-011: Should display the radio buttons and selection controls', async ({ page }) => {
    expect(await loginPage.adminRadio().isVisible()).toBeTruthy();
    expect(await loginPage.userRadio().isVisible()).toBeTruthy();
  });

  /**
   * Test Case 12: Remaining form controls visibility
   */
  test('TC-012: Should display the dropdown, terms checkbox and sign in button', async ({ page }) => {
    expect(await loginPage.userTypeDropdown().isVisible()).toBeTruthy();
    expect(await loginPage.termsCheckbox().isVisible()).toBeTruthy();
  });

  /**
   * Test Case 13: Sign in button visibility
   */
  test('TC-013: Should display the sign in button', async ({ page }) => {
    expect(await loginPage.signInButton().isVisible()).toBeTruthy();
  });

  /**
   * Test Case 14: Default form state for radio and dropdown
   */
  test('TC-014: Should keep the default radio and dropdown values on initial load', async ({ page }) => {
    expect(await loginPage.adminRadio().isChecked()).toBeTruthy();

    const dropdownValue = await loginPage.userTypeDropdown().inputValue();
    expect(dropdownValue).toBe('stud');
  });

  /**
   * Test Case 15: Default checkbox and empty field state
   */
  test('TC-015: Should keep the checkbox unchecked and fields empty on initial load', async ({ page }) => {
    expect(await loginPage.termsCheckbox().isChecked()).toBeFalsy();
    expect(await loginPage.usernameInput().inputValue()).toBe('');
  });

  /**
   * Test Case 16: Password field should remain empty on initial load
   */
  test('TC-016: Should keep the password field empty on initial load', async ({ page }) => {
    expect(await loginPage.passwordInput().inputValue()).toBe('');
  });
});

/**
 * Additional test suite for edge cases and error scenarios
 */
test.describe.only('Login Page - Edge Cases and Error Handling', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  /**
   * Test Case 17: Empty credentials validation
   * 
   * This test validates form behavior with empty credentials
   */
  test('TC-017: Should not submit form with empty username', async ({ page }) => {
    // ARRANGE: Leave username empty, fill password
    await loginPage.enterPassword(TEST_DATA.password);
    await loginPage.selectUserType();
    
    // Dismiss modal if it appears
    try {
      await loginPage.acceptConsultantPopup();
    } catch (error) {
      // Modal might not appear or might be already dismissed
    }

    await loginPage.selectConsultant();
    await loginPage.checkTermsCheckbox();

    // ACT: Try to click sign in without waiting for a successful redirect
    await loginPage.clickSignIn({ waitForNavigation: false });

    // ASSERT: Should stay on the login page and not navigate to Angular app
    await expect(page).not.toHaveURL('/angularpractice/', { timeout: 5000 });
    await expect(page).toHaveURL(/rahulshettyacademy\.com\/loginpagePractise\/?$/);
    });

  /**
   * Test Case 18: Modal dismissal handling
   * 
   * This test validates that the modal can be properly handled
   */
  test('TC-018: Should handle User selection modal correctly', async ({ page }) => {
    // ACT: Select User radio button
    await loginPage.selectUserType();

    // ASSERT: User radio should be checked
    expect(await loginPage.userRadio().isChecked()).toBeTruthy();

    // ACT: Accept modal
    await loginPage.acceptConsultantPopup();

    // ASSERT: Should be able to continue with form
    await loginPage.selectConsultant();

    const selectedValue = await loginPage.userTypeDropdown().inputValue();
    expect(selectedValue).toBe('consult');
  });
});
