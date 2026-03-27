#!/usr/bin/env python3
import http.server
import socketserver
import socket
import os
import sys

# 현재 디렉토리를 서버 루트로 설정
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def get_local_ip():
    try:
        # 외부 서버에 연결을 시도하여 로컬 IP 주소를 얻음
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"

if __name__ == "__main__":
    local_ip = get_local_ip()
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Medi Log 서버가 시작되었습니다!")
        print(f"📱 로컬 접속: http://localhost:{PORT}")
        print(f"🌐 네트워크 접속: http://{local_ip}:{PORT}")
        print(f"📋 다른 기기에서 접속하려면 위의 네트워크 주소를 사용하세요")
        print(f"⏹️  서버를 중지하려면 Ctrl+C를 누르세요")
        print("-" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 서버가 중지되었습니다.")
            sys.exit(0)