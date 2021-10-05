resource "aws_s3_bucket" "lambda_bucket" {
    bucket = "lambda-code-taller-seguridad-${var.aws_bucket_prefix}"

    acl           = "private"
    force_destroy = true

    tags = {
        Name = "lambda-code-taller-seguridad"
        Description = "Bucket para alojar el código de las funciones lambda"
    }
}