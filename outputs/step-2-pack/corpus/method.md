# HLR corpus re-cut: method

2026-10-18. Lane A, Gate 1 call 8; Website added in a later call the same day (section 5f). Source: Figma file `LYyYXPDUHVoAABh865EvMI`, read through the Figma connector (`use_figma`) with read-only Plugin API scripts. Provenance of every row: observed. Counts are in `counts.md`.

## 1. Scope

Walked in full, every text node: Email (0:1), Organic Social (2:32177), Paid Social (2:35858), Website (2:182972). Not walked: Components (2:31579), Retail/Press (2:33120), Print (2:35751), Inspiration (2:35848), Images (2:31298), by the client lead's ruling of 2026-10-18 (section 7). No connector refusal occurred on any page or call.

Channel mapping: Email page = email, Organic Social = social, Paid Social = paid, Website = web. Every other page would be other; that file was not produced.

## 2. Unit model (what counts as a frame)

The walk recurses the page and every section (sections inside sections included). Section paths are written `A / B`; `(page)` means a direct child of the page.

- Frame unit: a FRAME, COMPONENT, COMPONENT_SET, INSTANCE or GROUP that is a direct child of the page or of a section. All text inside it, at any depth, belongs to it. Coordinates are relative to this frame.
- Board: a frame-like node is treated as a board, not a deliverable, when at least two of its direct frame-like children are deliverable-sized and at least one pair of them sits side by side (x ranges do not overlap), or stacked (y ranges do not overlap) when both are of type 1. Deliverable-sized: type 1, shorter side at least 500 px and aspect ratio within 2.5% of 1:1, 4:5, 9:16, 16:9 or 1.91:1; type 2, width 600, 640, 700 or 1200 px (rounded) and height at least 1000 px. Pairs are checked within a window of 30 children. A board's frame-like children become frame units (boards inside boards are expanded the same way), and the board path gets ` / [board] <name>`. The board itself is walked as a separate unit that holds only its direct TEXT children (flag `board_text`); its other children are covers for that text.
- Loose text: a TEXT node that is a direct child of the page or of a section (flag `loose_text`). It has no frame, so frame columns are blank and x, y are canvas coordinates (flag `coords=canvas`).
- Top-level versus nested: a unit is nested (flag `nested`) when it sits inside a second-level or deeper section or inside a board.
- Nodes of other types that are direct children of a section (rectangles, vectors, slices, lines) hold no text and are not units.

Independent check: on each walked page the number of rows equals `findAllWithCriteria({types:['TEXT']})` (Email 4,156; Organic Social 3,807; Paid Social 3,613; Website 1,398) and every text id appears once, so no text node fell outside the unit model.

## 3. Visibility rules as applied

Each text node gets exactly one reason, tested in this order; the first that applies wins.

