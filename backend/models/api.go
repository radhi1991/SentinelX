package models

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type API struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string            `bson:"name" json:"name" binding:"required"`
	Version     string            `bson:"version" json:"version" binding:"required"`
	Type        string            `bson:"type" json:"type" binding:"required"` // REST, GraphQL, gRPC, WebSocket
	Endpoint    string            `bson:"endpoint" json:"endpoint" binding:"required,url"`
	Description string            `bson:"description" json:"description"`
	
	// Security
	AuthType    string            `bson:"auth_type" json:"authType" binding:"required"` // None, API Key, OAuth2, etc.
	SecurityScore float64         `bson:"security_score" json:"securityScore"`
	
	// Compliance
	ComplianceStatus map[string]bool `bson:"compliance_status" json:"complianceStatus"` // Map of compliance standards to status
	
	// PQC
	CryptoAlgorithms []string         `bson:"crypto_algorithms" json:"cryptoAlgorithms"`
	PQCReadiness     string           `bson:"pqc_readiness" json:"pqcReadiness"` // Not Started, In Progress, Ready
	
	// Metadata
	CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
	Owner        string             `bson:"owner" json:"owner"`
}
