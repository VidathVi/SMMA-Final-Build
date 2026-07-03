module "networking" {
  source = "./modules/networking"
}

module "gke" {
  source = "./modules/gke"
}

module "artifact-registry" {
  source = "./modules/artifact-registry"
}

module "cloud-run" {
  source = "./modules/cloud-run"

  count = var.environment == "staging" ? 1 : 0
}

provider "kubernetes" {
    host = 
    token = 
    cluster_ca_certificate =   
}

resource "kubernetes_namespace" "gke_cluster_name" {
  metadata {
    name = var.gke_cluster_name
  }
}

