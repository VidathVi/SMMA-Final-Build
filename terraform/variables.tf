variable "project_id" {
  type        = string
  description = "The ID of the project to deploy resources to"
}

variable "region" {
  type        = string
  description = "The region to deploy resources to"
  default     = "asia-southeast1"
}

variable "environment" {
  type        = string
  description = "The environment to deploy resources to"
  default     = "staging"
}

variable "gke_cluster_name" {
  type        = string
  description = "The name of the GKE cluster to deploy resources to"
  default     = "orean-production"
}

variable "gke_node_count" {
  type        = number
  description = "Initial number of nodes"
  default     = 2
}

variable "gke_machine_type" {
  type        = string
  description = "VM size for cluster nodes"
  default     = "e2-medium"
}

variable "domain_name" {
  type        = string
  description = "The domain name to use for the resources"
  default     = "orean.org"
}

variable "neon_database_url" {
  type        = string
  description = "The Neon connection string"
  sensitive   = true
}

variable "redis_url" {
  type        = string
  description = "The Aiven Redis connection string"
  sensitive   = true
}

