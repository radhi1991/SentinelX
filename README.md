# API Sentinel

API Sentinel is a comprehensive dashboard application for monitoring API security, health, and compliance. It provides real-time insights into API performance, security metrics, and post-quantum cryptography readiness.

![API Sentinel Dashboard](docs/dashboard-preview.png)

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

3. **Start the Server**
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
