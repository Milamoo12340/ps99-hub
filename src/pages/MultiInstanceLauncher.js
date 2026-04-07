import React, { useState } from 'react';

const LAUNCH_SCRIPT = `@echo off
REM PS99 Multi-Instance Launcher
REM Run as Administrator for best results
REM ────────────────────────────────────

set INSTANCES=%1
if "%INSTANCES%"=="" set INSTANCES=2

echo Launching %INSTANCES% Roblox instance(s)...

for /l %%i in (1,1,%INSTANCES%) do (
  echo Starting instance %%i...
  start "" "C:\\Users\\%USERNAME%\\AppData\\Local\\Roblox\\Versions\\RobloxPlayerBeta.exe" --app
  timeout /t 5 /nobreak >nul
)

echo Done! %INSTANCES% instances launched.
pause`;

const MULTI_AHK = `#Requires AutoHotkey v2.0
; PS99 Multi-Instance Manager
; Launch multiple Roblox windows

INSTANCES := 2  ; Change this number

Roblox_Path := A_LocalAppData "\\Roblox\\Versions\\"

; Find latest version
latest := ""
latestTime := 0
loop files Roblox_Path "*", "D" {
  if A_LoopFileTimeModified > latestTime {
    latestTime := A_LoopFileTimeModified
    latest := A_LoopFileFullPath
  }
}

if !latest {
  MsgBox("Roblox not found!", "Error", 16)
  ExitApp()
}

exe := latest "\\RobloxPlayerBeta.exe"

loop INSTANCES {
  Run(exe " --app")
  Sleep(5000)  ; wait 5s between launches
  ToolTip("Launched instance " A_Index " of " INSTANCES)
}

ToolTip("All instances running!")
Sleep(3000)
ToolTip()
ExitApp()`;

function download(content, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}));
  a.download = filename; a.click();
}

export default function MultiInstanceLauncher() {
  const [count, setCount] = useState(2);

  const s = {
    page: {background:'#0d0d1a',minHeight:'100vh',color:'#eee',fontFamily:'Segoe UI,sans-serif',padding:24},
    title: {fontSize:24,fontWeight:800,color:'#E74C3C',marginBottom:20},
    card: {background:'#1a1a2e',borderRadius:12,padding:20,marginBottom:16},
    btn: (c='#E74C3C') => ({padding:'10px 20px',borderRadius:8,border:'none',background:c,color:'#fff',cursor:'pointer',fontSize:14,fontWeight:700}),
    input: {padding:'8px 12px',borderRadius:8,background:'#0d0d1a',border:'1px solid #333',color:'#eee',fontSize:14,width:80,textAlign:'center',outline:'none'},
    warning: {background:'#E74C3C22',border:'1px solid #E74C3C44',borderRadius:8,padding:12,fontSize:12,color:'#E74C3C',marginBottom:16},
  };

  const customBat = LAUNCH_SCRIPT.replace('set INSTANCES=2', `set INSTANCES=${count}`);
  const customAhk = MULTI_AHK.replace('INSTANCES := 2', `INSTANCES := ${count}`);

  return (
    <div style={s.page}>
      <div style={s.title}>🔀 Multi-Instance Launcher</div>

      <div style={s.warning}>
        ⚠️ Multi-instancing may violate Roblox ToS. Use at your own risk. Some anti-cheat systems may flag this.
      </div>

      <div style={s.card}>
        <div style={{fontWeight:700,marginBottom:12}}>How many instances?</div>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
          <button onClick={()=>setCount(c=>Math.max(1,c-1))} style={{...s.btn('#333'),padding:'8px 14px'}}>−</button>
          <input style={s.input} type="number" value={count} onChange={e=>setCount(Math.max(1,Math.min(5,Number(e.target.value))))} min={1} max={5}/>
          <button onClick={()=>setCount(c=>Math.min(5,c+1))} style={{...s.btn('#333'),padding:'8px 14px'}}>+</button>
          <span style={{color:'#888',fontSize:13}}>(max 5 recommended)</span>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button onClick={()=>download(customBat,'launch-ps99-multi.bat')} style={s.btn()}>📥 Download .bat</button>
          <button onClick={()=>download(customAhk,'launch-ps99-multi.ahk')} style={s.btn('#9B59B6')}>📥 Download .ahk</button>
        </div>
      </div>

      <div style={s.card}>
        <div style={{fontWeight:700,marginBottom:10}}>📋 Instructions</div>
        <ol style={{color:'#aaa',fontSize:13,lineHeight:2,paddingLeft:20}}>
          <li>Download the .bat or .ahk version above</li>
          <li>Run as Administrator (right-click → Run as admin)</li>
          <li>Roblox will open {count} times with a 5 second delay between each</li>
          <li>Log into each instance separately</li>
          <li>Join PS99 in each window</li>
        </ol>
      </div>

      <div style={s.card}>
        <div style={{fontWeight:700,marginBottom:8}}>Script Preview (.bat)</div>
        <pre style={{fontSize:11,color:'#aaa',background:'#0d0d1a',padding:12,borderRadius:8,overflow:'auto',maxHeight:200,margin:0}}>{customBat}</pre>
      </div>
    </div>
  );
}
