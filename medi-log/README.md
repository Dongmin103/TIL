# Medi Log - 나만의 약물 복용 다이어리

개인 맞춤형 약물 관리 및 복용 기록을 위한 사용자 친화적인 애플리케이션입니다.

## 🎯 핵심 기능

### 원클릭 복용 관리
- 메인 화면에서 바로 복용 완료 체크
- 스와이프 제스처로 빠른 액션
- 시간대별 자동 약물 표시

### 스마트 약물 추가
- 바코드 스캔으로 자동 정보 입력
- 약품명 검색 기능
- 직접 입력 옵션

### 개인화된 알림
- AI 기반 복용 시간 추천
- 식사 관계 설정 (식전/식후/식사와 함께)
- 가족 알림 공유

### 상세 분석
- 주간/월간 복용률 추적
- 개선 제안 제공
- 성취 배지 시스템

## 🏗️ 아키텍처

### Frontend
- **React 18** - 모던 React 훅 기반
- **Zustand** - 경량 상태 관리
- **React Router** - SPA 라우팅
- **Framer Motion** - 부드러운 애니메이션
- **Lucide React** - 일관된 아이콘

### 상태 관리
```javascript
// 중앙화된 약물 관리 스토어
const useMedicationStore = create((set, get) => ({
  medications: [],
  logs: [],
  user: {},
  // 액션들...
}));
```

### 컴포넌트 구조
```
src/
├── components/
│   ├── Dashboard.js      # 메인 대시보드
│   ├── MedicationCard.js # 약물 카드 컴포넌트
│   ├── AddMedication.js  # 약물 추가
│   ├── Analytics.js      # 분석 화면
│   ├── Settings.js       # 설정
│   └── Navigation.js     # 하단 네비게이션
├── store/
│   └── medicationStore.js # Zustand 스토어
└── App.js               # 메인 앱
```

## 🎨 UX/UI 설계 원칙

### 1. 클릭 최소화
- **원클릭 원칙**: 핵심 액션은 1클릭으로 완료
- **제스처 활용**: 스와이프, 길게 누르기 등
- **예측적 UI**: 사용자 패턴 학습 후 자동 제안

### 2. 접근성 우선
- 최소 44px 터치 영역
- 고대비 모드 지원
- 큰 글씨 모드 대응
- VoiceOver/TalkBack 지원

### 3. 직관적 인터페이스
- 의료진과 환자 모두 이해하기 쉬운 UI
- 명확한 색상 구분 (완료/대기/지연)
- 시각적 피드백 강화

## 🚀 설치 및 실행

```bash
# 의존성 설치
cd medi-log
npm install

# 개발 서버 실행
npm start
```

브라우저에서 `http://localhost:3000`으로 접속

## 📱 주요 화면

### 1. 메인 대시보드
- 현재 시간 기준 복용할 약물 표시
- 원클릭 복용 완료
- 오늘의 복용률 시각화
- 빠른 액션 버튼 (약 추가, 응급연락, 리포트)

### 2. 약물 추가
- 바코드 스캔 (권장)
- 약품명 검색
- 수동 입력
- 복용 스케줄 설정

### 3. 분석 화면
- 주간 복용 현황 차트
- 월별 트렌드 분석
- 개인화된 개선 제안
- 성취 배지 시스템

### 4. 설정
- 프로필 관리
- 알림 설정
- 응급 연락처
- 개인정보 보호

## 🔧 기술적 특징

### 성능 최적화
- 컴포넌트 지연 로딩
- 이미지 최적화
- 로컬 스토리지 활용
- 오프라인 지원 준비

### 보안
- 개인정보 로컬 저장
- HTTPS 통신 준비
- 데이터 암호화 계획

### 확장성
- 모듈화된 컴포넌트 구조
- 재사용 가능한 훅
- 타입 안전성 (TypeScript 마이그레이션 준비)

## 🎯 향후 개발 계획

### Phase 1 (현재)
- ✅ 기본 약물 관리
- ✅ 복용 기록 추적
- ✅ 분석 대시보드

### Phase 2
- 🔄 실제 바코드 스캔 API 연동
- 🔄 푸시 알림 시스템
- 🔄 의료진 연동 기능

### Phase 3
- 📋 AI 기반 복용 패턴 분석
- 📋 약물 상호작용 체크
- 📋 웨어러블 디바이스 연동

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

프로젝트 관련 문의: [이메일 주소]

---

**Medi Log** - 나만의 약물 복용 다이어리로 건강한 복용 습관을 만들어보세요 💊✨