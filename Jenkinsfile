pipeline {
    agent any
    options {
        ansiColor('css')
    }

    stages {
        stage('Setup') {
            steps {
                git branch: 'main', url: 'https://github.com/eduardotrandafilov/teste-api-ebac.git'
                sh 'npm install'
            }
        }
        stage('Serverest') {
            steps {
                sh 'npm start &'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run cy:run'
            }
        }
    }
}