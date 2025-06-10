package main

import (
	"context"
	"context"
	"log"
	"time"
	// "api-security-dashboard/db" // Assuming db models are in "sentinel/backend/models" or similar
	"sentinel/backend/handlers"
	"sentinel/backend/middleware"
	// "sentinel/backend/db" // Placeholder for db package
	"sentinel/backend/models" // Added for db.CreateIndexes potentially if it uses models
	"sentinel/backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "github.com/swaggo/gin-swagger" // Not used currently
	// "github.com/swaggo/files" // Not used currently
)

func main() {
	// Initialize MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(getMongoURI()))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Create database instance
	database := client.Database("api_security_dashboard")

	// Create indexes - Assuming db.CreateIndexes is a function you have defined elsewhere
	// For example, it might be in a package like "sentinel/backend/db"
	// If CreateIndexes uses models.API, ensure models is imported.
	// To use db.CreateIndexes, you would need to uncomment the import for "sentinel/backend/db"
	// and ensure that package and function exist.
	// For now, we are using models.API directly to ensure the models import is used.
	// if err := db.CreateIndexes(database); err != nil {
	// log.Printf("Warning: Failed to create indexes: %v", err)
	// }
	_ = models.API{} // Use a type from models to ensure it's imported.


	// Initialize services
	securityScanner := services.NewSecurityScanner(database)
	complianceChecker := services.NewComplianceChecker(database)
	pqcAnalyzer := services.NewPQCAnalyzer(database)
	metricsService := services.NewMetricsService(database)

	// Initialize handlers
	apiHandler := handlers.NewAPIHandler(database)
	securityHandler := handlers.NewSecurityHandler(database, securityScanner)
	complianceHandler := handlers.NewComplianceHandler(database, complianceChecker)
	inventoryHandler := handlers.NewInventoryHandler(pqcAnalyzer, metricsService)

	// Initialize Gin router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Swagger documentation
	// router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler)) // Commenting out as swaggerFiles and ginSwagger are not defined

	// API Routes
	api := router.Group("/api/v1")
	api.Use(middleware.RateLimitMiddleware()) // Apply rate limiting to all /api/v1 routes
	{
		// Authentication routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.POST("/register", handlers.Register)
		}

		// API Management routes
		apis := api.Group("/apis")
		apis.Use(middleware.AuthRequired())
		{
			apis.GET("", apiHandler.ListAPIs)
			apis.POST("", apiHandler.CreateAPI)
			apis.GET("/:id", apiHandler.GetAPI)
			apis.PUT("/:id", apiHandler.UpdateAPI)
			apis.DELETE("/:id", apiHandler.DeleteAPI)
		}

		// Security routes
		security := api.Group("/security")
		security.Use(middleware.AuthRequired())
		{
			security.GET("/vulnerabilities", securityHandler.ListVulnerabilities)
			security.GET("/alerts", securityHandler.ListSecurityAlerts)
			security.POST("/scan", securityHandler.TriggerSecurityScan)
			security.GET("/scan/:id", securityHandler.GetScanStatus)
		}

		// Compliance routes
		compliance := api.Group("/compliance")
		compliance.Use(middleware.AuthRequired())
		{
			compliance.GET("/status", complianceHandler.GetComplianceStatus)
			compliance.GET("/reports", complianceHandler.ListComplianceReports)
			compliance.POST("/check", complianceHandler.RunComplianceCheck)
			compliance.GET("/check/:id", complianceHandler.GetCheckStatus)
		}

		// Inventory routes
		inventory := api.Group("/inventory")
		inventory.Use(middleware.AuthRequired())
		{
			inventory.GET("", inventoryHandler.GetAPIInventory)
			inventory.GET("/:id", inventoryHandler.GetAPIDetails)
			inventory.GET("/cbom", inventoryHandler.GetCBOMInventory)
			inventory.GET("/cbom/:id", inventoryHandler.GetCBOMDetails)
			inventory.GET("/metrics/security", inventoryHandler.GetSecurityMetrics)
		}

		// PQC routes
		pqc := api.Group("/pqc")
		pqc.Use(middleware.AuthRequired())
		{
			pqc.GET("/status", handlers.GetPQCStatus)
			pqc.GET("/dependencies", handlers.ListCryptoDependencies)
			pqc.POST("/analyze", handlers.AnalyzePQCReadiness)
		}

		// Metrics routes
		metrics := api.Group("/metrics")
		metrics.Use(middleware.AuthRequired())
		{
			metrics.GET("/security", securityHandler.GetSecurityMetrics)
			metrics.GET("/compliance", complianceHandler.GetComplianceMetrics)
		}
	}

	// Start server
	log.Printf("Server starting on :8080")
	log.Fatal(router.Run(":8080"))
}

func getMongoURI() string {
	// In production, this should come from environment variables
	return "mongodb://localhost:27017"
}
