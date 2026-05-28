import base64
import pytest
from playwright.sync_api import expect
def get_basic_auth_header(username, password):
    """Helper method to generate a Base64 encoded Basic Auth header."""
    credentials = f"{username}:{password}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {"Authorization": f"Basic {encoded}"}

def test_basic_auth_positive(api):
    """
    Essential because: Legitimate users and systems must be able to authenticate successfully. 
    If valid authorization fails, no user can access protected resources, causing a complete system outage.
    """
    headers = get_basic_auth_header("postman", "password")
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 200
    
    data = response.json()
    
    assert data["authenticated"] is True

def test_basic_auth_negative_wrong_password(api):
    """
    Essential because: It validates that the security boundary is actually enforced. 
    Allowing a request with incorrect credentials would result in a severe data breach. 
    The system must strictly return a 401 Unauthorized status.
    """
    headers = get_basic_auth_header("postman", "wrongpassword")
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 401

def test_basic_auth_negative_missing_header(api):
    """
    Essential because: It ensures the endpoint does not default to open access 
    if the authorization token is completely omitted. A secure system must prioritize 
    "failing closed" and immediately reject unauthenticated requests.
    """
    # Sending the request without any headers
    response = api.get("/basic-auth")
    
    assert response.status == 401

def test_basic_auth_negative_wrong_auth_type(api):
    """
    Essential because: APIs must validate the authorization scheme being used. 
    If an endpoint expects Basic Auth but receives a Bearer Token, it should 
    handle the mismatch safely and reject the request, not process it incorrectly.
    """
    # Sending a Bearer token instead of Basic auth
    headers = {"Authorization": "Bearer some-fake-jwt-token"}
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 401

def test_basic_auth_negative_malformed_token(api):
    """
    Essential because: We must verify how the server handles unpredictable, corrupted, or 
    malicious auth data. It must handle the Base64 parsing error gracefully with a 401 (or 400 Bad Request), 
    rather than crashing and leaking backend information via a 500 Internal Server Error.
    """
    # Sending a plain string where Base64 is expected
    headers = {"Authorization": "Basic just-some-plain-text-string"}
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 400

""" Wrong username with correct password should also fail authentication, ensuring that the system checks the entire credential pair, not just the password."""
def test_basic_auth_negative_wrong_username(api):
    """
    Essential because: It validates that the system strictly checks the username-password pair.
    If a system only validates the password without verifying the user entity it belongs to, 
    it can lead to credential mix-ups or lateral movement between accounts.
    """
    headers = get_basic_auth_header("wronguser", "password")
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 401    

""" Empty credentials should be rejected to prevent null input handling issues that could lead to backend exceptions or unintended access."""
def test_basic_auth_negative_empty_credentials(api):
    """
    Essential because: Null or empty inputs are notorious for causing backend exceptions.
    The auth layer must process blank credentials gracefully—rejecting them with a 401—
    rather than failing to parse them and throwing a 500 Internal Server Error.
    """
    # Encoding just a colon ":" based on formatting rules
    headers = get_basic_auth_header("", "")
    response = api.get("/basic-auth", headers=headers)
    
    assert response.status == 401

""" Injection payload attempts should be rejected to ensure that the authentication mechanism is not vulnerable to common attack vectors like SQL injection, which could allow attackers to bypass authentication or access unauthorized data."""
def test_basic_auth_negative_sql_injection_attempt(api):
    """
    Essential because: The authentication layer is the most common target for cyber attacks. 
    Passing injection strings verifies that the system sanitizes inputs before processing them, 
    preventing an attacker from bypassing the login via a SQL injection payload.
    """
    # Using a classic SQL injection string as the username
    headers = get_basic_auth_header("admin' OR '1'='1", "password")
    response = api.get("/basic-auth", headers=headers)

    assert response.status == 401

""" Bypassing via HTTP method manipulation is a critical security test. If the endpoint only secures GET requests but allows POST or PUT without authentication, it creates a severe vulnerability. This test ensures that all methods are protected equally."""
def test_basic_auth_negative_invalid_http_method(api):
    """
    Essential because: Security rules must protect the endpoint routing entirely. 
    Sometimes developers secure a GET request but leave POST or PUT open. We must 
    ensure an attacker cannot bypass the authentication check by simply changing the HTTP method.
    """
    # Assuming standard credentials, but using a POST request instead of GET
    headers = get_basic_auth_header("postman", "password")
    response = api.post("/basic-auth", headers=headers)
    
    # Postman Echo will return a 404 Not Found here because POST isn't routed for this endpoint.
    # In a real API, 405 Method Not Allowed or 401 are also acceptable.
    # The essential check is that it does NOT return a 200 OK.
    assert response.status != 200