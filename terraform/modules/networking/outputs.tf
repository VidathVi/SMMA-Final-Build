output "vpc_id" {
  value = google_compute_network.vpc.id
}

output "subnet_id" {
  value = google_compute_subnetwork.vpc.id
}

output "secondary_range_names" {
  value = [
    google_compute_subnetwork.vpc.secondary_ip_range[0].range_name,
    google_compute_subnetwork.vpc.secondary_ip_range[1].range_name,
  ]
}
