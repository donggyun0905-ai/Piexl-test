# 파일마다 가져온 피해 함수를 srcFn으로 묶는 일괄 변환 (docs/DMG_SRC.md): packages/shared/src/sim 에서 python3 ../../../../scripts/dev/bind-dmg-src.py
import re,glob,os
MAXB=14*1024
GENERIC={'combat','projectiles','pending','status','statusHit','util','dmgSrc','pvpRecap','player','s2Kit','index','run'}
def isKit(n): return n in GENERIC or n.endswith('Kit')
files=sorted(f for f in glob.glob('./*.ts') if not f.endswith('.test.ts') and 'TestUtil' not in f)
name=lambda f: os.path.basename(f)[:-3]
srcs={name(f):open(f,encoding='utf-8').read() for f in files}
PRIM={'damageEnemy','damageEnemyLite','blastAt','statusHit'}
# 도우미 파일(…Kit·s2Kit)이 내보내는 함수 중 피해를 주는 것
helpers={k:set() for k in srcs}
helpers['combat']={'damageEnemy','blastAt'}; helpers['statusHit']={'statusHit'}
def exports(src):
    out={}
    for m in re.finditer(r'export (?:function|const) (\w+)',src):
        st=m.end(); nx=re.search(r'\nexport |\n(?:function|const) \w+',src[st:]); out[m.group(1)]=src[st:st+(nx.start() if nx else len(src))]
    return out
kitExports={k:exports(v) for k,v in srcs.items() if isKit(k)}
known=set(PRIM)
changed=True
while changed:
    changed=False
    cr=re.compile(r'\b('+'|'.join(sorted(known))+r')\(')
    for k,ex in kitExports.items():
        for fn,body in ex.items():
            if fn not in helpers[k] and fn not in ('hasPerk','addEffect') and cr.search(body):
                helpers[k].add(fn); known.add(fn); changed=True
done=[];skipped=[]
IMP=re.compile(r'^import \{([^}]*)\} from "\./(\w+)";',re.M|re.S)
for f in files:
    n=name(f)
    if isKit(n): continue
    src=srcs[n]
    if 'srcFn(' in src: continue
    binds=[]
    def rep(m):
        mod=m.group(2)
        if mod not in helpers or not helpers[mod]: return m.group(0)
        parts=[]
        for x in m.group(1).split(','):
            raw=x; x=x.strip()
            if not x: continue
            if x.startswith('type '): parts.append(x); continue
            orig,_,local=x.partition(' as '); local=local or orig
            if orig in helpers[mod] and re.search(r'\b'+local+r'\(',src):
                binds.append(local); parts.append(f'{orig} as {local}_')
            else: parts.append(x)
        return 'import { '+', '.join(parts)+f' }} from "./{mod}";'.replace('}}','}')
    out=IMP.sub(rep,src)
    if not binds: continue
    last=[m for m in re.finditer(r'^import [^;]*;\n',out,re.M|re.S)][-1]
    line='import { srcFn } from "./dmgSrc";\nconst '+', '.join(f'{b} = srcFn("{n}", () => {b}_)' for b in binds)+';\n'
    if 'from "./dmgSrc";' in out:
        out=re.sub(r'import \{ ([^}]*) \} from "\./dmgSrc";',lambda m:'import { '+m.group(1)+', srcFn } from "./dmgSrc";',out,count=1)
        last=[m for m in re.finditer(r'^import [^;]*;\n',out,re.M|re.S)][-1]
        line=line.split('\n',1)[1]
    out=out[:last.end()]+line+out[last.end():]
    if len(out.encode())>MAXB or out.count('\n')>300: skipped.append(n); continue
    open(f,'w',encoding='utf-8').write(out); done.append(n)
print('bound',len(done),'skipped(size)',skipped)
open('/tmp/claude-0/-home-user/85066e83-4af0-5d99-8fa5-ede2b5cd6e6c/scratchpad/bound.txt','w').write('\n'.join(f"{n} | {srcs[n].splitlines()[0][:170]}" for n in done))
