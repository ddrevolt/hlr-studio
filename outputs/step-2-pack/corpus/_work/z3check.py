# Recomputes the z[3] checksum (string index*7 + font index*3 + reason code) from a v5 row chunk.
import json, sys
A='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
def b(s):
    v=0
    for c in s: v=v*62+A.index(c)
    return v
d=json.load(open(sys.argv[1])); r=d['r']; pos=0; z3=0; rows=0; W=d['h'][5]
for u in d['u']:
    p=u.split('|',8); M=[int(c) for c in p[6]]
    for k in range(int(p[7])):
        pos+=4 if r[pos]=='0' else 1
        pos+=sum(M)
        fi=b(r[pos:pos+2]); pos+=2; si=b(r[pos:pos+W]); pos+=W; rf=r[pos]; pos+=1
        z3+=si*7+fi*3+ord(rf); rows+=1
print('rows',rows,'end',pos,len(r),'z3',z3,'expected',d['z'][3] if len(d['z'])>3 else None)
