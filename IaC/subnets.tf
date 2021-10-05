resource "aws_subnet" "lambdas-subnets" {
  vpc_id     = aws_vpc.taller2021-vpc.id
  cidr_block = "10.0.1.0/24"

  tags={
    Name="private-tallerAws-10.0.1.0/24"
  }
}
resource "aws_subnet" "lambdas-subnets-public" {
  vpc_id     = aws_vpc.taller2021-vpc.id
  cidr_block = "10.0.2.0/24"
  tags={
   Name="public-tallerAws-10.0.2.0/24"
  }
}