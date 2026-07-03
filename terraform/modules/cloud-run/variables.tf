variable "project_id" {
  type        = string
  description = "The ID of the GCP project"
}

variable "region" {
  type        = string
  description = "The region to deploy the Cloud Run services to"
}

variable "neon_database_url" {
  type        = string
  description = "The connection string for the Neon PostgreSQL database"
  sensitive   = true
}

variable "redis_url" {
  type        = string
  description = "The connection string for Aiven Redis"
  sensitive   = true
}
