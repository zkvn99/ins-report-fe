# macOS 개발환경 설정

## 1. Homebrew

이미 설치되어 있으면 건너뜁니다.

```bash
brew --version
```

Homebrew가 없다면 https://brew.sh 의 설치 명령으로 설치합니다.

## 2. Node.js

가장 단순한 구성은 Homebrew의 기본 Node입니다.

```bash
brew install node
node -v
npm -v
```

이 프로젝트는 전역 `vue` CLI를 설치하지 않습니다. Vue CLI는 사용하지 않고 Vue 3 + Vite 구조를 사용합니다.

새 빈 프로젝트를 직접 만들 때의 공식 방식은 아래입니다. 제공된 프로젝트를 사용할 때는 실행할 필요가 없습니다.

```bash
npm create vue@latest
```

## 3. 프로젝트 실행

ZIP을 풀고 프로젝트 폴더에서:

```bash
npm install
npm run check:data
npm run dev
```

브라우저에서 Vite가 표시한 localhost 주소를 엽니다.

## 4. 테스트

```bash
npm test
```

## 5. 배포 빌드

일반 Vite 빌드:

```bash
npm run build
```

단일 HTML 빌드:

```bash
npm run build:single
```

결과:

```text
dist/health-asset-report.html
```

이 파일은 JS/CSS와 anatomy 이미지가 모두 인라인되는 구성을 목표로 합니다.

## 6. 권장 VS Code 확장

- Vue - Official
- ESLint (나중에 lint 설정을 추가할 때)
- Prettier (팀에서 포맷을 고정할 때)

초기에는 TypeScript를 강제하지 않고 JavaScript + 작은 모듈 구조로 유지합니다.
