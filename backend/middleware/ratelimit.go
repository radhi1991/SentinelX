package middleware

import (
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// Client represents a client with a rate limiter and last seen time.
type Client struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var (
	clients = make(map[string]*Client)
	mu      sync.Mutex
)

var (
	defaultRateLimit    = 10.0 // requests per second
	defaultBurstLimit   = 5    // burst allowance
	cleanupInterval     = 1 * time.Minute
	clientExpiry        = 5 * time.Minute
)

func init() {
	// Load configuration from environment variables
	if rpsStr := os.Getenv("RATE_LIMIT_RPS"); rpsStr != "" {
		if rps, err := strconv.ParseFloat(rpsStr, 64); err == nil {
			defaultRateLimit = rps
		} else {
			log.Printf("Warning: Invalid RATE_LIMIT_RPS value '%s', using default %f", rpsStr, defaultRateLimit)
		}
	}
	if burstStr := os.Getenv("RATE_LIMIT_BURST"); burstStr != "" {
		if burst, err := strconv.Atoi(burstStr); err == nil {
			defaultBurstLimit = burst
		} else {
			log.Printf("Warning: Invalid RATE_LIMIT_BURST value '%s', using default %d", burstStr, defaultBurstLimit)
		}
	}
	if expiryStr := os.Getenv("RATE_LIMIT_CLIENT_EXPIRY_MINUTES"); expiryStr != "" {
		if expiry, err := strconv.Atoi(expiryStr); err == nil {
			clientExpiry = time.Duration(expiry) * time.Minute
		} else {
			log.Printf("Warning: Invalid RATE_LIMIT_CLIENT_EXPIRY_MINUTES value '%s', using default %v", expiryStr, clientExpiry)
		}
	}

	log.Printf("Rate Limiting Initialized: RPS=%.2f, Burst=%d, ClientExpiry=%v", defaultRateLimit, defaultBurstLimit, clientExpiry)

	// Start a goroutine to clean up old clients
	go cleanupClients()
}

func getClient(ip string) *Client {
	mu.Lock()
	defer mu.Unlock()

	if client, exists := clients[ip]; exists {
		client.lastSeen = time.Now()
		return client
	}

	limiter := rate.NewLimiter(rate.Limit(defaultRateLimit), defaultBurstLimit)
	client := &Client{limiter: limiter, lastSeen: time.Now()}
	clients[ip] = client
	return client
}

func cleanupClients() {
	for {
		time.Sleep(cleanupInterval)
		mu.Lock()
		for ip, client := range clients {
			if time.Since(client.lastSeen) > clientExpiry {
				delete(clients, ip)
			}
		}
		mu.Unlock()
	}
}

// RateLimitMiddleware is a Gin middleware for IP-based rate limiting.
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip, _, err := net.SplitHostPort(c.ClientIP())
		if err != nil {
			// If splitting fails (e.g. "localhost" without port), use the full ClientIP
			ip = c.ClientIP()
		}

		client := getClient(ip)

		if !client.limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests. Please try again later."})
			c.Abort()
			return
		}
		c.Next()
	}
}
