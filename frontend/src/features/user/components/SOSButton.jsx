import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import axiosInstance from '../../../lib/axios';

export default function SOSButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleQuickReport = async () => {
    if (message.trim().length < 5) {
      toast({ title: 'Error', description: 'Please provide more details.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/incidents/quick-report', { message });
      toast({ title: 'SOS Sent!', description: 'Help is on the way. Staff has been notified.', variant: 'success' });
      setIsModalOpen(false);
      setMessage('');
      navigate('/user/my-incidents');
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to send SOS', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10 md:my-16 px-4">
        <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="absolute -inset-4 md:-inset-6 rounded-full bg-error/10 animate-pulse group-hover:bg-error/20 transition-all duration-500" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -inset-8 md:-inset-10 rounded-full bg-error/5 animate-pulse group-hover:bg-error/10 transition-all duration-500" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
          
          <button className="relative z-10 flex h-48 w-48 md:h-56 md:w-56 flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#ba1a1a] to-[#93000a] shadow-[0_16px_32px_rgba(186,26,26,0.4)] md:shadow-[0_24px_48px_rgba(186,26,26,0.4)] transition-all duration-300 group-hover:scale-105 active:scale-95 group-hover:shadow-[0_24px_48px_rgba(186,26,26,0.6)] md:group-hover:shadow-[0_32px_64px_rgba(186,26,26,0.6)]">
            <span className="text-5xl md:text-6xl font-display font-bold tracking-widest text-on-error drop-shadow-lg">SOS</span>
            <span className="mt-2 md:mt-3 text-xs md:text-sm font-semibold text-error-container uppercase tracking-[0.2em] md:tracking-[0.3em]">Quick Help</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-[24px] shadow-[0_32px_64px_rgba(23,28,31,0.15)] w-full max-w-lg transform transition-all">
            <h3 className="text-3xl font-display font-bold text-error mb-3">Emergency SOS</h3>
            <p className="text-on-surface-variant text-base mb-6 font-sans">
              Type what's happening or where you are. Our AI will instantly alert the staff.
            </p>
            <textarea
              placeholder="E.g., Fire in the lobby! Send help!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex w-full rounded-[12px] px-4 py-3 text-base bg-surface-container-highest border border-transparent placeholder:text-outline focus-visible:outline-none focus-visible:border-error focus-visible:border-2 text-on-surface min-h-[140px] mb-6 transition-all resize-none shadow-inner"
              autoFocus
            />
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={loading} className="rounded-[12px] h-12 px-6">
                Cancel
              </Button>
              <Button onClick={handleQuickReport} disabled={loading} className="bg-gradient-to-br from-error to-[#93000a] hover:opacity-90 text-on-error rounded-[12px] h-12 px-8 shadow-lg shadow-error/30 border-0">
                {loading ? 'Sending...' : 'Send SOS Alert'}
              </Button>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => navigate('/user/report')} className="text-sm font-semibold text-outline hover:text-primary transition-colors underline underline-offset-4">
                Switch to detailed report form
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
