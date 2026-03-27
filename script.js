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

// 사용자 정보 관리
let userProfile = {
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    conditions: '',
    allergies: '',
    healthInterests: [],
    currentMedications: '',
    prescriptionHistory: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    isRegistered: false
};

// 사용자 정보 로드
function loadUserProfile() {
    const saved = localStorage.getItem('medilog-user-profile');
    if (saved) {
        userProfile = { ...userProfile, ...JSON.parse(saved) };
        return true;
    }
    return false;
}

// 사용자 정보 저장
function saveUserProfile() {
    localStorage.setItem('medilog-user-profile', JSON.stringify(userProfile));
}

// 회원가입 처리
function handleRegistration(event) {
    event.preventDefault();
    
    // 폼 데이터 수집
    userProfile.name = document.getElementById('user-name').value;
    userProfile.age = document.getElementById('user-age').value;
    userProfile.gender = document.getElementById('user-gender').value;
    userProfile.phone = document.getElementById('user-phone').value;
    userProfile.address = document.getElementById('user-address').value;
    userProfile.conditions = document.getElementById('user-conditions').value || '없음';
    userProfile.allergies = document.getElementById('user-allergies').value || '없음';
    userProfile.currentMedications = document.getElementById('current-medications').value || '없음';
    userProfile.prescriptionHistory = document.getElementById('prescription-history').value || '없음';
    userProfile.emergencyName = document.getElementById('emergency-name').value;
    userProfile.emergencyRelation = document.getElementById('emergency-relation').value;
    userProfile.emergencyPhone = document.getElementById('emergency-phone').value;
    userProfile.isRegistered = true;
    
    // 건강 관심 분야 수집
    const interests = [];
    document.querySelectorAll('#health-interests input[type="checkbox"]:checked').forEach(checkbox => {
        interests.push(checkbox.value);
    });
    userProfile.healthInterests = interests;
    
    // 필수 약관 동의 확인
    const agreeTerms = document.getElementById('agree-terms').checked;
    const agreePrivacy = document.getElementById('agree-privacy').checked;
    
    if (!agreeTerms || !agreePrivacy) {
        showAlert('필수 약관에 동의해주세요 ⚠️');
        return;
    }
    
    // 사용자 정보 저장
    saveUserProfile();
    
    // 설정 페이지 정보 업데이트
    updateSettingsWithUserInfo();
    
    // 가입 완료 알림
    showAlert('회원가입이 완료되었습니다! 🎉');
    
    // 메인 페이지로 이동
    setTimeout(() => {
        showPage('dashboard');
    }, 1500);
}

// 설정 페이지 사용자 정보 업데이트
function updateSettingsWithUserInfo() {
    if (userProfile.isRegistered) {
        // 프로필 정보 업데이트
        const userNameElement = document.getElementById('profile-user-name');
        const userAgeElement = document.getElementById('profile-user-age');
        
        if (userNameElement) userNameElement.textContent = userProfile.name;
        if (userAgeElement) userAgeElement.textContent = `${userProfile.age}세 • ${userProfile.gender === 'male' ? '남성' : userProfile.gender === 'female' ? '여성' : ''}`;
        
        // 건강 정보 업데이트
        const healthConditionsElement = document.getElementById('health-conditions');
        const healthAllergiesElement = document.getElementById('health-allergies');
        const emergencyContactElement = document.getElementById('emergency-contact');
        
        if (healthConditionsElement) healthConditionsElement.textContent = userProfile.conditions;
        if (healthAllergiesElement) healthAllergiesElement.textContent = userProfile.allergies;
        if (emergencyContactElement) emergencyContactElement.textContent = `${userProfile.emergencyName} (${getRelationText(userProfile.emergencyRelation)}) • ${userProfile.emergencyPhone}`;
    }
}

// 관계 텍스트 변환
function getRelationText(relation) {
    const relations = {
        'spouse': '배우자',
        'parent': '부모',
        'child': '자녀',
        'sibling': '형제/자매',
        'friend': '친구',
        'other': '기타'
    };
    return relations[relation] || relation;
}

