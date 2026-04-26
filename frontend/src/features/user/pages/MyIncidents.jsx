import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hook/useAuth';
import { useSocket } from '../hook/useSocket';
import { getMyIncidents } from '../service/incident.api';
import { setIncidents } from '../state/incident.slice';
import IncidentCard from '../components/IncidentCard';

export default function MyIncidents() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { incidents } = useSelector((state) => state.incidents);
  useSocket(user?._id);

  useEffect(() => {
    getMyIncidents().then((res) => {
      dispatch(setIncidents(res.data.data || res.data));
    }).catch(console.error);
  }, [dispatch]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">My Reports</h1>
        <p className="text-slate-400 mt-1">Track the status of incidents you have reported.</p>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
          <p className="text-slate-500">You haven't reported any incidents.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map(incident => (
            <IncidentCard key={incident._id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
