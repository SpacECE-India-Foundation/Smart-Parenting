// src/pages/admin/AdminActivities.jsx — Full CRUD for Sound Match, Object Recognition, Fluency Passages, Phonics, Challenges
import { useState, useEffect } from "react";
import {
  getSoundMatchData, addSoundMatch, updateSoundMatch, deleteSoundMatch,
  getObjectRecognitionData, addObjectRecognition, updateObjectRecognition, deleteObjectRecognition,
  getFluencyPassages, addFluencyPassage, updateFluencyPassage, deleteFluencyPassage,
  getPhonicsWords, addPhonicsWord, updatePhonicsWord, deletePhonicsWord,
} from "../../firebase/firestoreService";
import s from "./Admin.module.css";

function Toast({ msg }) { return msg ? <div className={s.toast}>{msg}</div> : null; }

/* ── TABS ── */
const SUB_TABS = [
  { id: "sound",   label: "🔊 Sound Matching" },
  { id: "object",  label: "👆 Object Recognition" },
  { id: "fluency", label: "⏱️ Fluency Passages" },
  { id: "phonics", label: "🅰️ Phonics Words" },
];

/* ─────────────────────────── SOUND MATCHING ─────────────────────────── */
const SOUND_BLANK = { prompt: "", sound: "", animals: ["","","",""], labels: ["","","",""], answer: 0, age_group: "1-3" };
const DEFAULT_SOUNDS = [
  { id:"ds1", prompt:"Who says Moo?", sound:"Moo Moo Moo", animals:["🐮","🐷","🐔","🐸"], labels:["Cow","Pig","Hen","Frog"], answer:0, age_group:"1-3" },
  { id:"ds2", prompt:"Who says Woof?", sound:"Woof Woof Woof", animals:["🐱","🐶","🐦","🐸"], labels:["Cat","Dog","Bird","Frog"], answer:1, age_group:"1-3" },
  { id:"ds3", prompt:"Who says Meow?", sound:"Meow Meow", animals:["🐶","🦁","🐱","🐮"], labels:["Dog","Lion","Cat","Cow"], answer:2, age_group:"1-3" },
  { id:"ds4", prompt:"Who says Cluck?", sound:"Cluck Cluck Cluck", animals:["🦅","🐔","🐟","🐷"], labels:["Eagle","Hen","Fish","Pig"], answer:1, age_group:"1-3" },
  { id:"ds5", prompt:"Who says Roar?", sound:"Roarrrr", animals:["🐮","🦊","🦁","🐸"], labels:["Cow","Fox","Lion","Frog"], answer:2, age_group:"4-6" },
  { id:"ds6", prompt:"Who says Ribbit?", sound:"Ribbit Ribbit", animals:["🐸","🐟","🐛","🐢"], labels:["Frog","Fish","Worm","Turtle"], answer:0, age_group:"4-6" },
];

function SoundMatchAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm]   = useState(SOUND_BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState("");

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const load = async () => {
    setLoading(true);
    const fs = await getSoundMatchData();
    const fsIds = new Set(fs.map(x=>x.id));
    setItems([...fs, ...DEFAULT_SOUNDS.filter(d=>!fsIds.has(d.id))]);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));
  const setAnimal = (i,v) => setForm(p=>{ const a=[...p.animals]; a[i]=v; return {...p,animals:a}; });
  const setLabel  = (i,v) => setForm(p=>{ const l=[...p.labels];  l[i]=v; return {...p,labels:l};  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.prompt.trim() || !form.sound.trim()) return;
    setBusy(true);
    if (editId && !editId.startsWith("ds")) await updateSoundMatch(editId, form);
    else await addSoundMatch(form);
    showToast(editId ? "✅ Updated!" : "✅ Added!");
    setForm(SOUND_BLANK); setEditId(null);
    await load(); setBusy(false);
  };

  const startEdit = it => { setEditId(it.id); setForm({ prompt:it.prompt||"", sound:it.sound||"", animals:[...it.animals], labels:[...it.labels], answer:Number(it.answer), age_group:it.age_group||"1-3" }); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleDelete = async id => {
    if (DEFAULT_SOUNDS.find(d=>d.id===id)) { showToast("⚠️ Default sounds cannot be deleted."); return; }
    if (!window.confirm("Delete this sound question?")) return;
    await deleteSoundMatch(id); showToast("🗑️ Deleted!"); await load();
  };

  return (
    <>
      <Toast msg={toast} />
      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{editId?"✏️ Edit Sound Question":"➕ Add Sound Question"}</h2>
          {editId && <button className="btn btn-ghost" onClick={()=>{setForm(SOUND_BLANK);setEditId(null);}}>✕ Cancel</button>}
        </div>
        <div className={s.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={s.formGrid}>
              <div className="form-group">
                <label className="form-label">Question Prompt *</label>
                <input className="form-input" value={form.prompt} onChange={e=>setF("prompt",e.target.value)} placeholder="Who says Moo?" required />
              </div>
              <div className="form-group">
                <label className="form-label">Sound Text (spoken by TTS) *</label>
                <input className="form-input" value={form.sound} onChange={e=>setF("sound",e.target.value)} placeholder="Moo Moo Moo" required />
                <small style={{color:"var(--color-text-secondary)",fontSize:12}}>This text will be spoken aloud as the animal sound</small>
              </div>
              <div className="form-group">
                <label className="form-label">Age Group</label>
                <select className="form-input" value={form.age_group} onChange={e=>setF("age_group",e.target.value)}>
                  <option value="1-3">1–3</option><option value="4-6">4–6</option><option value="7-10">7–10</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Correct Answer (0–3)</label>
                <select className="form-input" value={form.answer} onChange={e=>setF("answer",Number(e.target.value))}>
                  {[0,1,2,3].map(n=><option key={n} value={n}>Option {n+1}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginTop:12}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input className="form-input" style={{width:60}} value={form.animals[i]} onChange={e=>setAnimal(i,e.target.value)} placeholder={`Emoji ${i+1}`} />
                  <input className="form-input" value={form.labels[i]} onChange={e=>setLabel(i,e.target.value)} placeholder={`Label ${i+1} (e.g. Cow)`} />
                  {form.answer===i && <span style={{fontSize:18}}>✅</span>}
                </div>
              ))}
            </div>
            <div className={s.formActions}>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy?"Saving...":editId?"💾 Save Changes":"➕ Add Sound"}</button>
            </div>
          </form>
        </div>
      </div>
      <div className={s.section}>
        <h2 className={s.sectionTitle}>📋 All Sound Questions ({items.length})</h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Prompt</th><th>Sound Text</th><th>Options</th><th>Answer</th><th>Age</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6}>Loading...</td></tr> : items.map(it=>(
                <tr key={it.id}>
                  <td><strong>{it.prompt}</strong></td>
                  <td><code style={{background:"var(--color-surface)",padding:"2px 6px",borderRadius:4,fontSize:12}}>{it.sound}</code></td>
                  <td style={{fontSize:18}}>{it.animals?.join(" ")}</td>
                  <td><span className={`${s.badge} ${s.badgeGreen}`}>{it.animals?.[it.answer]} {it.labels?.[it.answer]}</span></td>
                  <td><span className={`${s.badge} ${s.badgeOrange}`}>Age {it.age_group}</span></td>
                  <td>
                    <button className={s.iconBtn} onClick={()=>startEdit(it)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.deleteBtn}`} onClick={()=>handleDelete(it.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── OBJECT RECOGNITION ─────────────────────────── */
const OBJ_BLANK = { word:"", items:["","","",""], answer:0, age_group:"1-3" };
const DEFAULT_OBJECTS = [
  { id:"do1", word:"Apple",    items:["🍎","🐶","🚗","🏠"], answer:0, age_group:"1-3" },
  { id:"do2", word:"Dog",      items:["🌸","🐶","⭐","🍎"], answer:1, age_group:"1-3" },
  { id:"do3", word:"Star",     items:["🐘","🌊","⭐","🏠"], answer:2, age_group:"1-3" },
  { id:"do4", word:"House",    items:["🐟","🌺","🎈","🏠"], answer:3, age_group:"4-6" },
  { id:"do5", word:"Fish",     items:["🐟","🌸","🎨","🐘"], answer:0, age_group:"4-6" },
  { id:"do6", word:"Elephant", items:["🐸","🏠","🐘","⭐"], answer:2, age_group:"4-6" },
];

function ObjectRecognitionAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm]   = useState(OBJ_BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState("");

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const load = async () => {
    setLoading(true);
    const fs = await getObjectRecognitionData();
    const fsIds = new Set(fs.map(x=>x.id));
    setItems([...fs, ...DEFAULT_OBJECTS.filter(d=>!fsIds.has(d.id))]);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));
  const setItem = (i,v) => setForm(p=>{ const a=[...p.items]; a[i]=v; return {...p,items:a}; });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.word.trim()) return;
    setBusy(true);
    if (editId && !editId.startsWith("do")) await updateObjectRecognition(editId, form);
    else await addObjectRecognition(form);
    showToast(editId?"✅ Updated!":"✅ Added!");
    setForm(OBJ_BLANK); setEditId(null);
    await load(); setBusy(false);
  };

  const startEdit = it => { setEditId(it.id); setForm({ word:it.word||"", items:[...it.items], answer:Number(it.answer), age_group:it.age_group||"1-3" }); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleDelete = async id => {
    if (DEFAULT_OBJECTS.find(d=>d.id===id)) { showToast("⚠️ Default objects cannot be deleted."); return; }
    if (!window.confirm("Delete this question?")) return;
    await deleteObjectRecognition(id); showToast("🗑️ Deleted!"); await load();
  };

  return (
    <>
      <Toast msg={toast} />
      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{editId?"✏️ Edit Object Question":"➕ Add Object Question"}</h2>
          {editId && <button className="btn btn-ghost" onClick={()=>{setForm(OBJ_BLANK);setEditId(null);}}>✕ Cancel</button>}
        </div>
        <div className={s.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={s.formGrid}>
              <div className="form-group">
                <label className="form-label">Word to Find *</label>
                <input className="form-input" value={form.word} onChange={e=>setF("word",e.target.value)} placeholder="e.g. Apple" required />
              </div>
              <div className="form-group">
                <label className="form-label">Age Group</label>
                <select className="form-input" value={form.age_group} onChange={e=>setF("age_group",e.target.value)}>
                  <option value="1-3">1–3</option><option value="4-6">4–6</option><option value="7-10">7–10</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Correct Answer (0–3)</label>
                <select className="form-input" value={form.answer} onChange={e=>setF("answer",Number(e.target.value))}>
                  {[0,1,2,3].map(n=><option key={n} value={n}>Option {n+1}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:12}}>
              {[0,1,2,3].map(i=>(
                <div key={i}>
                  <label className="form-label" style={{fontSize:12}}>Option {i+1} {form.answer===i?"✅":""}</label>
                  <input className="form-input" value={form.items[i]} onChange={e=>setItem(i,e.target.value)} placeholder={`Emoji ${i+1}`} />
                </div>
              ))}
            </div>
            <div className={s.formActions}>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy?"Saving...":editId?"💾 Save Changes":"➕ Add Question"}</button>
            </div>
          </form>
        </div>
      </div>
      <div className={s.section}>
        <h2 className={s.sectionTitle}>📋 All Object Questions ({items.length})</h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Word</th><th>Options</th><th>Correct</th><th>Age</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5}>Loading...</td></tr> : items.map(it=>(
                <tr key={it.id}>
                  <td><strong>{it.word}</strong></td>
                  <td style={{fontSize:20}}>{it.items?.join("  ")}</td>
                  <td><span className={`${s.badge} ${s.badgeGreen}`}>{it.items?.[it.answer]}</span></td>
                  <td><span className={`${s.badge} ${s.badgeOrange}`}>Age {it.age_group}</span></td>
                  <td>
                    <button className={s.iconBtn} onClick={()=>startEdit(it)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.deleteBtn}`} onClick={()=>handleDelete(it.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── FLUENCY PASSAGES ─────────────────────────── */
const FLU_BLANK = { title:"", text:"", level:"Easy", time_limit:60, age_group:"7-10" };
const DEFAULT_PASSAGES = [
  { id:"df1", title:"The River", level:"Easy", time_limit:60, age_group:"7-10", text:"The river flows down the mountain. It passes through forests and villages. Children play near the river. They catch fish and swim in summer. The river gives water to farmers for their crops. Without the river, the village would be dry." },
  { id:"df2", title:"The Market", level:"Medium", time_limit:60, age_group:"7-10", text:"Every Saturday, the market comes alive with colour and noise. Vendors sell vegetables, fruits, spices, and clothes. The smell of fresh flowers fills the air. Old women bargain loudly. Children run between stalls eating sugarcane. The market is the heart of the village." },
  { id:"df3", title:"Technology Today", level:"Hard", time_limit:60, age_group:"7-10", text:"Technology has changed the way we learn and communicate. Smartphones connect people across thousands of kilometres instantly. Students can now access libraries from their homes. However, too much screen time can affect health. Balancing technology with outdoor activity is important for growing children." },
];

function FluencyPassagesAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm]   = useState(FLU_BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState("");

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const load = async () => {
    setLoading(true);
    const fs = await getFluencyPassages();
    const fsIds = new Set(fs.map(x=>x.id));
    setItems([...fs, ...DEFAULT_PASSAGES.filter(d=>!fsIds.has(d.id))]);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.text.trim()) return;
    setBusy(true);
    if (editId && !editId.startsWith("df")) await updateFluencyPassage(editId, form);
    else await addFluencyPassage(form);
    showToast(editId?"✅ Updated!":"✅ Added!");
    setForm(FLU_BLANK); setEditId(null);
    await load(); setBusy(false);
  };

  const startEdit = it => { setEditId(it.id); setForm({ title:it.title||"", text:it.text||"", level:it.level||"Easy", time_limit:it.time_limit||60, age_group:it.age_group||"7-10" }); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleDelete = async id => {
    if (DEFAULT_PASSAGES.find(d=>d.id===id)) { showToast("⚠️ Default passages cannot be deleted."); return; }
    if (!window.confirm("Delete this passage?")) return;
    await deleteFluencyPassage(id); showToast("🗑️ Deleted!"); await load();
  };

  return (
    <>
      <Toast msg={toast} />
      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{editId?"✏️ Edit Passage":"➕ Add Fluency Passage"}</h2>
          {editId && <button className="btn btn-ghost" onClick={()=>{setForm(FLU_BLANK);setEditId(null);}}>✕ Cancel</button>}
        </div>
        <div className={s.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={s.formGrid}>
              <div className="form-group">
                <label className="form-label">Passage Title *</label>
                <input className="form-input" value={form.title} onChange={e=>setF("title",e.target.value)} placeholder="e.g. The River" required />
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <select className="form-input" value={form.level} onChange={e=>setF("level",e.target.value)}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Age Group</label>
                <select className="form-input" value={form.age_group} onChange={e=>setF("age_group",e.target.value)}>
                  <option value="1-3">1–3</option><option value="4-6">4–6</option><option value="7-10">7–10</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time Limit (seconds)</label>
                <input className="form-input" type="number" min={30} max={180} value={form.time_limit} onChange={e=>setF("time_limit",Number(e.target.value))} />
              </div>
            </div>
            <div className="form-group" style={{marginTop:8}}>
              <label className="form-label">Passage Text * ({form.text.trim().split(/\s+/).filter(Boolean).length} words)</label>
              <textarea className={`form-input ${s.textarea}`} rows={5} value={form.text} onChange={e=>setF("text",e.target.value)} placeholder="Type the reading passage here..." required />
            </div>
            <div className={s.formActions}>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy?"Saving...":editId?"💾 Save Changes":"➕ Add Passage"}</button>
            </div>
          </form>
        </div>
      </div>
      <div className={s.section}>
        <h2 className={s.sectionTitle}>📋 All Passages ({items.length})</h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Title</th><th>Level</th><th>Words</th><th>Time</th><th>Age</th><th>Preview</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7}>Loading...</td></tr> : items.map(it=>(
                <tr key={it.id}>
                  <td><strong>{it.title}</strong></td>
                  <td><span className={`${s.badge} ${it.level==="Easy"?s.badgeGreen:it.level==="Medium"?s.badgeOrange:s.badgePurple}`}>{it.level}</span></td>
                  <td>{it.text?.trim().split(/\s+/).length || 0}</td>
                  <td>{it.time_limit}s</td>
                  <td><span className={`${s.badge} ${s.badgeBlue}`}>Age {it.age_group}</span></td>
                  <td style={{fontSize:12,color:"var(--color-text-secondary)",maxWidth:200}}>{it.text?.slice(0,80)}…</td>
                  <td>
                    <button className={s.iconBtn} onClick={()=>startEdit(it)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.deleteBtn}`} onClick={()=>handleDelete(it.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── PHONICS WORDS ─────────────────────────── */
const PHON_BLANK = { word:"", syllables:[""], emoji:"", age_group:"4-6" };
const DEFAULT_PHONICS = [
  { id:"dp1", word:"cat",    syllables:["cat"],       emoji:"🐱", age_group:"4-6" },
  { id:"dp2", word:"rabbit", syllables:["rab","bit"],  emoji:"🐰", age_group:"4-6" },
  { id:"dp3", word:"apple",  syllables:["ap","ple"],   emoji:"🍎", age_group:"4-6" },
  { id:"dp4", word:"banana", syllables:["ba","na","na"],emoji:"🍌",age_group:"4-6" },
  { id:"dp5", word:"elephant",syllables:["el","e","phant"],emoji:"🐘",age_group:"7-10"},
  { id:"dp6", word:"hat",    syllables:["hat"],        emoji:"🎩", age_group:"1-3" },
  { id:"dp7", word:"sun",    syllables:["sun"],        emoji:"☀️", age_group:"1-3" },
  { id:"dp8", word:"butterfly",syllables:["but","ter","fly"],emoji:"🦋",age_group:"7-10"},
];

function PhonicsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm]   = useState(PHON_BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState("");
  const [syllInput, setSyllInput] = useState(""); // comma-separated input

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const load = async () => {
    setLoading(true);
    const fs = await getPhonicsWords();
    const fsIds = new Set(fs.map(x=>x.id));
    setItems([...fs, ...DEFAULT_PHONICS.filter(d=>!fsIds.has(d.id))]);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.word.trim()) return;
    const syllables = syllInput.split(",").map(s=>s.trim()).filter(Boolean);
    if (!syllables.length) { showToast("⚠️ Add at least one syllable!"); return; }
    const data = { ...form, syllables };
    setBusy(true);
    if (editId && !editId.startsWith("dp")) await updatePhonicsWord(editId, data);
    else await addPhonicsWord(data);
    showToast(editId?"✅ Updated!":"✅ Added!");
    setForm(PHON_BLANK); setSyllInput(""); setEditId(null);
    await load(); setBusy(false);
  };

  const startEdit = it => {
    setEditId(it.id);
    setForm({ word:it.word||"", syllables:it.syllables||[], emoji:it.emoji||"", age_group:it.age_group||"4-6" });
    setSyllInput((it.syllables||[]).join(", "));
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleDelete = async id => {
    if (DEFAULT_PHONICS.find(d=>d.id===id)) { showToast("⚠️ Default phonics cannot be deleted."); return; }
    if (!window.confirm("Delete this phonics word?")) return;
    await deletePhonicsWord(id); showToast("🗑️ Deleted!"); await load();
  };

  return (
    <>
      <Toast msg={toast} />
      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{editId?"✏️ Edit Phonics Word":"➕ Add Phonics Word"}</h2>
          {editId && <button className="btn btn-ghost" onClick={()=>{setForm(PHON_BLANK);setSyllInput("");setEditId(null);}}>✕ Cancel</button>}
        </div>
        <div className={s.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={s.formGrid}>
              <div className="form-group">
                <label className="form-label">Word *</label>
                <input className="form-input" value={form.word} onChange={e=>setF("word",e.target.value)} placeholder="e.g. rabbit" required />
              </div>
              <div className="form-group">
                <label className="form-label">Emoji</label>
                <input className="form-input" value={form.emoji} onChange={e=>setF("emoji",e.target.value)} placeholder="🐰" />
              </div>
              <div className="form-group">
                <label className="form-label">Age Group</label>
                <select className="form-input" value={form.age_group} onChange={e=>setF("age_group",e.target.value)}>
                  <option value="1-3">1–3</option><option value="4-6">4–6</option><option value="7-10">7–10</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Syllables (comma-separated) *</label>
                <input className="form-input" value={syllInput} onChange={e=>setSyllInput(e.target.value)} placeholder="rab, bit" />
                <small style={{color:"var(--color-text-secondary)",fontSize:12}}>Each syllable will be highlighted separately during phonics mode</small>
              </div>
            </div>
            {syllInput && (
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:700}}>Preview:</span>
                {syllInput.split(",").map((s,i)=>(
                  <span key={i} style={{background:"var(--gradient-cool)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:14,fontWeight:700}}>{s.trim()}</span>
                ))}
              </div>
            )}
            <div className={s.formActions}>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy?"Saving...":editId?"💾 Save Changes":"➕ Add Word"}</button>
            </div>
          </form>
        </div>
      </div>
      <div className={s.section}>
        <h2 className={s.sectionTitle}>📋 All Phonics Words ({items.length})</h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Word</th><th>Emoji</th><th>Syllables</th><th>Age</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5}>Loading...</td></tr> : items.map(it=>(
                <tr key={it.id}>
                  <td><strong>{it.word}</strong></td>
                  <td style={{fontSize:24}}>{it.emoji}</td>
                  <td>
                    {it.syllables?.map((syl,i)=>(
                      <span key={i} style={{background:"var(--color-surface)",border:"1px solid var(--color-border)",padding:"2px 8px",borderRadius:12,fontSize:12,marginRight:4,fontWeight:600}}>{syl}</span>
                    ))}
                  </td>
                  <td><span className={`${s.badge} ${s.badgeBlue}`}>Age {it.age_group}</span></td>
                  <td>
                    <button className={s.iconBtn} onClick={()=>startEdit(it)}>✏️</button>
                    <button className={`${s.iconBtn} ${s.deleteBtn}`} onClick={()=>handleDelete(it.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── MAIN EXPORT ─────────────────────────── */
export default function AdminActivities() {
  const [subTab, setSubTab] = useState("sound");

  return (
    <>
      {/* Sub-tab navigation */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24,borderBottom:"2px solid var(--color-border)",paddingBottom:12}}>
        {SUB_TABS.map(t=>(
          <button key={t.id}
            className={`${s.chipBtn} ${subTab===t.id?s.chipActive:""}`}
            style={{fontSize:14,padding:"8px 16px"}}
            onClick={()=>setSubTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab==="sound"   && <SoundMatchAdmin />}
      {subTab==="object"  && <ObjectRecognitionAdmin />}
      {subTab==="fluency" && <FluencyPassagesAdmin />}
      {subTab==="phonics" && <PhonicsAdmin />}
    </>
  );
}
