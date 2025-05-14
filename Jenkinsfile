pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout()
    }

    environment {
        EC2_USER = "ubuntu"
    }

    stages {
        stage("Code Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies for CDK") {
            steps {
                 dir("infra") {
                    sh "npm install"
                }
            }
        }

        stage("Build CDK code") {
            steps {
                dir("infra") {
                    sh "npm run build"
                }
            }
        }

        stage("Deploy cloud resources") {
            steps {
                dir("infra") {
                    withCredentials([[
                        $class: "AmazonWebServicesCredentialsBinding",
                        credentialsId: "aws-creds-jenkins",
                        accessKeyId: "AWS_ACCESS_KEY_ID",
                        secretAccessKey: "AWS_SECRET_ACCESS_KEY"]]) {
                            sh "cdk deploy --require-approval never --outputs-file ./cdk-outputs.json"
                        }

                    script {
                        sh 'cat cdk-outputs.json'
                        def jsonText = readFile './cdk-outputs.json'
                        def outputs = new groovy.json.JsonSlurper().parseText(jsonText)
                        def ec2PublicIp = outputs["Blog-App-Api-Stack"]["InstancePublicIP"]
                        env.EC2_HOST = ec2PublicIp
                        echo "Public IP: ${ec2PublicIp}"
                    }
                }
            }
        }

        stage("Deploy Express App") {
            steps {
                script{
                    withEnv(["EC2_HOST=${env.EC2_HOST}"]) {
                        sshagent(['ssh-cred']) {
                            sh "scp -o StrictHostKeyChecking=no infra/scripts/deploy-app.sh $EC2_USER@$EC2_HOST:/home/$EC2_USER/deploy-app.sh"

                            sh "ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST 'bash /home/$EC2_USER/deploy-app.sh'"
                        }
                    }
                }
            }
        }
    }
}
