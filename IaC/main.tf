data "archive_file" "lambda_package_sign_up" {
    type        = "zip"
    output_path = abspath("${path.root}/../BackEnd/Services/auth/signup.zip")
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/auth/modules/authentication/index.js")}")
        filename = "modules/authentication/index.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/auth/signup_handler.js")}")
        filename = "signup_handler.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/lib/utilitiesResponse/index.js")}")
        filename = "lib/utilitiesResponse/index.js"
    }
}

resource "aws_s3_bucket_object" "lambda_code_sign_up" {
    bucket    = aws_s3_bucket.lambda_bucket.id

    key       = basename(data.archive_file.lambda_package_sign_up.output_path)
    source    = data.archive_file.lambda_package_sign_up.output_path

    etag      = filemd5(data.archive_file.lambda_package_sign_up.output_path)
}

data "archive_file" "lambda_package_sign_in" {
    type        = "zip"
    output_path = abspath("${path.root}/../BackEnd/Services/auth/signin.zip")
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/auth/modules/authentication/index.js")}")
        filename = "modules/authentication/index.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/auth/signin_handler.js")}")
        filename = "signin_handler.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/lib/utilitiesResponse/index.js")}")
        filename = "lib/utilitiesResponse/index.js"
    }
}

resource "aws_s3_bucket_object" "lambda_code_sign_in" {
    bucket    = aws_s3_bucket.lambda_bucket.id

    key       = basename(data.archive_file.lambda_package_sign_in.output_path)
    source    = data.archive_file.lambda_package_sign_in.output_path

    etag      = filemd5(data.archive_file.lambda_package_sign_in.output_path)
}
data "archive_file" "lambda_package_readPolygons" {
    type        = "zip"
    output_path = abspath("${path.root}/../BackEnd/Services/CRUD/readPolygons.zip")
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/Dynamo.js")}")
        filename = "classes/Dynamo.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/lib/utilitiesResponse/index.js")}")
        filename = "lib/utilitiesResponse/index.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/Utils.js")}")
        filename = "classes/Utils.js"
    }    
     source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/readPolygons/main.js")}")
        filename = "main.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/readPolygons/readPolygons_handler.js")}")
        filename = "readPolygons_handler.js"
    }
}

resource "aws_s3_bucket_object" "lambda_code_readPolygons" {
    bucket    = aws_s3_bucket.lambda_bucket.id

    key       = basename(data.archive_file.lambda_package_readPolygons.output_path)
    source    = data.archive_file.lambda_package_readPolygons.output_path

    etag      = filemd5(data.archive_file.lambda_package_readPolygons.output_path)
}

data "archive_file" "lambda_package_createPolygon" {
    type        = "zip"
    output_path = abspath("${path.root}/../BackEnd/Services/CRUD/createPolygon.zip")
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/Dynamo.js")}")
        filename = "classes/Dynamo.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/Google.js")}")
        filename = "classes/Google.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/SecretManager.js")}")
        filename = "classes/SecretManager.js"
    }
    source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/classes/Utils.js")}")
        filename = "classes/Utils.js"
    }    
     source {
        content = file("${abspath("${path.root}/../BackEnd/Services/lib/utilitiesResponse/index.js")}")
        filename = "lib/utilitiesResponse/index.js"
    }
     source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/createPolygon/main.js")}")
        filename = "main.js"
    }
     source {
        content = file("${abspath("${path.root}/../BackEnd/Services/CRUD/createPolygon/createPolygon_handler.js")}")
        filename = "createPolygon_handler.js"
    }
}

resource "aws_s3_bucket_object" "lambda_code_createPolygon" {

    bucket    = aws_s3_bucket.lambda_bucket.id

    key       = basename(data.archive_file.lambda_package_createPolygon.output_path)
    source    = data.archive_file.lambda_package_createPolygon.output_path

    etag      = filemd5(data.archive_file.lambda_package_createPolygon.output_path)
}
