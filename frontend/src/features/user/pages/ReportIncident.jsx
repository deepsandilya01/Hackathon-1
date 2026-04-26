import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportIncident } from '../service/incident.api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useToast } from '../../../components/ui/Toast';

export default function ReportIncident() {
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await reportIncident(formData);
      const { type, severity, suggestedActions } = res.data;
      setResult({ type, severity, suggestedActions });
      toast({
        title: 'Incident Reported',
        description: 'Your report has been sent successfully.',
        variant: 'success',
      });
      setTimeout(() => {
        navigate('/user/my-incidents');
      }, 2000);
    } catch (error) {
      let errorMessage = error.response?.data?.message || 'Failed to report incident';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(e => e.msg).join('\n');
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">Report Emergency</h1>
        <p className="text-slate-400 mt-2">Provide details to help staff respond quickly.</p>
      </div>

      {!result ? (
        <Card className="border-red-900/50 shadow-red-900/10 shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">What is happening?</label>
                <Input
                  placeholder="E.g., Fire in the kitchen"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  minLength={5}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Where are you?</label>
                <Input
                  placeholder="E.g., Room 402, Lobby"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Additional Details</label>
                <Textarea
                  placeholder="Describe the situation..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  minLength={10}
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-bold" disabled={loading}>
                {loading ? 'Sending Report...' : 'SUBMIT REPORT'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-900/50 bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-500 text-xl text-center">🤖 AI Detection Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center gap-4">
              <div className="bg-slate-800 px-4 py-2 rounded-lg">
                <span className="text-slate-400 text-sm block">Type</span>
                <span className="font-bold text-white">{result.type}</span>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg">
                <span className="text-slate-400 text-sm block">Severity</span>
                <span className={`font-bold ${result.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>
                  {result.severity}
                </span>
              </div>
            </div>
            {result.suggestedActions?.length > 0 && (
              <div className="text-left bg-slate-900 p-4 rounded-lg border border-slate-800 mt-4">
                <h4 className="font-semibold text-slate-300 mb-2">Suggested Actions:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-400">
                  {result.suggestedActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-slate-500 mt-4">Redirecting to your incidents...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
