#!/bin/zsh
set -e

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew가 없습니다. https://brew.sh 에서 Homebrew를 먼저 설치하세요."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 설치"
  brew install node
fi

node -v
npm -v
npm install
npm run check:data

echo ""
echo "설치 완료"
echo "개발 서버: npm run dev"
echo "단일 HTML 빌드: npm run build:single"
