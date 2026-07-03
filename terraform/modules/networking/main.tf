resource "google_compute_network" "vpc" {
  name = "smma-vpc"
}

resource "google-compute_subnetwork" "vpc" {
  name          = "smma-vpc"
  ip_cidr_range = "[IP_ADDRESS]"
  region        = var.region
  network       = google_compute_network.vpc.id

  secondary_ip_range {
    range_name    = "gke-pods-range"
    ip_cidr_range = "[IP_ADDRESS]"
  }
}

resource "google_compute_router" "smma-router" {
  name    = "smma-router"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "smma-nat" {
  name                               = "smma-nat"
  router                             = google_compute_router.smma-router.name
  region                             = google_compute_router.smma-router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
