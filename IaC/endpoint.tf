resource "aws_vpc_endpoint" "dynamo" {
  vpc_id       = aws_vpc.taller2021-vpc.id
  service_name = format( "com.amazonaws.%s.%s", var.aws_region, "dynamodb")
  route_table_ids=[aws_route_table.routetableTallerLambdas.id]
}

resource "aws_vpc_endpoint" "secretsManager" {
  vpc_id       = aws_vpc.taller2021-vpc.id
  service_name = format( "com.amazonaws.%s.%s", var.aws_region, "secretsmanager")
  vpc_endpoint_type = "Interface"
   security_group_ids = [
    aws_security_group.only-vpc-communication.id,
  ]
    subnet_ids = [aws_subnet.lambdas-subnets.id]
}

resource "aws_vpc_endpoint" "cloudwatch" {
  vpc_id       = aws_vpc.taller2021-vpc.id
  service_name = format( "com.amazonaws.%s.%s", var.aws_region, "logs")
  vpc_endpoint_type = "Interface"
  security_group_ids = [  aws_security_group.only-vpc-communication.id ]
  subnet_ids = [aws_subnet.lambdas-subnets.id]
}

