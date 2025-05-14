pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout()
    }

    environment {
        EC2_USER = "ubuntu"
        REPO_URL = "https://github.com/anmol111pal/blog-app-api.git"
        REPO_DIR = "/home/${EC2_USER}/app"
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
                            sh """
                                ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << 'EOF'
                                if [ ! -d "$REPO_DIR" ]; then
                                    git clone $REPO_URL $REPO_DIR
                                else
                                    cd $REPO_DIR && git pull origin master
                                fi
                                cd $REPO_DIR && cd src/
                                npm install
                                tsc
                                nohup node dist/index.js > app.log 2>&1 &
                                EOF
                            """
                        }
                    }
                }
            }
        }
    }
}
