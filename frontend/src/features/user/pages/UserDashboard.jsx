import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hook/useAuth';
import { useSocket } from '../hook/useSocket';
import { getMyIncidents } from '../service/incident.api';
import { setIncidents } from '../state/incident.slice';
import SOSButton from '../components/SOSButton';
import IncidentCard from '../components/IncidentCard';

export default function UserDashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { incidents } = useSelector((state) => state.incidents);
  useSocket(user?._id);

  useEffect(() => {
    getMyIncidents().then((res) => {
      dispatch(setIncidents(res.data.data || res.data));
    }).catch(console.error);
  }, [dispatch]);

  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'Pending').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
  };

  const recentIncidents = incidents.slice(0, 3);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center md:text-left pt-6 md:pt-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">Welcome, {user?.fullname}</h1>
        <p className="text-on-surface-variant text-base md:text-lg mt-2 font-sans">If you are in an emergency, press the SOS button immediately.</p>
      </div>

      <SOSButton />

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-[16px] bg-surface-container-lowest p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[0_16px_32px_rgba(23,28,31,0.04)] border border-outline-variant/10 hover:shadow-[0_24px_48px_rgba(23,28,31,0.08)] transition-all">
          <p className="text-xs md:text-sm font-semibold text-outline tracking-wider uppercase">Total Reports</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-white mt-2 md:mt-3">{stats.total}</p>
        </div>
        <div className="rounded-[16px] bg-surface-container-lowest p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[0_16px_32px_rgba(23,28,31,0.04)] border border-outline-variant/10 hover:shadow-[0_24px_48px_rgba(23,28,31,0.08)] transition-all">
          <p className="text-xs md:text-sm font-semibold text-outline tracking-wider uppercase">Pending</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-orange-500 mt-2 md:mt-3">{stats.pending}</p>
        </div>
        <div className="rounded-[16px] bg-surface-container-lowest p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[0_16px_32px_rgba(23,28,31,0.04)] border border-outline-variant/10 hover:shadow-[0_24px_48px_rgba(23,28,31,0.08)] transition-all">
          <p className="text-xs md:text-sm font-semibold text-outline tracking-wider uppercase">Resolved</p>
          <p className="text-4xl md:text-5xl font-display font-bold text-emerald-500 mt-2 md:mt-3">{stats.resolved}</p>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-2xl font-display font-semibold mb-6 text-primary border-b border-outline-variant/20 pb-4">Recent Incidents</h2>
        {recentIncidents.length === 0 ? (
          <div className="text-center p-16 bg-surface-container-low rounded-[16px] text-outline text-lg shadow-inner">
            No incidents reported yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentIncidents.map(incident => (
              <IncidentCard key={incident._id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
