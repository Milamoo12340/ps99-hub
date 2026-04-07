import React, { useState, useEffect } from 'react';

const BG = 'https://ps99.biggamesapi.io/api';

function fmt(n) {
  if (!n) return '0';
  if (n >= 1e12) return (n/1e12).toFixed(2)+'T';
  if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}

export default function PS99Data() {
  const [tab, setTab] = useState('pets');
  const [pets, setPets] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [rap, setRap] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BG}/collection/Pets`).then(r=>r.json()),
      fetch(`${BG}/collection/Eggs`).then(r=>r.json()),
      fetch(`${BG}/rap`).then(r=>r.json()),
    ]).then(([p,e,r]) => {
      setPets(p?.data||[]);
      setEggs(e?.data||[]);
      setRap((r?.data||[]).filter(x=>typeof x.configData==='object'&&x.value>0).sort((a,b)=>b.value-a.value));
      setLoading(false);
    });
  }, []);

  const rapMap = {};
  rap.forEach(r=>{if(typeof r.configData==='object') rapMap[(r.configData?.id||'').toLowerCase()]=r.value;});

  const filtered = (tab==='pets' ? pets : eggs).filter(x => {
    const name = (x.configData?.name||x.configName||'').toLowerCase();
    return !q || name.includes(q.toLowerCase());
  });

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#E67E22',marginBottom:20},
    tab: (a) => ({padding:'8px 16px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:a?'#E67E22':'#1a1a2e',color:a?'#fff':'#888'}),
    input: {padding:'9px 12px',borderRadius:8,background:'#1a1a2e',border:'1px solid #333',color:'#eee',fontSize:13,outline:'none',width:'100%',marginBottom:14},
    card: {background:'#1a1a2e',borderRadius:10,padding:12,display:'flex',gap:10,alignItems:'center'},
  };

  return (
    <div style={s.page}>
      <div style={s.title}>📊 PS99 Live Data</div>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {['pets','eggs','rap'].map(t=>(<button key={t} style={s.tab(tab===t)} onClick={()=>setTab(t)}>{t==='pets'?'🐾 Pets':t==='eggs'?'🥚 Eggs':'💰 RAP'}</button>))}
      </div>
      <input style={s.input} value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${tab}...`}/>
      {loading && <div style={{color:'#555'}}>Loading...</div>}

      {tab==='rap' ? (
        <div style={{background:'#1a1a2e',borderRadius:12,overflow:'hidden'}}>
          {rap.filter(r=>{
            const id=(r.configData?.id||'').toLowerCase();
            return !q||id.includes(q.toLowerCase());
          }).slice(0,80).map((r,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 16px',borderBottom:'1px solid #ffffff08'}}>
              <span style={{fontSize:13}}>{r.configData?.id}</span>
              <span style={{color:'#F1C40F',fontWeight:700}}>{fmt(r.value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
          {filtered.slice(0,80).map((item,i)=>{
            const name = item.configData?.name||item.configName||'?';
            const thumbId = (item.configData?.thumbnail||'').replace('rbxassetid://','');
            const rapVal = rapMap[name.toLowerCase()];
            return (
              <div key={i} style={s.card}>
                {thumbId ? <img src={`https://ps99.biggamesapi.io/image/${thumbId}`} alt={name} style={{width:44,height:44,borderRadius:8,objectFit:'cover'}}/> : <div style={{width:44,height:44,borderRadius:8,background:'#0d0d1a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{tab==='pets'?'🐾':'🥚'}</div>}
                <div>
                  <div style={{fontWeight:600,fontSize:12,color:'#eee'}}>{name}</div>
                  {rapVal && <div style={{fontSize:11,color:'#F1C40F'}}>💰 {fmt(rapVal)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
