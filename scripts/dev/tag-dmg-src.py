# 패시브 구간에 srcRun을 씌우는 일괄 변환: python3 tag.py [건너뛸 "파일:시작위치" 목록 파일]
import re,glob,sys,json,os
SIM='.'
MAXB=14*1024
skip=set(json.load(open(sys.argv[1]))) if len(sys.argv)>1 and os.path.exists(sys.argv[1]) else set()
files=sorted(f for f in glob.glob(SIM+'/**/*.ts',recursive=True) if not f.endswith('.test.ts') and 'TestUtil' not in f and not f.endswith('/dmgSrc.ts'))

def mask(src):
    out=list(src); i=0; n=len(src)
    def blank(a,b):
        for k in range(a,b):
            if out[k]!='\n': out[k]=' '
    while i<n:
        c=src[i]
        if src.startswith('//',i):
            j=src.find('\n',i); j=n if j<0 else j; blank(i,j); i=j
        elif src.startswith('/*',i):
            j=src.find('*/',i+2); j=n if j<0 else j+2; blank(i,j); i=j
        elif c in '"\'':
            j=i+1
            while j<n and src[j]!=c:
                j+=2 if src[j]=='\\' else 1
            blank(i+1,j); i=j+1
        elif c=='`':
            j=i+1; d=0
            while j<n and not (src[j]=='`' and d==0):
                if src[j]=='\\': j+=2; continue
                if src.startswith('${',j): d+=1; j+=2; continue
                if src[j]=='}' and d>0: d-=1
                j+=1
            blank(i+1,j); i=j+1
        else: i+=1
    return ''.join(out)

def match(m,i,o,c):
    d=0
    for j in range(i,len(m)):
        if m[j]==o: d+=1
        elif m[j]==c:
            d-=1
            if d==0: return j
    return -1

srcs={f:open(f,encoding='utf-8').read() for f in files}
masks={f:mask(s) for f,s in srcs.items()}
# 피해를 주는 함수 이름 (이름으로만 이어 봄)
defs={}
for f,m in masks.items():
    for mm in re.finditer(r'\bfunction\s+(\w+)\s*(?:<[^>(]*>)?\(',m):
        p=match(m,mm.end()-1,'(',')'); b=m.find('{',p)
        if p<0 or b<0: continue
        e=match(m,b,'{','}')
        if e>0: defs.setdefault(mm.group(1),[]).append(m[b:e])
    for mm in re.finditer(r'\bconst\s+(\w+)\s*=\s*(?:<[^>(]*>)?\([^()]*\)\s*(?::[^=]+)?=>\s*',m):
        e=m.find('\n',mm.end()); defs.setdefault(mm.group(1),[]).append(m[mm.end():e] if m[mm.end()]!='{' else m[mm.end():match(m,mm.end(),'{','}')])
dmg={'damageEnemy','damageEnemyLite','blastAt','dotDamage','statusHit','logDmg'}
PUSH=re.compile(r'projectiles\.push\(|pendingBlasts\.push\(')
changed=True
callre=lambda names: re.compile(r'\b('+'|'.join(sorted(names))+r')\(')
for name,bodies in defs.items():
    if any(PUSH.search(b) for b in bodies): dmg.add(name)
while changed:
    changed=False; cr=callre(dmg)
    for name,bodies in defs.items():
        if name not in dmg and any(cr.search(b) for b in bodies): dmg.add(name); changed=True