// 앱 초기화 시 사용자 등록 상태 확인
function checkUserRegistration() {
    const isRegistered = loadUserProfile();
    
    if (!isRegistered || !userProfile.isRegistered) {
        // 미등록 사용자는 랜딩 페이지로
        showPage('landing');
        return false;
    } else {
        // 등록된 사용자는 메인 페이지로
        updateSettingsWithUserInfo();
        updateComplianceWeather();
        showPage('dashboard');
        return true;
    }
}

// 로그인 모달 표시
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    // 로그인 폼 이벤트 리스너
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
}

// 로그인 모달 닫기
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

// 로그인 처리
function handleLogin(event) {
    event.preventDefault();
    
    const phone = document.getElementById('login-phone').value;
    const name = document.getElementById('login-name').value;
    
    // 간단한 로그인 검증 (실제로는 서버 검증 필요)
    if (userProfile.phone === phone && userProfile.name === name) {
        showAlert('로그인 성공! 🎉');
        closeLoginModal();
        showPage('dashboard');
        updateComplianceWeather();
    } else {
        showAlert('등록된 정보와 일치하지 않습니다 ❌');
    }
}

// 처방전 업로드 처리
function handlePrescriptionUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('prescription-preview');
        const imagePreview = document.getElementById('prescription-image-preview');
        
        imagePreview.innerHTML = `
            <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #e2e8f0;">
        `;
        
        preview.classList.remove('hidden');
        document.getElementById('prescription-upload-area').style.display = 'none';
        
        showAlert('처방전이 업로드되었습니다! 📷');
    };
    
    reader.readAsDataURL(file);
}

// 처방전 업로드 건너뛰기
function skipPrescriptionUpload() {
    showAlert('나중에 처방전을 등록할 수 있습니다 ⏭️');
}

// 처방전 업로드 제거
function removePrescriptionUpload() {
    document.getElementById('prescription-preview').classList.add('hidden');
    document.getElementById('prescription-upload-area').style.display = 'block';
    document.getElementById('prescription-file').value = '';
    showAlert('처방전이 제거되었습니다 🗑️');
}

// 복용 상태에 따른 날씨 아이콘 업데이트
function updateComplianceWeather() {
    const weatherElement = document.getElementById('compliance-weather');
    if (!weatherElement) return;
    
    // 복용 상태 계산 (예시 데이터)
    const medications = document.querySelectorAll('.medication-card');
    let onTime = 0;
    let delayed = 0;
    let missed = 0;
    
    medications.forEach(med => {
        if (med.classList.contains('completed')) {
            onTime++;
        } else if (med.classList.contains('missed')) {
            missed++;
        } else if (med.querySelector('.status-indicator.delayed')) {
            delayed++;
        } else {
            onTime++;
        }
    });
    
    const total = medications.length;
    const complianceRate = total > 0 ? (onTime / total) * 100 : 100;
    
    let weatherIcon, weatherText, weatherClass;
    
    if (complianceRate >= 90) {
        weatherIcon = '☀️';
        weatherText = '맑음';
        weatherClass = 'sunny';
    } else if (complianceRate >= 70) {
        weatherIcon = '⛅';
        weatherText = '흐림';
        weatherClass = 'cloudy';
    } else {
        weatherIcon = '🌧️';
        weatherText = '비';
        weatherClass = 'rainy';
    }
    
    weatherElement.innerHTML = `
        <div class="weather-icon ${weatherClass}">${weatherIcon}</div>
        <span class="weather-text">${weatherText}</span>
    `;
}

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
    const hour = now.getHours();
    
    // 날짜 포맷팅 (2024년 3월 27일)
    const dateString = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 요일 포맷팅
    const dayString = now.toLocaleDateString('ko-KR', {
        weekday: 'long'
    });
    
    // 시간 포맷팅 (14:30)
    const timeString = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    // 사용자 이름 가져오기
    const userName = userProfile.name || '사용자';
    
    // 시간대별 인사말 설정
    let greetingText = '';
    if (hour >= 5 && hour < 11) {
        // 오전 (5시-11시)
        const morningGreetings = [
            `좋은 아침이에요, ${userName}님! 🌅`,
            `상쾌한 아침입니다, ${userName}님! ☀️`
        ];
        greetingText = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    } else if (hour >= 11 && hour < 17) {
        // 오후 (11시-17시)
        const afternoonGreetings = [
            `좋은 오후에요, ${userName}님! 🌤️`,
            `활기찬 오후입니다, ${userName}님! 💪`
        ];
        greetingText = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
    } else if (hour >= 17 && hour < 22) {
        // 저녁 (17시-22시)
        const eveningGreetings = [
            `좋은 저녁이에요, ${userName}님! 🌆`,
            `편안한 저녁입니다, ${userName}님! 🌙`
        ];
        greetingText = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
    } else {
        // 밤/새벽 (22시-5시)
        const nightGreetings = [
            `늦은 시간이네요, ${userName}님! 🌃`,
            `안녕하세요, ${userName}님! 🌟`
        ];
        greetingText = nightGreetings[Math.floor(Math.random() * nightGreetings.length)];
    }
    
    // DOM 업데이트
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerHTML = `${dateString} ${dayString} ${timeString}`;
    }
    
    const greetingElement = document.getElementById('greeting-text');
    if (greetingElement) {
        greetingElement.innerHTML = greetingText;
    }
}

