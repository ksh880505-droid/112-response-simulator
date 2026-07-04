# 112 흉기위협 대응 시뮬레이터

현장 경찰관의 안전 중심 의사결정을 위한 정적 교육 프로토타입입니다.

## 실행

`index.html`을 브라우저에서 열거나 정적 파일 서버로 현재 폴더를 실행합니다. 빌드 과정은 필요하지 않습니다.

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. Project Settings > API에서 Project URL과 anon public key를 복사합니다.
4. `supabase-config.js`의 `url`, `anonKey` 값을 실제 값으로 바꿉니다.
5. Authentication > Providers에서 Email provider를 켭니다.

## 구조

- `index.html`: 화면과 교육 콘텐츠
- `styles.css`: 반응형 공공안전 UI
- `auth.css`: 인증 패널 UI
- `app.js`: 진행, 점수, 결과 리포트, 인증, DB 저장 로직
- `data/scenarios.js`: 교체 가능한 mock 시나리오 데이터
- `supabase-config.js`: Supabase 클라이언트 설정
- `supabase/schema.sql`: 인증 사용자별 훈련 결과 저장 테이블과 RLS 정책

## 유의사항

법률 및 정책 설명은 교육용 요약입니다. 실제 교육에 사용하기 전 소속 기관의 최신 현장 지침과 국가법령정보센터의 현행 법령을 검토해야 합니다.
