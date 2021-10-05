resource "aws_nat_gateway" "natGateway_allow_internet" {
    allocation_id = aws_eip.natgatewayIp.id 
    subnet_id = aws_subnet.lambdas-subnets-public.id   
  tags = {
      Name = "natgateway_taller2021"
  }
  depends_on = [aws_internet_gateway.internetgwTallerVpc]
} 