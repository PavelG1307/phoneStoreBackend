pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'docker build -t pavelg1307/phonestore .'
        sh 'docker push pavelg1307/phonestore'
      }
    }
  }
  
  post {
     success { 
        withCredentials([string(credentialsId: 'botSecret', variable: 'TOKEN'), string(credentialsId: 'chatId', variable: 'CHAT_ID')]) {
        sh ("""curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d parse_mode=markdown -d text='Ура! Новая сборка!✅\nРепозиторий: ${env.JOB_NAME}\nВетка: ${env.GIT_BRANCH}'""")
        }
     }

     aborted {
        withCredentials([string(credentialsId: 'botSecret', variable: 'TOKEN'), string(credentialsId: 'chatId', variable: 'CHAT_ID')]) {
        sh  ("""curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d parse_mode=markdown -d text='Сборка принудительно остановлена❗\nРепозиторий: ${env.JOB_NAME}\nВетка: ${env.GIT_BRANCH}'""")
        }
     
     }
     failure {
        withCredentials([string(credentialsId: 'botSecret', variable: 'TOKEN'), string(credentialsId: 'chatId', variable: 'CHAT_ID')]) {
        sh  ("""curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d parse_mode=markdown -d text='Усп! Кто-то накосячил!❌\nРепозиторий: ${env.JOB_NAME}\nВетка: ${env.GIT_BRANCH}'""")
        }
     }

 }
}
