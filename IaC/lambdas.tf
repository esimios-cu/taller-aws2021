resource "aws_lambda_function" "sign_up" {
    function_name       = "SignUp"
    description         = "Función encargada de realizar el registro de usuarios hacia Cognito"
    s3_bucket           = aws_s3_bucket.lambda_bucket.id
    s3_key              = aws_s3_bucket_object.lambda_code_sign_up.key
    runtime             = "nodejs14.x"
    handler             = "signup_handler.handler"
    source_code_hash    = data.archive_file.lambda_package_sign_up.output_base64sha256
    role                = aws_iam_role.lambda_auth.arn
    layers              = [aws_lambda_layer_version.aws_sdk.arn]
    environment {
      variables = {
          COGNITO_CLIENT_ID = aws_cognito_user_pool_client.client.id
      }
    }

    depends_on = [aws_cognito_user_pool_client.client]
}

resource "aws_cloudwatch_log_group" "sign_up" {
    name                = "/aws/lambda/${aws_lambda_function.sign_up.function_name}"
    retention_in_days   = 30
}

resource "aws_lambda_function" "sign_in" {
    function_name       = "SignIn"
    description         = "Función encargada de la atenticación de los usuarios con Cognito"
    s3_bucket           = aws_s3_bucket.lambda_bucket.id
    s3_key              = aws_s3_bucket_object.lambda_code_sign_in.key
    runtime             = "nodejs14.x"
    handler             = "signin_handler.handler"
    source_code_hash    = data.archive_file.lambda_package_sign_in.output_base64sha256
    role                = aws_iam_role.lambda_auth.arn
    layers              = [aws_lambda_layer_version.aws_sdk.arn]
    environment {
      variables = {
          COGNITO_CLIENT_ID = aws_cognito_user_pool_client.client.id
      }
    }

    depends_on = [aws_cognito_user_pool_client.client]
}

resource "aws_cloudwatch_log_group" "sign_in" {
    name                = "/aws/lambda/${aws_lambda_function.sign_in.function_name}"
    retention_in_days   = 30
}

data "aws_iam_policy_document" "policy_document" {
    statement {
        sid     = "GetSecurityCredentials"
        actions = ["sts:AssumeRole"]
        effect  = "Allow"
        principals {
            type = "Service"
            identifiers = ["lambda.amazonaws.com"]
        }
    }
}

resource "aws_iam_role" "lambda_exec" {
    name                = "lambdarole-taller-seguridad"
    description         = "Role encargado de la ejecución básica de lambda"
    path                = "/dev-service-role/lambda/"
    assume_role_policy  = data.aws_iam_policy_document.policy_document.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
    role       = aws_iam_role.lambda_exec.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "cognito_auth_permissions" {
    statement {
        sid     = "AllowCognitoAuthentication"
        actions = [
            "cognito-idp:SignUp",
            "cognito-idp:InitiateAuth",
            "cognito-idp:GetUser",
        ]
        effect  = "Allow"
        resources = [
            aws_cognito_user_pool.pool.arn
        ]
    }
}

resource "aws_iam_role" "lambda_auth" {
    name                = "lambda-role-authorizer"
    description         = "Role encargado de realizar la autenticación con cognito"
    assume_role_policy  = data.aws_iam_policy_document.policy_document.json
    inline_policy {
        name      = "lambda-cognito-authorizer"
        policy    = data.aws_iam_policy_document.cognito_auth_permissions.json
    }
}

resource "aws_iam_role_policy_attachment" "lambda_role_authorizer_basic_exec" {
    role       = aws_iam_role.lambda_auth.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


//ReadPolygons
resource "aws_lambda_function" "readPolygons" {
    function_name       = "ReadPolygons"
    description         = "Función encargada de la la lectura de los polígonos"
    s3_bucket           = aws_s3_bucket.lambda_bucket.id
    s3_key              = aws_s3_bucket_object.lambda_code_readPolygons.key
    runtime             = "nodejs14.x"
    handler             = "readPolygons_handler.handler"
    source_code_hash    = data.archive_file.lambda_package_readPolygons.output_base64sha256
    role                = aws_iam_role.lambda_readPolygons_rol.arn
    layers              = [aws_lambda_layer_version.aws_sdk.arn]
    timeout= 15
    vpc_config {
    subnet_ids         = [aws_subnet.lambdas-subnets.id]
    security_group_ids = [aws_security_group.only-vpc-communication-dynamo.id]
  }

}

resource "aws_iam_role" "lambda_readPolygons_rol" {
    name                = "lambda-role-readPolygons"
    description         = "Role de la función lambda encargada de la lectura de los poligonos"
    assume_role_policy  = data.aws_iam_policy_document.policy_document.json
    inline_policy {
        name      = "lambda-readPolygons-policy"
        policy    = data.aws_iam_policy_document.read_dynamo_permissions.json
    }
}
data "aws_iam_policy_document" "read_dynamo_permissions" {
    statement {
        sid     = "allowRead"
        actions = [
            "dynamodb:Query"
        ]
        effect  = "Allow"
        resources = [
            aws_dynamodb_table.polygon-dynamodb-table.arn
        ]
    }
}
resource "aws_cloudwatch_log_group" "readPolygons" {
    name                = "/aws/lambda/${aws_lambda_function.readPolygons.function_name}"
    retention_in_days   = 30
}

resource "aws_iam_role_policy_attachment" "readPolygonAttachment" {
    role       = aws_iam_role.lambda_readPolygons_rol.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

//CreatePolygon

data "aws_iam_policy_document" "putItem_dynamo_permissions" {
    statement {
        sid     = "allowPutItem"
        actions = [
            "dynamodb:PutItem",
            "secretsmanager:GetSecretValue"
        ]
        effect  = "Allow"
        resources = [
            aws_dynamodb_table.polygon-dynamodb-table.arn,
            aws_secretsmanager_secret.googleKey.arn
        ]
    }
}


resource "aws_iam_role" "lambda_createPolygon_rol" {
    name                = "lambda-role-createPolygon"
    description         = "Rol de la función lambda encargada de la creación de los polígonos"
    assume_role_policy  = data.aws_iam_policy_document.policy_document.json
    inline_policy {
        name      = "lambda-readPolygons-policy"
        policy    = data.aws_iam_policy_document.putItem_dynamo_permissions.json
    }
}

resource "aws_iam_role_policy_attachment" "createPolygonAttachment" {
    role       = aws_iam_role.lambda_createPolygon_rol.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_lambda_function" "createPolygon" {
    function_name       = "createPolygon"
    description         = "Función encargada de la la lectura de los polígonos"
    s3_bucket           = aws_s3_bucket.lambda_bucket.id
    s3_key              = aws_s3_bucket_object.lambda_code_createPolygon.key
    runtime             = "nodejs14.x"
    handler             = "createPolygon_handler.handler"
    source_code_hash    = data.archive_file.lambda_package_createPolygon.output_base64sha256
    role                = aws_iam_role.lambda_createPolygon_rol.arn
    layers              = [aws_lambda_layer_version.aws_sdk.arn]
    timeout= 15
     vpc_config {
     subnet_ids         = [aws_subnet.lambdas-subnets.id]
     security_group_ids = [aws_security_group.egress-internet.id]
   }
    environment {
      variables = {
          GOOGLE_SECRET = var.google_secret
      }
    }
}

resource "aws_cloudwatch_log_group" "createPolygon" {
    name                = "/aws/lambda/${aws_lambda_function.createPolygon.function_name}"
    retention_in_days   = 30
}
