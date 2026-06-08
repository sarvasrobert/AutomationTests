# API Test Automation - Authorization
This repository contains automated API tests focusing on Authentication and Authorization using the Postman Echo mock service. Built with Python, Pytest, and Playwright.
It covers one positive happy-path test, and several critical negative edge cases targeting the `/basic-auth` endpoint.
## Prerequisites
- Python 3.8+ installed on your system.
- pytest 9.0.3
- playwright 1.60.0
- pytest-playwright 0.8.0

## Setup Instructions
1. **Clone the repository:**
   ```cmd
   git clone <your-repository-url>
   cd api-auth-automation
   ```

2. **Create a virtual environment (Recommended):**
   ```cmd
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```

3.  **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```
   
   If you have problems to install requirements  use these cmmds.
   ```cmd
   pip install -U pytest
   pip install pytest-playwright
   ```
   
4.  **Running the tests:**
   ```cmd
   pytest test_auth.py -v
   ```