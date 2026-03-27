import React from 'react';
import { TrendingUp, Calendar, Award, Download } from 'lucide-react';

const Analytics = () => {
  // 임시 데이터
  const weeklyData = [
    { day: '월', rate: 100, completed: 3, total: 3 },
    { day: '화', rate: 100, completed: 3, total: 3 },
    { day: '수', rate: 75, completed: 2, total: 3 },
    { day: '목', rate: 100, completed: 3, total: 3 },
    { day: '금', rate: 100, completed: 3, total: 3 },
    { day: '토', rate: 0, completed: 0, total: 3 },
    { day: '일', rate: 85, completed: 2, total: 3 }
  ];

  const monthlyTrend = 85;
  const improvement = 5;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 복용 분석</h1>
      </div>

      {/* 이번 주 복용 현황 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">이번 주 복용 현황</h2>
        </div>
        
        <div className="weekly-chart">
          {weeklyData.map((day, index) => (
            <div key={index} className="day-column">
              <div className="day-label">{day.day}</div>
              <div className="day-bar">
                <div 
                  className={`bar-fill ${day.rate === 100 ? 'perfect' : day.rate >= 75 ? 'good' : day.rate > 0 ? 'partial' : 'missed'}`}
                  style={{ height: `${Math.max(day.rate, 10)}%` }}
                ></div>
              </div>
              <div className="day-rate">{day.rate}%</div>
              <div className="day-detail">{day.completed}/{day.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 월별 트렌드 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📈 월별 트렌드</h2>
        </div>
        
        <div className="trend-section">
          <div className="trend-bar">
            <div 
              className="trend-fill"
              style={{ width: `${monthlyTrend}%` }}
            ></div>
          </div>
          <div className="trend-info">
            <span className="trend-percentage">{monthlyTrend}%</span>
            <span className="trend-improvement">
              지난달 대비 +{improvement}% 향상! 🎉
            </span>
          </div>
        </div>
      </div>

      {/* 개선 제안 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 개선 제안</h2>
        </div>
        
        <div className="suggestions">
          <div className="suggestion-item">
            <div className="suggestion-icon">⚠️</div>
            <div className="suggestion-content">
              <h4>토요일 복용률이 낮습니다</h4>
              <p>주말 알림을 30분 일찍 설정해보세요</p>
            </div>
          </div>
          
          <div className="suggestion-item">
            <div className="suggestion-icon">🎯</div>
            <div className="suggestion-content">
              <h4>목표 달성까지 5% 남았어요</h4>
              <p>꾸준히 복용하시면 이번 달 90% 달성 가능합니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* 성취 배지 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏆 성취 배지</h2>
        </div>
        
        <div className="achievements">
          <div className="achievement earned">
            <Award size={32} />
            <span>7일 연속</span>
          </div>
          <div className="achievement earned">
            <Calendar size={32} />
            <span>한 달 달성</span>
          </div>
          <div className="achievement locked">
            <TrendingUp size={32} />
            <span>90% 달성</span>
          </div>
        </div>
      </div>

      {/* 리포트 다운로드 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 상세 리포트</h2>
        </div>
        
        <div className="report-actions">
          <button className="btn btn-primary">
            <Download size={18} />
            PDF 다운로드
          </button>
          <button className="btn btn-secondary">
            의사와 공유
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;