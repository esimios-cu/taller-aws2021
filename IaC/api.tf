resource "aws_apigatewayv2_api" "api_gateway" {
    name = "api-taller-seguridad"
    protocol_type = "HTTP"
    cors_configuration {
        allow_headers = ["*"]
        allow_methods = [
            "POST",
            "OPTIONS"
        ]
        allow_origins = ["https://taller-aws-2021.esimeculhuacan.com"]
    }
}

resource "aws_apigatewayv2_authorizer" "api_authorizer" {
    name                = "apiauthorizer-taller-seguridad"
    api_id              = aws_apigatewayv2_api.api_gateway.id
    authorizer_type     = "JWT"
    identity_sources    = [ "$request.header.Authorization" ]
    jwt_configuration {
        audience  = [ aws_cognito_user_pool_client.client.id ]
        issuer    = "https://${aws_cognito_user_pool.pool.endpoint}"
    }
}

resource "aws_apigatewayv2_integration" "api_integration" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    integration_method  = "POST"
    integration_type    = "AWS_PROXY"
    integration_uri     = aws_lambda_function.sign_up.invoke_arn
}

resource "aws_apigatewayv2_route" "sign_up" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
#    authorizer_id       = aws_apigatewayv2_authorizer.api_authorizer.id
#    authorization_type  = "JWT"
    route_key           = "POST /signup"
    target              = "integrations/${aws_apigatewayv2_integration.api_integration.id}"
}

resource "aws_apigatewayv2_integration" "sign_in" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    integration_method  = "POST"
    integration_type    = "AWS_PROXY"
    integration_uri     = aws_lambda_function.sign_in.invoke_arn
}

//ReadPolygons
resource "aws_apigatewayv2_integration" "readPolygons" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    integration_method  = "POST"
    integration_type    = "AWS_PROXY"
    integration_uri     = aws_lambda_function.readPolygons.invoke_arn
}
resource "aws_apigatewayv2_route" "readPolygons" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    authorizer_id       = aws_apigatewayv2_authorizer.api_authorizer.id
    authorization_type  = "JWT"
    route_key           = "POST /readPolygons"
    target              = "integrations/${aws_apigatewayv2_integration.readPolygons.id}"
}

//CreatePolygon
resource "aws_apigatewayv2_integration" "createPolygon" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    integration_method  = "POST"
    integration_type    = "AWS_PROXY"
    integration_uri     = aws_lambda_function.createPolygon.invoke_arn
}
resource "aws_apigatewayv2_route" "createPolygon" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    authorizer_id       = aws_apigatewayv2_authorizer.api_authorizer.id
    authorization_type  = "JWT"
    route_key           = "POST /createPolygon"
    target              = "integrations/${aws_apigatewayv2_integration.createPolygon.id}"
}

resource "aws_apigatewayv2_route" "sign_in" {
    api_id              = aws_apigatewayv2_api.api_gateway.id
    route_key           = "POST /signin"
    target              = "integrations/${aws_apigatewayv2_integration.sign_in.id}"
}

resource "aws_apigatewayv2_stage" "lambda" {
    api_id = aws_apigatewayv2_api.api_gateway.id
    name        = "dev_stage_taller_seguridad"
    auto_deploy = true

    access_log_settings {
        destination_arn = aws_cloudwatch_log_group.api_gw.arn

        format = jsonencode({
            requestId               = "$context.requestId"
            sourceIp                = "$context.identity.sourceIp"
            requestTime             = "$context.requestTime"
            protocol                = "$context.protocol"
            httpMethod              = "$context.httpMethod"
            resourcePath            = "$context.resourcePath"
            routeKey                = "$context.routeKey"
            status                  = "$context.status"
            responseLength          = "$context.responseLength"
            integrationErrorMessage = "$context.integrationErrorMessage"
            user                    = "$context.identity.user"
        })
    }
}

resource "aws_lambda_permission" "lambda_permission" {
    statement_id    = "AllowExecutionFromAPIGateway"
    action          = "lambda:InvokeFunction"
    function_name   = aws_lambda_function.sign_up.function_name
    principal       = "apigateway.amazonaws.com"

    source_arn      = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

resource "aws_lambda_permission" "sign_in" {
    statement_id    = "AllowExecutionFromAPIGateway"
    action          = "lambda:InvokeFunction"
    function_name   = aws_lambda_function.sign_in.function_name
    principal       = "apigateway.amazonaws.com"

    source_arn      = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

resource "aws_lambda_permission" "readPolygons" {
    statement_id    = "AllowExecutionFromAPIGateway"
    action          = "lambda:InvokeFunction"
    function_name   = aws_lambda_function.readPolygons.function_name
    principal       = "apigateway.amazonaws.com"

    source_arn      = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}
resource "aws_lambda_permission" "createPolygon" {
    statement_id    = "AllowExecutionFromAPIGateway"
    action          = "lambda:InvokeFunction"
    function_name   = aws_lambda_function.createPolygon.function_name
    principal       = "apigateway.amazonaws.com"

    source_arn      = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "api_gw" {
    name = "/aws/api_gw/${aws_apigatewayv2_api.api_gateway.name}"
    retention_in_days = 30
}