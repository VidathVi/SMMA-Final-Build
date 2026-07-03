output "gke_cluster_endpoint" {
  description = "URL of Kubernets cluster's API"
  value       = module.gke.cluster_endpoint
}

output "gke_cluster_certificate" {
  description = "The cluster's certificate"
  value       = module.gke.cluster_certificate
}