1. hidden: the node or any ancestor up to the page (sections included) has `visible === false`. Mask nodes are treated as not visible themselves.
2. zero_opacity: the node or any ancestor has `opacity === 0`. Also zero_opacity, flag `no_visible_paint`: no fill and no stroke paint is visible with opacity above 0 (a stroke counts only with weight above 0 or mixed). Mixed fills count as visible paint.
3. empty: `characters.trim()` is empty.
4. off_frame: the text's bounding box does not intersect its frame unit's bounding box (boards: the board's box). Partly inside counts as inside. Loose text is never off_frame.
5. off_frame, flag `clipped_or_masked`: the part inside the frame does not intersect the clip region, which is the intersection of the boxes of every ancestor with `clipsContent` true and of any mask that precedes it among its siblings (and its ancestors' siblings).
6. buried, flag `cover=image` or `cover=solid`: a cover lies later in the unit's pre-order traversal (so it paints on top) and its box, after clipping, contains the text's visible box (0.5 px tolerance). A cover is a visible, non-zero-opacity RECTANGLE, FRAME, COMPONENT, INSTANCE or COMPONENT_SET, not a mask, rotated by a multiple of 90 degrees (within 0.5 degrees), whose topmost visible fill has paint opacity of at least 0.999, normal or pass-through blend, and is SOLID or an IMAGE not in FIT mode. If the cover sits under an ancestor that is translucent (opacity below 1) or uses a non-normal blend mode, that ancestor must also contain the text, or the cover is ignored. Covers are looked for only inside the same unit; separate frames that overlap on the canvas are not tested against each other. For board text, only the board's direct children are candidate covers. Loose text is never buried.
7. visible. Flag `unresolved` (still visible): the text sits under a mask that is not an axis-aligned rectangle or frame, or the only cover found sits under such a mask. No row needed this flag.

Instance content is read as rendered, with overrides applied, through the Plugin API; no instance override was unreadable, so none was flagged for that reason. Instances were walked like any other node.

Conservative readings chosen where the rules left room: partly-inside or partly-covered text counts visible; a cover must contain the whole visible box; translucent or blended covers never bury; text under a non-rectangular mask stays visible with a flag.

## 4. Columns

- `characters`: the node's `characters`, exact. Newlines are written as `\n`, carriage returns as `\r`, tabs as `\t`, and a backslash would be `\\` (none occurs). The line separator U+2028, which Figma inserts for a soft line break (shift and return) and which renders as a line break, is written as `\u2028` so that it stays distinct from a newline; a reader that wants display text can treat `\u2028` as a line break. Any other control character, or U+2029, would be written as `\uXXXX` (none occurs). Counts in the `characters` column over the five TSVs: 4,088 newlines (in 1,846 text nodes), 459 line separators (260), 8 carriage returns, 6 tabs; Website contributes 201 newlines (81) and 7 line separators (5). No-break spaces (190, in 86 text nodes), word joiners U+2060 (19, in 5), zero-width joiners (3, in 1) and one zero-width space are kept as raw characters; most viewers do not show them. Em dashes and other punctuation in client text are the client's.
- `layer_name`: the node's name when it differs from `characters` after collapsing whitespace runs (as JavaScript `\s+` matches them) to one space and trimming (flag `name_differs`). Otherwise the column holds `characters` with whitespace collapsed, which equals the name up to whitespace. Loose text follows the same rule: for 16 loose planning notes (Email 2, Organic Social 14) the exact name differs from the collapsed text only in whitespace, and the column holds the collapsed text.
- `font_family`, `font_style`: the node's font, or for mixed runs the distinct families and styles in order of first appearance joined by ` / ` (flag `mixed_font_runs`). `font_size`: rounded to 0.01; blank when sizes are mixed (flag `mixed_size`).
- `x`, `y`, `w`, `h`: the text's `absoluteBoundingBox` relative to its frame unit's box (board text: the board's box; loose text: canvas), rounded to whole pixels. Rotated text uses its axis-aligned box.
- `frame_w`, `frame_h`: the unit's box, rounded. Blank for loose text.
- `excluded.tsv` adds `reason`: hidden, zero_opacity, empty, off_frame or buried. Rows keep walk order (page, then section and z-order).

## 5. How the data was moved

The connector returns at most 20,480 bytes per call, and nothing can be written from the plugin side, so each page was walked in chunks. A strings phase returned the page's distinct `characters` values in order of first appearance; a rows phase returned one fixed-width base-62 record per text node (id as a delta from the previous id, coordinates, font index into a per-chunk font table, string index into the page table, one reason code), with unit and section records alongside. Each chunk was copied verbatim into `_raw/` and decoded by `_work/decode.py`.

Checks on every chunk: rows returned against rows decoded, sum of x+y+w+h, and for strings chunks the count and total UTF-16 length. From Paid Social chunk 5 onward a fourth checksum (string index times 7 plus font index times 3 plus reason code) also covered the indices; `_work/z3check.py` recomputes it. One copying slip was caught: `paid_R4.json` first carried one repeated row pair twice; the row-count and coordinate checksums failed, the duplicate was removed, and both checksums then matched the walk. For chunks before Paid Social chunk 5, a wrong index character that stayed in range would not have been caught by these checksums, and none of them catches a character copied as another of the same length. Section 5e closes both gaps: after a string repair, every row, unit and name was checked against hashes computed in the file, and all match.

Script versions (the visibility logic is the same in all):

- v1, v2 (`email_01.json`, `email_02.json`, Email units 0 to 44, 432 rows): per-chunk string tables, one-character font index. Their text was not kept in this lane's working context, so they are not pasted. Cross-check: a v5 census call recomputed those 432 rows (`_raw/census_email.json`, field `vr`); ids, reasons, flags and the coordinate sum (1,600,102) match exactly. The row hashes in 5e cover these rows as well, fonts and characters included.
- v3 (`email_R1`, `email_R2`): page string table, one-character font index.
- v4 (`email_R3` to `R7`, `social_R1` to `R4`): two-character font index.
- v5 (`social_R5` to `R10`, `paid_R1` to `R8`): as v4, plus a loose-text unit whose name matches its characters sends the marker U+0001 instead of the name. Paid R5 to R8 add the fourth checksum. The first rows call on each page also carried the tail of the string table.
- v6 (`web_S1`, `web_R1` to `R3`, `census_web`): as v5, with every returned string escaped to printable ASCII and every chunk carrying its own 5e hashes, computed at the source (5f).

### 5a. Strings phase (as run for Paid Social, chunk S1)

```js
// Lane A corpus walk v3, strings phase. READ-ONLY: reads node properties only.
const PID='2:35858',RU=0,RT=0,SS=0,LIM=19600;
const page=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(page);
const g=(n,k)=>(k in n)?n[k]:undefined;
const FL=new Set(['FRAME','COMPONENT','COMPONENT_SET','INSTANCE','GROUP']),RT2=[1,.8,.5625,16/9,1.91];
const hid=n=>g(n,'visible')===false,zo=n=>g(n,'opacity')===0;
const dl=c=>{if(!FL.has(c.type))return 0;const w=c.width,h=c.height;if(Math.min(w,h)>=500&&RT2.some(r=>Math.abs(w/h/r-1)<.025))return 1;if([600,640,700,1200].includes(Math.round(w))&&h>=1000)return 2;return 0};
const isB=n=>{const k=(n.children||[]).filter(dl);if(k.length<2)return 0;for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length&&j<i+30;j++){const a=k[i],b=k[j];if(a.x+a.width<=b.x||b.x+b.width<=a.x||((a.y+a.height<=b.y||b.y+b.height<=a.y)&&dl(a)===1&&dl(b)===1))return 1}return 0};
const secs=[['(page)',0]],units=[];
function eB(b,p,d,h,z){const q=p+' / [board] '+b.name;secs.push([q,d+1]);const si=secs.length-1;for(const n of b.children){if(!FL.has(n.type))continue;const h2=h||hid(n),z2=z||zo(n),bb=isB(n);units.push({n,k:bb?'b':'u',si,h,z,ns:1});if(bb)eB(n,q,d+1,h2,z2)}}
function eC(c,p,d,si,h,z){for(const n of c.children){const h2=h||hid(n),z2=z||zo(n),ns=d>1?1:0;
 if(n.type==='SECTION'){const q=p?p+' / '+n.name:n.name;secs.push([q,d+1]);eC(n,q,d+1,secs.length-1,h2,z2);continue}
 if(n.type==='TEXT'){units.push({n,k:'l',si,h,z,ns});continue}
 if(!FL.has(n.type))continue;
 if(isB(n)){units.push({n,k:'b',si,h,z,ns});eB(n,p||'(page)',d,h2,z2)}else units.push({n,k:'u',si,h,z,ns})}}
eC(page,'',0,0,false,false);
const lt=U=>{if(U.k==='l')return[U.n];const T=[],sh=U.k==='b';const w=(m,dp)=>{if(m.type==='TEXT'){T.push(m);return}if('children' in m&&(!sh||dp<1))for(const c of m.children)w(c,dp+1)};w(U.n,0);return T};
const G=new Map(),GL=[];for(let u=RU;u<units.length;u++){const T=lt(units[u]);for(let t=(u===RU?RT:0);t<T.length;t++){const ch=T[t].characters;if(!G.has(ch)){G.set(ch,GL.length);GL.push(ch)}}}
const W=GL.length>3843?3:2;
const jl=s=>{let b=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c<32)b+=(c===10||c===9||c===13||c===8||c===12)?2:6;else if(c===34||c===92)b+=2;else if(c<128)b++;else if(c<2048)b+=2;else if(c>=55296&&c<56320){b+=4;i++}else b+=3}return b};
const t=[];let by=200,i=SS,ch=0;for(;i<GL.length;i++){const a=jl(GL[i])+3;if(by+a>LIM)break;by+=a;t.push(GL[i]);ch+=GL[i].length}
return{v:3,kind:'S',h:[PID,RU+'.'+RT,SS,i,GL.length,W],t,z:[t.length,ch]};
```

Other strings calls changed only `PID`, `RU`, `RT` (the unit and text where the page table starts; 44.16 for Email, 0.0 elsewhere) and `SS` (first string index to return).

### 5b. Rows phase, v5 (as run for Paid Social, chunk R8)

```js
// Lane A corpus walk v5, rows phase. READ-ONLY: reads node properties only; creates, edits or renames nothing.
const PID='2:35858',RU=0,RT=0,CU=1178,CT=0,LIM=19600;
const page=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(page);
const g=(n,k)=>(k in n)?n[k]:undefined;
const FL=new Set(['FRAME','COMPONENT','COMPONENT_SET','INSTANCE','GROUP']),CV=new Set(['RECTANGLE','FRAME','COMPONENT','INSTANCE','COMPONENT_SET']),RT2=[1,.8,.5625,16/9,1.91];
const bl=m=>{const b=g(m,'blendMode');return b&&b!=='NORMAL'&&b!=='PASS_THROUGH'};
const hid=n=>g(n,'visible')===false,zo=n=>g(n,'opacity')===0;
const dl=c=>{if(!FL.has(c.type))return 0;const w=c.width,h=c.height;if(Math.min(w,h)>=500&&RT2.some(r=>Math.abs(w/h/r-1)<.025))return 1;if([600,640,700,1200].includes(Math.round(w))&&h>=1000)return 2;return 0};
const isB=n=>{const k=(n.children||[]).filter(dl);if(k.length<2)return 0;for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length&&j<i+30;j++){const a=k[i],b=k[j];if(a.x+a.width<=b.x||b.x+b.width<=a.x||((a.y+a.height<=b.y||b.y+b.height<=a.y)&&dl(a)===1&&dl(b)===1))return 1}return 0};
const secs=[['(page)',0]],units=[];
function eB(b,p,d,h,z){const q=p+' / [board] '+b.name;secs.push([q,d+1]);const si=secs.length-1;for(const n of b.children){if(!FL.has(n.type))continue;const h2=h||hid(n),z2=z||zo(n),bb=isB(n);units.push({n,k:bb?'b':'u',si,h,z,ns:1});if(bb)eB(n,q,d+1,h2,z2)}}
function eC(c,p,d,si,h,z){for(const n of c.children){const h2=h||hid(n),z2=z||zo(n),ns=d>1?1:0;
 if(n.type==='SECTION'){const q=p?p+' / '+n.name:n.name;secs.push([q,d+1]);eC(n,q,d+1,secs.length-1,h2,z2);continue}
 if(n.type==='TEXT'){units.push({n,k:'l',si,h,z,ns});continue}
 if(!FL.has(n.type))continue;
 if(isB(n)){units.push({n,k:'b',si,h,z,ns});eB(n,p||'(page)',d,h2,z2)}else units.push({n,k:'u',si,h,z,ns})}}
eC(page,'',0,0,false,false);
const lt=U=>{if(U.k==='l')return[U.n];const T=[],sh=U.k==='b';const w=(m,dp)=>{if(m.type==='TEXT'){T.push(m);return}if('children' in m&&(!sh||dp<1))for(const c of m.children)w(c,dp+1)};w(U.n,0);return T};
const G=new Map(),GL=[];for(let u=RU;u<units.length;u++){const T=lt(units[u]);for(let t=(u===RU?RT:0);t<T.length;t++){const ch=T[t].characters;if(!G.has(ch)){G.set(ch,GL.length);GL.push(ch)}}}
const W=GL.length>3843?3:2;
const I=(a,b)=>{if(!a)return b;if(!b)return a;const x=Math.max(a.x,b.x),y=Math.max(a.y,b.y),r=Math.min(a.x+a.width,b.x+b.width),t=Math.min(a.y+a.height,b.y+b.height);return r>x&&t>y?{x,y,width:r-x,height:t-y}:{x,y,width:0,height:0,e:1}};
const K=(a,b)=>a.x<=b.x+.5&&a.y<=b.y+.5&&a.x+a.width>=b.x+b.width-.5&&a.y+a.height>=b.y+b.height-.5;
const r9=m=>{const r=Math.abs((g(m,'rotation')||0)%90);return r<.5||r>89.5};
const po=p=>p.opacity===undefined?1:p.opacity;
const op=m=>{const f=g(m,'fills');if(!Array.isArray(f))return 0;for(let i=f.length-1;i>=0;i--){const p=f[i];if(p.visible===false||po(p)<.999||(p.blendMode&&p.blendMode!=='NORMAL'&&p.blendMode!=='PASS_THROUGH'))continue;if(p.type==='SOLID')return's';if(p.type==='IMAGE'&&p.scaleMode!=='FIT')return'i'}return 0};
function tv(U){const L=[],T=[],C=[],sh=U.k==='b';
 if(U.k==='l'){const m=U.n,e={i:0,end:0,m,bb:m.absoluteBoundingBox,v:!U.h&&!hid(m),z:U.z||zo(m),tr:-1,clip:null,mk:0};return{L:[e],T:[e],C}}
 const w=(m,v,z,tr,clip,mk,dp)=>{const i=L.length,bb=m.absoluteBoundingBox,vv=v&&!hid(m),zz=z||zo(m),o1=g(m,'opacity'),t=((o1!==undefined&&o1<1)||bl(m))?i:tr,e={i,m,bb,v:vv,z:zz,tr:t,clip,mk};L.push(e);
  if(m.type==='TEXT')T.push(e);
  else{if(i>0&&vv&&!zz&&bb&&CV.has(m.type)&&!g(m,'isMask')&&r9(m)){const o=op(m);if(o){e.o=o;e.er=I(bb,clip);C.push(e)}}
   if('children' in m&&(!sh||dp<1)){const cc=g(m,'clipsContent')&&bb?I(clip,bb):clip;let mc=cc,mm=mk;for(const c of m.children){if(g(c,'isMask')){mc=I(cc,c.absoluteBoundingBox);mm=(c.type==='RECTANGLE'||c.type==='FRAME')&&r9(c)?mk:2;w(c,false,zz,t,mc,mm,dp+1)}else w(c,vv,zz,t,mc,mm,dp+1)}}}
  e.end=L.length-1};
 w(U.n,!U.h,U.z,-1,null,0,0);return{L,T,C}}
const vp=a=>Array.isArray(a)&&a.some(p=>p.visible!==false&&po(p)>0);
const ev=(U,e,ub,C,L)=>{const m=e.m,ch=m.characters;if(!e.v)return'h';if(e.z)return'o';
 const sw=m.strokeWeight;if(!(m.fills===figma.mixed||vp(m.fills)||(vp(m.strokes)&&(typeof sw!=='number'||sw>0))))return'n';
 if(!ch.trim())return'e';if(!e.bb)return'f';if(U.k==='l')return'v';
 const r0=I(e.bb,ub);if(r0.e)return'f';const er=I(r0,e.clip);if(er.e)return'c';
 let u=e.mk===2;for(const c of C){if(c.i<=e.i)continue;if(c.tr>=0&&!(c.tr<e.i&&L[c.tr].end>=e.i))continue;if(K(c.er,er)){if(c.mk===2){u=true;continue}return c.o}}
 return u?'u':'v'};
const A='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',OF={2:300,3:100000,4:7000000},MX={2:3843,3:238327,4:14776335};
const E=(v,n)=>{let s='';for(let k=0;k<n;k++){s=A[v%62]+s;v=Math.floor(v/62)}return s};
const jl=s=>{let b=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c<32)b+=(c===10||c===9||c===13||c===8||c===12)?2:6;else if(c===34||c===92)b+=2;else if(c<128)b++;else if(c<2048)b+=2;else if(c>=55296&&c<56320){b+=4;i++}else b+=3}return b};
const nz=s=>s.replace(/\s+/g,' ').trim(),idn=id=>/^2:\d+$/.test(id)&&+id.slice(2)<238328?+id.slice(2):-1;
const O={v:5,kind:'R',h:[PID,CU+'.'+CT,'END',units.length,RU+'.'+RT,W],ts:-1,t:[],s:[],f:[],u:[],r:'',x:[],n:[],c:[],z:[0,0,0,0]};
const fI=new Map(),sS=new Set(),ta={};let by=300,rw=0;
out:for(let u=CU;u<units.length;u++){const U=units[u],nd=U.n,{L,T,C}=tv(U),ub=U.k==='l'?null:nd.absoluteBoundingBox;
 const un=U.k==='l'&&nz(nd.name)===nz(nd.characters)?'\u0001':nd.name;
 const rr=[],M=[2,2,2,2];
 for(const e of T){const b=e.bb||{x:0,y:0,width:0,height:0},q=[Math.round(b.x-(ub?ub.x:0)),Math.round(b.y-(ub?ub.y:0)),Math.round(b.width),Math.round(b.height)];rr.push(q);
  for(let j=0;j<4;j++){const o=j<2;while(M[j]<4&&((o?q[j]+OF[M[j]]:q[j])<0||(o?q[j]+OF[M[j]]:q[j])>MX[M[j]]))M[j]++}}
 let ur=null,pid=Math.max(idn(nd.id),0);
 for(let t=(u===CU?CT:0);t<T.length;t++){const e=T[t],m=e.m,ch=m.characters,rf=ev(U,e,ub,C,L),q=rr[t];
  let fam,sty;const fn=m.fontName;if(fn===figma.mixed){const F=[],S=[];for(const s of m.getStyledTextSegments(['fontName'])){if(!F.includes(s.fontName.family))F.push(s.fontName.family);if(!S.includes(s.fontName.style))S.push(s.fontName.style)}fam=F.join(' / ');sty=S.join(' / ')}else{fam=fn.family;sty=fn.style}
  const fs=m.fontSize,fk=fam+'|'+sty+'|'+(fs===figma.mixed?'*':Math.round(fs*100)/100);
  const mi=idn(m.id),d=mi-pid,ic=mi<0?'0000':(d>0&&d<62?A[d]:'0'+E(mi,3));
  let add=ic.length+M[0]+M[1]+M[2]+M[3]+3+W;let fi=fI.get(fk);const nf=fi===undefined;if(nf){fi=fI.size;add+=jl(fk)+3}
  const si=G.get(ch);const nm=nz(m.name)!==nz(ch);if(nm)add+=jl(m.name)+8;if(mi<0)add+=jl(m.id)+8;
  if(!ur){add+=jl(un)+44;if(!sS.has(U.si))add+=jl(secs[U.si][0])+12}
  if(by+add>LIM){O.h[2]=u+'.'+t;break out}
  by+=add;
  if(!ur){if(!sS.has(U.si)){sS.add(U.si);O.s.push(U.si+'|'+secs[U.si][1]+'|'+secs[U.si][0])}ur=[nd.id,ub?Math.round(ub.width):0,ub?Math.round(ub.height):0,U.si,U.k,U.ns,M.join(''),0,un];O.u.push(ur)}
  if(nf){fI.set(fk,fi);O.f.push(fk)}
  if(nm)O.n.push(rw+'|'+m.name);if(mi<0)O.x.push(rw+'|'+m.id);
  O.r+=ic+E(q[0]+OF[M[0]],M[0])+E(q[1]+OF[M[1]],M[1])+E(q[2],M[2])+E(q[3],M[3])+E(fi,2)+E(si,W)+rf;O.z[3]+=si*7+fi*3+rf.charCodeAt(0);
  if(mi>=0)pid=mi;ur[7]++;rw++;O.z[1]+=q[0]+q[1]+q[2]+q[3]}
 const k=U.si+','+U.k+','+U.ns+','+(T.length?1:0);ta[k]=(ta[k]||0)+1}
O.c=Object.entries(ta).map(([k,v])=>k+','+v);O.z[0]=rw;O.u=O.u.map(a=>a.join('|'));
return O;
```

Other rows calls changed only `PID`, `RU`, `RT`, `CU`, `CT` (the unit and text to start from). Calls before Paid Social R5 had `z:[0,0,0]` and no `;O.z[3]+=...` statement. The first rows call per page also set `TS` (first string not yet sent), started `O` with `ts:TS,t:TS>=0?GL.slice(TS):[]`, started the byte count with `let by=300+O.t.reduce((a,s)=>a+jl(s)+3,0)`, and set `O.z[2]=O.t.reduce((a,s)=>a+s.length,0)` before returning. v4 differs from v5 only in sending `nd.name` where v5 sends `un`, and in `v:4`. v3 differs from v4 in writing the font index as one character (`E(fi,1)`).

### 5c. Census (as run for Email, with the v1 and v2 cross-check)

The census script is the rows script's unit model and visibility functions (identical text, lines `const g=` through `const ev=` above, with `PID='0:1',VU=44,VT=16` in place of the walk constants), followed by:

```js
const cnt=secs.map(()=>({u0:0,u1:0,b0:0,b1:0,l0:0,l1:0,t:0,x:0}));let TT=0;
for(const U of units){const c=cnt[U.si];c[U.k+U.ns]++;const n=lt(U).length;TT+=n;if(n)c.t++;c.x+=n}
const S=secs.map((s,i)=>{const c=cnt[i];return i+'|'+s[1]+'|'+s[0]+'|'+[c.u0,c.u1,c.b0,c.b1,c.l0,c.l1,c.t,c.x].join(',')});
const K1=['(page)|'+page.children.filter(n=>FL.has(n.type)).length+'|'+page.children.filter(n=>n.type==='SECTION').length+'|'+page.children.filter(n=>n.type==='TEXT').length];
for(const n of page.children)if(n.type==='SECTION')K1.push(n.name+'|'+n.children.filter(c=>FL.has(c.type)).length+'|'+n.children.filter(c=>c.type==='SECTION').length+'|'+n.children.filter(c=>c.type==='TEXT').length);
let vr='',vz=0,vn=0;
if(VU>=0)for(let u=0;u<=VU&&u<units.length;u++){const U=units[u],{L,T,C}=tv(U),ub=U.k==='l'?null:U.n.absoluteBoundingBox;
 for(let t=0;t<T.length&&(u<VU||t<VT);t++){const e=T[t],b=e.bb||{x:0,y:0,width:0,height:0};vz+=Math.round(b.x-(ub?ub.x:0))+Math.round(b.y-(ub?ub.y:0))+Math.round(b.width)+Math.round(b.height);vr+=e.m.id+':'+ev(U,e,ub,C,L)+',';vn++}}
return{v:5,kind:'C',h:[PID,units.length,TT,secs.length],s:S,k1:K1,vn,vz,vr};
```

The Organic Social and Paid Social census calls ran the same unit model and the same section and K1 counts, without the visibility functions or the cross-check. The census totals agree with the checks in 5e: units holding text (Email 472, Organic Social 1,276, Paid Social 1,033) equal the unit hash counts, and units in total (512, 1,954, 1,182) equal the unit count in every rows-phase header.

### 5d. Independent text count (one call per page)

```js
// READ-ONLY: counts TEXT nodes on the page; creates, edits or renames nothing.
const page=await figma.getNodeByIdAsync('0:1');await figma.setCurrentPageAsync(page);
const T=page.findAllWithCriteria({types:['TEXT']});
return {page:'0:1',text_nodes:T.length,unique_ids:new Set(T.map(t=>t.id)).size};
```

### 5e. Verification against the file, and the string repair

The chunk checksums count rows, coordinates and UTF-16 length, so a character copied as another character of the same length passes them. Decoding then found duplicate entries in page string tables that, in the file, hold only distinct strings: invisible characters had changed in copying (for example a line separator U+2028 written as a newline, or a no-break space as a space). Read-only hash calls then compared the copied data with the file. Every hash is 32-bit FNV-1a over UTF-16 code units, with one separator step after each record, taken over blocks of 20 records and written in base 36; `_work/strcheck.py` computes the same hash in Python.

1. String tables: block hashes of each page's string table in table order, and of the characters of the 432 Email v1 and v2 rows (`_raw/strcheck.json`).
2. Per-string hashes inside each block that failed (`_raw/strcheck_per.json`), which located 188 strings (`_raw/strcheck_bad.json`): Email 38 table strings and 7 v1 or v2 rows, Organic Social 110, Paid Social 33. Inside them: 301 line separators U+2028, 167 no-break spaces, 6 word joiners U+2060, 3 zero-width joiners, 1 zero-width space.
3. Repair: those 188 strings were read again with every character outside printable ASCII, and the backslash, written as a `\uXXXX` escape, so that nothing invisible could change in copying (`_raw/fix_*.json`). `_work/applyfix.py` decodes them and checks each against its per-string hash before use (188 of 188 match), and `_work/build.py` asserts that every string-table block then matches.
4. End to end, after the repair: block hashes over every row (text id, reason code, font key, x, y, w, h, characters; `_raw/rowcheck.json`), every unit holding text (id, kind, nesting, frame width and height, section path, text count; `_raw/unitcheck.json`) and every name the TSVs carry (unit names, layer names that differ from their text, section paths; `_raw/namecheck.json`). `_work/rowcheck.py`, `unitcheck.py` and `namecheck.py` rebuild the same records from the decoded data, and `_work/build.py` asserts every block before it writes anything. Every block matches on all three pages (counts.md, verification table). The remaining columns (`channel`, `page`, `flags`) are derived from verified values.

The hash helper, identical in every check, as run:

```js
const fnv=(h,s)=>{for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}h^=0;h=Math.imul(h,16777619)>>>0;return h};
const blk=L=>{const o=[];for(let i=0;i<L.length;i+=B){let h=0x811c9dc5;for(let j=i;j<Math.min(i+B,L.length);j++)h=fnv(h,L[j]);o.push(h.toString(36))}return o.join(',')};
```

Steps 1 to 3 ran the unit model of 5a and differ from it only in their last lines. Their full text was not kept in this lane's working context, so only their distinctive parts are given: step 1 returned `{page,n,tb,rn,rb}`, with `tb` the helper over the page table; step 2 hashed each string alone with the same steps (`const fnv=s=>{let h=0x811c9dc5; ... return h.toString(36)}`) and returned `per=(L,bl)=>bl.map(b=>b+':'+L.slice(b*B,b*B+B).map(fnv).join(','))` for the failed blocks; step 3 escaped with the line below, paged from `START` with `LIM=19000`, and returned `{page,n,next,s}`.

```js
const esc=s=>{let o='';for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);o+=(c<32||c>126||c===92)?'\\u'+c.toString(16).padStart(4,'0'):s[i]}return o};
```

Step 4, as run for Email; the Organic Social and Paid Social calls changed only `PID`. Each call starts with these lines (the comment names the check: row, unit or name):

```js
// Lane A row check. READ-ONLY: reads node properties only; creates, edits or renames nothing.
const PID='0:1',B=20;
const page=await figma.getNodeByIdAsync(PID);await figma.setCurrentPageAsync(page);
```

Row check: then the lines of 5b from `const g=` through `const ev=`, leaving out `lt`, `G`, `GL` and `W`, then the helper, then:

```js
const R=[];
for(const U of units){const nd=U.n,{L,T,C}=tv(U),ub=U.k==='l'?null:nd.absoluteBoundingBox;
 for(const e of T){const m=e.m,b=e.bb||{x:0,y:0,width:0,height:0},q=[Math.round(b.x-(ub?ub.x:0)),Math.round(b.y-(ub?ub.y:0)),Math.round(b.width),Math.round(b.height)],rf=ev(U,e,ub,C,L);
  let fam,sty;const fn=m.fontName;if(fn===figma.mixed){const F=[],S=[];for(const s of m.getStyledTextSegments(['fontName'])){if(!F.includes(s.fontName.family))F.push(s.fontName.family);if(!S.includes(s.fontName.style))S.push(s.fontName.style)}fam=F.join(' / ');sty=S.join(' / ')}else{fam=fn.family;sty=fn.style}
  const fs=m.fontSize,fk=fam+'|'+sty+'|'+(fs===figma.mixed?'*':Math.round(fs*100)/100);
  R.push(m.id+'\u0000'+rf+'\u0000'+fk+'\u0000'+q.join(',')+'\u0000'+m.characters)}}
return{page:PID,n:R.length,rb:blk(R)};
```

Unit check: then the lines of 5a from `const g=` through `const lt=`, then the helper, then:

```js
const Q=[];
for(const U of units){const n=lt(U).length;if(!n)continue;const ub=U.k==='l'?null:U.n.absoluteBoundingBox;
 Q.push(U.n.id+'\u0000'+U.k+U.ns+'\u0000'+(ub?Math.round(ub.width):0)+','+(ub?Math.round(ub.height):0)+'\u0000'+secs[U.si][0]+'\u0000'+n)}
return{page:PID,n:Q.length,qb:blk(Q)};
```

Name check: then the lines of 5a from `const g=` through `const lt=`, then `const nz=s=>s.replace(/\s+/g,' ').trim();`, then the helper, then:

```js
const UN=[],LN=[],SI=new Set();
for(const U of units){const T=lt(U);if(!T.length)continue;SI.add(U.si);if(U.k!=='l')UN.push(U.n.id+'\u0000'+U.n.name);for(const t of T)if(nz(t.name)!==nz(t.characters))LN.push(t.id+'\u0000'+t.name)}
const SN=[...SI].map(i=>secs[i][0]).sort();
return{page:PID,un:UN.length,ub:blk(UN),ln:LN.length,lb:blk(LN),sn:SN.length,sb:blk(SN)};
```

### 5f. Website (v6): escaped and hashed at the source

Website was walked after the repair in 5e, with two changes, so that copying through the model's context cannot alter a character unnoticed.

1. Escaped at the source. Every string a v6 script returns (page-table strings, section paths, unit and layer names, font keys, ids) comes back as printable ASCII: each UTF-16 code unit outside 0x20 to 0x7E, and each percent sign, double quote, single quote, backtick and backslash, is written as `%u` and four lowercase hex digits. JSON serialization then has nothing to escape, so a stored v6 chunk holds no backslash and no byte outside printable ASCII. `decode.load` checks both properties and reverses the escape, so a line separator U+2028 stays U+2028 and a no-break space stays a no-break space.
2. Hashed at the source. Each chunk carries, in `hb` with record counts in `hn`, the 5e block hashes of its own records, computed by the walk over the original strings: a strings chunk hashes its strings in table order; a rows chunk hashes the row records of the 5e row check, the unit records of the unit check (text count within the chunk), and the unit names, differing layer names and section paths of the name check; the census hashes its section and K1 records. `_work/chunkcheck.py` rebuilds the same records from the decoded chunk (`rowcheck.key`, `unitcheck.units`, `namecheck.lists`) and compares them. Each chunk was stored in `_raw` and checked before the next one was read. Every chunk matched on its first read, so nothing was re-read and no data was edited by hand.

Calls, in order: census (`census_web.json`; 5c's census lines without the visibility functions or the cross-check), the 5d count (`web_count.json`: 1,398 text nodes, 1,398 unique ids), strings S1 (`web_S1.json`: all 197 page-table strings, 8,637 UTF-16 code units, 10 hash blocks), rows R1 to R3 (`web_R1.json` 677 rows, `web_R2.json` 572, `web_R3.json` 149; split at unit.text 25.36 and 64.11; 71 row hash blocks in all). One further read-only call, without hashes and not stored, read `clipsContent` of the 43 frames that hold off-frame text and the children of the one board (section 6). The unit model and the visibility logic are those of 5a and 5b, unchanged.

All three v6 scripts add these lines after the unit model (`B=20` is added to the constants line):

```js
const X=s=>{let o='';for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);o+=(c<32||c>126||c===34||c===37||c===39||c===92||c===96)?'%u'+c.toString(16).padStart(4,'0'):s[i]}return o};
const fnv=(h,s)=>{for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}h^=0;h=Math.imul(h,16777619)>>>0;return h};
const blk=L=>{const o=[];for(let i=0;i<L.length;i+=B){let h=0x811c9dc5;for(let j=i;j<Math.min(i+B,L.length);j++)h=fnv(h,L[j]);o.push(h.toString(36))}return o.join(',')};
```

Strings phase: 5a with `PID='2:182972'`, and its last two lines replaced by:

```js
const t=[];let by=300,i=SS,ch=0;for(;i<GL.length;i++){const a=X(GL[i]).length+3+(t.length%B===0?8:0);if(by+a>LIM)break;by+=a;t.push(GL[i]);ch+=GL[i].length}
return{v:6,kind:'S',h:[PID,RU+'.'+RT,SS,i,GL.length,W],t:t.map(X),z:[t.length,ch],hb:{t:blk(t)},hn:[t.length]};
```

Census: 5c's lines from `const cnt=` through the `K1` loop, then:

```js
return{v:6,kind:'C',h:[PID,units.length,TT,secs.length],s:S.map(X),k1:K1.map(X),hb:{s:blk(S),k1:blk(K1)},hn:[S.length,K1.length]};
```

Rows phase: 5b (v5) with these changes. Constants `const PID='2:182972',RU=0,RT=0,CU=0,CT=0,TS=-1,LIM=19600,B=20;` (R2: `CU=25,CT=36`; R3: `CU=64,CT=11`; `TS=-1` throughout, since S1 held the whole table). `jl` is replaced by `const xl=s=>X(s).length;`, and every byte estimate uses `xl`. `O` starts with `v:6` and `ts:TS,t:TS>=0?GL.slice(TS):[]`. The byte count starts at `let by=450+O.t.reduce((a,s)=>a+xl(s)+3,0)+Math.ceil(O.t.length/B)*8` and reserves 8 bytes for each new hash block: `+(rw%B===0?8:0)` per row, `+(LN.length%B===0?8:0)` per differing layer name, `+(O.u.length%B===0?16:0)` per unit and `+(sS.size%B===0?8:0)` per section. `R` and `LN` are declared with `fI`. Per row, a differing layer name is also pushed as `LN.push(m.id+'\u0000'+m.name)`, and the row record as `R.push(m.id+'\u0000'+rf+'\u0000'+fk+'\u0000'+q.join(',')+'\u0000'+ch)`. The last lines are:

```js
O.c=Object.entries(ta).map(([k,v])=>k+','+v);O.z[0]=rw;O.z[2]=O.t.reduce((a,s)=>a+s.length,0);
const Q=O.u.map(a=>a[0]+'\u0000'+a[4]+a[5]+'\u0000'+a[1]+','+a[2]+'\u0000'+secs[a[3]][0]+'\u0000'+a[7]);
const UN=O.u.filter(a=>a[4]!=='l').map(a=>a[0]+'\u0000'+a[8]);
const SN=[...new Set(O.u.map(a=>a[3]))].map(i=>secs[i][0]).sort();
O.hb={t:blk(O.t),r:blk(R),q:blk(Q),u:blk(UN),l:blk(LN),s:blk(SN)};O.hn=[O.t.length,R.length,Q.length,UN.length,LN.length,SN.length];
O.u=O.u.map(a=>X(a.join('|')));O.t=O.t.map(X);O.s=O.s.map(X);O.f=O.f.map(X);O.n=O.n.map(X);O.x=O.x.map(X);
return O;
```

`_work/build.py` re-runs `chunkcheck.py` on the strings chunk, the census and every rows chunk, and asserts that the page table has the length the strings chunk reports, before it writes anything. `z3check.py` also passes on all three rows chunks.

## 6. What could not be determined

- Image transparency. An image fill at full paint opacity counts as opaque; pixel alpha is not readable through these scripts. Text buried by an image (Email 4, Organic Social 64, Paid Social 228, Website 17, flag `cover=image` in `excluded.tsv`) may show through transparent areas of a cut-out PNG. Screenshots of a sample would settle it; not done (budget).
- Rendered case and truncation. `characters` is the stored text. A `textCase` setting (upper, lower, title, small caps) changes what a viewer sees without changing `characters`, and text truncation or a line limit can cut what shows. Neither property was read.
- Legibility. Text in the same color as what lies behind it, text behind effects (blurs, shadows), and partly covered text all count as visible.
- Covers across frames. Overlapping separate frames on the canvas are not tested against each other.
- Board detection is a size heuristic (section 2). It found 3 boards on Email, 117 on Organic Social, 16 on Paid Social and 1 on Website. A frame that holds deliverables but fails the size test is walked as one deliverable, and a deliverable that happens to hold two deliverable-sized children is walked as a board. Board names are in `section_path` for review.
- Working notes. Visible means visible on the canvas under the rules above. Planning notes, request briefs, captions and placeholder text (for example "Lorem ipsum" and "Text will be here") that sit visibly on the canvas are included. They concentrate in rows flagged `loose_text` and `board_text`; no note heuristic was applied.
- Counts of frames that hold no text (counts.md sections 1, 3 and 4) are integers copied from the census calls and are not covered by the hashes in 5e; their page totals agree with the rows phase (5c). The Website census carries its own source hashes (5f), which match.
- A hash match is strong evidence, not proof: two different records can share a 32-bit hash. For any one block, the chance that a copying error goes unnoticed is about 1 in 4 billion.

Where the Website page does not fit the unit model or the visibility rules. The written rules were applied unchanged; these are listed for review, not resolved.

- A page comp walked as a board. One desktop homepage comp, D_HP_V1 (2:185247, 1440 x 902), passes the board test because two of its children are 1440 x 760 instances (1.89:1, within 2.5% of 1.91:1) placed side by side (x 0 and 1442). Its six frame-like children became nested units (three hold text: Component 111, D_Get Started, Component 113) and its one direct text, " Find Your Match", is board text. The other 27 frames named D_HP_V1 that hold text are single units.
- The board's clip is not applied to its children. Board children are walked as units with their own boxes, and a unit's clip region starts at the unit (section 3, rule 5). D_Get Started sits at y = -1720 inside that board, outside the board's box, and the board has `clipsContent` true, so its 8 texts do not show on the canvas, yet they count visible by the rule. The rows are in `corpus-visible-web.tsv` with flag `nested` under section `(page) / [board] D_HP_V1`.
- Repeated off-frame component. 369 of the 1,398 text nodes are off_frame, none of them clipped_or_masked. 312 of these are the same 8 texts, in 39 instances of that D_Get Started block, placed about 1,100 to 1,800 px above each of 39 desktop comps (6 D_PDP, 6 "Channeling this design", 27 D_HP_V1). The other 57 lie below (34) or to the right (23) of their frame. All 43 frames that hold off-frame text have `clipsContent` true, so for these rows the rule agrees with what the canvas shows. The 8 strings are about picture framing (for example "What do you want to frame?"); no note heuristic was applied.
- Very tall and viewport-height comps. A whole page is one frame unit: three D_PDP comps at 1440 x 4980 and mobile comps from 375 x 950 to 375 x 4244, so a frame in `corpus-visible-web.tsv` is a page comp, not a module, and x, y are relative to the top of the page. Other desktop comps are cut to a viewport (1440 x 902, 1440 x 910, 1440 x 794); text below their bottom edge is off_frame.
- Breakpoint variants. Desktop comps (1440 wide: 43 units holding text, counting the board and its 3 nested units) and mobile comps (375 wide: 15 units) of the same pages are separate units, and no rule pairs a desktop comp with its mobile variant, so copy that appears at both breakpoints is counted at each.
- Repeated components and iterations. 595 of the 1,398 text nodes (43%) sit inside instances (text ids beginning with `I`). Header and navigation strings repeat in most comps (for example "Free shipping over $150" in 49 visible text nodes), and the 28 frames named D_HP_V1 that hold text (27 frames and the board) share one name and size, 1440 x 902. Instances and iterations are walked like any other node, so the line counts in `counts.md` section 5 count repeats, not distinct placements in one final design.

## 7. Not walked

- Components (2:31579, 53 text nodes), Retail/Press (2:33120, 1,287), Print (2:35751, 20), Inspiration (2:35848, 0) and Images (2:31298, 85) are not walked, by the client lead's ruling of 2026-10-18. `corpus-visible-other.tsv` was not written.
- Website (2:182972, 1,398 text nodes), listed here in the first version of this file, was walked later the same day (section 5f).

## 8. Files

- `corpus-visible-email.tsv`, `corpus-visible-social.tsv`, `corpus-visible-paid.tsv`, `corpus-visible-web.tsv`: visible text nodes, one row each.
- `excluded.tsv`: every other text node on the four pages, with `reason` (Website rows last).
- `counts.md`: counts, the verification table and the comparison with Chat 1.
- `_raw/`: the verbatim chunks returned by the walk (strings `*_S*.json`, rows `*_R*.json` and `email_01/02.json`, census `census_*.json`); the hashes computed in the file (`strcheck.json`, `strcheck_per.json`, `strcheck_bad.json`, `rowcheck.json`, `unitcheck.json`, `namecheck.json`); the escaped re-reads (`fix_*.json`); for Website, the v6 chunks `census_web.json`, `web_S1.json` and `web_R1.json` to `web_R3.json` (escaped, each carrying its source hashes) and the 5d count `web_count.json`.
- `_work/`: `decode.py` (chunk decoder; `load` checks and reverses the v6 escape), `z3check.py` (index checksum), `strcheck.py` (the hash in Python and the string-table check), `applyfix.py` (decodes and checks the re-read strings), `rowcheck.py`, `unitcheck.py` and `namecheck.py` (rebuild the hashed records from the decoded data; the last two read chunks through `decode.load`), `chunkcheck.py` (checks a v6 chunk against its source hashes), `build.py` (applies the repair, asserts every hash, the Website source hashes included, writes the TSVs and `counts.md`), `escape_counts.json` (escapes written in all TSV columns), `web_sha256_before.txt` and `web_sha256_after.txt` (sha256 of the outputs before and after the Website rebuild).

## 9. Budget

The brief asked for spend near 400K tokens. Every row had to pass through the model's context twice (read from the connector, then copied into a file), and the three pages hold 11,576 text nodes and 3,289 page-table strings (3,182 distinct across the three pages). The lane used about 1.8 million tokens, roughly 4.5 times the target; about 0.4 million of that went to the string repair and the checks in 5e. Following the brief's order, Email, Organic Social and Paid Social were finished in full and the remaining pages were left (section 7).

Website was walked later the same day against a target of about 0.25M tokens: 1,398 text nodes in six stored calls (census, count, one strings chunk, three rows chunks) plus the unhashed clip check. Every chunk matched its source hashes on its first read, so nothing was re-read or repaired, and after the rebuild the three earlier TSVs are byte-identical and the earlier rows of `excluded.tsv` are unchanged. Estimated spend for that call: about 0.34M tokens, of which roughly 0.09M was fixed session context; most of the rest was the three rows chunks (about 20 KB each), each passing through the model's context twice.
