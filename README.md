# node-socket-file-system

## 1. 실행을 위한 환경 구축

### Version
node v7.8.0
npm 4.2.0 

파일 구조를 보기 편하게 잡기 위한 디렉토리 구조 잡기

* back-end
  * build
  * node_modules
  * src
  * package.json
* front-end
  * dist
  * node_modules
  * src
  * package.json

ES6 문법을 사용하기 위해서 .babelrc 로 preset 지정,
npm run script로, node express 서버 실행 하기 전에, 
ES6로 짜여진 소스코드 babel precompile해서 build 디렉토리로 이동.
node build를 통해서 서버 실행

.env ( dotenv ) 라이브러리를 사용하여, PORT나, Mongoose등에서 사용할 환경 변수 설정을 할 예정.


### MongoDB 설치

일단 로컬 환경에서 테스트 할 수 있도록 MAC OS에서 설치, homebrew를 통해서 설치 후,
mongod --dbpath <directory> 를 통해서 DBPATH를 재 설정함.
다음엔 스키마 작성.
 ```json
 USER {
  username,
  password
 }
 ```

mongoose 4.11 >= 부터 promise이 활용 되면서, mongoose connect()등 메서등이 deprecated되었고, 이를 해결 하기 위해서 blubird나 global.Promise를 사용해서 connection 이후에 여러가지 작업들을 promise chainning으로 쿼리를 작성 할 수 있다.

### socket.io

[tutorial](https://socket.io/get-started/chat/) 진행.

귓속말은 각 클라이언트의 socketId를 저장 해놨다가 해당 socketId로 직접 메세지를 보낸다.

socketId가 없는 닉네임의 경우 ( 연결되지 않은 클라이언트 ) 에러 핸들링을 통해서 system 메세지로 연결되어 있지 않다고 표현

채팅방에 연결된 유저들의 목록을 보여준다.

유저목록에서 유저를 클릭하면 자동으로 whisper가 설정된다.

명령어는 /help를 입력하면 보여준다.

답장기능을 넣으면..?

## 2. 실행 방법

cd back-end && npm start
cd front-end && npm start

build / dist 폴더 생성 및 파일 Copy 후 실행

dev, environment 환경 설정이 따로 되어있지 않다.

## 3. 구현된 기능들 짧게 소개


* ~~[x] 로그인 구현~~
* ~~[x] 회원가입 구현~~
* ~~[x] 세션 연결~~
* ~~[x] 세션 리다이렉트 연결~~
* ~~[x] 채팅 연결~~
* ~~[x] 채팅 주고받기~~
* ~~[x] 귓속말 구현~~
* [] 채팅 입력시 스크롤 제일 하단 설정 해줘야 겠다. 아니면 새로운 채팅이 오면 스크롤을 제일 하단으로.
* [] 채팅 시간 표현하기 momentJS 사용해보기
* [] 유저 목록에서 특정 유저를 클릭하면 input tag에 자동으로 `/w username` 삽입 할 수 있도록. ALL의 경우에는 `/w username` 삭제
* [] 채팅 정보 저장 하기 mongoDB
* [] 지금 까지의 채팅정보를 긁어서 어떻게 파싱해서 보여주나 ? ( 귓속말도 있을 테니.. ) 최신 100개 정도만 긁어서 보여주고 페이징 설정
* [] 채팅이 많이 쌓이면 페이징 해야될 것 같은데
* [] 10개 더보기 뭐 이런걸로 구현 해야 될 듯
* [] 파일 매니저 구현
* [] 코드 및 구조 리팩토링
* [] 테스트 케이스... 작성