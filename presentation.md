---
marp: false
theme: default
paginate: true
---

# MoreBurger 백엔드 개발 프레젠테이션

---

## 프로젝트 개요

### MoreBurger 백엔드 서비스

- **목적**: 햄버거 관련 커머스 플랫폼 구축
- **주요 기능**:
  - 사용자 인증 (로그인/회원가입)
  - 햄버거 상품 관리 (CRUD 작업)
- **기술 스택**: 
  - Node.js (v18.16.0)
  - Express.js
  - MySQL (Sequelize ORM v6.32.1)
  - JSON Web Token (JWT) for authentication
  - bcrypt for password hashing

---

## 사용자 인증 기능

### 로그인 및 회원가입

- **구현 내용**:
  - 회원가입: 새로운 사용자 정보 등록 (`POST /api/users`)
  - 로그인: 등록된 사용자 인증 (`POST /api/auth`)
- **주요 파일**:
  - `routes/userRoute.js`: 사용자 관련 라우팅 처리
  - `controllers/userController.js`: 사용자 관련 로직 구현
  - `models/user.js`: Sequelize를 사용한 사용자 모델 정의

---

## 사용자 인증 기능 (계속)

- **보안**: 
  - bcrypt를 사용한 비밀번호 해싱
  - JWT를 이용한 토큰 기반 인증
- **특징**:
  - 이메일 중복 체크
  - 비밀번호 유효성 검사 (최소 8자, 최소 하나의 대문자, 소문자, 숫자, 특수문자 포함)

---

## 햄버거 상품 관리

### 햄버거 CRUD 작업

- **구현 기능**:
  - Create: 새로운 햄버거 상품 등록 (`POST /api/burgers`)
  - Read: 햄버거 상품 정보 조회 (`GET /api/burgers`, `GET /api/burgers/:id`)
  - Update: 기존 햄버거 상품 정보 수정 (`PUT /api/burgers/:id`)
  - Delete: 햄버거 상품 삭제 (`DELETE /api/burgers/:id`)

---

## 햄버거 상품 관리 (계속)

- **주요 파일**:
  - `routes/burgerRoute.js`: 햄버거 관련 라우팅 처리
  - `controllers/burgerController.js`: 햄버거 정보 처리 로직
  - `models/burger.js`: Sequelize를 사용한 햄버거 모델 정의
- **특징**: 
  - RESTful API 설계 원칙 준수
  - Sequelize를 활용한 MySQL 데이터 관리
  - 상품 이미지 URL 저장 기능
  - 가격, 설명 등 상세 정보 관리

---

## 감사합니다!

질문이나 피드백이 있으시면 언제든 말씀해 주세요.