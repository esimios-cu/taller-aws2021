resource "aws_secretsmanager_secret" "googleKey" {
  name = var.google_secret
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "productionGoogleKey" {
  secret_id     = aws_secretsmanager_secret.googleKey.id
  secret_string = var.google_apikey
}