import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Shimmer = () => <div className="absolute top-0 bottom-0 left-0 w-[150%] animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" style={{ transform: 'translate3d(-100%, 0, 0) skewX(-20deg)' }} />;

const CardSkeleton = () => (
  <div className="w-full flex flex-col gap-2 relative">
    <div className="aspect-[3/4.5] bg-[#16161a] rounded-sm relative overflow-hidden shadow-xl"><Shimmer /></div>
    <div className="w-3/4 h-2.5 bg-[#16161a] rounded-sm relative overflow-hidden"><Shimmer /></div>
  </div>
);

const AnimeCard = ({ a, onClick, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), (index % 15) * 40);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div onClick={onClick} className={`w-full flex flex-col gap-2 group cursor-pointer active:scale-95 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 blur-none translate-y-0' : 'opacity-0 blur-xl translate-y-4'}`}>
      <div className="relative aspect-[3/4.5] w-full overflow-hidden bg-[#16161a] rounded-sm shadow-xl">
        <img src={a.image_poster} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-[9px] font-bold text-white/60 line-clamp-1 capitalize group-hover:text-[#F6CF80] transition-colors">{a.title.toLowerCase()}</h3>
    </div>
  );
};

const Ongoing = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/ongoing?page=0`).then(r => r.json());
        if (isMounted) setResults(res.data ||[]);
      } catch (e) {
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPage();
    return () => { isMounted = false; };
  },[]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-nunito selection:bg-[#F6CF80] selection:text-black pb-24">
      <style>{`
        @keyframes shimmer { 0% { transform: translate3d(-100%, 0, 0) skewX(-20deg); } 100% { transform: translate3d(200%, 0, 0) skewX(-20deg); } }
        body, html { background-color: #0a0a0c !important; color: white; margin: 0; padding: 0; overscroll-behavior-y: none; }
        body { font-family: 'Nunito', sans-serif; }
      `}</style>
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6">
        <div className="mb-8 flex flex-col">
          <h2 className="text-white font-black uppercase text-lg tracking-tight">Ongoing Anime</h2>
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Anime yang sedang tayang saat ini</span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-3 px-2 mb-10">
          {isLoading ? [...Array(18)].map((_, i) => <CardSkeleton key={`shimmer-${i}`} />) : results.map((a, index) => (
            <AnimeCard key={a.id} a={a} index={index} onClick={() => navigate(`/anime/${a.id}-${(a.title||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ongoing;