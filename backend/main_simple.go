package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swagger "github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"
	"net/http"
	"time"

	_ "github.com/windsurf-project/backend/docs" // Import generated docs
)

// @title API Security Dashboard API
// @version 1.0
// @description API for monitoring and managing API security metrics
// @host localhost:8080
// @BasePath /api

// TimelineResponse represents the activity timeline response
type TimelineResponse struct {
	Data []TimelineEvent `json:"data"`
}

// TimelineEvent represents a single event in the timeline
type TimelineEvent struct {
	Timestamp string `json:"timestamp"`
	Event     string `json:"event"`
	Type      string `json:"type"`
}

// MetricsResponse represents the overall metrics response
type MetricsResponse struct {
	TotalAPIs       int     `json:"total_apis"`
	SecureAPIs      int     `json:"secure_apis"`
	VulnerableAPIs  int     `json:"vulnerable_apis"`
	ComplianceScore int     `json:"compliance_score"`
	APICalls24h     int     `json:"api_calls_24h"`
	ErrorRate       float64 `json:"error_rate"`
	Alerts          int     `json:"alerts"`
	CriticalAlerts  int     `json:"critical_alerts"`
	Uptime          float64 `json:"uptime"`
	AvgResponseTime int     `json:"avg_response_time"`
	TotalEndpoints  int     `json:"total_endpoints"`
}
func main() {
	router := gin.Default()

	// Debug middleware
	router.Use(func(c *gin.Context) {
		fmt.Printf("[DEBUG] %s %s\n", c.Request.Method, c.Request.URL.Path)
		c.Next()
	})

	// Configure CORS - must be before routes
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	// Serve Swagger documentation
	router.GET("/swagger/*any", swagger.WrapHandler(swaggerFiles.Handler, swagger.URL("http://localhost:8080/swagger/doc.json")))

	// API Routes
	apiGroup := router.Group("/api")
	{
		// @Summary Get API health status
		// @Description Get health status of the API and its dependencies
		// @Tags health
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /health/status [get]
		apiGroup.GET("/health/status", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "healthy",
				"timestamp": time.Now().Format(time.RFC3339),
				"version": "1.0.0",
				"services": gin.H{
					"api": "healthy",
					"database": "healthy",
					"cache": "healthy",
				},
				"metrics": gin.H{
					"uptime": "99.99%",
					"latency": "120ms",
					"memory_usage": "256MB",
				},
			})
		})
		// @Summary Get activity timeline
		// @Description Get recent activity events with timestamps
		// @Tags activity
		// @Produce json
		// @Success 200 {object} TimelineResponse
		// @Router /activity/timeline [get]
		apiGroup.GET("/activity/timeline", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"data": []gin.H{
					{"timestamp": time.Now().Add(-1 * time.Hour).Format(time.RFC3339), "event": "API Security Scan", "type": "security"},
					{"timestamp": time.Now().Add(-2 * time.Hour).Format(time.RFC3339), "event": "Performance Test", "type": "performance"},
					{"timestamp": time.Now().Add(-3 * time.Hour).Format(time.RFC3339), "event": "Config Update", "type": "config"},
				},
			})
		})

		// @Summary Get overall metrics
		// @Description Get general metrics including API counts and scores
		// @Tags metrics
		// @Produce json
		// @Success 200 {object} MetricsResponse
		// @Router /metrics [get]
		apiGroup.GET("/metrics", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"total_apis":        150,
				"secure_apis":       120,
				"vulnerable_apis":   30,
				"compliance_score":  85,
				"api_calls_24h":     25000,
				"error_rate":        0.02,
				"alerts":            15,
				"critical_alerts":   3,
				"uptime":            99.99,
				"avg_response_time": 120,
				"total_endpoints":   250,
			})
		})

		// @Summary Get performance metrics
		// @Description Get detailed performance metrics with trends
		// @Tags metrics
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /metrics/performance [get]
		apiGroup.GET("/metrics/performance", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"metrics": []gin.H{
					{"name": "Response Time", "value": 120, "unit": "ms", "trend": "-5%"},
					{"name": "Throughput", "value": 1000, "unit": "req/s", "trend": "+10%"},
					{"name": "Error Rate", "value": 0.02, "unit": "%", "trend": "-1%"},
				},
			})
		})

		// @Summary Get security metrics
		// @Description Get detailed security metrics and scores
		// @Tags security
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /metrics/security [get]
		apiGroup.GET("/metrics/security", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"overall_score": 85,
				"metrics": []gin.H{
					{"name": "Authentication", "score": 90, "trend": "+5"},
					{"name": "Authorization", "score": 85, "trend": "+2"},
					{"name": "Data Encryption", "score": 95, "trend": "0"},
				},
			})
		})

		// @Summary Get security alerts summary
		// @Description Get summary of security alerts by severity
		// @Tags security
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /security/alerts [get]
		apiGroup.GET("/security/alerts", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"alerts": []gin.H{
					{"severity": "Critical", "count": 2},
					{"severity": "High", "count": 5},
					{"severity": "Medium", "count": 8},
					{"severity": "Low", "count": 12},
				},
			})
		})

		// @Summary Get detailed security alerts
		// @Description Get detailed information about security alerts
		// @Tags security
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /security/alerts/details [get]
		apiGroup.GET("/security/alerts/details", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"total_alerts": 15,
				"by_severity": gin.H{
					"critical": 2,
					"high":     5,
					"medium":   8,
					"low":      12,
				},
				"recent": []gin.H{
					{
						"id":        "alert-1",
						"timestamp": time.Now().Add(-10 * time.Minute).Format(time.RFC3339),
						"category":  "Authentication",
						"severity":  "high",
						"message":   "Multiple failed login attempts detected",
						"status":    "open",
					},
				},
			})
		})

		// @Summary Get API categories
		// @Description Get list of API categories with counts
		// @Tags inventory
		// @Produce json
		// @Success 200 {object} map[string]interface{}
		// @Router /inventory/categories [get]
		apiGroup.GET("/inventory/categories", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"categories": []gin.H{
					{"name": "REST", "count": 45},
					{"name": "GraphQL", "count": 25},
					{"name": "gRPC", "count": 15},
					{"name": "WebSocket", "count": 15},
				},
			})
		})
	}

	// Start server
	fmt.Println("Server starting on http://localhost:8080")
	fmt.Println("Swagger UI available at http://localhost:8080/docs/index.html")
	if err := router.Run(":8080"); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
