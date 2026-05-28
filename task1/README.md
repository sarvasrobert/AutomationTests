# API Test Automation Suite
This test suite automates the validation of critical API endpoints, covering both core CRUD operations and security boundaries. Positive tests verify that the system securely authenticates legitimate users and accurately processes standard data requests. Negative tests are included to ensure the API degrades gracefully when encountering malformed data, incorrect HTTP methods, or invalid credentials. Testing authorization prevents unauthorized access and data breaches by strictly enforcing credential validation. Ultimately, these tests are essential because they guarantee system reliability, safeguard user data, and prevent backend failures under unpredictable conditions.
## Prerequisites
- **Node.js** (v18 or higher) installed on your system.
## Setup Instructions
1. **Open your terminal or Command Prompt and navigate to the project directory:**

      cmd
      ```
      cd [your/local/directory]
```

2. **Initialize an npm project (if you haven't already) and install the native Playwright Test framework:**

      cmd
      ```
      npm init -y
      npm install -D @playwright/test
      ```

3. **Install Playwright dependencies (this ensures the Playwright environment is fully configured, even for API testing):**


      cmd
      ```
      npx playwright install
      ```
4. **Running the Tests in Playwright:**
      To execute the suite using the Playwright test runner in your command line, run:

      cmd
      ```
      npx playwright test
      ```
5. **Additional Execution Commands**
      Run in UI Mode: To visually step through the API requests and explore the responses natively in Playwright:

      cmd
      ```
      npx playwright test --ui
      ```
      Run a Specific File: Focus the test run on just the CRUD or Auth tests:

      cmd
      ```
      npx playwright test Auth.spec.ts
      ```
      View the HTML Report: If any tests fail, or you want to see a detailed breakdown of the execution:

      cmd
      ```
      npx playwright show-report
      ```