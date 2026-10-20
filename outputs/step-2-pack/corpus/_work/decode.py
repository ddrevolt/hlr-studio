# Decodes the compact chunks returned by the read-only Figma walk into row dicts.
import json, glob, os, sys, re
# v6 chunks (Website) are escaped at the source: every UTF-16 code unit outside 0x20..0x7E, and % " ' ` \\, is sent as %u plus four hex digits.
PU=re.compile(r'%u([0-9a-f]{4})')
def unesc(s):
    assert all(32<=ord(c)<=126 for c in s) and not any(c in s for c in '"\'`\\'), ('not source-escaped', s[:40])
    assert '%' not in PU.sub('', s), ('stray percent', s[:40])
    t=PU.sub(lambda m: chr(int(m.group(1),16)), s)
    return t.encode('utf-16-le','surrogatepass').decode('utf-16-le')
def _un(o):
    if isinstance(o,str): return unesc(o)
    if isinstance(o,list): return [_un(v) for v in o]
    if isinstance(o,dict): return {k:_un(v) for k,v in o.items()}
    return o
def load(p):
    # Loads a chunk; a v6 chunk is unescaped (earlier versions are returned as stored).
    d=json.load(open(p,encoding='utf-8'))
    return _un(d) if isinstance(d,dict) and d.get('v',0)>=6 else d
A='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
OF={2:300,3:100000,4:7000000}
RS={'v':('visible',''),'u':('visible','unresolved'),'h':('hidden',''),'o':('zero_opacity',''),'n':('zero_opacity','no_visible_paint'),
    'e':('empty',''),'f':('off_frame',''),'c':('off_frame','clipped_or_masked'),'i':('buried','cover=image'),'s':('buried','cover=solid')}
def b62(s):
    v=0
    for ch in s: v=v*62+A.index(ch)
    return v
def u16(s): return len(s.encode('utf-16-le'))//2
def load_strings(raw, page):
    # v3 page-global string tables, concatenated in order of sstart
    out=[]
    for p in sorted(glob.glob(os.path.join(raw,'*.json'))):
        d=load(p)
        if d.get('v') in (3,6) and d.get('kind')=='S' and d['h'][0]==page:
            out.append((d['h'][2],d['t'],p,d['z']))
    out.sort(key=lambda t:t[0]); tab=[]
    for st,t,p,z in out:
        assert st==len(tab),('string gap',p,st,len(tab))
        assert z[0]==len(t) and z[1]==sum(u16(s) for s in t),('string checksum',p)
        tab.extend(t)
    return tab
def decode(p, gstr=None):
    d=load(p); v=d['v']
    secs={int(s.split('|',2)[0]):(int(s.split('|',2)[1]),s.split('|',2)[2]) for s in d['s']}
    fonts=[f.split('|') for f in d['f']]
    strs=d['t'] if v<3 else gstr
    W=2 if v<3 else d['h'][5]
    xs={int(a.split('|',1)[0]):a.split('|',1)[1] for a in d['x']}
    ns={int(a.split('|',1)[0]):a.split('|',1)[1] for a in d['n']}
    r=d['r']; pos=0; rows=[]; rw=0; csum=0
    for urec in d['u']:
        uid,w,h,si,k,nest,mode,nr,name=urec.split('|',8)
        M=[int(mode)]*4 if v==1 else [int(c) for c in mode]
        prev=int(uid[2:]) if uid.startswith('2:') and uid[2:].isdigit() else 0
        for _ in range(int(nr)):
            if v==1:
                n=b62(r[pos:pos+3]); pos+=3
                tid=xs[rw] if rw in xs else '2:%d'%n
            else:
                c=r[pos]
                if c=='0':
                    n=b62(r[pos+1:pos+4]); pos+=4
                    if rw in xs: tid=xs[rw]
                    else: tid='2:%d'%n; prev=n
                else:
                    n=prev+A.index(c); pos+=1; tid='2:%d'%n; prev=n
            q=[]
            for j in range(4):
                val=b62(r[pos:pos+M[j]]); pos+=M[j]
                q.append(val-OF[M[j]] if j<2 else val)
            if v>=4: fi=b62(r[pos:pos+2]); pos+=2
            else: fi=A.index(r[pos]); pos+=1
            sidx=b62(r[pos:pos+W]); pos+=W
            rc=r[pos]; pos+=1
            ch=strs[sidx]
            reason,flag=RS[rc]
            fam,sty,size=fonts[fi]
            rows.append(dict(page=d['h'][0],section_path=secs[int(si)][1],section_depth=secs[int(si)][0],frame_id=uid,frame_name=(None if (v>=5 and k=='l' and name=='\x01') else name),
                frame_w=int(w),frame_h=int(h),kind=k,nested=nest,text_id=tid,layer_name=ns.get(rw),characters=ch,
                font_family=fam,font_style=sty,font_size='' if size=='*' else size,x=q[0],y=q[1],w=q[2],h=q[3],reason=reason,flag=flag,chunk=os.path.basename(p)))
            csum+=sum(q); rw+=1
    assert pos==len(r),('row string length mismatch',p,pos,len(r))
    assert rw==d['z'][0] and csum==d['z'][1],('row checksum',p,rw,csum,d['z'])
    if v<3: assert d['z'][2]==sum(u16(s) for s in d['t']),('string checksum',p)
    return d,rows
if __name__=='__main__':
    for p in sys.argv[1:]:
        d,rows=decode(p); print(os.path.basename(p),'ok',len(rows),d['h'])
