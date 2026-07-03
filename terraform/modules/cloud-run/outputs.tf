output "service_url" {
  value       = google_cloud_run_v2_service.frontend.uri
  description = "The public URL of the frontend Cloud Run service"
}
