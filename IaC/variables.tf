variable "aws_profile" {
    description = "Nombre del perfil que se ocupara para la creación de los recursos"
    type    = string
}
variable "aws_region" {
    description = "Region de AWS para todos los recursos"
    type    = string
    default = "us-east-1"
}
variable "aws_env" {
    description = "Etiqueta para identificar el entorno de los recursos"
    type    = string
    default = "Development"
}

variable "aws_bucket_prefix" {
    description = "Etiqueta prefijo para bucket"
    type    = string
    default = "ivan"
}

variable "google_secret" {
    description = "Apikey reserveGeocoding"
    type    = string
    default = "apikeys/production/googleKey"
}