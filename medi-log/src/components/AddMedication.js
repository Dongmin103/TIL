import React, { useState } from 'react';
import { ArrowLeft, Camera, Search, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddMedication = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('method'); // method, scan, search, manual

  const handleBarcodeScann = () => {
    toast.success('바코드 스캔 기능은 개발 중입니다');
    setStep('manual');
  };

  const handleSearch = () => {
    setStep('search');
  };

  const handleManualInput = () => {
    setStep('manual');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">약 추가하기</h1>
        <div></div>
      </div>

      {step === 'method' && (
        <div className="add-method-selection">
          <div className="method-card primary" onClick={handleBarcodeScann}>
            <div className="method-icon">
              <Camera size={48} />
            </div>
            <h3>📷 바코드 스캔 (권장)</h3>
            <p>약품 포장지의 바코드를 스캔하여 자동으로 정보를 입력합니다</p>
            <div className="method-badge">가장 빠름</div>
          </div>

          <div className="method-divider">
            <span>또는</span>
          </div>

          <div className="method-card" onClick={handleSearch}>
            <div className="method-icon">
              <Search size={32} />
            </div>
            <h4>🔍 약품명 검색</h4>
            <p>약품명을 입력하여 검색합니다</p>
          </div>

          <div className="method-card" onClick={handleManualInput}>
            <div className="method-icon">
              <Edit3 size={32} />
            </div>
            <h4>📝 직접 입력</h4>
            <p>모든 정보를 직접 입력합니다</p>
          </div>
        </div>
      )}

      {step === 'scan' && (
        <div className="barcode-scanner">
          <div className="scanner-container">
            <div className="scanner-viewfinder">
              <div className="scanner-overlay">
                <div className="scanner-line"></div>
              </div>
              <p>바코드를 카메라에 맞춰주세요</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setStep('method')}>
            다른 방법 선택
          </button>
        </div>
      )}

      {step === 'search' && (
        <div className="search-medication">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="약품명을 입력하세요 (예: 아모디핀, 메트포르민)"
            />
          </div>
          <div className="search-results">
            <p className="text-gray">약품명을 입력하면 검색 결과가 표시됩니다</p>
          </div>
        </div>
      )}

      {step === 'manual' && (
        <ManualInputForm onBack={() => setStep('method')} />
      )}
    </div>
  );
};

const ManualInputForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    form: 'tablet',
    schedules: [{ time: '08:00', relation: 'after_meal' }],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('약물이 추가되었습니다!');
    navigate('/');
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [...formData.schedules, { time: '12:00', relation: 'after_meal' }]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="manual-form">
      <div className="form-group">
        <label className="form-label">약품명 *</label>
        <input
          type="text"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="예: 혈압약 (아모디핀)"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">용량</label>
        <input
          type="text"
          className="form-input"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          placeholder="예: 5mg"
        />
      </div>

      <div className="form-group">
        <label className="form-label">제형</label>
        <select 
          className="form-input"
          value={formData.form}
          onChange={(e) => setFormData({...formData, form: e.target.value})}
        >
          <option value="tablet">정제</option>
          <option value="capsule">캡슐</option>
          <option value="liquid">액상</option>
          <option value="powder">가루</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">복용 시간</label>
        {formData.schedules.map((schedule, index) => (
          <div key={index} className="schedule-input">
            <input
              type="time"
              className="form-input"
              value={schedule.time}
              onChange={(e) => {
                const newSchedules = [...formData.schedules];
                newSchedules[index].time = e.target.value;
                setFormData({...formData, schedules: newSchedules});
              }}
            />
            <select
              className="form-input"
              value={schedule.relation}
              onChange={(e) => {
                const newSchedules = [...formData.schedules];
                newSchedules[index].relation = e.target.value;
                setFormData({...formData, schedules: newSchedules});
              }}
            >
              <option value="before_meal">식전 30분</option>
              <option value="after_meal">식후 30분</option>
              <option value="with_meal">식사와 함께</option>
              <option value="none">시간 무관</option>
            </select>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addSchedule}>
          복용 시간 추가
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">메모</label>
        <textarea
          className="form-input"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="복용 시 주의사항이나 메모를 입력하세요"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="submit" className="btn btn-primary">
          약물 추가
        </button>
      </div>
    </form>
  );
};

export default AddMedication;