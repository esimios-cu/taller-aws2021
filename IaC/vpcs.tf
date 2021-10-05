resource "aws_vpc" "taller2021-vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
}