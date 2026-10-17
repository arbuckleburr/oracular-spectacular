"""Merge data/batch-*.json (exactly 512 phrases) and assign each an ordered 3d8 roll.
Deterministic: seed below. Phrases are spread so every first-die value (blocks of 64) gets a similar
regional mix. Output: data/phrases.json. Re-running with the same batch files and seed gives the same file."""
import json,glob,random,collections,re
SEED=20261017
items=[]
for f in sorted(glob.glob('data/batch-*.json')): items+=json.load(open(f,encoding='utf8'))
assert len(items)==512, len(items)
def group(t):
    t=t.lower()
    for k,g in (('hebrew','Hebrew'),('gnostic','Gnostic/Hermetic'),('hermetic','Gnostic/Hermetic'),('chinese','Chinese'),('indian','Indian'),('tamil','Indian'),('ashanti','Africa'),('hausa','Africa'),('arabic','Arabia'),('malay','SEAsia'),('gaelic','Celtic'),('japanese','Japan'),('inca','Americas'),('nahua','Americas'),('egypt','Egypt'),('persian','Persia/Mesopotamia'),('assyrian','Persia/Mesopotamia'),('scythian','Persia/Mesopotamia')):
        if k in t: return g
    return 'Greek/Roman'
rng=random.Random(SEED)
groups=collections.defaultdict(list)
for x in items: groups[group(x['tradition'])].append(x)
keyed=[]
for g,xs in groups.items():
    rng.shuffle(xs)
    for i,x in enumerate(xs): keyed.append(((i+rng.random())/len(xs),g,x))
keyed.sort(key=lambda k:k[0])
out=[]
for i,(_,g,x) in enumerate(keyed):
    roll=[i//64+1,(i//8)%8+1,i%8+1]
    y=dict(x); y['roll']=roll; y['key']='-'.join(map(str,roll)); out.append(y)
assert len({y['key'] for y in out})==512
out.sort(key=lambda y:y['roll'])
json.dump(out,open('data/phrases.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print('wrote data/phrases.json',len(out))
per=collections.defaultdict(collections.Counter)
for y in out: per[y['roll'][0]][group(y['tradition'])]+=1
for d1 in sorted(per): print(d1,dict(per[d1]))
