import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';

export default function UpdateStatusModal({ incident, isOpen, onClose, onSubmit }) {
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incident) {
      setStatus(incident.status);
      setAssignedTo(incident.assignedTo || '');
    }
  }, [incident]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(incident._id, { status, assignedTo });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Update Incident Status</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-800 border-slate-700 text-white">
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Assign To (Optional)</label>
            <Input
              placeholder="Staff member name"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
