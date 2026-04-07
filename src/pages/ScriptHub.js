import React, { useState } from 'react';

const SCRIPTS = [
  {
    name: 'Auto Farm (Basic)',
    category: 'Farming',
    desc: 'Basic auto-farm loop for coins and XP.',
    tags: ['farm','coins','xp'],
    code: `#Requires AutoHotkey v2.0
; Basic PS99 Auto Farm
; F1: Toggle | Esc: Exit
global farming := false

F1:: {
  global farming
  farming := !farming
  ToolTip(farming ? "🌾 Farming..." : "⏸ Paused")
}

SetTimer(FarmLoop, 100)
FarmLoop() {
  global farming
  if farming {
    Click  ; collect coins
    Sleep(200)
  }
}

Escape:: ExitApp()`,
  },
  {
    name: 'Auto Hatch + Collect',
    category: 'Hatching',
    desc: 'Automatically hatches and collects pets.',
    tags: ['hatch','collect','auto'],
    code: `#Requires AutoHotkey v2.0
; Auto Hatch + Collect
; F2: Toggle | Esc: Exit
global hatching := false

F2:: {
  global hatching
  hatching := !hatching
  ToolTip(hatching ? "🥚 Hatching..." : "⏸ Paused")
}

SetTimer(HatchLoop, 50)
HatchLoop() {
  global hatching
  if hatching {
    Click
    Sleep(100)
    Send("{e}")  ; collect
    Sleep(150)
  }
}

Escape:: ExitApp()`,
  },
  {
    name: 'Anti-AFK',
    category: 'Utility',
    desc: 'Prevents AFK kick every 7 minutes.',
    tags: ['afk','utility'],
    code: `#Requires AutoHotkey v2.0
; Anti-AFK for PS99
SetTimer(AntiAfk, 420000)
AntiAfk() {
  Send("{Space}")
  Sleep(100)
  Send("{Space}")
}
ToolTip("✅ Anti-AFK active (F12 to exit)")
F12:: ExitApp()`,
  },
  {
    name: 'Fast Click Spam',
    category: 'Clicking',
    desc: 'High-speed click spam with configurable delay.',
    tags: ['click','spam','fast'],
    code: `#Requires AutoHotkey v2.0
; Fast Click — Hold F to spam click
; Esc to exit
CLICK_DELAY := 30  ; ms between clicks

F:: {
  while GetKeyState("F", "P") {
    Click
    Sleep(CLICK_DELAY)
  }
}

Escape:: ExitApp()`,
  },
];

function download(content, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download = filename; a.click();
}

export default function ScriptHub() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState(null);

  const cats = ['All', ...new Set(SCRIPTS.map(s => s.category))];
  const filtered = SCRIPTS.filter(s => {
    const catOk = cat === 'All' || s.category === cat;
    const qOk = !q || s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.tags.some(t => t.includes(q.toLowerCase()));
    return catOk && qOk;
  });

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#2ECC71',marginBottom:20},
    input: {padding:'9px 12px',borderRadius:8,background:'#1a1a2e',border:'1px solid #333',color:'#eee',fontSize:13,outline:'none'},
    card: (a) => ({background:'#1a1a2e',border:`1px solid ${a?'#2ECC71':'#ffffff11'}`,borderRadius:12,padding:14,cursor:'pointer'}),
    btn: (c='#2ECC71') => ({padding:'7px 14px',borderRadius:8,border:'none',background:c,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600}),
    catBtn: (a) => ({padding:'6px 12px',borderRadius:7,border:'1px solid '+(a?'#2ECC71':'#333'),background:a?'#2ECC7122':'transparent',color:a?'#2ECC71':'#888',cursor:'pointer',fontSize:12}),
  };

  return (
    <div style={s.page}>
      <div style={s.title}>📜 Script Hub</div>
      <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
        <input style={{...s.input,flex:1}} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search scripts..."/>
        {cats.map(c => <button key={c} style={s.catBtn(cat===c)} onClick={()=>setCat(c)}>{c}</button>)}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12,marginBottom:20}}>
        {filtered.map((sc,i)=>(
          <div key={i} style={s.card(selected===i)} onClick={()=>setSelected(i)}>
            <div style={{fontWeight:700,marginBottom:4}}>{sc.name}</div>
            <div style={{fontSize:11,color:'#888',marginBottom:8}}>{sc.desc}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
              {sc.tags.map(t=><span key={t} style={{fontSize:10,background:'#2ECC7122',color:'#2ECC71',padding:'2px 6px',borderRadius:4}}>{t}</span>)}
            </div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={e=>{e.stopPropagation();download(sc.code,`${sc.name.replace(/\s+/g,'-')}.ahk`)}} style={s.btn()}>📥</button>
              <button onClick={e=>{e.stopPropagation();navigator.clipboard.writeText(sc.code)}} style={s.btn('#3498DB')}>📋</button>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div style={{background:'#1a1a2e',borderRadius:12,padding:16}}>
          <div style={{fontWeight:700,marginBottom:8}}>{filtered[selected]?.name}</div>
          <pre style={{fontSize:11,color:'#2ECC71',background:'#0d0d1a',padding:12,borderRadius:8,overflow:'auto',maxHeight:300,margin:0}}>
            {filtered[selected]?.code}
          </pre>
        </div>
      )}
    </div>
  );
}
