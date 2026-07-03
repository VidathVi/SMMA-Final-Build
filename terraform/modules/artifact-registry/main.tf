resource "google_artifact_registry_repository" "name" {
  format        = "DOCKER"
  location      = "asia-southeast1"
  repository_id = "orean-image"
}

resource "google_artifact_registry_repository_iam_member" "name" {

}

