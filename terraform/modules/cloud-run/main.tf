resource "google_cloud_run_v2_service" "backend" {
  name     = "orean-backend-staging"
  location = var.region

  template {
    containers {
      image = "gcr.io/cloudrun/hello"

      env {
        name  = "DATABASE_URL"
        value = var.neon_database_url
      }

      env {
        name  = "REDIS_URL"
        value = var.redis_url
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image
    ]
  }
}

resource "google_cloud_run_v2_service" "frontend" {
  name     = "orean-frontend-staging"
  location = var.region

  template {
    containers {
      image = "gcr.io/cloudrun/hello"

      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = google_cloud_run_v2_service.backend.uri
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  name     = google_cloud_run_v2_service.backend.name
  location = google_cloud_run_v2_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  name     = google_cloud_run_v2_service.frontend.name
  location = google_cloud_run_v2_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}


