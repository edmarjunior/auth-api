# Auth API

 ## Funcionalidades inclusas &nbsp;&nbsp;&nbsp;  [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Auth%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fedmarjunior%2Fauth-api%2Fmaster%2Finsomnia-export.json%3Ftoken%3DAC52DJGF7PLTZO5QALNOZB26USNKK)
  - criar conta (via de e-mail de ativação)
  - reenviar ativação de conta (via e-mail)
  - ativar conta
  - login
  - recuperar senha (via e-mail)
  - nova senha

 ## Pré-requisitos (instalações)
  - node
  - yarn
  - docker e docker-compose
   
 ## Rodando aplicação
  - criar arquivo .env e preencher as variaveis de embiente (dica: ctrl+C e ctrl+V do arquivo .env.example)
  - rodar no teminal (na raiz do projeto) os comandos abaixo:  
    ```
      yarn 
      docker-compose up -d
      yarn sequelize db:migrate
      yarn dev
    ```
    Descrição dos comandos acima:
      - yarn (instalar as dependencias da aplicação caso necessário)
      - docker-compose up -d (subir o postgres + pgAdmin)
      - yarn sequelize db:migrate (criar as migrations no banco de dados)
      - yarn dev (iniciar a aplicação com nodemon em http://localhost:3333)
    
 ## Rodando testes
  - criar arquivo .env.test e preencher as variaveis de embiente (dica: ctrl+C e ctrl+V do arquivo .env.test.example)
  - rodar no teminal (na raiz do projeto) os comandos abaixo:  
    ```
      yarn
      yarn test
    ```
    Descrição dos comandos acima:
      - yarn (instalar as dependencias da aplicação caso necessário)
      - yarn test (para rodar os testes criados dentro do diretório __tests__)
