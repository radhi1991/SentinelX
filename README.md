# API Sentinel

API Sentinel is a comprehensive dashboard application for monitoring API security, health, and compliance. It provides real-time insights into API performance, security metrics, and post-quantum cryptography readiness.

*(Placeholder for an image or GIF of the application dashboard)*

## Core Features

API Sentinel offers a suite of tools to help you manage and secure your APIs effectively:

### Security Monitoring
- Real-time security score tracking with customizable thresholds.
- Vulnerability trend analysis with ML-powered predictions.
- Post-quantum cryptography readiness assessment.
- Automated security scanning and reporting.

### API Health Dashboard
- Live service status monitoring with uptime tracking.
- Performance metrics (latency, error rates) with historical data.
- Service Level Agreement (SLA) compliance monitoring.
- Automated health checks and alerts.

### Analytics & Reporting
- Interactive charts and customizable dashboards for data visualization.
- Real-time mobile notifications for critical events (planned).
- Custom metric tracking and reporting capabilities.
- Trend analysis and forecasting for proactive management.

### Compliance Management
- Automated checks against common compliance standards.
- Policy enforcement monitoring and reporting.
- Access control and audit logging for accountability.
- Generation of compliance reports.

## Technology Stack

API Sentinel is built using modern technologies to ensure performance and scalability:

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
- **Database**: SQLite (for development), PostgreSQL (for production)
- **Authentication**: JWT (JSON Web Tokens) with refresh token mechanism
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Go testing package with `testify`

## Getting Started

This section guides you through setting up API Sentinel for development and deployment.

### Prerequisites
- Node.js (v16 or higher)
- Go (v1.21 or higher)
- Git
- Docker (optional, for containerized deployment)

### Frontend Setup

1.  **Clone the Repository and Install Dependencies**:
    ```bash
    git clone https://github.com/radhi1991/API-Sentinel.git
    cd API-Sentinel/frontend
    npm install
    ```
2.  **Environment Configuration**:
    Copy the example environment file and customize it as needed:
    ```bash
    cp .env.example .env.local
    # Edit .env.local with your frontend configuration (e.g., API base URL)
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The frontend application will be accessible at `http://localhost:3000`.

4.  **Build for Production**:
    ```bash
    npm run build
    # Use npm run preview to see the production build locally
    ```

### Backend Setup

1.  **Install Go Dependencies**:
    Navigate to the backend directory and fetch dependencies:
    ```bash
    cd backend
    go mod tidy
    ```
2.  **Database Setup**:
    -   **Development (SQLite)**:
        Run database migrations (SQLite database will be created automatically):
        ```bash
        go run cmd/migrate/main.go
        ```
    -   **Production (PostgreSQL)**:
        Set the database URL environment variable and run migrations:
        ```bash
        export DB_URL="postgresql://user:password@host:port/database_name"
        go run cmd/migrate/main.go
        ```
3.  **Environment Variables**:
    The backend relies on environment variables for critical configuration. Ensure these are set before running the application. Refer to the "Security Best Practices" section for more on managing these securely.
    -   **Authentication**:
        ```bash
        export JWT_SECRET_KEY="your-very-strong-and-secret-key"
        ```
    -   **Rate Limiting (Optional)**:
        -   `RATE_LIMIT_RPS`: Requests per second allowed per IP (default: 10).
        -   `RATE_LIMIT_BURST`: Burst allowance per IP (default: 5).
        -   `RATE_LIMIT_CLIENT_EXPIRY_MINUTES`: How long an inactive client's rate limit data is kept (default: 5 minutes).
        Example:
        ```bash
        export RATE_LIMIT_RPS="20"
        export RATE_LIMIT_BURST="10"
        ```
4.  **Updating API Documentation (Swagger)**:
    If you modify backend API endpoints or their annotations, update the Swagger documentation:
    1.  Install `swag` CLI (if not already installed):
        ```bash
        go install github.com/swaggo/swag/cmd/swag@latest
        ```
    2.  From the project root, run the update script:
        ```bash
        npm run docs:update-api
        ```
        This script regenerates `backend/docs/swagger.json` and copies it to `website/api-docs/` for the static website.
5.  **Start the Server**:
    -   **Development**:
        ```bash
        go run main.go
        ```
    -   **Production**:
        Build the binary:
        ```bash
        go build -o api-sentinel
        ./api-sentinel
        ```
    The backend server will start on port `8080` by default.

## API Documentation (Endpoints)

The API Sentinel backend exposes several endpoints for managing and monitoring APIs. For a detailed and interactive API specification, please refer to the [Swagger documentation hosted on our website](website/docs.html) (once the website is deployed) or by running the application and accessing the generated `swagger.json`.

Key endpoint groups include:
-   `/auth`: Authentication (login, register).
-   `/apis`: API management (CRUD operations).
-   `/security`: Security scanning and vulnerability information.
-   `/compliance`: Compliance status and checks.
-   `/inventory`: API inventory and detailed metrics.
-   `/pqc`: Post-Quantum Cryptography analysis.
-   `/metrics`: General security and compliance metrics.

