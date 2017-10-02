# node-socket-file-system

## 1. 실행을 위한 환경 구축

### Version
node v7.8.0
npm 4.2.0 

* 파일 구조를 보기 편하게 구성하기

* goorm-test (root)
  * back-end (server)
    * build
    * node_modules
    * src
      * config
      * controller
      * model
      * routes
      * util
    * package.json
    * .env
    * .babelrc
    * .gitignore
  * front-end (client)
    * dist (static files)
    * node_modules
    * src
      * css
      * js
      * views ( view engine ejs)
    * package.json
    * .gitignore
    * .babelrc
    * webpack.config.js


### Express 설치

* ES6 문법을 사용하기 위해서 .babelrc 로 preset 지정,
npm run script로, node express 서버 실행 하기 전에, 
ES6로 짜여진 소스코드 babel precompile해서 build 디렉토리로 이동됩니다. 

* .env 파일에는 ( dotenv ) 라이브러리를 사용하여, PORT나, Mongoose등에서 사용할 환경 변수 설정을 해줍니다.

### MongoDB 설치

* 일단 로컬 환경에서 테스트 할 수 있도록 MAC OS에서 설치, homebrew를 통해서 설치 후, 아래와 같이 DBPATH를 재 설정했습니다.

```bash
mongod --dbpath <Local directory> 
```

#### Schema

 ```js
 USER {
  _id,
  username, // 유저 이름
  password, // 비밀번호 값
  salt // 암호화 하기위한 salt 값
 }
 ```

 ```js
  Chat {
    _id,
    username, // 유저 이름
    message, // 메세지 내용
    type,  // 일반, 귓속말 타입
    time,  // 메세지 전달 시간
    toUser, //받는사람
    fromUser //보낸사람
  }
 ```

> mongoose 4.11 >= 부터 promise이 활용 되면서, mongoose connect()등 메서등이 deprecated되었고, 이를 해결 하기 위해서 blubird나 global.Promise를 사용해서 connection 이후에 여러가지 작업들을 promise chainning으로 쿼리를 작성 할 수 있습니다.

### socket.io

[tutorial](https://socket.io/get-started/chat/) 진행.

* 연결 된 클라이언트들의 정보를 저장합니다. (서버에서 배열과 Object를 활용)

* 귓속말은 각 클라이언트의 socketId를 저장 해놨다가 해당 socketId로 직접 메세지를 보냅니다.

* socketId가 없는 닉네임의 경우 ( 연결되지 않은 클라이언트 ) 에러 핸들링을 통해서 system 메세지로 연결되어 있지 않다고 표현합니다.

* 채팅방에 연결된 유저들의 목록을 보여줍니다.

* 유저목록에서 유저를 클릭하면 자동으로 whisper가 설정됩니다.

* 명령어는 /help를 입력하면 보여줍니다.

* 메세지가 실패한 경우 (귓속말) 및, 시스템 로그 제외하고 모든 메세지는 MongoDB에 저장이 됩니다.

* 현재 페이징 기능은 구현이 안되어있습니다.

## 2. 실행 방법

* 압축 해제


* back-end 폴더 내에 `.envcopy` 파일에 항목을 알맞게 작성해주시고, `.env` 파일로 변경해주시면 됩니다.

```
PORT=4000
DB_URL=mongodb://localhost/name
DB_NAME=name
SECRET_KEY=ASDFASDFASDF!@#!@#!@#
```

* node_modules 설치 및 실행

```bash
cd back-end
$ back-end > npm install
$ back-end > npm start

cd front-end
$ front-end > npm install
$ front-end > npm start
```

* `SECRIT_KEY`는 session 생성에 필요한 session secret key 입니다.

이후에, server에서는 build / front에서는 dist 폴더 생성 및 파일 Copy 후 자동으로 실행됩니다!

dev, environment 환경 설정이 따로 되어있지 않습니다.

## 3. 구현된 기능들 짧게 소개

### API

* [POST] /api/signin
* [POST] /api/signup
* [GET] /api/chatlog/:skip/:limit

### view

* [GET] / 
* [GET] /signin
* [GET] /signup
* [GET] /logout
* [GET] /chat

### 소개

* JS 코딩은 ES6 문법을 사용하였습니다.
* VIEW는 Bootstrap + jQuery로 구현했습니다.
* 회원가입, 로그인 및 세션 유지를 `MongoStore`를 이용하여 하였습니다.
* 로그인시 유효한 유저이름이나, 비밀번호에 대해서 `flash message`를 통해 유저에게 알려줍니다.
* 로그인이 필요한 페이지 요청이나 api 요청에 대해서는 `authenticated` (middleware)를 구현하여 요청에 대한 알맞은 응답을 보내도록 하였습니다. 
* 채팅은 `Socket.io`를 이용하여 구현하였고, 로그인 한 경우에만 ( 세션이 유효한 경우 ) 채팅을 할 수 있습니다. 
* 새로고침을 할 경우, 연결이 끊어지며 재 입장시 모든 채팅 로그가 남기 때문에 채팅을 이어서 할 수 있습니다.
* `momentJS`를 사용해서 채팅 시간에 대한 처리를 하였습니다.
* 채팅은 최신 순으로, 100개만 보여줍니다. ( 페이징 기능 미구현 )
* 특정 command (ex) /help, /w username을 통해서 채팅에서 일반 채팅과 귓속말 모두 구현하였습니다.

## 4. TodoList

* [x] 로그인 구현
* [x] 회원가입 구현
* [x] 세션 연결
* [x] 세션 리다이렉트 연결
* [x] 채팅 연결
* [x] 채팅 주고받기
* [x] 귓속말 구현
* [x] 채팅 입력시 스크롤 제일 하단 설정 해줘야 겠다. 아니면 새로운 채팅이 오면 스크롤을 제일 하단으로.
* [x] 채팅 시간 표현하기 momentJS 사용해보기
* [x] 유저 목록에서 특정 유저를 클릭하면 input tag에 자동으로 `/w username` 삽입 할 수 있도록. ALL의 경우에는 `/w username` 삭제
* [x] 채팅 정보 저장 하기 mongoDB
* [x] 지금 까지의 채팅정보를 긁어서 어떻게 파싱해서 보여주나 ? ( 귓속말도 있을 테니.. ) 최신 100개 정도만 긁어서 보여준다
* [ ] 채팅이 많이 쌓이면 페이징 해야될 것 같은데 `더보기` 로 구현..
* [ ] 파일 매니저 구현
* [ ] 코드 및 구조 리팩토링