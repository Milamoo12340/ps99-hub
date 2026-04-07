import React, { useState, useEffect } from 'react';

const BIGGAMES = 'https://ps99.biggamesapi.io/api';

function fmt(n) {
  if (!n) return '0';
  if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}

export default function Dashboard() {
  const [gameInfo, setGameInfo] = useState(null);
  const [rapTop, setRapTop] = useState([]);
  const [rarest, setRarest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [game, rap, exists] = await Promise.all([
          fetch(`https://games.roblox.com/v1/games?universeIds=3317771874`).then(r=>r.json()),
          fetch(`${BIGGAMES}/rap`).then(r=>r.json()),
          fetch(`${BIGGAMES}/exists`).then(r=>r.json()),
        ]);
        setGameInfo(game?.data?.[0]);
        const rapData = (rap?.data||[]).filter(r=>typeof r.configData==='object'&&r.value>0)
          .sort((a,b)=>b.value-a.value).slice(0,5);
        setRapTop(rapData);
        const existData = (exists?.data||[]).filter(e=>typeof e.configData==='object'&&e.value>0&&e.value<100)
          .sort((a,b)=>a.value-b.value).slice(0,5);
        setRarest(existData);
      } catch(e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,background:'linear-gradient(135deg,#9B59B6,#3498DB)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:24},
    grid: {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28},
    card: (c='#7289DA') => ({background:'#1a1a2e',border:`1px solid ${c}33`,borderRadius:12,padding:'16px 20px'}),
    row: {display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #ffffff08'},
  };

  return (
    <div style={s.page}>
      <div style={s.title}>🐾 PS99 Dashboard</div>
      {loading ? <div style={{color:'#555'}}>Loading live data...</div> : (
        <>
          <div style={s.grid}>
            <div style={s.card('#2ECC71')}>
              <div style={{fontSize:11,color:'#888'}}>LIVE PLAYERS</div>
              <div style={{fontSize:28,fontWeight:800,color:'#2ECC71'}}>{fmt(gameInfo?.playing||0)}</div>
            </div>
            <div style={s.card('#3498DB')}>
              <div style={{fontSize:11,color:'#888'}}>TOTAL VISITS</div>
              <div style={{fontSize:28,fontWeight:800,color:'#3498DB'}}>{fmt(gameInfo?.visits||0)}</div>
            </div>
            <div style={s.card('#F1C40F')}>
              <div style={{fontSize:11,color:'#888'}}>FAVOURITES</div>
              <div style={{fontSize:28,fontWeight:800,color:'#F1C40F'}}>{fmt(gameInfo?.favoritedCount||0)}</div>
            </div>
            <div style={s.card('#9B59B6')}>
              <div style={{fontSize:11,color:'#888'}}>LAST UPDATE</div>
              <div style={{fontSize:16,fontWeight:700,color:'#9B59B6'}}>{gameInfo?.updated?.slice(0,10)||'?'}</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={s.card('#F1C40F')}>
              <div style={{fontWeight:700,marginBottom:12}}>💰 Top RAP Pets</div>
              {rapTop.map((r,i)=>(
                <div key={i} style={s.row}>
                  <span style={{fontSize:13}}>{r.configData?.id||'?'}</span>
                  <span style={{color:'#F1C40F',fontWeight:700}}>{fmt(r.value)}</span>
                </div>
              ))}
            </div>
            <div style={s.card('#E74C3C')}>
              <div style={{fontWeight:700,marginBottom:12}}>✨ Rarest (sub-100)</div>
              {rarest.map((e,i)=>(
                <div key={i} style={s.row}>
                  <span style={{fontSize:13}}>{e.configData?.id||'?'}</span>
                  <span style={{color:'#E74C3C',fontWeight:700}}>{e.value} exist</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
