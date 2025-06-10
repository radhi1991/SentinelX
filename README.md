# SentinelX

API Sentinel is a comprehensive dashboard application for monitoring API security, health, and compliance. It provides real-time insights into API performance, security metrics, and post-quantum cryptography readiness.

Image will be added later

## 🌟 Features

### Security Monitoring
- 🔒 Real-time security score tracking with customizable thresholds
- 🔍 Vulnerability trend analysis with ML-powered predictions
- 🚀 Post-quantum cryptography readiness assessment
- 🛡️ Automated security scanning and reporting

### API Health Dashboard
- 📊 Live service status monitoring with uptime tracking
- ⚡ Performance metrics with historical data
- 🎯 SLA compliance monitoring
- 🔄 Automated health checks and alerts

### Analytics & Reporting
- 📈 Interactive charts and customizable dashboards
- 📱 Real-time mobile notifications
- 📊 Custom metric tracking and reporting
- 📉 Trend analysis and forecasting

### Compliance Management
- ✅ Automated compliance checks
- 📋 Policy enforcement monitoring
- 🔐 Access control and audit logging
- 📝 Compliance report generation

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Components**: Material-UI v5
- **State Management**: Redux Toolkit
- **Data Visualization**: Recharts
- **API Client**: Axios
- **Testing**: Jest & React Testing Library
- **Build Tool**: Vite

### Backend
- **Runtime**: Go 1.21
- **Framework**: Gin Web Framework
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Go testing package with testify

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Go (v1.21 or higher)
- Git
- Docker (optional)

### Frontend Setup

1. **Clone and Install Dependencies**
```bash
git clone https://github.com/radhi1991/API-Sentinel.git
cd API-Sentinel/frontend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Development Server**
```bash
npm run dev
# Access the app at http://localhost:3000
```

4. **Build for Production**
```bash
npm run build
npm run preview
```

### Backend Setup

1. **Install Go Dependencies**
```bash
cd backend
go mod tidy
```

2. **Database Setup**
```bash
# Development (SQLite)
go run cmd/migrate/main.go

# Production (PostgreSQL)
export DB_URL="postgresql://user:password@localhost:5432/api_sentinel"
go run cmd/migrate/main.go
```

3. **Environment Variables**
   Before running the backend, ensure you have set the necessary environment variables.

   **Authentication:**
   ```bash
   export JWT_SECRET_KEY="your-secure-secret-key"
   ```

   **Rate Limiting (Optional):**
   - `RATE_LIMIT_RPS`: Requests per second allowed per IP (default: 10).
   - `RATE_LIMIT_BURST`: Burst allowance per IP (default: 5).
   - `RATE_LIMIT_CLIENT_EXPIRY_MINUTES`: How long an inactive client's rate limit data is kept (default: 5 minutes).
   Example:
   ```bash
   export RATE_LIMIT_RPS="20"
   export RATE_LIMIT_BURST="10"
   export RATE_LIMIT_CLIENT_EXPIRY_MINUTES="10"
   ```

4. **Updating API Documentation**
   If you make changes to the backend API (e.g., adding new endpoints or modifying existing ones with annotations), you need to update the Swagger documentation.
   The `swaggo/swag` tool is used for this. First, ensure `swag` is installed:
   ```bash
   go install github.com/swaggo/swag/cmd/swag@latest
   ```
   Then, you can run the following script from the project root to regenerate the `swagger.json` file and copy it to the website's assets:
   ```bash
   npm run docs:update-api
   ```
   This script executes `swag init` in the `backend` directory and then copies the updated `swagger.json` to `website/api-docs/`.

5. **Start the Server**
```bash
# Development
go run main.go

# Production
go build
./api-sentinel
```

## 📚 API Documentation

### Authentication
```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### API Inventory
```http
GET    /api/v1/inventory          # List all APIs
POST   /api/v1/inventory          # Register new API
GET    /api/v1/inventory/:id      # Get API details
PUT    /api/v1/inventory/:id      # Update API
DELETE /api/v1/inventory/:id      # Remove API
```

