"""Count phrases per batch and per region group across data/batch-*.json"""
import json,glob,collections
def group(t):
    t=t.lower()
    if any(k in t for k in ('hebrew','jewish')): return 'Hebrew'
    if 'arabic' in t: return 'Arabia/Egypt (oral)'
    if 'egypt' in t and 'hermetic' not in t: return 'Egyptian'
    if any(k in t for k in ('gnostic','hermetic')): return 'Gnostic/Hermetic'
    if any(k in t for k in ('chinese',)): return 'Chinese'
    if any(k in t for k in ('indian','tamil')): return 'Indian'
    if any(k in t for k in ('persian','assyrian','scythian')): return 'Persia/Mesopotamia/Steppe'
    if any(k in t for k in ('ashanti','hausa','akan','yoruba','zulu')): return 'Africa (oral)'
    if 'japanese' in t: return 'Japan'
    if 'inca' in t or 'nahua' in t: return 'Americas'
    if 'malay' in t: return 'SE Asia (oral)'
    if 'gaelic' in t or 'celtic' in t: return 'Celtic (oral)'
    if any(k in t for k in ('greek','roman','spartan','macedonian')): return 'Greek/Roman'
    return 'Other'
tot=0; g=collections.Counter(); per={}
for f in sorted(glob.glob('data/batch-*.json')):
    d=json.load(open(f,encoding='utf8')); per[f]=len(d); tot+=len(d)
    for x in d: g[group(x['tradition'])]+=1
print(per); print('total',tot, 'of 512')
for k,v in g.most_common(): print(f'{k:28s}{v:4d}  {100*v/512:4.1f}% of 512')
