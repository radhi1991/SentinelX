package handlers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"sentinel/backend/models"
)

var validate = validator.New()

type APIHandler struct {
	db *mongo.Database
}

func NewAPIHandler(db *mongo.Database) *APIHandler {
	return &APIHandler{db: db}
}

// ListAPIs returns all APIs with optional filtering
func (h *APIHandler) ListAPIs(c *gin.Context) {
	collection := h.db.Collection("apis")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Parse query parameters for filtering
	apiType := c.Query("type")
	filter := bson.M{}
	if apiType != "" {
		filter["type"] = apiType
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: ListAPIs, Event: Error, Details: Failed to fetch APIs, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch APIs"})
		return
	}
	defer cursor.Close(ctx)

	var apis []models.API
	if err := cursor.All(ctx, &apis); err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: ListAPIs, Event: Error, Details: Failed to decode APIs, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode APIs"})
		return
	}

	c.JSON(http.StatusOK, apis)
}

// CreateAPI creates a new API
func (h *APIHandler) CreateAPI(c *gin.Context) {
	var api models.API
	if err := c.ShouldBindJSON(&api); err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: CreateAPI, Event: Error, Details: Failed to bind JSON, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := validate.Struct(&api); err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: CreateAPI, Event: Error, Details: Validation failed, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := h.db.Collection("apis")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	api.ID = primitive.NewObjectID()
	api.CreatedAt = time.Now()
	api.UpdatedAt = time.Now()

	result, err := collection.InsertOne(ctx, api)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: CreateAPI, Event: Error, Details: Failed to create API in DB, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create API"})
		return
	}

	api.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, api)
}

// GetAPI returns a specific API by ID
func (h *APIHandler) GetAPI(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: GetAPI, Event: Error, Details: Invalid API ID format, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
		return
	}

	collection := h.db.Collection("apis")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var api models.API
	err = collection.FindOne(ctx, bson.M{"_id": id}).Decode(&api)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Timestamp: %s, IP: %s, Handler: GetAPI, Event: Info, Details: API not found, ID: %s", time.Now().Format(time.RFC3339), c.ClientIP(), idParam)
			c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
			return
		}
		log.Printf("Timestamp: %s, IP: %s, Handler: GetAPI, Event: Error, Details: Failed to fetch API from DB, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch API"})
		return
	}

	c.JSON(http.StatusOK, api)
}

// UpdateAPI updates an existing API
func (h *APIHandler) UpdateAPI(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: UpdateAPI, Event: Error, Details: Invalid API ID format, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
		return
	}

	var api models.API
	// Preserve ID and CreatedAt from path and existing document if necessary
	if api.ID.IsZero() && idParam != "" {
		objID, err := primitive.ObjectIDFromHex(idParam)
		if err == nil { // if idParam is a valid ObjectID hex
			api.ID = objID
		}
	}

	if err := c.ShouldBindJSON(&api); err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: UpdateAPI, Event: Error, Details: Failed to bind JSON, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := validate.Struct(&api); err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: UpdateAPI, Event: Error, Details: Validation failed, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := h.db.Collection("apis")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	api.UpdatedAt = time.Now()
	update := bson.M{"$set": api}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: UpdateAPI, Event: Error, Details: Failed to update API in DB, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update API"})
		return
	}

	if result.MatchedCount == 0 {
		log.Printf("Timestamp: %s, IP: %s, Handler: UpdateAPI, Event: Info, Details: API not found for update, ID: %s", time.Now().Format(time.RFC3339), c.ClientIP(), idParam)
		c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
		return
	}

	c.JSON(http.StatusOK, api)
}

// DeleteAPI deletes an API
func (h *APIHandler) DeleteAPI(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: DeleteAPI, Event: Error, Details: Invalid API ID format, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid API ID"})
		return
	}

	collection := h.db.Collection("apis")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		log.Printf("Timestamp: %s, IP: %s, Handler: DeleteAPI, Event: Error, Details: Failed to delete API from DB, ID: %s, Error: %v", time.Now().Format(time.RFC3339), c.ClientIP(), idParam, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete API"})
		return
	}

	if result.DeletedCount == 0 {
		log.Printf("Timestamp: %s, IP: %s, Handler: DeleteAPI, Event: Info, Details: API not found for deletion, ID: %s", time.Now().Format(time.RFC3339), c.ClientIP(), idParam)
		c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "API deleted successfully"})
}
