# API Test Automation - Authorization
This repository contains automated API tests focusing on Authentication and Authorization using the Postman Echo mock service. Built with Python, Pytest, and Playwright.
It covers one positive happy-path test, and several critical negative edge cases targeting the `/basic-auth` endpoint.
## Prerequisites
- Python 3.8+ installed on your system.
- pytest 8.2.1
- playwright 1.44.0
- pytest-playwright 0.5.0

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd api-auth-automation

2. **Create a virtual environment (Recommended):**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

3.  **Install dependencies:**
   ```bash
   pip install -r requirements.txt

4.  **Running the tests:**
   ```bash 
   pytest test_auth.py -v