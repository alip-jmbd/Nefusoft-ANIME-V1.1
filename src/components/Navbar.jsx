import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const[showLoginPopup, setShowLoginPopup] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery('');
      setLiveResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLiveLoading(true);
        try {
          const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`).then(r => r.json());
          setLiveResults(res.data || []);
        } catch (e) {
          setLiveResults([]);
        }
        setIsLiveLoading(false);
      } else {
        setLiveResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks =[
    { path: '/home', label: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> },
    { path: '/explore', label: 'Explore', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/> },
    { path: '/history', label: 'History', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/> },
    { path: '/ongoing', label: 'Ongoing', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> },
    { path: '/schedule', label: 'Schedule', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/> }
  ];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scaleY(0.95); }
          to { opacity: 1; transform: translateY(0) scaleY(1); }
        }
      `}</style>
      <nav className="fixed top-2 inset-x-4 z-[100] max-w-7xl mx-auto">
        <div className="bg-black/60 h-16 px-6 rounded-2xl flex items-center justify-between border border-white/5 shadow-lg relative overflow-hidden">
          <div className="flex items-center shrink-0 z-10">
            <img src="https://raw.githubusercontent.com/alip-jmbd/alipp/main/icon-rbg.png" className="w-10 md:w-14 aspect-square object-contain cursor-pointer" alt="NefuSoft" onClick={() => navigate('/home')} />
          </div>
          
          <div className="flex items-center justify-end flex-1 gap-3 z-10">
            <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-white cursor-pointer border border-white/10 hover:bg-[#F6CF80] hover:text-black hover:border-[#F6CF80] transition-colors shrink-0" onClick={() => setIsSearchOpen(true)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            
            <div onClick={() => setShowLoginPopup(true)} className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-white cursor-pointer border border-white/10 hover:bg-[#F6CF80] hover:text-black hover:border-[#F6CF80] transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
          </div>

          <div className={`absolute inset-0 bg-[#16161a] z-20 flex items-center px-4 transition-all duration-300 ease-out ${isSearchOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
              <button type="submit" className="text-[#F6CF80] shrink-0 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
              <input 
                ref={searchInputRef}
                type="text" 
                className="flex-1 bg-transparent text-white text-sm outline-none font-bold placeholder-white/30"
                placeholder="Cari anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="text-white/40 hover:text-white p-2 shrink-0 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </form>
          </div>
        </div>

        {isSearchOpen && searchQuery.length > 2 && (
          <div className="absolute top-20 left-4 right-4 md:left-auto md:right-0 md:w-96 bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl z-[110] max-h-[60vh] overflow-y-auto custom-scrollbar origin-top animate-[slideDown_0.2s_ease-out]">
            {isLiveLoading ? (
              <div className="p-6 text-center text-[#F6CF80] text-xs font-bold">mencari...</div>
            ) : liveResults.length > 0 ? (
              liveResults.map(r => (
                <div key={r.id} onClick={() => { navigate(`/anime/${r.id}-${(r.title||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`); setIsSearchOpen(false); }} className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors">
                  <img src={r.image_poster} referrerPolicy="no-referrer" className="w-10 aspect-[3/4.5] object-cover rounded-md shadow-md" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs line-clamp-1">{r.title}</span>
                    <span className="text-white/40 font-bold text-[9px] mt-1">{r.type} • {r.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-white/40 text-xs font-bold">anime tidak ditemukan</div>
            )}
          </div>
        )}
      </nav>

      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-black/80 border border-white/10 rounded-full flex justify-between items-center px-6 py-3 shadow-2xl z-[90]">
        {navLinks.map((link) => {
          const isActive = location.pathname.includes(link.path);
          return (
            <div 
              key={link.path} 
              onClick={() => {
                if (link.path === '/history') {
                  setShowLoginPopup(true);
                } else {
                  navigate(link.path);
                }
              }}
              className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${isActive ? 'text-[#F6CF80]' : 'text-white/40 hover:text-white/80'}`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-[#F6CF80]/20' : 'bg-transparent'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </div>
              <span className={`text-[9px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{link.label}</span>
            </div>
          );
        })}
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 z-[999] bg-[#0a0a0c]/90 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#16161a] border border-white/10 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center relative shadow-2xl">
            <button onClick={() => setShowLoginPopup(false)} className="absolute top-5 right-5 text-white/30 hover:text-[#F6CF80] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <img src="https://raw.githubusercontent.com/alip-jmbd/alipp/main/irohaplenger.jpg" alt="Not Available" className="w-32 h-32 object-cover rounded-full mb-6 shadow-[0_0_30px_rgba(246,207,128,0.15)] border-4 border-[#F6CF80]/20" />
            <h3 className="text-white font-black text-2xl mb-3 text-center tracking-tight">Eitss, belum bisa!</h3>
            <p className="text-white/50 text-sm font-medium text-center leading-relaxed">Fitur login dan riwayat tontonan masih dalam tahap pengembangan. Sabar ya! 😖</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;