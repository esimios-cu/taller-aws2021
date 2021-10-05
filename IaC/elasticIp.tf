resource "aws_eip" "natgatewayIp" {
    tags = {
      Name = "ip_natgateway_taller2021"
  }
}