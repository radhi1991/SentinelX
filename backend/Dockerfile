# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
# -ldflags="-w -s" strips debug information and symbols, reducing binary size.
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

# Final stage
FROM alpine:latest

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/main .

# Ensure the binary is executable by the appuser
RUN chown appuser:appgroup /app/main

# Switch to the non-root user
USER appuser

# Expose port (Note: The application now uses the PORT env var, defaulting to 8080)
# This documents the default port. The actual port can be overridden by setting PORT env var.
EXPOSE 8080

# Run the application
CMD ["./main"]
