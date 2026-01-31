# Kakao Map API 설정 가이드

## 1. Kakao Developers 계정 생성 및 앱 등록

### 1.1 회원가입 및 로그인
1. https://developers.kakao.com/ 접속
2. 우측 상단 "로그인" 클릭
3. 카카오 계정으로 로그인 (없으면 회원가입)

### 1.2 애플리케이션 등록
1. 로그인 후 "내 애플리케이션" 메뉴 클릭
2. "애플리케이션 추가하기" 버튼 클릭
3. 앱 정보 입력:
   - 앱 이름: 대구 부동산 (또는 원하는 이름)
   - 사업자명: 개인 또는 회사명
   - 카테고리: 라이프스타일 > 부동산/인테리어
4. "저장" 버튼 클릭

## 2. JavaScript 키 확인

### 2.1 앱 키 확인
1. 생성한 앱을 클릭하여 상세 페이지로 이동
2. 좌측 메뉴에서 "앱 키" 클릭
3. **JavaScript 키**를 복사 (REST API 키가 아님!)

```
예시: 1234567890abcdef1234567890abcdef
```

## 3. 플랫폼 등록 (중요!)

### 3.1 Web 플랫폼 등록
1. 좌측 메뉴에서 "플랫폼" 클릭
2. "Web 플랫폼 등록" 버튼 클릭
3. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:3000`
   - 배포 환경: `https://yourdomain.com` (실제 도메인)
4. "저장" 버튼 클릭

**주의**: 등록하지 않은 도메인에서는 API 호출이 차단됩니다!

## 4. 환경변수 설정

### 4.1 .env.local 파일 생성
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 4.2 환경변수 추가
`.env.local` 파일을 열어 다음 내용을 추가합니다:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Generative AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Kakao Map API - 여기에 복사한 JavaScript 키를 입력!
NEXT_PUBLIC_KAKAO_APP_KEY=1234567890abcdef1234567890abcdef
```

## 5. 개발 서버 재시작

환경변수를 추가한 후 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버가 실행 중이면 Ctrl+C로 중지 후
npm run dev
```

## 6. 확인

### 6.1 브라우저에서 확인
1. http://localhost:3000/properties 접속
2. 상단의 "지도" 버튼 클릭
3. 지도가 정상적으로 표시되는지 확인
4. 개별 매물 상세 페이지에서도 지도 확인

### 6.2 에러 발생 시
브라우저 개발자 도구(F12)의 Console 탭에서 에러 메시지를 확인:
- "Invalid API key" → JavaScript 키가 잘못됨
- "Platform not registered" → 플랫폼 등록 필요
- 지도가 회색으로 표시 → API 키 미설정 또는 잘못됨

## 7. 배포 시 주의사항

### 7.1 Vercel 배포
1. Vercel 프로젝트 설정 > Environment Variables
2. `NEXT_PUBLIC_KAKAO_APP_KEY` 추가
3. Production, Preview, Development 모두 체크
4. 재배포

### 7.2 도메인 등록
배포 후 실제 도메인을 Kakao Developers > 플랫폼에 추가해야 합니다:
```
https://your-app.vercel.app
```

## 참고 자료
- Kakao Maps API 문서: https://apis.map.kakao.com/web/
- react-kakao-maps-sdk: https://github.com/JaeSeoKim/react-kakao-maps-sdk
