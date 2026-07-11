output "gke_cluster_endpoint" {
  description = "URL of Kubernets cluster's API"
  value       = module.gke.cluster_endpoint
}

output "gke_cluster_ca_certificate" {
  description = "The GKE cluster's CA certificate"
  value       = module.gke.cluster_ca_certificate
}

output "artifact_registry_url" {
  description = "The URL of the artifact registry"
  value       = module.artifact-registry.artifact_registry_url
}

output "cloud_run_url" {
  description = "The URL of the cloud run"
  value       = one(module.cloud-run[*].service_url)
}



