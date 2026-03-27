import { create } from 'zustand';

const useMedicationStore = create((set, get) => ({
  medications: [
    {
      id: '1',
      name: '혈압약 (아모디핀)',
      dosage: '5mg',
      form: 'tablet',
      color: '#FF6B6B',
      schedules: [
        { time: '08:00', relation: 'after_meal' },
        { time: '20:00', relation: 'after_meal' }
      ],
      stock: 28,
      notes: '식후 30분에 복용'
    },
    {
      id: '2',
      name: '당뇨약 (메트포르민)',
      dosage: '500mg',
      form: 'tablet',
      color: '#4ECDC4',
      schedules: [
        { time: '08:00', relation: 'with_meal' },
        { time: '14:00', relation: 'with_meal' },
        { time: '20:00', relation: 'with_meal' }
      ],
      stock: 45,
      notes: '식사와 함께 복용'
    }
  ],
  
  logs: [],

  user: {
    name: '김철수',
    age: 45,
    emergencyContact: {
      name: '김영희 (배우자)',
      phone: '010-1234-5678'
    }
  },

  addMedication: (medication) => set((state) => ({
    medications: [...state.medications, { ...medication, id: Date.now().toString() }]
  })),

  logMedication: (medicationId, status) => set((state) => ({
    logs: [...state.logs, {
      id: Date.now().toString(),
      medicationId,
      scheduledTime: new Date().toISOString(),
      actualTime: new Date().toISOString(),
      status
    }]
  })),

  getTodaySchedule: () => {
    const state = get();
    const now = new Date();
    const currentHour = now.getHours();
    
    const todaySchedule = [];
    
    state.medications.forEach(medication => {
      medication.schedules.forEach(schedule => {
        const [scheduleHour] = schedule.time.split(':').map(Number);
        const timeDiff = Math.abs(currentHour - scheduleHour);
        
        if (timeDiff <= 2) {
          const isCompleted = state.logs.some(log => 
            log.medicationId === medication.id && 
            log.status === 'taken' &&
            new Date(log.scheduledTime).toDateString() === now.toDateString()
          );

          todaySchedule.push({
            ...medication,
            scheduleTime: schedule.time,
            relation: schedule.relation,
            isCompleted,
            isPending: !isCompleted && timeDiff <= 1
          });
        }
      });
    });

    return todaySchedule;
  }
}));

export default useMedicationStore;