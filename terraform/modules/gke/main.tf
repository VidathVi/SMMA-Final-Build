resource "google_container_cluster" "" {
  networking_mode = "VPC_NATIVE"
  workload_identity_config {

  }
  initial_node_count       = 1
  remove_default_node_pool = true
  node_pool {
    name = "default"
  }
}

resource "google_container_node_pool" "" {
  machine_type = e2-medium
  node_count   = 2
  oauth_scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
  ]
  auto_repair  = true
  auto_upgrade = true
}

