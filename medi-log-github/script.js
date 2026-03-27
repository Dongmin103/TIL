// 현재 복용 중인 약물 데이터
const currentMedications = [
    {
        name: '아모디핀',
        genericName: '암로디핀베실산염',
        dosage: '5mg',
        frequency: '1일 1회',
        timing: '아침 식후',
        interactions: ['심바스타틴', '와파린']
    }
];

// 약물 상호작용 데이터베이스 (실제로는 API에서 가져올 데이터)
const drugInteractions = {
    '아모디핀': {
        '심바스타틴': {
            level: 'warning',
            description: '근육병증 위험이 증가할 수 있습니다. 정기적인 모니터링이 필요합니다.'
        },
        '와파린': {
            level: 'safe',
            description: '일반적으로 안전하게 병용 가능합니다.'
        },
        '리시노프릴': {
            level: 'safe',
            description: '혈압 강하 효과가 상승할 수 있으나 일반적으로 안전합니다.'
        }
    },
    '메트포르민': {
        '아모디핀': {
            level: 'safe',
            description: '상호작용 없이 안전하게 병용 가능합니다.'
        }
    }
};

// 시간 업데이트
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `오늘 ${timeString}`;
    }
}

// 페이지 전환
function showPage(pageId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 선택된 페이지 보이기
    document.getElementById(`${pageId}-page`).classList.remove('hidden');
    
    // 네비게이션 활성 상태 업데이트
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 클릭된 네비게이션 아이템 활성화
    const activeNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => {
        const onclick = item.getAttribute('onclick');
        return onclick && onclick.includes(pageId);
    });
    
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// 복용 완료 처리
function takeMedication(medId, medName) {
    const medCard = document.getElementById(medId);
    const button = medCard.querySelector('.btn-success');
    
    // 완료 상태로 변경
    medCard.classList.add('completed');
    button.outerHTML = `
        <div class="completed-badge">
            ✓ 복용완료
        </div>
    `;
    
    showAlert(`${medName} 복용 완료! ✅`);
}

// 처방전 분석 (실제 파일 업로드)
function analyzePrescription(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showAlert('처방전을 분석하고 있습니다... 🔍');
    
    // 파일 미리보기
    const reader = new FileReader();
    reader.onload = function(e) {
        const cameraView = document.getElementById('camera-view');
        cameraView.innerHTML = `
            <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
            <p>처방전 분석 중...</p>
        `;
    };
    reader.readAsDataURL(file);
    
    // 3초 후 분석 결과 표시 (실제로는 OCR API 호출)
    setTimeout(() => {
        simulateAnalysis();
    }, 3000);
}

// 데모 분석 실행
function simulateAnalysis() {
    showAlert('처방전 분석을 시작합니다... 🔍');
    
    // 분석 결과 영역 표시
    document.getElementById('analysis-results').classList.remove('hidden');
    
    // 단계별 분석 시뮬레이션
    setTimeout(() => {
        showDetectedMedications();
    }, 1000);
    
    setTimeout(() => {
        showInteractionResults();
    }, 2000);
    
    setTimeout(() => {
        showRecommendedSchedule();
    }, 3000);
}

