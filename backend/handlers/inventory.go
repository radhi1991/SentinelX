package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, apis)
}

// GetCBOMInventory returns the Cryptographic Bill of Materials
func (h *InventoryHandler) GetCBOMInventory(c *gin.Context) {
	cbom, err := h.pqcAnalyzer.GetAllCBOM(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cbom)
}

// GetSecurityMetrics returns detailed security metrics
func (h *InventoryHandler) GetSecurityMetrics(c *gin.Context) {
	metrics, err := h.metricsService.GetSecurityMetrics(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, metrics)
}

// GetAPIDetails returns detailed information about a specific API
func (h *InventoryHandler) GetAPIDetails(c *gin.Context) {
	apiID := c.Param("id")
	details, err := h.metricsService.GetAPIDetails(c.Request.Context(), apiID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, details)
}

// GetCBOMDetails returns detailed CBOM information for a specific API
func (h *InventoryHandler) GetCBOMDetails(c *gin.Context) {
	apiID := c.Param("id")
	cbom, err := h.pqcAnalyzer.GenerateCBOM(c.Request.Context(), apiID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cbom)
}
