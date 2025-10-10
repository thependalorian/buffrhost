# Buffr Host Microservices Infrastructure
# Google Cloud Platform deployment configuration

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Provider configuration
provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "secretmanager.googleapis.com"
  ])
  
  service = each.value
  disable_on_destroy = false
}

# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "postgres" {
  name             = "buffrhost-postgres-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    
    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }
    
    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }

  deletion_protection = false
}

# Database for each microservice
resource "google_sql_database" "databases" {
  for_each = toset([
    "buffrhost_auth",
    "buffrhost_hospitality", 
    "buffrhost_menu",
    "buffrhost_booking",
    "buffrhost_payment",
    "buffrhost_notification",
    "buffrhost_analytics"
  ])
  
  name     = each.value
  instance = google_sql_database_instance.postgres.name
}

# Database user
resource "google_sql_user" "buffruser" {
  name     = "buffruser"
  instance = google_sql_database_instance.postgres.name
  password = "buffrpass123!"
}

# Redis instance
resource "google_redis_instance" "redis" {
  name           = "buffrhost-redis-${var.environment}"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region
}

# Cloud Run services for each microservice
resource "google_cloud_run_service" "api_gateway" {
  name     = "api-gateway"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/api-gateway:latest"
        
        ports {
          container_port = 8000
        }
        
        env {
          name  = "ENVIRONMENT"
          value = var.environment
        }
        
        env {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.redis.host}:6379"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "auth_service" {
  name     = "auth-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/auth-service:latest"
        
        ports {
          container_port = 8001
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_auth"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "hospitality_service" {
  name     = "hospitality-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/hospitality-service:latest"
        
        ports {
          container_port = 8002
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_hospitality"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "menu_service" {
  name     = "menu-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/menu-service:latest"
        
        ports {
          container_port = 8003
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_menu"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "booking_service" {
  name     = "booking-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/booking-service:latest"
        
        ports {
          container_port = 8004
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_booking"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "payment_service" {
  name     = "payment-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/payment-service:latest"
        
        ports {
          container_port = 8005
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_payment"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "notification_service" {
  name     = "notification-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/notification-service:latest"
        
        ports {
          container_port = 8006
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_notification"
        }
      }
    }
  }
}

resource "google_cloud_run_service" "analytics_service" {
  name     = "analytics-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/analytics-service:latest"
        
        ports {
          container_port = 8007
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://buffruser:buffrpass123!@${google_sql_database_instance.postgres.private_ip_address}:5432/buffrhost_analytics"
        }
      }
    }
  }
}

# Outputs
output "api_gateway_url" {
  value = google_cloud_run_service.api_gateway.status[0].url
}

output "database_connection_name" {
  value = google_sql_database_instance.postgres.connection_name
}

output "redis_host" {
  value = google_redis_instance.redis.host
}