// 즉시 시간 업데이트 실행
updateTime();

// 페이지 전환
function showPage(pageId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 선택된 페이지 보이기
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
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
    const button = medCard.querySelector('button');
    
    // 완료 상태로 변경
    medCard.classList.add('completed');
    medCard.classList.remove('missed');
    
    // 상태 표시기 업데이트
    const statusIndicator = medCard.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator completed';
    statusIndicator.textContent = '✅';
    
    // 버튼 변경
    button.outerHTML = `
        <div class="completed-badge">
            ✓ 복용완료
        </div>
    `;
    
    // 복용 상태 날씨 업데이트
    updateComplianceWeather();
    
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
        const targetElement = document.getElementById(`health-${type}`);
        if (targetElement) {
            targetElement.textContent = newValue;
        }
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
    const healthConditionsElement = document.getElementById('health-conditions');
    const healthAllergiesElement = document.getElementById('health-allergies');
    const emergencyContactElement = document.getElementById('emergency-contact');
    
    if (healthConditionsElement) healthConditionsElement.textContent = conditions;
    if (healthAllergiesElement) healthAllergiesElement.textContent = allergies;
    if (emergencyContactElement) emergencyContactElement.textContent = emergency;
    
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
    const largeTextToggle = document.getElementById('large-text-toggle');
    const voiceReadingToggle = document.getElementById('voice-reading-toggle');
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const simpleUIToggle = document.getElementById('simple-ui-toggle');
    const medicationAlertsToggle = document.getElementById('medication-alerts');
    const vibrationAlertsToggle = document.getElementById('vibration-alerts');
    const soundAlertsToggle = document.getElementById('sound-alerts');
    const familyAlertsToggle = document.getElementById('family-alerts');
    
    if (largeTextToggle) largeTextToggle.checked = userSettings.largeText;
    if (voiceReadingToggle) voiceReadingToggle.checked = userSettings.voiceReading;
    if (highContrastToggle) highContrastToggle.checked = userSettings.highContrast;
    if (simpleUIToggle) simpleUIToggle.checked = userSettings.simpleUI;
    if (medicationAlertsToggle) medicationAlertsToggle.checked = userSettings.medicationAlerts;
    if (vibrationAlertsToggle) vibrationAlertsToggle.checked = userSettings.vibrationAlerts;
    if (soundAlertsToggle) soundAlertsToggle.checked = userSettings.soundAlerts;
    if (familyAlertsToggle) familyAlertsToggle.checked = userSettings.familyAlerts;
    
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
    const healthConditionsElement = document.getElementById('health-conditions');
    const healthAllergiesElement = document.getElementById('health-allergies');
    const emergencyContactElement = document.getElementById('emergency-contact');
    
    if (healthConditionsElement) healthConditionsElement.textContent = userHealthInfo.conditions;
    if (healthAllergiesElement) healthAllergiesElement.textContent = userHealthInfo.allergies;
    if (emergencyContactElement) emergencyContactElement.textContent = userHealthInfo.emergencyContact;
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
    const userAge = parseInt(userProfile.age) || 45; // 실제로는 사용자 프로필에서 가져옴
    
    if (userAge >= 65) {
        // 65세 이상 사용자를 위한 자동 설정
        userSettings.largeText = true;
        userSettings.simpleUI = true;
        userSettings.voiceReading = true;
        
        // UI 적용
        const largeTextToggle = document.getElementById('large-text-toggle');
        const simpleUIToggle = document.getElementById('simple-ui-toggle');
        const voiceReadingToggle = document.getElementById('voice-reading-toggle');
        
        if (largeTextToggle) largeTextToggle.checked = true;
        if (simpleUIToggle) simpleUIToggle.checked = true;
        if (voiceReadingToggle) voiceReadingToggle.checked = true;
        
        document.body.classList.add('large-text', 'simple-ui');
        enableVoiceReading();
        
        showAlert('고령자 친화 설정이 자동으로 적용되었습니다 👴👵');
        saveSettings();
    }
}
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
    });
}

