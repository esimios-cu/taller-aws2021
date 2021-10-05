resource "aws_secretsmanager_secret" "googleKey" {
  name = var.google_secret
}

resource "aws_secretsmanager_secret_version" "productionGoogleKey" {
  secret_id     = aws_secretsmanager_secret.googleKey.id
  secret_string = "AIzaSyDwPlhwssBFLGxns_UW1ReYoD09lyc_LKA"
}