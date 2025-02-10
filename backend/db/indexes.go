package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateIndexes(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// APIs collection indexes
	apiIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "name", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{
				{Key: "type", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "security_score", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "pqc_readiness", Value: 1},
			},
		},
	}

	// Security scans indexes
	scanIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "api_id", Value: 1},
				{Key: "start_time", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "status", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "type", Value: 1},
			},
		},
	}

	// Compliance checks indexes
	complianceIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "api_id", Value: 1},
				{Key: "standard", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "status", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "start_time", Value: -1},
			},
		},
	}

	// Vulnerability indexes
	vulnIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "api_id", Value: 1},
				{Key: "severity", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "status", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "created_at", Value: -1},
			},
		},
	}

	// Create indexes for each collection
	collections := map[string][]mongo.IndexModel{
		"apis":              apiIndexes,
		"security_scans":    scanIndexes,
		"compliance_checks": complianceIndexes,
		"vulnerabilities":   vulnIndexes,
	}

	for collection, indexes := range collections {
		_, err := db.Collection(collection).Indexes().CreateMany(ctx, indexes)
		if err != nil {
			log.Printf("Failed to create indexes for collection %s: %v", collection, err)
			return err
		}
	}

	return nil
}
