output "vpc_id" {
  value = google_compute_network.vpc.id
}

output "subnet_id" {
  value = google_compute_subnetwork.vpc.id
}

output "pod_range_name" {
  value = "gke-pods-range"
}

output "service_range_name" {
  value = "gke-services-range"
}
