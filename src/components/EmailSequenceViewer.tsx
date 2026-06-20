import { useState } from 'react';
import { Mail, Clock, ChevronDown, ChevronUp, Send, Check, FileText } from 'lucide-react';
import { WELCOME_SEQUENCE } from '../lib/email-service';

export default function EmailSequenceViewer() {
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'sequence' | 'analytics' | 'settings'>('sequence');

  const tabs = [
    { id: 'sequence' as const, label: 'Email Sequence' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Mail className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Email Marketing System</h1>
        <p className="text-ink/60">Welcome sequence, newsletter templates, and automation</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-primary text-black' : 'text-ink/60 hover:text-ink'}`}>{tab.label}</button>
        ))}
      </div>

      {/* Email Sequence Tab */}
      {activeTab === 'sequence' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h3 className="font-bold text-ink text-sm">Welcome Sequence Overview</h3>
            <p className="text-ink/60 text-xs mt-1">{WELCOME_SEQUENCE.length} emails over 21 days • Automated for every new subscriber</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

            {WELCOME_SEQUENCE.map((email, idx) => (
              <div key={email.id} className="relative pl-14 pb-6">
                <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                  <span className="text-[10px] font-bold text-black">{idx + 1}</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedEmail(expandedEmail === idx ? null : idx)} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                          {email.day === 0 ? 'Immediate' : `Day ${email.day}`}
                        </span>
                        <Clock className="w-3 h-3 text-ink/40" />
                      </div>
                      <h4 className="font-bold text-ink text-sm truncate">{email.subject}</h4>
                      <p className="text-ink/60 text-xs truncate mt-0.5">{email.previewText}</p>
                    </div>
                    {expandedEmail === idx ? <ChevronUp className="w-4 h-4 text-ink/40 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink/40 flex-shrink-0" />}
                  </button>

                  {expandedEmail === idx && (
                    <div className="p-4 border-t border-slate-700 space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs text-ink/60 uppercase font-bold">Subject Line</div>
                        <div className="p-3 bg-slate-900 rounded-lg text-ink text-sm">{email.subject}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-ink/60 uppercase font-bold">Preview Text</div>
                        <div className="p-3 bg-slate-900 rounded-lg text-ink/70 text-sm">{email.previewText}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-ink/60 uppercase font-bold">Content Preview</div>
                        <div className="p-4 bg-slate-900 rounded-lg text-ink/70 text-sm max-h-64 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
                          {email.content.substring(0, 500)}...
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                          <Send className="w-3 h-3" /> Send Test
                        </button>
                        <button className="flex-1 py-2 bg-slate-700 text-ink text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-1">
                          <FileText className="w-3 h-3" /> Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Subscribers', value: '2,847', change: '+12%' },
              { label: 'Open Rate', value: '42.3%', change: '+3.2%' },
              { label: 'Click Rate', value: '8.7%', change: '+1.1%' },
              { label: 'Unsubscribe Rate', value: '0.3%', change: '-0.1%' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl text-center">
                <div className="text-2xl font-black text-ink">{stat.value}</div>
                <div className="text-xs text-ink/60 uppercase mt-1">{stat.label}</div>
                <div className="text-[10px] text-green-400 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase">Email Performance</h3>
            <div className="space-y-3">
              {WELCOME_SEQUENCE.map((email, i) => (
                <div key={email.id} className="flex items-center gap-3">
                  <span className="text-ink/40 text-xs font-bold w-8">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate">{email.subject}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-ink/60">
                      <span>Open: {(45 + Math.random() * 15).toFixed(1)}%</span>
                      <span>Click: {(5 + Math.random() * 8).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-800/50 rounded-xl space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase">Email Service Integration</h3>
            <div className="space-y-3">
              {[
                { name: 'Brevo (Sendinblue)', status: 'connected', color: 'text-green-400' },
                { name: 'Mailchimp', status: 'not connected', color: 'text-ink/40' },
                { name: 'ConvertKit', status: 'not connected', color: 'text-ink/40' },
              ].map(service => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <span className="text-ink text-sm font-bold">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${service.color}`}>{service.status}</span>
                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors">
                      {service.status === 'connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase">Automation Rules</h3>
            <div className="space-y-3">
              {[
                { name: 'Welcome Sequence', trigger: 'New subscriber', active: true },
                { name: 'Tool Usage Tips', trigger: 'Tool used', active: true },
                { name: 'Re-engagement', trigger: 'Inactive 30 days', active: true },
                { name: 'New Tool Announcement', trigger: 'Tool launched', active: true },
                { name: 'Blog Notification', trigger: 'Post published', active: false },
              ].map(rule => (
                <div key={rule.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <div>
                    <div className="text-ink text-sm font-bold">{rule.name}</div>
                    <div className="text-ink/60 text-xs">Trigger: {rule.trigger}</div>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-primary' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl space-y-4">
            <h3 className="font-bold text-ink text-sm uppercase">GDPR Compliance</h3>
            <div className="space-y-2 text-sm text-ink/70">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Double opt-in enabled</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Unsubscribe link in every email</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Preference center available</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Data retention policy configured</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Privacy policy linked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
