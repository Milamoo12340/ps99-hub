import React, { useState, useEffect } from 'react';

const PRESETS = {
  'Max FPS': {
    "DFIntTaskSchedulerTargetFps": 999,
    "FFlagTaskSchedulerLimitTargetFpsTo2402": false,
    "DFIntDefaultFrameRateLimit": 0,
  },
  'Low Graphics': {
    "DFIntTextureQualityOverride": 0,
    "DFFlagTextureQualityOverrideEnabled": true,
    "FIntRenderShadowIntensity": 0,
    "DFFlagDebugPauseVoxelizer": true,
  },
  'Network Optimised': {
    "DFIntConnectionMTUSize": 900,
    "DFIntMaxMissedWorldStepsRemembered": 1,
    "DFIntRakNetResendBufferArrayLength": 128,
  },
  'Balanced': {
    "DFIntTaskSchedulerTargetFps": 144,
    "DFIntTextureQualityOverride": 2,
    "DFIntDefaultFrameRateLimit": 144,
  },
};

function download(content, filename) {
  const blob = new Blob([content], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export default function FastFlags() {
  const [flags, setFlags] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [activePreset, setActivePreset] = useState('');

  function applyPreset(name) {
    setFlags(f => ({...f, ...PRESETS[name]}));
    setActivePreset(name);
  }

  function addFlag() {
    if (!newKey) return;
    let val = newVal;
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (!isNaN(Number(val)) && val !== '') val = Number(val);
    setFlags(f => ({...f, [newKey]: val}));
    setNewKey(''); setNewVal('');
  }

  function removeFlag(key) {
    setFlags(f => { const n = {...f}; delete n[key]; return n; });
  }

  const jsonOutput = JSON.stringify(flags, null, 2);

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#3498DB',marginBottom:20},
    card: {background:'#1a1a2e',border:'1px solid #ffffff11',borderRadius:12,padding:16,marginBottom:16},
    input: {padding:'8px 12px',borderRadius:8,background:'#0d0d1a',border:'1px solid #333',color:'#eee',fontSize:13,outline:'none'},
    btn: (c='#3498DB') => ({padding:'8px 16px',borderRadius:8,border:'none',background:c,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600}),
    presetBtn: (a) => ({padding:'8px 14px',borderRadius:8,border:'1px solid '+(a?'#3498DB':'#333'),background:a?'#3498DB22':'transparent',color:a?'#3498DB':'#888',cursor:'pointer',fontSize:12,fontWeight:600}),
  };

  return (
    <div style={s.page}>
      <div style={s.title}>🚩 FFlag Editor</div>

      <div style={s.card}>
        <div style={{fontWeight:600,marginBottom:10}}>Quick Presets</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {Object.keys(PRESETS).map(p => (
            <button key={p} onClick={()=>applyPreset(p)} style={s.presetBtn(activePreset===p)}>{p}</button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={{fontWeight:600,marginBottom:10}}>Add Custom Flag</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input style={{...s.input,flex:2}} value={newKey} onChange={e=>setNewKey(e.target.value)} placeholder="Flag name (e.g. DFIntTaskSchedulerTargetFps)"/>
          <input style={{...s.input,flex:1}} value={newVal} onChange={e=>setNewVal(e.target.value)} placeholder="Value"/>
          <button onClick={addFlag} style={s.btn()}>Add</button>
        </div>
      </div>

      {Object.keys(flags).length > 0 && (
        <div style={s.card}>
          <div style={{fontWeight:600,marginBottom:10}}>Active Flags ({Object.keys(flags).length})</div>
          {Object.entries(flags).map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #ffffff08'}}>
              <code style={{fontSize:12,color:'#3498DB'}}>{k}</code>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:12,color:v===true?'#2ECC71':v===false?'#E74C3C':'#F1C40F'}}>{String(v)}</span>
                <button onClick={()=>removeFlag(k)} style={{background:'none',border:'none',color:'#E74C3C',cursor:'pointer',fontSize:16}}>×</button>
              </div>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}}>
            <button onClick={()=>download(jsonOutput,'ClientAppSettings.json')} style={s.btn('#2ECC71')}>📥 Download JSON</button>
            <button onClick={()=>navigator.clipboard.writeText(jsonOutput)} style={s.btn('#9B59B6')}>📋 Copy JSON</button>
            <button onClick={()=>setFlags({})} style={s.btn('#E74C3C')}>🗑 Clear All</button>
          </div>
        </div>
      )}

      <div style={s.card}>
        <div style={{fontWeight:600,marginBottom:8}}>JSON Preview</div>
        <pre style={{fontSize:11,color:'#2ECC71',background:'#0d0d1a',padding:12,borderRadius:8,overflow:'auto',maxHeight:300,margin:0}}>
          {jsonOutput || '{}'}
        </pre>
      </div>
    </div>
  );
}
