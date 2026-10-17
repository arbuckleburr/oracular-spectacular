import re,json,sys
SRC=sys.argv[1]; OUT=sys.argv[2]
raw={}
def txt(f):
    if f not in raw: raw[f]=open(f'{SRC}/{f}.txt',encoding='utf8').read()
    return raw[f]
def pos(f,q,start=0):
    words=[re.escape(w) for w in q.split()]
    m=re.compile(r'\s+'.join(words),re.I).search(txt(f),start)
    return m.start() if m else None
META={
 'g30508':('Egyptian','c. 2400 BCE (traditional)','Battiscombe G. Gunn, 1906'),
 'g124':('Hebrew (Jewish)','c. 180 BCE','King James Apocrypha, 1611'),
 'g10p':('Hebrew (Jewish)','10th-3rd c. BCE','King James Version, 1611'),
 'g10e':('Hebrew (Jewish)','3rd c. BCE','King James Version, 1611'),
}
E=[
('g30508','Ptahhotep','Be not proud because thou art learned; but discourse with the ignorant man, as with the sage.'),
('g30508','Ptahhotep','no limit can be set to skill, neither is there any craftsman that possesseth full advantages.'),
('g30508','Ptahhotep','Fair speech is more rare than the emerald that is found by slave-maidens on the pebbles.'),
('g30508','Ptahhotep','Great is Truth, appointing a straight path'),
('g30508','Ptahhotep','Live, therefore, in the house of kindliness, and men shall come and give gifts of themselves.'),
('g30508','Ptahhotep','Silence is more profitable unto thee than abundance of speech.'),
('g30508','Ptahhotep','A cup of water quencheth the thirst, and a mouthful of melon supporteth the heart.'),
('g30508','Ptahhotep','The bowman hitteth the mark, as the steersman reacheth land, by diversity of aim.'),
('g30508','Ptahhotep','Vice must be drawn out, that virtue may remain.'),
('g30508','Ptahhotep','Quarrelling in place of friendship is a foolish thing.'),
('g30508','Ptahhotep','He that obeyeth becometh one obeyed.'),
('g30508','Ptahhotep','When riches are gained, follow the heart; for riches are of no avail if one be weary.'),
('g30508','Ptahhotep','Be not covetous toward thy neighbours; for with a gentle man praise availeth more than might.'),
('g30508','Ptahhotep','Heedlessness leadeth unto disobedience on the morrow; but understanding shall stablish him.'),
('g124','Sirach','A faithfull friend is a strong defence: and he that hath found such an one hath found a treasure.'),
('g124','Sirach','If thou wouldest get a friend, prove him first and be not hasty to credit him.'),
('g124','Sirach','A friend cannot be known in prosperity: and an enemy cannot be hidden in adversity.'),
('g124','Sirach','If thou hast understanding, answer thy neighbour; if not, lay thy hand upon thy mouth.'),
('g124','Sirach','He that can rule his tongue shall live without strife; and he that hateth babbling shall have less evil.'),
('g124','Sirach','Better is he that laboureth, and aboundeth in all things, than he that boasteth himself, and wanteth bread.'),
('g124','Sirach','Change not a friend for any good by no means; neither a faithful brother for the gold of Ophir.'),
('g124','Sirach','Judge none blessed before his death: for a man shall be known in his children.'),
('g124','Sirach','Consult not with a fool; for he cannot keep counsel.'),
('g124','Sirach','When thou hast enough, remember the time of hunger: and when thou art rich, think upon poverty and need.'),
('g10p','Proverbs','A soft answer turneth away wrath: but grievous words stir up anger.'),
('g10p','Proverbs','A merry heart doeth good like a medicine: but a broken spirit drieth the bones.'),
('g10p','Proverbs','He that is slow to anger is better than the mighty; and he that ruleth his spirit than he that taketh a city.'),
('g10p','Proverbs','Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.'),
('g10p','Proverbs','Faithful are the wounds of a friend; but the kisses of an enemy are deceitful.'),
('g10p','Proverbs','Go to the ant, thou sluggard; consider her ways, and be wise'),
('g10p','Proverbs','A good name is rather to be chosen than great riches'),
('g10p','Proverbs','Where there is no vision, the people perish'),
('g10e','Ecclesiastes','To every thing there is a season, and a time to every purpose under the heaven'),
('g10e','Ecclesiastes','Better is an handful with quietness, than both the hands full with travail and vexation of spirit.'),
('g10e','Ecclesiastes','Cast thy bread upon the waters: for thou shalt find it after many days.'),
('g10e','Ecclesiastes','A threefold cord is not quickly broken.'),
('g10e','Ecclesiastes','The race is not to the swift, nor the battle to the strong'),
('g10e','Ecclesiastes','Two are better than one; because they have a good reward for their labour.'),
]
# KJV body offsets
t10=txt('g10') if True else ''
def kjv_start(name):
    return [m.start() for m in re.finditer(r'(?m)^'+name+r'$',t10)]
prov=kjv_start('The Proverbs')[-1]; eccl=kjv_start('Ecclesiastes')[-1]
song=[m.start() for m in re.finditer(r'(?m)^The Song of Solomon$',t10)][-1]
raw['g10p']=t10[prov:eccl]; raw['g10e']=t10[eccl:song]
sir0=txt('g124').find('\nThe Book of Sirach (or Ecclesiasticus)\n',3000)
raw['g124']=txt('g124')[sir0:txt('g124').find('\nThe Book of Baruch\n',3000)]
out=[];bad=0
for i,(f,work,q) in enumerate(E,1):
    p=pos(f,q)
    if p is None: print('NOTFOUND',f,q); bad+=1; continue
    trad,era,tr=META[f]
    before=txt(f)[:p]
    if f=='g30508':
        a=txt(f).find('The Instruction of the Governor of his City'); 
        nums=re.findall(r'(?m)^\s*(\d{1,2})\. ',before[a:]) if p>a else []
        loc=f"{nums[-1]}" if nums else 'preface'
        src=f'Ptahhotep, Instruction, maxim {loc}' if nums else 'Ptahhotep, Instruction, prologue'
    else:
        v=re.findall(r'(?m)^(\d{1,2}:\d{1,2}) ',before)
        # verse number may sit on the same line as quote start
        ref=re.findall(r'(?<!\d)(\d{1,3}:\d{1,3}) ',before)[-1]
        src=f'{work} {ref}' if work!='Sirach' else f'Sirach (Ecclesiasticus) {ref}'
    if q.startswith('A cup of water'): src="Kagemni, Instruction, maxim 2"
    q2=q.rstrip(';')[0].upper()+q.rstrip(';')[1:]
    if not q2.endswith(('.','?','!',':')): q2+='.'
    out.append({'id':f'b2-{len(out)+1:02d}','roll':None,'text':q2,'source':src,'tradition':trad,'era':era,'translator':tr})
json.dump(out,open(OUT,'w',encoding='utf8'),ensure_ascii=False,indent=1)
print(len(out),'written;',bad,'not found')
for o in out: print(o['id'],'|',o['source'],'|',o['text'][:70])
