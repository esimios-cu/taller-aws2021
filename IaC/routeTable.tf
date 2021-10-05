resource "aws_route_table" "routetableTallerLambdas" {
    vpc_id = aws_vpc.taller2021-vpc.id 
     route {          
         cidr_block = "0.0.0.0/0"
         nat_gateway_id = aws_nat_gateway.natGateway_allow_internet.id
     }
    tags = { Name = "lambda-vpc-routTable" }        
}
resource "aws_route_table_association" "route_table_subnet" { 
    subnet_id = aws_subnet.lambdas-subnets.id
    route_table_id = aws_route_table.routetableTallerLambdas.id
}

resource "aws_route_table" "routetableTallerLambdasPublic" {
    vpc_id = aws_vpc.taller2021-vpc.id 
     route {          
         cidr_block = "0.0.0.0/0"
         gateway_id = aws_internet_gateway.internetgwTallerVpc.id
     }
    tags = { Name = "lambda-vpc-routTable-Public" }        
}
resource "aws_route_table_association" "route_table_subnet_public" { 
    subnet_id = aws_subnet.lambdas-subnets-public.id
    route_table_id = aws_route_table.routetableTallerLambdasPublic.id
}