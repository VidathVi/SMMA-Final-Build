resource "google_compute_network" "vpc" {
  name                    = "smma-vpc-${var.environment}"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "vpc" {
  name          = "smma-subnet-${var.environment}"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.vpc.id

  secondary_ip_range {
    range_name    = "gke-pods-range"
    ip_cidr_range = "192.168.0.0/18"
  }

  secondary_ip_range {
    range_name    = "gke-services-range"
    ip_cidr_range = "192.168.64.0/22"
  }
}

resource "google_compute_router" "smma_router" {
  name    = "smma-router-${var.environment}"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "smma_nat" {
  name                               = "smma-nat-${var.environment}"
  router                             = google_compute_router.smma_router.name
  region                             = google_compute_router.smma_router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

