# API Test Automation - JSONPlaceholder

This repository contains automated API tests for the JSONPlaceholder mock API using Python, Pytest, and Playwright. 

It covers positive and negative test cases for standard CRUD operations (Create, Read, Update, Delete) on the `/posts` endpoint.

## Prerequisites
- Python 3.8+ installed on your system.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd api-test-automation


2. **Create a virtual environment (Recommended):**

python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

3. **Install dependencies:**
pip install -r requirements.txt

4. **running the tests:**
pytest test_crud.py -v


"Note: Because JSONPlaceholder is a mock service, some negative tests (like missing required fields) return successful status codes. In a strict microservice environment, I would expect those tests to assert 400 Bad Request or 422 Unprocessable Entity."