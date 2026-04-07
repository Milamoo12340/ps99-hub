import React, { useState } from 'react';

const MACRO_TEMPLATES = [
  {
    name: 'Auto Hatch Loop',
    desc: 'Continuously clicks to hatch eggs. Set your hatch hotkey.',
    code: `#Requires AutoHotkey v2.0
; PS99 Auto Hatch Loop
; Press F1 to toggle, Escape to exit

global running := false

F1:: {
  global running
  running := !running
  ToolTip(running ? "🟢 Hatching..." : "🔴 Stopped")
  SetTimer(HatchLoop, running ? 50 : 0)
}

HatchLoop() {
  global running
  if !running {
    SetTimer(HatchLoop, 0)
    return
  }
  Click
  Sleep(150)
}

Escape:: ExitApp()`,
  },
  {
    name: 'Auto Collect Coins',
    desc: 'Walks forward and collects coins in a loop.',
    code: `#Requires AutoHotkey v2.0
; PS99 Auto Collect — walks forward collecting
; F2 to start/stop, Esc to exit

global active := false

F2:: {
  global active
  active := !active
  ToolTip(active ? "🟢 Collecting..." : "🔴 Stopped")
}

SetTimer(() => {
  global active
  if active {
    Send("{w down}")
    Sleep(2000)
    Send("{w up}")
    Sleep(200)
    Send("{e}")  ; interact / collect
    Sleep(300)
  }
}, 100)

Escape:: ExitApp()`,
  },
  {
    name: 'Auto Rebirth',
    desc: 'Detects rebirth button and clicks it automatically.',
    code: `#Requires AutoHotkey v2.0
; PS99 Auto Rebirth
; Scans screen for rebirth button position
; F3 to toggle

global rebirthActive := false

F3:: {
  global rebirthActive
  rebirthActive := !rebirthActive
  ToolTip(rebirthActive ? "🟢 Auto-rebirth ON" : "🔴 Off")
}

SetTimer(CheckRebirth, 3000)

CheckRebirth() {
  global rebirthActive
  if !rebirthActive
    return
  ; Click rebirth button area (adjust coords for your resolution)
  ; Default: center-right of screen
  w := A_ScreenWidth, h := A_ScreenHeight
  Click(w * 0.85, h * 0.5)
  Sleep(500)
  Click(w * 0.5, h * 0.65)  ; confirm
}

Escape:: ExitApp()`,
  },
  {
    name: 'Speed Afk Farm',
    desc: 'Keeps moving to prevent AFK kick while farming.',
    code: `#Requires AutoHotkey v2.0
; PS99 AFK Farm — prevents kick
; Rotates WASD every 8 mins

SetTimer(AntiAfk, 480000)  ; every 8 minutes

AntiAfk() {
  Send("{w down}")
  Sleep(200)
  Send("{w up}")
  Sleep(100)
  Send("{a down}")
  Sleep(200)
  Send("{a up}")
  Sleep(100)
  Send("{d down}")
  Sleep(200)
  Send("{d up}")
}

Escape:: ExitApp()`,
  },
];

function download(content, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download = filename; a.click();
}

export default function Macros() {
  const [selected, setSelected] = useState(null);
  const [customCode, setCustomCode] = useState('');
  const [customName, setCustomName] = useState('');

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#9B59B6',marginBottom:20},
    card: (a) => ({background:'#1a1a2e',border:`1px solid ${a?'#9B59B6':'#ffffff11'}`,borderRadius:12,padding:16,cursor:'pointer',transition:'all 0.15s'}),
    btn: (c='#9B59B6') => ({padding:'8px 16px',borderRadius:8,border:'none',background:c,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600}),
    input: {padding:'8px 12px',borderRadius:8,background:'#0d0d1a',border:'1px solid #333',color:'#eee',fontSize:13,outline:'none',width:'100%'},
  };

  return (
    <div style={s.page}>
      <div style={s.title}>🤖 AHK Macro Templates</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12,marginBottom:24}}>
        {MACRO_TEMPLATES.map((m,i)=>(
          <div key={i} style={s.card(selected===i)} onClick={()=>setSelected(i)}>
            <div style={{fontWeight:700,marginBottom:4}}>{m.name}</div>
            <div style={{fontSize:12,color:'#888',marginBottom:8}}>{m.desc}</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={e=>{e.stopPropagation();download(m.code,`${m.name.replace(/\s+/g,'-')}.ahk`)}} style={s.btn()}>📥 Download</button>
              <button onClick={e=>{e.stopPropagation();navigator.clipboard.writeText(m.code)}} style={s.btn('#3498DB')}>📋 Copy</button>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div style={{background:'#1a1a2e',borderRadius:12,padding:16,marginBottom:24}}>
          <div style={{fontWeight:700,marginBottom:8}}>{MACRO_TEMPLATES[selected].name} — Code</div>
          <pre style={{fontSize:11,color:'#2ECC71',background:'#0d0d1a',padding:12,borderRadius:8,overflow:'auto',maxHeight:320,margin:0}}>
            {MACRO_TEMPLATES[selected].code}
          </pre>
        </div>
      )}

      <div style={{background:'#1a1a2e',borderRadius:12,padding:16}}>
        <div style={{fontWeight:700,marginBottom:10}}>✏️ Custom Macro Editor</div>
        <input style={{...s.input,marginBottom:8}} value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Macro name..."/>
        <textarea value={customCode} onChange={e=>setCustomCode(e.target.value)}
          placeholder={'#Requires AutoHotkey v2.0\n; Your macro here...'}
          style={{...s.input,height:200,resize:'vertical',fontFamily:'monospace',marginBottom:8}}/>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>download(customCode,`${customName||'custom'}.ahk`)} style={s.btn('#2ECC71')}>📥 Download .ahk</button>
          <button onClick={()=>navigator.clipboard.writeText(customCode)} style={s.btn('#9B59B6')}>📋 Copy</button>
        </div>
      </div>
    </div>
  );
}
