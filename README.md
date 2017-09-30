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
  * build
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
  password,
  email
 }
 ```

mongoose 4.11 >= 부터 promise이 활용 되면서, mongoose connect()등 메서등이 deprecated되었고, 이를 해결 하기 위해서 blubird나 global.Promise를 사용해서 connection 이후에 여러가지 작업들을 promise chainning으로 쿼리를 작성 할 수 있다.

## 2. 실행 방법

npm start ( 내부적으로 npm run build && node build 실행 스크립트 작성 )

## 3. 구현된 기능들 짧게 소개