// 인식된 약물 표시
function showDetectedMedications() {
    const detectedMeds = [
        {
            name: '리시노프릴정 10mg',
            genericName: '리시노프릴',
            dosage: '10mg',
            frequency: '1일 1회',
            duration: '30일분',
            instructions: '아침 식후 복용'
        },
        {
            name: '메트포르민정 500mg',
            genericName: '메트포르민',
            dosage: '500mg',
            frequency: '1일 2회',
            duration: '30일분',
            instructions: '아침, 저녁 식후 복용'
        }
    ];
    
    const container = document.getElementById('detected-medications');
    container.innerHTML = detectedMeds.map(med => `
        <div class="detected-med-item">
            <div class="med-name">${med.name}</div>
            <div class="med-details">
                <div><strong>용량:</strong> ${med.dosage}</div>
                <div><strong>횟수:</strong> ${med.frequency}</div>
                <div><strong>기간:</strong> ${med.duration}</div>
                <div><strong>복용법:</strong> ${med.instructions}</div>
            </div>
        </div>
    `).join('');
    
    showAlert('약물 인식이 완료되었습니다! ✅');
}
// 약물 상호작용 결과 표시
function showInteractionResults() {
    const newMeds = ['리시노프릴', '메트포르민'];
    const interactions = [];
    
    // 기존 약물과의 상호작용 체크
    currentMedications.forEach(currentMed => {
        newMeds.forEach(newMed => {
            if (drugInteractions[currentMed.name] && drugInteractions[currentMed.name][newMed]) {
                const interaction = drugInteractions[currentMed.name][newMed];
                interactions.push({
                    drug1: currentMed.name,
                    drug2: newMed,
                    level: interaction.level,
                    description: interaction.description
                });
            }
        });
    });
    
    // 새로운 약물들 간의 상호작용도 체크
    if (drugInteractions['리시노프릴'] && drugInteractions['리시노프릴']['메트포르민']) {
        const interaction = drugInteractions['리시노프릴']['메트포르민'];
        interactions.push({
            drug1: '리시노프릴',
            drug2: '메트포르민',
            level: interaction.level,
            description: interaction.description
        });
    }
    
    const container = document.getElementById('interaction-results');
    
    if (interactions.length === 0) {
        container.innerHTML = `
            <div class="interaction-item interaction-safe">
                <div class="interaction-header">
                    <span>✅</span>
                    <span>상호작용 없음</span>
                </div>
                <div class="interaction-description">
                    새로 처방된 약물들은 기존 복용 중인 약물과 안전하게 병용 가능합니다.
                </div>
            </div>
        `;
    } else {
        container.innerHTML = interactions.map(interaction => {
            const levelClass = `interaction-${interaction.level}`;
            const icon = interaction.level === 'safe' ? '✅' : 
                        interaction.level === 'warning' ? '⚠️' : '❌';
            const levelText = interaction.level === 'safe' ? '안전' :
                             interaction.level === 'warning' ? '주의' : '위험';
            
            return `
                <div class="interaction-item ${levelClass}">
                    <div class="interaction-header">
                        <span>${icon}</span>
                        <span>${interaction.drug1} + ${interaction.drug2} (${levelText})</span>
                    </div>
                    <div class="interaction-description">
                        ${interaction.description}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 상태 업데이트
    const statusItems = document.querySelectorAll('.status-item');
    if (statusItems[1]) {
        statusItems[1].innerHTML = `
            <span class="status-icon">✅</span>
            <span>약물 상호작용 검사 완료</span>
        `;
    }
    
    showAlert('약물 상호작용 검사가 완료되었습니다! 🔍');
}

// 권장 복용 스케줄 표시
function showRecommendedSchedule() {
    const schedules = [
        {
            time: '08:00 (아침)',
            medications: [
                '아모디핀 5mg (기존)',
                '리시노프릴 10mg (신규)',
                '메트포르민 500mg (신규)'
            ]
        },
        {
            time: '20:00 (저녁)',
            medications: [
                '메트포르민 500mg (신규)'
            ]
        }
    ];
    
    const container = document.getElementById('recommended-schedule');
    container.innerHTML = schedules.map(schedule => `
        <div class="schedule-item">
            <div class="schedule-time">${schedule.time}</div>
            <div class="schedule-meds">
                ${schedule.medications.map(med => `
                    <div class="schedule-med">• ${med}</div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    showAlert('복용 스케줄이 생성되었습니다! 📅');
}

// 내 약물에 추가
function addToMyMedications() {
    showAlert('새로운 약물이 추가되었습니다! 🎉');
    
    // 실제로는 여기서 로컬 스토리지나 서버에 데이터 저장
    setTimeout(() => {
        showPage('dashboard');
        showAlert('메인 화면에서 새로운 복용 스케줄을 확인하세요! 📋');
    }, 1500);
}

// 응급 연락
function emergencyCall() {
    showAlert('김영희 (배우자)에게 연결 중... 📞');
}

// 알림 표시
function showAlert(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #363636;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // 기본 페이지 표시
    showPage('dashboard');
});
// 설정 관련 변수
let userSettings = {
    largeText: false,
    voiceReading: false,
    highContrast: false,
    simpleUI: false,
    medicationAlerts: true,
    vibrationAlerts: true,
    soundAlerts: false,
    familyAlerts: true
};

let userHealthInfo = {
    conditions: '고혈압, 당뇨병',
    allergies: '페니실린, 아스피린',
    emergencyContact: '김영희 (배우자) • 010-1234-5678'
};

// 음성 읽기 기능
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// 큰 글씨 모드 토글
function toggleLargeText() {
    const isEnabled = document.getElementById('large-text-toggle').checked;
    userSettings.largeText = isEnabled;
    
    if (isEnabled) {
        document.body.classList.add('large-text');
        showAlert('큰 글씨 모드가 활성화되었습니다 📖');
    } else {
        document.body.classList.remove('large-text');
        showAlert('큰 글씨 모드가 비활성화되었습니다');
    }
    
    saveSettings();
}

// 음성 읽기 토글
function toggleVoiceReading() {
    const isEnabled = document.getElementById('voice-reading-toggle').checked;
    userSettings.voiceReading = isEnabled;
    
    if (isEnabled) {
        showAlert('음성 읽기 모드가 활성화되었습니다 🔊');
        speakText('음성 읽기 기능이 활성화되었습니다. 이제 텍스트를 터치하면 음성으로 읽어드립니다.');
        enableVoiceReading();
    } else {
        showAlert('음성 읽기 모드가 비활성화되었습니다');
        disableVoiceReading();
    }
    
    saveSettings();
}

// 고대비 모드 토글
function toggleHighContrast() {
    const isEnabled = document.getElementById('high-contrast-toggle').checked;
    userSettings.highContrast = isEnabled;
    
    if (isEnabled) {
        document.body.classList.add('high-contrast');
        showAlert('고대비 모드가 활성화되었습니다 🌓');
    } else {
        document.body.classList.remove('high-contrast');
        showAlert('고대비 모드가 비활성화되었습니다');
    }
    
    saveSettings();
}

// 간단한 UI 모드 토글
function toggleSimpleUI() {
    const isEnabled = document.getElementById('simple-ui-toggle').checked;
    userSettings.simpleUI = isEnabled;
    
    if (isEnabled) {
        document.body.classList.add('simple-ui');
        showAlert('간단한 인터페이스 모드가 활성화되었습니다 ✨');
    } else {
        document.body.classList.remove('simple-ui');
        showAlert('전체 인터페이스 모드로 변경되었습니다');
    }
    
    saveSettings();
}

// 복용 알림 토글
function toggleMedicationAlerts() {
    const isEnabled = document.getElementById('medication-alerts').checked;
    userSettings.medicationAlerts = isEnabled;
    
    if (isEnabled) {
        showAlert('복용 알림이 활성화되었습니다 🔔');
    } else {
        showAlert('복용 알림이 비활성화되었습니다');
    }
    
    saveSettings();
}

// 음성 읽기 기능 활성화
function enableVoiceReading() {
    // 모든 텍스트 요소에 클릭 이벤트 추가
    const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, button');
    textElements.forEach(element => {
        element.addEventListener('click', handleVoiceClick);
        element.style.cursor = 'pointer';
    });
}

// 음성 읽기 기능 비활성화
function disableVoiceReading() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, button');
    textElements.forEach(element => {
        element.removeEventListener('click', handleVoiceClick);
        element.style.cursor = '';
    });
    
    // 현재 재생 중인 음성 중지
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
}

// 음성 클릭 핸들러
function handleVoiceClick(event) {
    if (!userSettings.voiceReading) return;
    
    event.preventDefault();
    const text = event.target.textContent.trim();
    if (text) {
        speakText(text);
        
        // 시각적 피드백
        event.target.classList.add('voice-reading-active');
        setTimeout(() => {
            event.target.classList.remove('voice-reading-active');
        }, 2000);
    }
}

// 텍스트 음성 변환
function speakText(text) {
    // 기존 음성 중지
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = 0.8;
    currentUtterance.pitch = 1;
    
    currentUtterance.onend = () => {
        currentUtterance = null;
    };
    
    speechSynthesis.speak(currentUtterance);
}

// 음성 테스트
function testVoiceReading() {
    const testText = '안녕하세요. 메디 로그 음성 읽기 기능 테스트입니다. 약 복용 시간을 놓치지 마세요.';
    speakText(testText);
    showAlert('음성 테스트를 실행합니다 🔊');
}

// 건강 정보 표시
function showHealthInfo() {
    showModal('건강 정보 수정', `
        <div class="form-group">
            <label class="form-label">질환 정보</label>
            <textarea class="form-input form-textarea" id="edit-conditions" placeholder="고혈압, 당뇨병 등">${userHealthInfo.conditions}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">알레르기</label>
            <textarea class="form-input form-textarea" id="edit-allergies" placeholder="페니실린, 아스피린 등">${userHealthInfo.allergies}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">응급 연락처</label>
            <input type="text" class="form-input" id="edit-emergency" placeholder="이름 • 전화번호" value="${userHealthInfo.emergencyContact}">
        </div>
    `, () => {
        saveHealthInfo();
    });
}

// 건강 정보 편집
function editHealthInfo(type) {
    let title, content, placeholder, currentValue;
    
    switch(type) {
        case 'conditions':
            title = '질환 정보 수정';
            placeholder = '고혈압, 당뇨병, 심장병 등을 입력하세요';
            currentValue = userHealthInfo.conditions;
            break;
        case 'allergies':
            title = '알레르기 정보 수정';
            placeholder = '페니실린, 아스피린, 견과류 등을 입력하세요';
            currentValue = userHealthInfo.allergies;
            break;
        case 'emergency':
            title = '응급 연락처 수정';
            placeholder = '이름 • 전화번호';
            currentValue = userHealthInfo.emergencyContact;
            break;
    }
    
    content = `
        <div class="form-group">
            <label class="form-label">${title}</label>
            <textarea class="form-input form-textarea" id="edit-${type}" placeholder="${placeholder}">${currentValue}</textarea>
        </div>
    `;
    
    showModal(title, content, () => {
        const newValue = document.getElementById(`edit-${type}`).value;
        userHealthInfo[type] = newValue;
        document.getElementById(`health-${type}`).textContent = newValue;
        saveHealthInfo();
        showAlert('정보가 업데이트되었습니다 ✅');
    });
}

// 모달 표시
function showModal(title, content, onSave) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            ${content}
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">취소</button>
                <button class="btn btn-primary" onclick="handleModalSave()">저장</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 저장 핸들러 설정
    window.currentModalSaveHandler = onSave;
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 모달 닫기
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
    window.currentModalSaveHandler = null;
}

// 모달 저장 처리
function handleModalSave() {
    if (window.currentModalSaveHandler) {
        window.currentModalSaveHandler();
    }
    closeModal();
}

// 건강 정보 저장
function saveHealthInfo() {
    const conditions = document.getElementById('edit-conditions')?.value || userHealthInfo.conditions;
    const allergies = document.getElementById('edit-allergies')?.value || userHealthInfo.allergies;
    const emergency = document.getElementById('edit-emergency')?.value || userHealthInfo.emergencyContact;
    
    userHealthInfo.conditions = conditions;
    userHealthInfo.allergies = allergies;
    userHealthInfo.emergencyContact = emergency;
    
    // UI 업데이트
    document.getElementById('health-conditions').textContent = conditions;
    document.getElementById('health-allergies').textContent = allergies;
    document.getElementById('emergency-contact').textContent = emergency;
    
    // 로컬 스토리지에 저장
    localStorage.setItem('medilog-health-info', JSON.stringify(userHealthInfo));
    showAlert('건강 정보가 저장되었습니다 💾');
}

// 설정 저장
function saveSettings() {
    localStorage.setItem('medilog-settings', JSON.stringify(userSettings));
}

// 설정 로드
function loadSettings() {
    const saved = localStorage.getItem('medilog-settings');
    if (saved) {
        userSettings = { ...userSettings, ...JSON.parse(saved) };
    }
    
    // UI에 설정 적용
    document.getElementById('large-text-toggle').checked = userSettings.largeText;
    document.getElementById('voice-reading-toggle').checked = userSettings.voiceReading;
    document.getElementById('high-contrast-toggle').checked = userSettings.highContrast;
    document.getElementById('simple-ui-toggle').checked = userSettings.simpleUI;
    document.getElementById('medication-alerts').checked = userSettings.medicationAlerts;
    document.getElementById('vibration-alerts').checked = userSettings.vibrationAlerts;
    document.getElementById('sound-alerts').checked = userSettings.soundAlerts;
    document.getElementById('family-alerts').checked = userSettings.familyAlerts;
    
    // 클래스 적용
    if (userSettings.largeText) document.body.classList.add('large-text');
    if (userSettings.highContrast) document.body.classList.add('high-contrast');
    if (userSettings.simpleUI) document.body.classList.add('simple-ui');
    if (userSettings.voiceReading) enableVoiceReading();
}

// 건강 정보 로드
function loadHealthInfo() {
    const saved = localStorage.getItem('medilog-health-info');
    if (saved) {
        userHealthInfo = { ...userHealthInfo, ...JSON.parse(saved) };
    }
    
    // UI 업데이트
    document.getElementById('health-conditions').textContent = userHealthInfo.conditions;
    document.getElementById('health-allergies').textContent = userHealthInfo.allergies;
    document.getElementById('emergency-contact').textContent = userHealthInfo.emergencyContact;
}

// 로그아웃 확인
function confirmLogout() {
    showModal('로그아웃', `
        <p>정말 로그아웃하시겠습니까?</p>
        <p style="font-size: 14px; color: #666; margin-top: 8px;">
            저장된 데이터는 유지됩니다.
        </p>
    `, () => {
        showAlert('로그아웃되었습니다 👋');
        // 실제로는 여기서 로그아웃 처리
    });
}

// 65세 이상 사용자 자동 설정
function checkAgeAndApplySettings() {
    const userAge = 45; // 실제로는 사용자 프로필에서 가져옴
    
    if (userAge >= 65) {
        // 65세 이상 사용자를 위한 자동 설정
        userSettings.largeText = true;
        userSettings.simpleUI = true;
        userSettings.voiceReading = true;
        
        // UI 적용
        document.getElementById('large-text-toggle').checked = true;
        document.getElementById('simple-ui-toggle').checked = true;
        document.getElementById('voice-reading-toggle').checked = true;
        
        document.body.classList.add('large-text', 'simple-ui');
        enableVoiceReading();
        
        showAlert('고령자 친화 설정이 자동으로 적용되었습니다 👴👵');
        saveSettings();
    }
}

// 초기화 함수 업데이트
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // 설정 로드
    loadSettings();
    loadHealthInfo();
    
    // 65세 이상 자동 설정 체크
    checkAgeAndApplySettings();
    
    // 모든 모달 숨기기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    });
    
    // 기본 페이지를 홈으로 설정
    showPage('dashboard');
    
    // 네비게이션 초기화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.nav-item[onclick*="dashboard"]').classList.add('active');
});
// 분석 페이지 관련 함수들
function showAnalyticsFilter() {
    showModal('분석 기간 선택', `
        <div class="form-group">
            <label class="form-label">분석 기간</label>
            <select class="form-input" id="analytics-period">
                <option value="1week">최근 1주</option>
                <option value="1month" selected>최근 1개월</option>
                <option value="3months">최근 3개월</option>
                <option value="6months">최근 6개월</option>
                <option value="1year">최근 1년</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">약물 선택</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> 모든 약물
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> 혈압약 (아모디핀)
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> 당뇨약 (메트포르민)
                </label>
            </div>
        </div>
    `, () => {
        const period = document.getElementById('analytics-period').value;
        showAlert(`${period} 기간으로 분석을 업데이트했습니다 📊`);
        // 실제로는 여기서 차트 데이터 업데이트
    });
}

function changeTrendPeriod(period) {
    showAlert(`${period} 트렌드로 변경되었습니다 📈`);
    // 실제로는 여기서 트렌드 차트 데이터 업데이트
}

function exportReport(type) {
    let message = '';
    switch(type) {
        case 'pdf':
            message = 'PDF 리포트를 생성하고 있습니다... 📄';
            break;
        case 'excel':
            message = 'Excel 데이터를 내보내고 있습니다... 📊';
            break;
        default:
            message = '리포트를 생성하고 있습니다...';
    }
    
    showAlert(message);
    
    // 실제 구현에서는 여기서 서버 API 호출
    setTimeout(() => {
        showAlert('리포트가 다운로드 폴더에 저장되었습니다! ✅');
    }, 2000);
}

function shareWithDoctor() {
    showModal('의사와 공유', `
        <div class="form-group">
            <label class="form-label">의료진 선택</label>
            <select class="form-input" id="doctor-select">
                <option value="">의사를 선택하세요</option>
                <option value="kim">김의사 (내과)</option>
                <option value="lee">이의사 (심장내과)</option>
                <option value="park">박의사 (내분비내과)</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">공유할 데이터</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> 복용 기록
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> 복용률 분석
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox"> 부작용 기록
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox"> 건강 지표
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">메모 (선택사항)</label>
            <textarea class="form-input form-textarea" placeholder="의사에게 전달할 메시지를 입력하세요"></textarea>
        </div>
    `, () => {
        const doctor = document.getElementById('doctor-select').value;
        if (!doctor) {
            showAlert('의사를 선택해주세요 ⚠️');
            return;
        }
        showAlert('의료진에게 데이터를 공유했습니다 👨‍⚕️');
    });
}

// 처방전 분석 모달 관련 함수들
function showPrescriptionAnalysis() {
    const modal = document.getElementById('prescription-analysis-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePrescriptionAnalysis();
        }
    });
}

function closePrescriptionAnalysis() {
    const modal = document.getElementById('prescription-analysis-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function showPrescriptionTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    event.target.classList.add('active');
    document.getElementById(`prescription-${tabName}`).classList.add('active');
}

function filterTimeline(period) {
    showAlert(`${period} 기간의 처방 이력을 표시합니다 📋`);
    // 실제로는 여기서 타임라인 데이터 필터링
}

function exportPrescriptionReport() {
    showAlert('처방전 분석 리포트를 생성하고 있습니다... 📋');
    
    setTimeout(() => {
        showAlert('처방전 분석 리포트가 저장되었습니다! ✅');
        closePrescriptionAnalysis();
    }, 2000);
}

// 트렌드 포인트 호버 효과
document.addEventListener('DOMContentLoaded', function() {
    // 기존 초기화 코드...
    
    // 트렌드 포인트에 툴팁 추가
    const trendPoints = document.querySelectorAll('.trend-point');
    trendPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const month = this.getAttribute('data-month');
            const rate = this.getAttribute('data-rate');
            
            // 툴팁 생성 (간단한 구현)
            const tooltip = document.createElement('div');
            tooltip.className = 'trend-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                transform: translate(-50%, -100%);
                margin-top: -8px;
            `;
            tooltip.textContent = `${month}: ${rate}`;
            
            this.appendChild(tooltip);
        });
        
        point.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.trend-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // 주간 차트 애니메이션
    setTimeout(() => {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '0';
                bar.style.transform = 'scaleY(0)';
                bar.style.transformOrigin = 'bottom';
                bar.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    bar.style.opacity = '1';
                    bar.style.transform = 'scaleY(1)';
                }, 100);
            }, index * 100);
        });
    }, 500);
});