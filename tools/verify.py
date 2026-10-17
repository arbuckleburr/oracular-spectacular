import sys,re
src,cand=sys.argv[1],sys.argv[2]
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('--','-')
    s=re.sub(r'\s*-+\s*','-',s); return re.sub(r'\s+',' ',s).strip().lower()
cache={}
ok=bad=0
for ln in open(cand,encoding='utf8'):
    ln=ln.rstrip('\n')
    if not ln.strip() or ln.startswith('#'): continue
    f,t=ln.split('|',1)
    if f not in cache: cache[f]=norm(open(f'{src}/{f}.txt',encoding='utf8').read())
    if norm(t) in cache[f]: ok+=1
    else: bad+=1; print('MISS',f,'|',t)
print('ok',ok,'miss',bad)
