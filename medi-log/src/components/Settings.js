import React from 'react';
import { User, Bell, Shield, Heart, HelpCircle, LogOut } from 'lucide-react';

const Settings = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚙️ 설정</h1>
      </div>

      {/* 프로필 */}
      <div className="card">
        <div className="profile-section">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h3>김철수</h3>
            <p>45세 • 남성</p>
            <p className="text-sm text-gray">가입일: 2024.01.15</p>
          </div>
        </div>
      </div>

      {/* 설정 메뉴 */}
      <div className="card">
        <div className="settings-menu">
          <div className="setting-item">
            <div className="setting-icon">
              <Bell size={24} />
            </div>
            <div className="setting-content">
              <h4>알림 설정</h4>
              <p>복용 알림, 소리, 진동 설정</p>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">
              <Heart size={24} />
            </div>
            <div className="setting-content">
              <h4>응급 연락처</h4>
              <p>김영희 (배우자) • 010-1234-5678</p>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">
              <Shield size={24} />
            </div>
            <div className="setting-content">
              <h4>개인정보 보호</h4>
              <p>데이터 보안 및 개인정보 설정</p>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">
              <HelpCircle size={24} />
            </div>
            <div className="setting-content">
              <h4>도움말 및 지원</h4>
              <p>사용법, FAQ, 고객지원</p>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      {/* 앱 정보 */}
      <div className="card">
        <div className="app-info">
          <h3>Medi Log</h3>
          <p>버전 1.0.0</p>
          <p className="text-sm text-gray">
            스마트 복용 약물 관리 앱
          </p>
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="card">
        <button className="logout-btn">
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Settings;