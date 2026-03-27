import React from 'react';
import { Check, Clock } from 'lucide-react';

const MedicationCard = ({ medication, onTaken }) => {
  const getRelationText = (relation) => {
    const relations = {
      'before_meal': '식전 30분',
      'after_meal': '식후 30분',
      'with_meal': '식사와 함께',
      'none': '시간 무관'
    };
    return relations[relation] || '시간 무관';
  };

  return (
    <div className={`medication-card ${medication.isCompleted ? 'completed' : ''}`}>
      <div className="medication-info">
        <div className="medication-header">
          <div 
            className="medication-pill"
            style={{ backgroundColor: medication.color }}
          >
            💊
          </div>
          <div className="medication-details">
            <h4 className="medication-name">{medication.name}</h4>
            <p className="medication-dosage">{medication.dosage}</p>
          </div>
        </div>
        
        <div className="medication-schedule">
          <div className="schedule-time">
            <Clock size={16} />
            <span>{medication.scheduleTime} - {getRelationText(medication.relation)}</span>
          </div>
        </div>
      </div>

      {!medication.isCompleted && (
        <button 
          className="btn btn-success take-btn"
          onClick={onTaken}
        >
          <Check size={18} />
          복용완료
        </button>
      )}

      {medication.isCompleted && (
        <div className="completed-badge">
          <Check size={16} />
          복용완료
        </div>
      )}
    </div>
  );
};

export default MedicationCard;