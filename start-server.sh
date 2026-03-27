#!/bin/bash

# Medi Log 서버 시작 스크립트

echo "🏥 Medi Log 서버를 시작합니다..."

# Python이 설치되어 있는지 확인
if command -v python3 &> /dev/null; then
    echo "✅ Python3 발견"
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python 발견"
    python server.py
else
    echo "❌ Python이 설치되어 있지 않습니다."
    echo "📥 Python 설치 방법:"
    echo "   macOS: brew install python3"
    echo "   Ubuntu: sudo apt install python3"
    echo "   Windows: https://python.org에서 다운로드"
    exit 1
fi