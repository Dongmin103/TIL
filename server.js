const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;

// MIME 타입 매핑
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// 로컬 IP 주소 가져오기
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 파일을 찾을 수 없습니다</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`서버 오류: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

const localIP = getLocalIP();

server.listen(PORT, () => {
    console.log('🚀 Medi Log 서버가 시작되었습니다!');
    console.log(`📱 로컬 접속: http://localhost:${PORT}`);
    console.log(`🌐 네트워크 접속: http://${localIP}:${PORT}`);
    console.log('📋 다른 기기에서 접속하려면 위의 네트워크 주소를 사용하세요');
    console.log('⏹️  서버를 중지하려면 Ctrl+C를 누르세요');
    console.log('-'.repeat(60));
});

process.on('SIGINT', () => {
    console.log('\n🛑 서버가 중지되었습니다.');
    process.exit(0);
});