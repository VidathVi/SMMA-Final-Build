terraform {
  backend "gcs" {
    bucket = "smma-final-build-v1-tf-state"
    prefix = "terraform/state"
  }
}
