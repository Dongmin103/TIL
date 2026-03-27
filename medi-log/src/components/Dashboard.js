import React from 'react';
import { Clock, User, Phone, BarChart3, Camera } from 'lucide-react';
import useMedicationStore from '../store/medicationStore';
import MedicationCard from './MedicationCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, getTodaySchedule, logMedication } = useMedicationStore();
  const todaySchedule = getTodaySchedule();
  
  const currentTime = new Date().toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const handleMedicationTaken = (medicationId, medicationName) => {
    logMedication(medicationId, 'taken');
    toast.success(`${medicationName} 복용 완료!`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <div className="time-greeting">
          <div className="current-time">
            <Clock size={20} />
            <span>오늘 {currentTime}</span>
          </div>
          <div className="greeting">
            <User size={24} />
            <span>{getGreeting()}, {user.name}님! 👋</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 지금 복용할 약</h2>
        </div>
        
        {todaySchedule.length === 0 ? (
          <div className="empty-state">
            <p>현재 복용할 약물이 없습니다.</p>
          </div>
        ) : (
          <div className="medication-list">
            {todaySchedule.map((medication) => (
              <MedicationCard
                key={`${medication.id}-${medication.scheduleTime}`}
                medication={medication}
                onTaken={() => handleMedicationTaken(medication.id, medication.name)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">⚡ 빠른 액션</h3>
        <div className="quick-actions">
          <button className="quick-action-btn">
            <Camera size={24} />
            <span>약 추가</span>
          </button>
          
          <button className="quick-action-btn emergency">
            <Phone size={24} />
            <span>응급연락</span>
          </button>
          
          <button className="quick-action-btn">
            <BarChart3 size={24} />
            <span>리포트</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;