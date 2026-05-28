import pytest
from playwright.sync_api import Playwright, APIRequestContext
@pytest.fixture(scope="session")
def api(playwright: Playwright) -> APIRequestContext:
    """Sets up the Playwright API request context with the Postman Echo base URL."""
    request_context = playwright.request.new_context(
        base_url="https://postman-echo.com"
    )
    yield request_context
    request_context.dispose()