import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Download, 
  X, 
  Loader2, 
  Mail, 
  Calendar, 
  User, 
  LogIn, 
  ShieldAlert, 
  Plus, 
  TrendingUp, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  Trash2, 
  Zap, 
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { auth, googleProvider, getEntries, getAllUsers, updateUserTier, addCommunityContent, getCommunityContent, getConsultations } from '../firebase';
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AdminDashboardProps {
  onClose: () => void;
}

const ADMIN_EMAIL = "thrilznetwork@gmail.com";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [communityUsers, setCommunityUsers] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'entries' | 'users' | 'content' | 'consultations'>('entries');

  // Content Form State
  const [newContent, setNewContent] = useState({
    title: '',
    body: '',
    type: 'drop',
    minTier: 'basic',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        fetchAllData();
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [entriesData, usersData, contentData, consultationsData] = await Promise.all([
        getEntries(),
        getAllUsers(),
        getCommunityContent(),
        getConsultations()
      ]);
      setEntries(entriesData || []);
      setCommunityUsers(usersData || []);
      setContent(contentData || []);
      setConsultations(consultationsData || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load data. Make sure you are the authorized admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ADMIN_EMAIL) {
        setError('Unauthorized access. This dashboard is for the administrator only.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleTierUpdate = async (uid: string, newTier: string) => {
    try {
      await updateUserTier(uid, newTier);
      setCommunityUsers(prev => prev.map(u => u.uid === uid ? { ...u, tier: newTier } : u));
    } catch (err) {
      console.error('Tier update error:', err);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCommunityContent(newContent);
      setNewContent({ title: '', body: '', type: 'drop', minTier: 'basic', url: '' });
      const updatedContent = await getCommunityContent();
      setContent(updatedContent || []);
      alert('Content added successfully!');
    } catch (err) {
      console.error('Add content error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = user && user.email === ADMIN_EMAIL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-10"
    >
      <div className="relative flex h-full max-h-[900px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Quantum Admin</h2>
              <p className="text-[10px] uppercase tracking-[1px] text-white/30">Management Console</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isAdmin ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 text-center">
            <div className="mb-6 rounded-full bg-red-500/10 p-4 text-red-500">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Restricted Access</h3>
            <p className="mb-8 max-w-sm text-sm text-white/40">
              This dashboard is only accessible to the authorized administrator.
            </p>
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-50"
            >
              {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign in as Admin
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Sidebar Tabs */}
            <div className="w-full border-b border-white/5 p-4 md:w-64 md:border-b-0 md:border-r">
              <nav className="flex space-x-2 overflow-x-auto pb-2 md:flex-col md:space-x-0 md:space-y-2 md:pb-0 scrollbar-hide">
                <button 
                  onClick={() => setActiveTab('entries')}
                  className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[1px] transition-all ${activeTab === 'entries' ? 'bg-gold/10 text-gold' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <Users className="h-4 w-4" />
                  Email Entries
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[1px] transition-all ${activeTab === 'users' ? 'bg-gold/10 text-gold' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <Zap className="h-4 w-4" />
                  Community Tiers
                </button>
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[1px] transition-all ${activeTab === 'content' ? 'bg-gold/10 text-gold' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Content & Drops
                </button>
                <button 
                  onClick={() => setActiveTab('consultations')}
                  className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[1px] transition-all ${activeTab === 'consultations' ? 'bg-gold/10 text-gold' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Consultations
                </button>
              </nav>
            </div>

            {/* Main Panel */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {activeTab === 'entries' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-white">Email Entries</h3>
                    <button className="text-[10px] font-bold uppercase tracking-[1px] text-gold hover:underline">Export CSV</button>
                  </div>
                  <div className="overflow-x-auto overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="border-b border-white/5 bg-white/[0.03] text-[10px] uppercase tracking-[1px] text-white/40">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 font-medium text-white">{entry.name}</td>
                            <td className="px-6 py-4 text-white/60">{entry.email}</td>
                            <td className="px-6 py-4 text-white/40">{entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-white">Community Members</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {communityUsers.map((u) => (
                      <div key={u.uid} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="flex items-center gap-4">
                          <img src={u.photoURL} className="h-10 w-10 rounded-full" />
                          <div>
                            <div className="text-sm font-bold text-white">{u.name}</div>
                            <div className="text-[10px] text-white/40">{u.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {['basic', 'premium', 'elite'].map((t) => (
                            <button 
                              key={t}
                              onClick={() => handleTierUpdate(u.uid, t)}
                              className={`rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[1px] transition-all ${u.tier === t ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-8">
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-[1px] text-gold">Visual Assets</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('generate-all-images'));
                            alert('Batch generation started. This may take a few minutes.');
                          }}
                          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] text-black hover:bg-yellow transition-all"
                        >
                          <Zap className="h-3 w-3" />
                          Generate All Visuals (Pro)
                        </button>
                      </div>
                    </div>
                    <p className="mb-4 text-[11px] leading-relaxed text-white/40">
                      Trigger a batch generation of all chapter visuals using the Gemini 3 Pro model. This ensures all readers see high-fidelity cinematic imagery.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-[1px] text-gold">Add New Drop</h4>
                    <form onSubmit={handleAddContent} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input 
                        placeholder="Title"
                        value={newContent.title}
                        onChange={e => setNewContent({...newContent, title: e.target.value})}
                        className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-gold/50 outline-none"
                        required
                      />
                      <select 
                        value={newContent.type}
                        onChange={e => setNewContent({...newContent, type: e.target.value})}
                        className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-gold/50 outline-none"
                      >
                        <option value="drop">Drop</option>
                        <option value="price">Price Update</option>
                        <option value="pdf">PDF Resource</option>
                        <option value="job">Hire Opportunity</option>
                        <option value="podcast">Podcast</option>
                        <option value="blog">Blog</option>
                      </select>
                      <textarea 
                        placeholder="Body content..."
                        value={newContent.body}
                        onChange={e => setNewContent({...newContent, body: e.target.value})}
                        className="md:col-span-2 rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-gold/50 outline-none h-24"
                        required
                      />
                      <input 
                        placeholder="URL (optional)"
                        value={newContent.url}
                        onChange={e => setNewContent({...newContent, url: e.target.value})}
                        className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-gold/50 outline-none"
                      />
                      <select 
                        value={newContent.minTier}
                        onChange={e => setNewContent({...newContent, minTier: e.target.value})}
                        className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-gold/50 outline-none"
                      >
                        <option value="basic">Basic Tier</option>
                        <option value="premium">Premium Tier</option>
                        <option value="elite">Elite Tier</option>
                      </select>
                      <button 
                        disabled={isSubmitting}
                        className="md:col-span-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-[1px] text-black hover:bg-yellow disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Publish to Community'}
                      </button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-[1px] text-white/40">Recent Content</h4>
                    {content.map(item => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/40">
                            {item.type === 'drop' ? <Zap className="h-5 w-5" /> : item.type === 'price' ? <TrendingUp className="h-5 w-5" /> : item.type === 'pdf' ? <FileText className="h-5 w-5" /> : item.type === 'podcast' ? <Headphones className="h-5 w-5" /> : item.type === 'blog' ? <FileText className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-white/40">{item.minTier} tier · {item.type}</div>
                          </div>
                        </div>
                        <button className="text-red-500/40 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'consultations' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-white">Consultation Requests</h3>
                  <div className="space-y-4">
                    {consultations.map(c => (
                      <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">{c.userName.charAt(0)}</div>
                            <div>
                              <div className="text-sm font-bold text-white">{c.userName}</div>
                              <div className="text-[10px] text-white/40">{c.userEmail}</div>
                            </div>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[1px] ${c.status === 'pending' ? 'bg-yellow/10 text-yellow' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 italic">"{c.message}"</p>
                        <div className="mt-4 flex justify-end">
                          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-gold hover:underline">
                            <CheckCircle className="h-3 w-3" /> Mark Contacted
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
