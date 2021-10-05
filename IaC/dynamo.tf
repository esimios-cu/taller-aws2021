resource "aws_dynamodb_table" "polygon-dynamodb-table" {
  name           = "Polygons"
  billing_mode   = "PROVISIONED"
  //Size polygon ~.4KBs
  //Reading of 100 polygons per seconds (400KB) eventually consistent
  //Writing of 50 polygons per seconds (200KB)
  //Example
  //RCU = 20 (Rounded 4Kb)
  //Eventually consistent 10 reads per second for items up to 4kb
  //Strongly consistent 20 reads per second for items up to 4kb
  //Item larger than 4KB consumes more RCU
  //WCU = 10  (Rounded 1Kb)
  //Standard 10 Writes per second for items up to 1KB
  //Transactional 5 Writes per seconds for items up to 1KB
  //50 RCU
  //50 WCU
  read_capacity  = 50
  write_capacity = 50
  hash_key       = "userId"
  range_key      = "timestamp"

  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name = "timestamp"
    type = "N"
  }
  server_side_encryption {
    enabled=true
  }
  
  }
