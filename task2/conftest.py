import pytest
from playwright.sync_api import Playwright, APIRequestContext
@pytest.fixture(scope="session")
def api(playwright: Playwright) -> APIRequestContext:
    """
    Sets up the Playwright API request context with the base SUT URL.
    Scope is set to session to reuse the connection pool across tests.
    """
    request_context = playwright.request.new_context(
        base_url="https://jsonplaceholder.typicode.com",
        extra_http_headers={
            "Content-type": "application/json; charset=UTF-8"
        }
    )
    yield request_context
    request_context.dispose()