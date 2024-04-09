pipeline {
    agent any
    
    environment {
        branchName = Version.tokenize('/').last() //'refs/heads/main'
    }


    stages {
        stage('Preparation') {
            steps {
                checkout scm
                script {
                    commit_id = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
                }
            }
        }
        
        stage('login to dockerhub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'docker_username', passwordVariable: 'docker_password')]) {
                        sh "docker login https://index.docker.io/v1/ --username \"\$docker_username\" --password \"\$docker_password\""
                    }                    
                }
            }
        }
        stage('Build and Publish FE') {
            steps {
                script {
                        sh '''
                        image_name="a2022113664/schoolar-frontend:$branchName"
                        
                        docker build -t $image_name -f Dockerfile .
                        docker push $image_name
                        '''
                }
            }
        }
    }
}
