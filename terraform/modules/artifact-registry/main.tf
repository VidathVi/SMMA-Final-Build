resource "google_artifact_registry_repository" "repo" {
  format        = "DOCKER"
  location      = var.region
  repository_id = "orean-images"
}

data "google_compute_default_service_account" "default" {}

resource "google_artifact_registry_repository_iam_member" "gke_reader" {
  project    = google_artifact_registry_repository.repo.project
  location   = google_artifact_registry_repository.repo.location
  repository = google_artifact_registry_repository.repo.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}


