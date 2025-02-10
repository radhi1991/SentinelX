package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CBOM struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	APIID         primitive.ObjectID `bson:"api_id" json:"apiId"`
	LastUpdated   time.Time         `bson:"last_updated" json:"lastUpdated"`
	Components    []CryptoComponent `bson:"components" json:"components"`
	RiskScore     float64           `bson:"risk_score" json:"riskScore"`
	PQCReadiness  PQCReadiness     `bson:"pqc_readiness" json:"pqcReadiness"`
}

type CryptoComponent struct {
	Name           string   `bson:"name" json:"name"`
	Version        string   `bson:"version" json:"version"`
	Type           string   `bson:"type" json:"type"` // Library, Algorithm, Protocol
	Usage          []string `bson:"usage" json:"usage"` // Encryption, Signing, KeyExchange
	Algorithms     []Algorithm `bson:"algorithms" json:"algorithms"`
	Dependencies   []string `bson:"dependencies" json:"dependencies"`
	PQCStatus     string   `bson:"pqc_status" json:"pqcStatus"` // Vulnerable, Migration-Ready, PQC-Ready
	MigrationPath string   `bson:"migration_path" json:"migrationPath"`
}

type Algorithm struct {
	Name           string   `bson:"name" json:"name"`
	Type           string   `bson:"type" json:"type"` // Symmetric, Asymmetric, Hash
	KeySize        int      `bson:"key_size" json:"keySize"`
	StandardsRef   []string `bson:"standards_ref" json:"standardsRef"` // NIST, IETF, etc.
	QuantumThreat  string   `bson:"quantum_threat" json:"quantumThreat"` // High, Medium, Low
	PQCAlternative string   `bson:"pqc_alternative" json:"pqcAlternative"`
}

type PQCReadiness struct {
	Status           string    `bson:"status" json:"status"` // Not Started, In Progress, Ready
	VulnerableCount  int       `bson:"vulnerable_count" json:"vulnerableCount"`
	MigrationCount   int       `bson:"migration_count" json:"migrationCount"`
	ReadyCount       int       `bson:"ready_count" json:"readyCount"`
	LastAssessment   time.Time `bson:"last_assessment" json:"lastAssessment"`
	EstimatedEffort  string    `bson:"estimated_effort" json:"estimatedEffort"`
	RecommendedSteps []string  `bson:"recommended_steps" json:"recommendedSteps"`
}
