"""Verify quotes against downloaded source texts and write a batch JSON.
usage: python3 -I tools/make_batch.py SRC_DIR SPEC.tsv OUT.json PREFIX
SPEC.tsv lines (tab-separated): file<TAB>text<TAB>source<TAB>tradition<TAB>era<TAB>translator
Lines starting with # are ignored. A quote must appear verbatim (whitespace/quote/dash-normalized,
case-insensitive) in SRC_DIR/<file>.txt, otherwise it is reported and skipped."""
import sys,re,json
src,spec,out,prefix=sys.argv[1:5]
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-')
    s=re.sub(r'\s*-+\s*','-',s); return re.sub(r'\s+',' ',s).strip().lower()
cache={}; res=[]; bad=0
for ln in open(spec,encoding='utf8'):
    ln=ln.rstrip('\n')
    if not ln.strip() or ln.startswith('#'): continue
    f,text,source,trad,era,tr=ln.split('\t')
    if f not in cache: cache[f]=norm(open(f'{src}/{f}.txt',encoding='utf8',errors='replace').read())
    if norm(text) not in cache[f]: print('MISS',f,'|',text); bad+=1; continue
    t=text.strip(); t=t[0].upper()+t[1:]
    if t[-1] in ';,': t=t[:-1]+'.'
    elif t[-1] not in '.!?"”\'’:': t+='.'
    res.append(dict(id=f'{prefix}-{len(res)+1:02d}',roll=None,text=t,source=source,tradition=trad,era=era,translator=tr))
json.dump(res,open(out,'w',encoding='utf8'),ensure_ascii=False,indent=1)
print(len(res),'written,',bad,'missed')
