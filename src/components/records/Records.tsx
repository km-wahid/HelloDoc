import { FileText, Clock, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConsultationRecord } from '../../types';
import { recordService } from '../../services/recordService';

export function Records() {
  const [records, setRecords] = useState<ConsultationRecord[]>([]);

  useEffect(() => {
    recordService.getMyConsultationRecords().then(setRecords);
  }, []);

  if (records.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-surface border-outline p-10 text-center">
          <FileText size={40} className="mx-auto text-on-surface-variant mb-4" />
          <h2 className="text-2xl font-black">No records yet</h2>
          <p className="text-on-surface-variant mt-2">Save consultation notes to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {records.map((record) => (
        <div key={record.id} className="card bg-surface border-outline p-6 space-y-3">
          <div className="flex items-center gap-4 text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            <span className="inline-flex items-center gap-2"><UserRound size={14} /> {record.doctorName}</span>
            <span className="inline-flex items-center gap-2"><Clock size={14} /> {new Date(record.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-on-surface whitespace-pre-wrap">{record.notes}</p>
        </div>
      ))}
    </div>
  );
}
