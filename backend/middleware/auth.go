package middleware

import (
	"net/http"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey []byte

func init() {
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	if jwtSecret == "" {
		log.Println("WARNING: JWT_SECRET_KEY environment variable not set. Using default key for development.")
		secretKey = []byte("your-secret-key") // Default key for development
	} else {
		secretKey = []byte(jwtSecret)
	}
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Printf("Timestamp: %s, IP: %s, Event: FailedLogin, Reason: MissingAuthorizationHeader", time.Now().Format(time.RFC3339), ip)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || strings.ToLower(bearerToken[0]) != "bearer" {
			log.Printf("Timestamp: %s, IP: %s, Event: FailedLogin, Reason: InvalidAuthorizationHeaderFormat", time.Now().Format(time.RFC3339), ip)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := bearerToken[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				log.Printf("Timestamp: %s, IP: %s, Event: InvalidToken, Reason: UnexpectedSigningMethod, Algorithm: %v", time.Now().Format(time.RFC3339), ip, token.Header["alg"])
				return nil, jwt.ErrSignatureInvalid
			}
			return secretKey, nil
		})

		if err != nil {
			log.Printf("Timestamp: %s, IP: %s, Event: InvalidToken, Reason: %v, Token: %s", time.Now().Format(time.RFC3339), ip, err, tokenString)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID, ok := claims["user_id"].(string)
			if !ok {
				log.Printf("Timestamp: %s, IP: %s, Event: InvalidToken, Reason: MissingOrInvalidUserIDClaim, Claims: %v", time.Now().Format(time.RFC3339), ip, claims)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims: user_id missing or not a string"})
				c.Abort()
				return
			}
			log.Printf("Timestamp: %s, IP: %s, Event: SuccessfulLogin, UserID: %s", time.Now().Format(time.RFC3339), ip, userID)
			c.Set("user_id", userID)
			c.Next()
		} else {
			log.Printf("Timestamp: %s, IP: %s, Event: InvalidToken, Reason: InvalidClaimsOrToken, Claims: %v", time.Now().Format(time.RFC3339), ip, claims)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}
	}
}
