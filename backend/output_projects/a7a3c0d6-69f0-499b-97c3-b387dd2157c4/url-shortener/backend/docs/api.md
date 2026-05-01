# API Documentation
## Introduction
This API provides endpoints for URL shortening and analytics.
## Endpoints
### 1. Shorten URL
* **POST /shorten**: Shorten a URL and return the shortened URL.
* **GET /{short_url}**: Redirect to the original URL.
### 2. Analytics
* **GET /analytics**: Get the hit count for all shortened URLs.
## Authentication
* **Authorization Header**: Include a valid JWT token in the Authorization header for all requests.