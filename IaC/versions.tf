terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = ">= 3.0.0"
        }

        archive = {
            source  = "hashicorp/archive"
            version = "~> 2.2.0"
        }
    }
}