### Security Metrics
```http
GET /api/v1/metrics/security
GET /api/v1/metrics/security/:id/history
POST /api/v1/metrics/security/scan
```

### Performance Monitoring
```http
GET /api/v1/metrics/performance
GET /api/v1/metrics/performance/:id/uptime
GET /api/v1/metrics/performance/:id/latency
```

## 📁 Project Structure
```
.
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── store/              # Redux store
│   │   ├── theme/              # MUI theme
│   │   └── utils/              # Utility functions
│   └── package.json
│
└── backend/
    ├── cmd/                    # Command-line tools
    ├── internal/
    │   ├── api/               # API handlers
    │   ├── middleware/        # Custom middleware
    │   ├── models/            # Data models
    │   └── services/          # Business logic
    ├── pkg/                   # Shared packages
    └── main.go
```

## 🔒 Security Best Practices

When deploying and managing API Sentinel, it's crucial to follow security best practices to protect your data and infrastructure.

### Securing API Keys/Tokens
- **JWT Storage**: Store JWTs (JSON Web Tokens) securely. For web applications, HttpOnly cookies are generally recommended over Local Storage to mitigate XSS risks. If not using cookies, ensure your chosen storage mechanism is secure.
- **Token Expiration**: Implement and respect token expiration. Use refresh tokens to obtain new access tokens without requiring users to re-authenticate frequently, and ensure refresh tokens are stored securely and have a longer, but finite, lifespan.
- **Minimize Exposure**: Do not expose tokens unnecessarily in URLs, logs, or client-side scripts that are easily accessible.

### Managing Access Controls
- **Principle of Least Privilege**: While the current authentication identifies a user, if future enhancements include roles or permissions, always grant only the minimum necessary permissions for any user or service account.
- **Resource Scoping**: Ensure users can only access resources they are authorized for (e.g., their own API data if the platform becomes multi-tenant).

### Input Validation
- **Client and Server Validation**: The API performs input validation on incoming data. Ensure that any client applications interacting with the API also perform client-side validation for a better user experience and to reduce invalid requests.
- **Valid Data**: Be mindful of sending valid and sanitized data to the API endpoints as per the API documentation to prevent errors and potential security issues.

### Monitoring Security Events
- **Regularly Review Logs**: The application logs security-relevant events, including authentication successes and failures, and errors in API handlers. Regularly monitor these logs for suspicious activities or patterns that might indicate an attempted breach or misuse.
- **Alerting**: Consider setting up alerts based on critical log events (e.g., multiple failed login attempts for a single user or from a specific IP).

### Environment Variables for Configuration
- **Sensitive Data**: **Never** hardcode sensitive information like JWT secret keys, database credentials, or API keys directly into your code.
- **Use Environment Variables**: Store all sensitive configuration details (e.g., `JWT_SECRET_KEY`, `DB_URL`, `RATE_LIMIT_RPS`) as environment variables. This is critical for security and maintainability.
- **`.env` Files**: For local development, you can use `.env` files (like the provided `.env.example` for the frontend) but ensure these files are listed in your `.gitignore` and are not committed to version control. In production, use your deployment platform's mechanism for managing environment variables.

### Regular Updates and Patch Management
- **Keep Dependencies Updated**: Regularly update all project dependencies (both frontend and backend) to their latest stable versions. This helps patch known vulnerabilities that could be exploited.
- **System Updates**: Ensure the underlying operating system and any other services (like databases, reverse proxies) are also kept up-to-date with security patches.

By following these practices, you can significantly improve the security posture of your API Sentinel deployment.

## 🤝 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links
- [Documentation](docs/README.md)
- [API Reference](docs/API_REFERENCE.md)
- [Roadmap](ROADMAP.md)

## 👥 Contact
- **Project Link**: [API Sentinel GitHub](https://github.com/radhi1991/API-Sentinel)
- **Report Bug**: [Issue Tracker](https://github.com/radhi1991/API-Sentinel/issues)

## 🙏 Acknowledgments
- Material-UI team for the excellent UI components
- Recharts team for the powerful charting library
- Go community for the robust backend framework
