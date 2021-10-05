resource "aws_internet_gateway" "internetgwTallerVpc" {
    vpc_id = aws_vpc.taller2021-vpc.id
    tags = {
        Name = "igw-vpc-lambdas"
    }
}