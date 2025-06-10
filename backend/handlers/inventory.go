package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"sentinel/backend/services" // Assuming services is in this path
)

type InventoryHandler struct {
	pqcAnalyzer    *services.PQCAnalyzer
	metricsService *services.MetricsService
}

func NewInventoryHandler(pqcAnalyzer *services.PQCAnalyzer, metricsService *services.MetricsService) *InventoryHandler {
	return &InventoryHandler{
		pqcAnalyzer:    pqcAnalyzer,
		metricsService: metricsService,
	}
}

// GetAPIInventory returns the list of APIs with their security and compliance details
func (h *InventoryHandler) GetAPIInventory(c *gin.Context) {
	apis, err := h.metricsService.GetAPIInventory(c.Request.Context())
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetAPIInventory, Event: Error, Details: Failed to get API inventory from service, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve API inventory"})
		return
	}
	c.JSON(http.StatusOK, apis)
}

// GetCBOMInventory returns the Cryptographic Bill of Materials
func (h *InventoryHandler) GetCBOMInventory(c *gin.Context) {
	cbom, err := h.pqcAnalyzer.GetAllCBOM(c.Request.Context())
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetCBOMInventory, Event: Error, Details: Failed to get CBOM inventory from service, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve CBOM inventory"})
		return
	}
	c.JSON(http.StatusOK, cbom)
}

// GetSecurityMetrics returns detailed security metrics
func (h *InventoryHandler) GetSecurityMetrics(c *gin.Context) {
	metrics, err := h.metricsService.GetSecurityMetrics(c.Request.Context())
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetSecurityMetrics, Event: Error, Details: Failed to get security metrics from service, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve security metrics"})
		return
	}
	c.JSON(http.StatusOK, metrics)
}

// GetAPIDetails returns detailed information about a specific API
func (h *InventoryHandler) GetAPIDetails(c *gin.Context) {
	apiID := c.Param("id")
	// Basic validation for apiID can be added here if needed, e.g., checking if it's empty.
	// However, ObjectID validation is typically done by the service or database layer.
	// For now, we assume apiID is passed as is.
	details, err := h.metricsService.GetAPIDetails(c.Request.Context(), apiID)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetAPIDetails, Event: Error, Details: Failed to get API details from service, API_ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), apiID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve API details"})
		return
	}
	c.JSON(http.StatusOK, details)
}

// GetCBOMDetails returns detailed CBOM information for a specific API
func (h *InventoryHandler) GetCBOMDetails(c *gin.Context) {
	apiID := c.Param("id")
	// Similar to GetAPIDetails, apiID validation can be enhanced.
	cbom, err := h.pqcAnalyzer.GenerateCBOM(c.Request.Context(), apiID)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetCBOMDetails, Event: Error, Details: Failed to generate CBOM details from service, API_ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), apiID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate CBOM details"})
		return
	}
	c.JSON(http.StatusOK, cbom)
}
