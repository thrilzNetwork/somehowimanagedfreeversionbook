import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Calendar, 
  Zap, 
  TrendingUp, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  X, 
  Loader2, 
  LogIn, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Star,
  Share2,
  Award,
  Copy,
  Check
} from 'lucide-react';
import { auth, googleProvider, syncUser, getUserProfile, getCommunityContent, requestConsultation } from '../firebase';
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface UserDashboardProps {
  onClose: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onClose }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'hire' | 'books'>('feed');
  
  // Consultation State
  const [consultationMsg, setConsultationMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const referrerCode = localStorage.getItem('quantum_referrer') || undefined;
        const userProfile = await syncUser(currentUser, referrerCode);
        setProfile(userProfile);
        const communityContent = await getCommunityContent();
        setContent(communityContent || []);
        
        // Clear referrer after sync
        if (referrerCode) {
          localStorage.removeItem('quantum_referrer');
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !consultationMsg.trim()) return;
    
    setIsSubmitting(true);
    try {
      await requestConsultation(user.uid, user.displayName || 'Anonymous', user.email || '', consultationMsg);
      setConsultationMsg('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Consultation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter content based on user tier
  const filteredContent = content.filter(item => {
    const tiers = ['basic', 'premium', 'elite'];
    const userTierIndex = tiers.indexOf(profile?.tier || 'basic');
    const itemTierIndex = tiers.indexOf(item.minTier || 'basic');
    return userTierIndex >= itemTierIndex;
  });

  const feedItems = filteredContent.filter(i => i.type === 'drop' || i.type === 'price');
  const hireItems = filteredContent.filter(i => i.type === 'job');
  const bookItems = filteredContent.filter(i => i.type === 'pdf');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-10"
    >
      <div className="relative flex h-full max-h-[900px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Quantum Community</h2>
              <p className="text-[10px] uppercase tracking-[1px] text-white/30">Member Dashboard</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <div className="mb-6 h-20 w-20 rounded-full bg-gold/5 flex items-center justify-center text-gold">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white font-serif">Exclusive Access</h3>
            <p className="mb-8 max-w-sm text-sm text-white/40">
              Join the Quantum Closed Community to access share prices, exclusive drops, and hire opportunities.
            </p>
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-sm font-bold text-black transition-all hover:bg-yellow disabled:opacity-50"
            >
              {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign in with Google
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* User Profile Bar */}
            <div className="flex flex-col items-center justify-between gap-4 border-b border-white/5 bg-white/[0.02] p-6 md:flex-row">
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ''} className="h-12 w-12 rounded-full border border-gold/20" />
                <div>
                  <div className="text-lg font-bold text-white">{user.displayName}</div>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] text-white/40">
                    <span className="flex items-center gap-1 text-gold">
                      <Star className="h-3 w-3 fill-gold" /> {profile?.tier} member
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Joined {profile?.joinDate?.toDate ? profile.joinDate.toDate().toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('feed')}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] transition-all ${activeTab === 'feed' ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  Community Feed
                </button>
                <button 
                  onClick={() => setActiveTab('hire')}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] transition-all ${activeTab === 'hire' ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  Hire Opps
                </button>
                <button 
                  onClick={() => setActiveTab('books')}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] transition-all ${activeTab === 'books' ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  Free Books
                </button>
              </div>
            </div>

            {/* Referral Info Bar */}
            <div className="flex flex-col items-center justify-between gap-4 border-b border-white/5 bg-gold/[0.02] p-4 md:flex-row md:px-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold text-white/60">Points:</span>
                  <span className="text-sm font-black text-gold">{profile?.points || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-gold" />
                  <span className="text-xs font-bold text-white/60">Referral Code:</span>
                  <span className="font-mono text-sm font-bold text-white">{profile?.referralCode}</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}?ref=${profile?.referralCode}`;
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] text-gold transition-all hover:bg-gold/10"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy Referral Link"}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {activeTab === 'feed' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="font-serif text-2xl font-bold text-white">Latest Drops & Prices</h3>
                    {feedItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-white/20">
                        No updates for your tier yet.
                      </div>
                    ) : (
                      feedItems.map(item => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={item.id} 
                          className="rounded-xl border border-white/5 bg-white/[0.03] p-6"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-gold">
                              {item.type === 'drop' ? <Zap className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                              {item.type}
                            </span>
                            <span className="text-[10px] text-white/20">{item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'Recently'}</span>
                          </div>
                          <h4 className="mb-2 text-lg font-bold text-white">{item.title}</h4>
                          <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline">
                              View Details <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Consultation Sidebar */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[1px] text-gold">
                        <MessageSquare className="h-4 w-4" /> Consultation
                      </h4>
                      <p className="mb-4 text-xs text-white/40">Ask questions or request a 1-on-1 session with the Quantum team.</p>
                      
                      {showSuccess ? (
                        <div className="rounded-lg bg-emerald-500/10 p-4 text-center text-xs text-emerald-500">
                          Request sent! We'll contact you soon.
                        </div>
                      ) : (
                        <form onSubmit={handleConsultation} className="space-y-3">
                          <textarea 
                            placeholder="What's on your mind?"
                            value={consultationMsg}
                            onChange={e => setConsultationMsg(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white focus:border-gold/50 outline-none h-24"
                            required
                          />
                          <button 
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-gold py-3 text-[10px] font-bold uppercase tracking-[1px] text-black hover:bg-yellow disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : 'Send Request'}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hire' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-white">Hire Opportunities</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {hireItems.map(item => (
                      <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/40">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-white">{item.title}</h4>
                        <p className="mb-4 text-sm text-white/60">{item.body}</p>
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-3 text-[10px] font-bold uppercase tracking-[1px] text-white hover:bg-white/5">
                          Apply Now <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {hireItems.length === 0 && (
                      <div className="col-span-full rounded-xl border border-dashed border-white/10 p-10 text-center text-white/20">
                        No active hire opportunities for your tier.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'books' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-white">Free Book PDFs</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {bookItems.map(item => (
                      <div key={item.id} className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-gold/30">
                        <div className="mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-white/5 flex items-center justify-center text-white/10">
                          <FileText className="h-12 w-12" />
                        </div>
                        <h4 className="mb-1 text-sm font-bold text-white">{item.title}</h4>
                        <p className="mb-4 text-[10px] text-white/40 line-clamp-2">{item.body}</p>
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-[10px] font-bold uppercase tracking-[1px] text-white group-hover:bg-gold group-hover:text-black transition-all">
                          <Download className="h-3 w-3" /> Download
                        </button>
                      </div>
                    ))}
                    {bookItems.length === 0 && (
                      <div className="col-span-full rounded-xl border border-dashed border-white/10 p-10 text-center text-white/20">
                        No PDF resources available for your tier.
                      </div>
                    )}
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