## Project Structure

A brief overview of the project's directory layout:
```
.
├── backend/            # Go backend application
│   ├── cmd/            # Command-line interface tools (e.g., migrations)
│   ├── docs/           # Swagger documentation files (generated)
│   ├── handlers/       # HTTP request handlers
│   ├── internal/       # Internal application logic (alternative to pkg for non-shared code)
│   ├── middleware/     # Gin middleware (auth, rate limiting, logging)
│   ├── models/         # Data models (structs)
│   ├── services/       # Business logic services
│   └── main.go         # Backend application entry point
├── frontend/           # React frontend application
│   ├── public/         # Static assets
│   ├── src/            # Frontend source code
│   └── package.json    # Frontend dependencies and scripts
├── website/            # Static informational website
│   ├── api-docs/       # Copied Swagger JSON for website
│   ├── css/            # Stylesheets for the website
│   ├── js/             # JavaScript for the website
│   └── *.html          # HTML pages
├── .github/            # GitHub specific files (workflows, templates)
├── CONTRIBUTING.md     # Guidelines for contributors
├── LICENSE             # Project license (MIT)
├── package.json        # Root package.json (for shared scripts like docs update)
├── ROADMAP.md          # Project roadmap
└── README.md           # This file
```

## Security Best Practices

When deploying and managing API Sentinel, it's crucial to follow security best practices to protect your data and infrastructure.

### Securing API Keys/Tokens
-   **JWT Storage**: Store JWTs securely. For web applications, HttpOnly cookies are generally recommended over Local Storage to mitigate Cross-Site Scripting (XSS) risks. If not using cookies, ensure your chosen client-side storage mechanism is appropriately secured.
-   **Token Expiration**: Implement and respect token expiration policies. Use refresh tokens to obtain new access tokens seamlessly, ensuring refresh tokens are stored securely and have a well-defined, finite lifespan.
-   **Minimize Exposure**: Avoid exposing tokens in URLs, client-side logs, or other easily accessible locations.

### Managing Access Controls
-   **Principle of Least Privilege**: While the current authentication is user-based, if future enhancements include roles or permissions, always grant only the minimum necessary permissions for any user or service account.
-   **Resource Scoping**: Design authorization logic to ensure users can only access resources they are explicitly permitted to view or modify.

### Input Validation
-   **Server-Side Validation**: The API performs rigorous input validation on all incoming data. This is a critical defense against many common web vulnerabilities.
-   **Client-Side Feedback**: While server-side validation is key, implement client-side validation in consuming applications to provide immediate feedback to users and reduce unnecessary API calls.

### Monitoring Security Events
-   **Regularly Review Logs**: The application logs security-relevant events (e.g., authentication attempts, errors). Regularly monitor these logs for suspicious activities or patterns that might indicate an attempted breach or misuse.
-   **Alerting Systems**: Consider integrating log output with alerting systems to be notified of critical security events in real-time.

### Environment Variables for Configuration
-   **Sensitive Data Protection**: **Never** hardcode sensitive information such as JWT secret keys, database credentials, or third-party API keys directly into your source code.
-   **Centralized Configuration**: Use environment variables to manage all sensitive configurations (`JWT_SECRET_KEY`, `DB_URL`, `RATE_LIMIT_RPS`, etc.). This is vital for security and simplifies deployment across different environments.
-   **`.env` Files in Development**: For local development, you can use `.env` files. Ensure these files are included in your `.gitignore` to prevent accidental commitment to version control. In production, use your deployment platform's secure mechanism for managing environment variables.

### Regular Updates and Patch Management
-   **Keep Dependencies Updated**: Regularly update all project dependencies (frontend, backend, and any development tools) to their latest stable versions. This helps patch known vulnerabilities.
-   **System Security**: Ensure the underlying operating system, database servers, and any other infrastructure components are also kept up-to-date with security patches.

By adhering to these practices, you can significantly enhance the security posture of your API Sentinel deployment.

## Contributing
We welcome contributions from the community! Whether it's reporting bugs, suggesting new features, or submitting code changes, your help is appreciated. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute.

## Roadmap
Curious about where API Sentinel is headed? Check out our [ROADMAP.md](ROADMAP.md) to see our planned features and long-term vision.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
-   **Project Link**: [API Sentinel GitHub Repository](https://github.com/radhi1991/API-Sentinel)
-   **Issue Tracker**: [Report a Bug or Suggest a Feature](https://github.com/radhi1991/API-Sentinel/issues)

## Acknowledgments
This project benefits from the work of many open-source libraries and communities. We extend our thanks to:
-   The Material-UI team for their excellent UI components.
-   The Recharts team for their powerful charting library.
-   The Go and Gin communities for providing robust backend frameworks and tools.
-   The React community for their innovative frontend library.
```
