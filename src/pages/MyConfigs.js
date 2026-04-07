import React, { useState, useEffect } from 'react';

function download(content, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download = filename; a.click();
}

export default function MyConfigs() {
  const [configs, setConfigs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ps99hub_configs') || '[]'); }
    catch { return []; }
  });
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('{\n  \n}');
  const [editing, setEditing] = useState(null);

  function saveConfigs(updated) {
    setConfigs(updated);
    localStorage.setItem('ps99hub_configs', JSON.stringify(updated));
  }

  function addConfig() {
    if (!newName) return;
    const cfg = { id: Date.now(), name: newName, content: newContent, created: new Date().toISOString() };
    saveConfigs([...configs, cfg]);
    setNewName(''); setNewContent('{\n  \n}');
  }

  function deleteConfig(id) { saveConfigs(configs.filter(c => c.id !== id)); }

  function updateConfig(id, content) {
    saveConfigs(configs.map(c => c.id === id ? {...c, content, updated: new Date().toISOString()} : c));
    setEditing(null);
  }

  function importFile() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,.txt';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const cfg = { id: Date.now(), name: file.name, content: ev.target.result, created: new Date().toISOString() };
        saveConfigs([...configs, cfg]);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#1ABC9C',marginBottom:20},
    card: {background:'#1a1a2e',border:'1px solid #ffffff11',borderRadius:12,padding:16,marginBottom:12},
    input: {padding:'9px 12px',borderRadius:8,background:'#0d0d1a',border:'1px solid #333',color:'#eee',fontSize:13,outline:'none'},
    btn: (c='#1ABC9C') => ({padding:'8px 14px',borderRadius:8,border:'none',background:c,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600}),
    textArea: {padding:'9px 12px',borderRadius:8,background:'#0d0d1a',border:'1px solid #333',color:'#2ECC71',fontSize:12,outline:'none',width:'100%',fontFamily:'monospace',resize:'vertical'},
  };

  return (
    <div style={s.page}>
      <div style={s.title}>💾 My Configs</div>

      <div style={s.card}>
        <div style={{fontWeight:700,marginBottom:10}}>Save New Config</div>
        <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
          <input style={{...s.input,flex:1}} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Config name (e.g. Max FPS Setup)"/>
          <button onClick={importFile} style={s.btn('#3498DB')}>📂 Import File</button>
        </div>
        <textarea style={{...s.textArea,height:120,marginBottom:8}} value={newContent} onChange={e=>setNewContent(e.target.value)} placeholder='{"flag": value}'/>
        <button onClick={addConfig} style={s.btn()} disabled={!newName}>💾 Save Config</button>
      </div>

      {configs.length === 0 && <div style={{textAlign:'center',padding:40,color:'#444'}}>No configs saved yet. Create or import one above.</div>}

      {configs.map(cfg => (
        <div key={cfg.id} style={s.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div>
              <div style={{fontWeight:700}}>{cfg.name}</div>
              <div style={{fontSize:11,color:'#555'}}>{new Date(cfg.created).toLocaleDateString()}</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>download(cfg.content,cfg.name.endsWith('.json')?cfg.name:cfg.name+'.json')} style={s.btn()}>📥</button>
              <button onClick={()=>navigator.clipboard.writeText(cfg.content)} style={s.btn('#9B59B6')}>📋</button>
              <button onClick={()=>setEditing(editing===cfg.id?null:cfg.id)} style={s.btn('#F1C40F')}>✏️</button>
              <button onClick={()=>deleteConfig(cfg.id)} style={s.btn('#E74C3C')}>🗑</button>
            </div>
          </div>
          {editing === cfg.id ? (
            <div>
              <textarea style={{...s.textArea,height:150,marginBottom:8}} defaultValue={cfg.content}
                onChange={e=>e.currentTarget._val=e.target.value}
                onBlur={e=>e.currentTarget._val && updateConfig(cfg.id, e.currentTarget._val)}/>
              <button onClick={()=>setEditing(null)} style={s.btn('#555')}>Done</button>
            </div>
          ) : (
            <pre style={{fontSize:10,color:'#aaa',background:'#0d0d1a',padding:8,borderRadius:6,overflow:'auto',maxHeight:100,margin:0}}>
              {cfg.content.slice(0,300)}{cfg.content.length>300?'...':''}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
