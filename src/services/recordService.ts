import { ConsultationRecord } from '../types';
import { authService } from './authService';

const CONSULTATION_RECORDS_KEY = 'hellodoc_consultation_records';

const getAllRecords = (): ConsultationRecord[] => {
  const raw = localStorage.getItem(CONSULTATION_RECORDS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ConsultationRecord[];
  } catch {
    return [];
  }
};

const saveAllRecords = (records: ConsultationRecord[]) => {
  localStorage.setItem(CONSULTATION_RECORDS_KEY, JSON.stringify(records));
};

export const recordService = {
  async saveConsultationRecord(payload: { doctorId: string; doctorName: string; notes: string }) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Please log in to save records.');
    }
    const allRecords = getAllRecords();
    const newRecord: ConsultationRecord = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `rec-${Date.now()}`,
      userId: currentUser.uid,
      doctorId: payload.doctorId,
      doctorName: payload.doctorName,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
    };
    allRecords.unshift(newRecord);
    saveAllRecords(allRecords);
    return newRecord;
  },

  async getMyConsultationRecords() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];
    return getAllRecords().filter((record) => record.userId === currentUser.uid);
  },
};
