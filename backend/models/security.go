package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Vulnerability struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	APIID       primitive.ObjectID `bson:"api_id" json:"apiId"`
	Type        string            `bson:"type" json:"type"`
	Severity    string            `bson:"severity" json:"severity"` // Critical, High, Medium, Low
	Description string            `bson:"description" json:"description"`
	Status      string            `bson:"status" json:"status"` // Open, In Progress, Resolved
	CreatedAt   time.Time         `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time         `bson:"updated_at" json:"updatedAt"`
}

type SecurityAlert struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	APIID       primitive.ObjectID `bson:"api_id" json:"apiId"`
	Type        string            `bson:"type" json:"type"`
	Severity    string            `bson:"severity" json:"severity"`
	Message     string            `bson:"message" json:"message"`
	Timestamp   time.Time         `bson:"timestamp" json:"timestamp"`
	Status      string            `bson:"status" json:"status"` // New, Acknowledged, Resolved
}

type SecurityScan struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	APIID     primitive.ObjectID `bson:"api_id" json:"apiId"`
	Type      string            `bson:"type" json:"type"` // Vulnerability, Dependency, Configuration
	Status    string            `bson:"status" json:"status"`
	StartTime time.Time         `bson:"start_time" json:"startTime"`
	EndTime   time.Time         `bson:"end_time,omitempty" json:"endTime,omitempty"`
	Results   []ScanResult      `bson:"results" json:"results"`
}

type ScanResult struct {
	Type        string `bson:"type" json:"type"`
	Description string `bson:"description" json:"description"`
	Severity    string `bson:"severity" json:"severity"`
}
