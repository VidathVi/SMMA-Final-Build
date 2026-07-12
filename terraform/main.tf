data "google_client_config" "default" {}

module "networking" {
  source      = "./modules/networking"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
}

module "gke" {
  source             = "./modules/gke"
  project_id         = var.project_id
  region             = var.region
  cluster_name       = var.gke_cluster_name
  machine_type       = var.gke_machine_type
  node_count         = var.gke_node_count
  vpc_id             = module.networking.vpc_id
  subnet_id          = module.networking.subnet_id
  pod_range_name     = module.networking.pod_range_name
  service_range_name = module.networking.service_range_name
}

module "artifact-registry" {
  source     = "./modules/artifact-registry"
  project_id = var.project_id
  region     = var.region
}

module "cloud-run" {
  source            = "./modules/cloud-run"
  count             = var.environment == "staging" ? 1 : 0
  project_id        = var.project_id
  region            = var.region
  neon_database_url = var.neon_database_url
  redis_url         = var.redis_url
}



