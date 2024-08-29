# Node.js 22 버전의 알파인 이미지를 기반으로 시작
FROM node:22-alpine

# 애플리케이션 포트를 외부에 노출
EXPOSE 8080

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일을 복사
COPY ./package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 코드를 복사
COPY . .

# 애플리케이션 시작
CMD ["node", "index.js"]