for bad in ('hasPerk','addEffect','roll','recalcStats','healPlayer'): dmg.discard(bad)
CR=callre(dmg)
HP=re.compile(r'(!?)\s*hasPerk\(\s*[\w.]+\s*,\s*"(\w+)"\s*\)')
BADKW=re.compile(r'\b(return|continue|break|yield|await|arguments|this)\b')
stats={'A':0,'B':0}; report={}
for f in files:
    src=srcs[f]; m=masks[f]; edits=[]  # (pos,del_len,insert,sitekey)
    # 함수 범위 (B용)
    funcs=[]
    for mm in re.finditer(r'\bfunction\s+\w+\s*(?:<[^>(]*>)?\(',m):
        p=match(m,mm.end()-1,'(',')')
        if p<0: continue
        b=m.find('{',p)
        if b<0 or not re.fullmatch(r'\s*:\s*void\s*',m[p+1:b]): continue
        e=match(m,b,'{','}')
        pre=m[max(0,mm.start()-8):mm.start()]
        if e>0 and 'async' not in pre and '*' not in m[mm.start():mm.end()]: funcs.append((b,e,m[mm.end():p]))
    doneB=set()
    for mm in re.finditer(r'\bif\s*\(',m):
        o=mm.end()-1; c=match(m,o,'(',')')
        if c<0: continue
        cond=m[o+1:c]; hs=HP.findall(src[o+1:c])
        if len(hs)!=1 or len(HP.findall(cond.replace(' ','')))>1: continue
        neg,pid=hs[0]
        key=f'{f}:{mm.start()}'
        if key in skip: continue
        j=c+1
        while m[j] in ' \t': j+=1
        if not neg:
            if '||' in cond or '?' in cond: continue
            # 단독 항으로 && 로만 이어져야 함
            if re.search(r'\belse\s*$',m[max(0,mm.start()-8):mm.start()]): continue
            if m[j]=='{':
                e=match(m,j,'{','}')
                if e<0: continue
                body=m[j+1:e]; after=m[e+1:e+12]
                if re.match(r'\s*else\b',after) or BADKW.search(body) or not CR.search(body) or not re.search(r'\(s[,)]',body): continue
                edits.append((j,1,f'srcRun(s, "{pid}", () => {{',key)); edits.append((e,1,'});',key)); stats['A']+=1
            else:
                if m[j]=='\n' or re.match(r'(for|while|if|switch|try|do|const|let|var|throw)\b',m[j:]): continue
                # 문장 끝 ; 찾기 (괄호 균형)
                d=0;e=-1
                for k in range(j,len(m)):
                    ch=m[k]
                    if ch in '([{': d+=1
                    elif ch in ')]}':
                        d-=1
                        if d<0: break
                    elif ch==';' and d==0: e=k;break
                if e<0: continue
                body=m[j:e]; after=m[e+1:e+12]
                if re.match(r'\s*else\b',after) or BADKW.search(body) or not CR.search(body) or not re.search(r'\(s[,)]',body) or '=>' in body and '\n' in body: continue
                edits.append((j,0,f'srcRun(s, "{pid}", () => ',key)); edits.append((e,0,')',key)); stats['A']+=1
        else:
            if '&&' in cond or '?' in cond: continue
            mr=re.match(r'return\s*;',m[j:])
            if not mr: continue
            fn=next(((b,e,ps) for b,e,ps in funcs if b<mm.start()<e),None)
            if not fn or fn[0] in doneB: continue
            b,e,ps=fn
            # 함수 맨 바깥 단계여야 함
            depth=m[b:mm.start()].count('{')-m[b:mm.start()].count('}')
            if depth!=1 or not re.search(r'\bs\s*:',ps): continue
            rest=m[j+mr.end():e]
            if not CR.search(rest) or re.search(r'\b(yield|await|arguments|this)\b',rest) or re.search(r'\breturn\s+[^;\s]',rest): continue
            doneB.add(b)
            edits.append((j+mr.end(),0,f' return srcRun(s, "{pid}", () => {{',key)); edits.append((e,0,'}); ',key)); stats['B']+=1
    if not edits: continue
    # 겹침 없이 뒤에서부터 적용 · 크기 넘으면 뒤쪽 자리부터 뺌
    keys=[]
    for e in edits:
        if e[3] not in keys: keys.append(e[3])
    while True:
        out=src
        for pos,dl,ins,k in sorted([e for e in edits if e[3] in keys],key=lambda x:-x[0]):
            out=out[:pos]+ins+out[pos+dl:]
        imp='import { srcRun } from "./dmgSrc";\n' if f.count('/')==1 else 'import { srcRun } from "'+'../'*(f.count('/')-1)+'dmgSrc";\n'
        i=out.index('\nimport ')+1 if '\nimport ' in out else (0 if out.startswith('import ') else None)
        if i is None: keys=[]; break
        out2=out[:i]+imp+out[i:]
        if len(out2.encode())<=MAXB and out2.count('\n')+ (0 if out2.endswith('\n') else 1)<=300: break
        keys.pop()
        if not keys: break
    if keys:
        open(f,'w',encoding='utf-8').write(out2); report[f]=keys
print(stats, 'files',len(report),'sites',sum(len(v) for v in report.values()),'dmgnames',len(dmg))
print(json.dumps({f: len(v) for f, v in report.items()}, ensure_ascii=False))