function changeTrendPeriod(period) {
    showAlert(`${period} 트렌드로 변경되었습니다 📈`);
    // 피드백 메시지 업데이트
    updateComplianceFeedback();
}

// 복용률에 따른 피드백 메시지 업데이트
function updateComplianceFeedback() {
    const trendPercentageElement = document.getElementById('trend-percentage');
    const feedbackElement = document.getElementById('compliance-feedback');
    
    if (!trendPercentageElement || !feedbackElement) return;
    
    // 현재 복용률 가져오기 (73%에서 숫자만 추출)
    const currentRate = parseInt(trendPercentageElement.textContent.replace('%', ''));
    
    let feedbackClass = '';
    let feedbackIcon = '';
    let feedbackText = '';
    
    if (currentRate >= 90) {
        // 90% 이상: 우수
        feedbackClass = 'excellent';
        feedbackIcon = '🎉';
        feedbackText = '정말 잘 하고 계십니다! 계속 꾸준한 복용을 지켜주세요.';
    } else if (currentRate >= 71) {
        // 71-89%: 양호 (71%-100%까지 잘 하고 계십니다)
        feedbackClass = 'good';
        feedbackIcon = '👍';
        feedbackText = '잘 하고 계십니다. 계속 꾸준한 복용을 지켜주세요.';
    } else if (currentRate >= 70) {
        // 70%: 개선 필요 (70% 이상이면 조금 더 분발이 필요)
        feedbackClass = 'needs-improvement';
        feedbackIcon = '💪';
        feedbackText = '잘 하고 계시지만 조금 더 분발이 필요합니다.';
    } else {
        // 70% 미만: 많은 개선 필요
        feedbackClass = 'needs-improvement';
        feedbackIcon = '⚠️';
        feedbackText = '복용률이 낮습니다. 건강을 위해 꾸준한 복용이 중요합니다.';
    }
    
    // 피드백 요소 업데이트
    feedbackElement.className = `compliance-feedback ${feedbackClass}`;
    feedbackElement.innerHTML = `
        <div class="feedback-message">
            <span class="feedback-icon">${feedbackIcon}</span>
            <span class="feedback-text">${feedbackText}</span>
        </div>
    `;
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
    document.querySelectorAll('.prescription-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('#prescription-analysis-modal .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Find the clicked button and make it active
    const clickedBtn = document.querySelector(`.prescription-tabs .tab-btn[onclick*="${tabName}"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    document.getElementById(`prescription-${tabName}`).classList.add('active');
}

function filterTimeline(period) {
    showAlert(`${period} 기간의 처방 이력을 표시합니다 📋`);
}

function exportPrescriptionReport() {
    showAlert('처방전 분석 리포트를 생성하고 있습니다... 📋');
    
    setTimeout(() => {
        showAlert('처방전 분석 리포트가 저장되었습니다! ✅');
        closePrescriptionAnalysis();
    }, 2000);
}

// 처방전 아카이브 토글
function togglePrescriptionArchive() {
    const content = document.getElementById('prescription-archive-content');
    const toggleText = document.getElementById('archive-toggle-text');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggleText.textContent = '접기';
        showAlert('처방 이력을 불러왔습니다 📚');
    } else {
        content.classList.add('hidden');
        toggleText.textContent = '펼치기';
    }
}

function exportPrescriptionHistory() {
    showAlert('처방 이력을 내보내고 있습니다... 📄');
    
    setTimeout(() => {
        showAlert('처방 이력이 PDF로 저장되었습니다! ✅');
    }, 2000);
}

// 약물 정보 데이터베이스
const medicationDatabase = {
    'amlodipine': {
        title: '아모디핀 (Amlodipine)',
        ingredient: '아모디핀베실산염',
        productName: '아모디핀정 5mg',
        manufacturer: '한국제약',
        classification: '칼슘채널차단제 (고혈압 치료제)',
        insuranceCode: '123456789',
        shape: '원형 정제, 흰색',
        description: '아모디핀은 칼슘채널차단제로 혈관을 확장시켜 혈압을 낮추는 약물입니다. 고혈압과 협심증 치료에 사용되며, 장기간 복용 시 심혈관 질환 예방 효과가 있습니다.',
        dosage: '5mg',
        frequency: '1일 1회',
        timing: '아침 식후',
        duration: '의사 지시에 따라 장기간',
        usageTips: [
            '매일 같은 시간에 복용하세요',
            '물과 함께 통째로 삼키세요',
            '복용을 잊었다면 생각났을 때 즉시 복용하되, 다음 복용 시간이 가까우면 건너뛰세요',
            '임의로 복용을 중단하지 마세요',
            '자몽주스와 함께 복용하지 마세요'
        ],
        precautions: [
            '임신 중이거나 임신 가능성이 있는 경우 의사와 상담하세요',
            '간 기능 장애가 있는 경우 용량 조절이 필요할 수 있습니다',
            '어지러움이 있을 수 있으니 운전이나 기계 조작 시 주의하세요',
            '갑자기 일어날 때 어지러움을 방지하기 위해 천천히 일어나세요',
            '치과 치료 전 복용 중인 약물을 알려주세요'
        ],
        contraindications: [
            '아모디핀 또는 다른 디하이드로피리딘계 약물에 과민반응이 있는 경우',
            '심한 저혈압 환자',
            '불안정 협심증 환자',
            '중증 대동맥 협착증 환자'
        ],
        interactions: [
            '심바스타틴: 근육병증 위험 증가 가능',
            '자몽주스: 약물 농도 증가 가능',
            'CYP3A4 억제제: 아모디핀 농도 증가',
            '리팜핀: 아모디핀 효과 감소 가능'
        ],
        commonEffects: [
            '발목 부종 (가장 흔함)',
            '어지러움',
            '피로감',
            '두통',
            '안면 홍조'
        ],
        uncommonEffects: [
            '복통',
            '구역질',
            '근육 경련',
            '수면 장애',
            '변비'
        ],
        seriousEffects: [
            '심한 저혈압',
            '심계항진',
            '호흡곤란',
            '심한 알레르기 반응',
            '간 기능 이상'
        ]
    },
    'metformin': {
        title: '메트포르민 (Metformin)',
        ingredient: '메트포르민염산염',
        productName: '메트포르민정 500mg',
        manufacturer: '대한제약',
        classification: '비구아나이드계 당뇨병 치료제',
        insuranceCode: '987654321',
        shape: '타원형 정제, 흰색',
        description: '메트포르민은 제2형 당뇨병 치료의 1차 선택약물로, 간에서 포도당 생성을 억제하고 인슐린 감수성을 개선합니다.',
        dosage: '500mg',
        frequency: '1일 2회',
        timing: '아침, 저녁 식후',
        duration: '의사 지시에 따라 장기간',
        usageTips: [
            '식사와 함께 또는 식후에 복용하세요',
            '충분한 물과 함께 복용하세요',
            '정기적인 혈당 검사를 받으세요',
            '복용을 잊었다면 다음 식사 때 복용하세요',
            '알코올 섭취를 제한하세요'
        ],
        precautions: [
            '신장 기능을 정기적으로 검사하세요',
            '조영제 검사 전후 일시적으로 중단할 수 있습니다',
            '수술이나 심한 감염 시 의사와 상담하세요',
            '비타민 B12 결핍이 발생할 수 있습니다',
            '젖산산증의 위험이 있으니 주의하세요'
        ],
        contraindications: [
            '중증 신장 질환 환자',
            '급성 또는 만성 대사성 산증 환자',
            '중증 간 질환 환자',
            '심한 심부전 환자'
        ],
        interactions: [
            '알코올: 젖산산증 위험 증가',
            '조영제: 신독성 위험 증가',
            '이뇨제: 신기능 저하 위험',
            '코르티코스테로이드: 혈당 상승'
        ],
        commonEffects: [
            '소화불량',
            '구역질',
            '설사',
            '복통',
            '식욕 부진'
        ],
        uncommonEffects: [
            '금속성 맛',
            '비타민 B12 결핍',
            '체중 감소',
            '두통'
        ],
        seriousEffects: [
            '젖산산증 (매우 드물지만 심각)',
            '심한 저혈당 (다른 당뇨약과 병용 시)',
            '심한 알레르기 반응'
        ]
    }
};

// 약물 정보 모달 표시
function showMedicationInfo(medicationId) {
    const medication = medicationDatabase[medicationId];
    if (!medication) {
        showAlert('약물 정보를 찾을 수 없습니다 ❌');
        return;
    }
    
    document.getElementById('med-info-title').textContent = `💊 ${medication.title}`;
    
    // SVG 대체 이미지 생성
    const medImage = document.getElementById('med-image');
    const medPillDisplay = document.getElementById('med-pill-display');
    
    medImage.style.display = 'none';
    medPillDisplay.style.display = 'block';
    medPillDisplay.textContent = '💊';
    
    // 기본 정보 탭 데이터 설정
    document.getElementById('med-ingredient').textContent = medication.ingredient;
    document.getElementById('med-product-name').textContent = medication.productName;
    document.getElementById('med-manufacturer').textContent = medication.manufacturer;
    document.getElementById('med-classification').textContent = medication.classification;
    document.getElementById('med-insurance-code').textContent = medication.insuranceCode;
    document.getElementById('med-shape').textContent = medication.shape;
    document.getElementById('med-description-text').textContent = medication.description;
    
    // 복용법 탭 데이터 설정
    document.getElementById('med-dosage').textContent = medication.dosage;
    document.getElementById('med-frequency').textContent = medication.frequency;
    document.getElementById('med-timing').textContent = medication.timing;
    document.getElementById('med-duration').textContent = medication.duration;
    
    const usageTipsList = document.getElementById('med-usage-tips');
    usageTipsList.innerHTML = medication.usageTips.map(tip => `<li>${tip}</li>`).join('');
    
    // 주의사항 탭 데이터 설정
    const precautionsList = document.getElementById('med-precautions-list');
    precautionsList.innerHTML = medication.precautions.map(item => `<li>${item}</li>`).join('');
    
    const contraindicationsList = document.getElementById('med-contraindications');
    contraindicationsList.innerHTML = medication.contraindications.map(item => `<li>${item}</li>`).join('');
    
    const interactionsList = document.getElementById('med-interactions');
    interactionsList.innerHTML = medication.interactions.map(item => `<li>${item}</li>`).join('');
    
    // 부작용 탭 데이터 설정
    const commonEffectsList = document.getElementById('med-common-effects');
    commonEffectsList.innerHTML = medication.commonEffects.map(effect => `<li>${effect}</li>`).join('');
    
    const uncommonEffectsList = document.getElementById('med-uncommon-effects');
    uncommonEffectsList.innerHTML = medication.uncommonEffects.map(effect => `<li>${effect}</li>`).join('');
    
    const seriousEffectsList = document.getElementById('med-serious-effects');
    seriousEffectsList.innerHTML = medication.seriousEffects.map(effect => `<li>${effect}</li>`).join('');
    
    // 모달 표시
    const modal = document.getElementById('medication-info-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    
    showMedInfoTab('basic');
    showAlert(`${medication.title} 정보를 불러왔습니다 📚`);
}

function closeMedicationInfo() {
    const modal = document.getElementById('medication-info-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function showMedInfoTab(tabName) {
    document.querySelectorAll('.medication-info-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('#medication-info-modal .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Find the clicked button and make it active
    const clickedBtn = document.querySelector(`.medication-info-tabs .tab-btn[onclick*="${tabName}"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    document.getElementById(`med-info-${tabName}`).classList.add('active');
}

function reportSideEffect() {
    showAlert('부작용 신고 페이지로 이동합니다 📝');
}

function saveMedicationInfo() {
    showAlert('약물 정보가 즐겨찾기에 추가되었습니다 ⭐');
}

// 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    // 사용자 등록 상태 확인
    const isRegistered = checkUserRegistration();
    
    // 즉시 시간 업데이트
    updateTime();
    setInterval(updateTime, 1000);
    
    // 회원가입 폼 이벤트 리스너
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    // 등록된 사용자만 설정 로드
    if (isRegistered) {
        loadSettings();
        loadHealthInfo();
        checkAgeAndApplySettings();
        setTimeout(updateComplianceWeather, 1000);
    }
    
    // 모든 모달 숨기기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    });
    
    // 네비게이션 초기화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 등록된 사용자만 네비게이션 활성화
    if (isRegistered) {
        const dashboardNav = document.querySelector('.nav-item[onclick*="dashboard"]');
        if (dashboardNav) {
            dashboardNav.classList.add('active');
        }
    }
    
    // 차트 인터랙션 초기화
    setTimeout(() => {
        initializeChartInteractions();
        // 복용률 피드백 메시지 초기화
        updateComplianceFeedback();
    }, 500);
});

// 차트 인터랙션 초기화
function initializeChartInteractions() {
    const dataPoints = document.querySelectorAll('.data-point');
    let tooltip = null;
    
    dataPoints.forEach(point => {
        point.addEventListener('mouseenter', function(e) {
            const day = this.getAttribute('data-day');
            const rate = this.getAttribute('data-rate');
            
            tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip visible';
            tooltip.innerHTML = `${day}일: ${rate}`;
            
            const rect = this.getBoundingClientRect();
            const chartRect = this.closest('.chart-area').getBoundingClientRect();
            
            tooltip.style.left = (rect.left - chartRect.left) + 'px';
            tooltip.style.top = (rect.top - chartRect.top) + 'px';
            
            this.closest('.chart-area').appendChild(tooltip);
        });
        
        point.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
    
    // 트렌드 라인 애니메이션
    const trendLine = document.querySelector('.trend-line');
    if (trendLine) {
        const pathLength = trendLine.getTotalLength();
        trendLine.style.strokeDasharray = pathLength;
        trendLine.style.strokeDashoffset = pathLength;
        
        setTimeout(() => {
            trendLine.style.transition = 'stroke-dashoffset 2s ease-in-out';
            trendLine.style.strokeDashoffset = 0;
        }, 300);
    }
}