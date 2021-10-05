resource "aws_security_group" "only-vpc-communication" {
  name        = "only_vpc"
  description = "Grupo de seguridad encargado de comunicar dentro de la vpc"
  vpc_id      = aws_vpc.taller2021-vpc.id
  

  egress{
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["10.0.0.0/16"]      
    }
  
}

resource "aws_security_group" "only-vpc-communication-dynamo" {
  name        = "only_endpoint_dynamo"
  description = "Grupo de seguridad encargado de comunicar al endpoint dynamo"
  vpc_id      = aws_vpc.taller2021-vpc.id
  

    egress{
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      prefix_list_ids = [aws_vpc_endpoint.dynamo.prefix_list_id]  
    }   
  
}

resource "aws_security_group" "egress-internet" {
  name        = "securityGroup_outbound_internet"
  description = "Grupo de seguridad encargado de salir a internet"
  vpc_id      = aws_vpc.taller2021-vpc.id
  

  egress{
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
    }
  
}