import re,json,sys
SRC=sys.argv[1]; OUT=sys.argv[2]
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-')
    s=re.sub(r'\s*-+\s*','-',s); return re.sub(r'\s+',' ',s).strip().lower()
raw={}; 
def txt(f):
    if f not in raw: raw[f]=open(f'{SRC}/{f}.txt',encoding='utf8').read()
    return raw[f]
def pos(f,q):
    # position of quote in raw text via whitespace-flexible regex
    words=[re.escape(w) for w in q.split()]
    m=re.search(r'\s+'.join(words),txt(f),re.I)
    return m.start() if m else None
META={
 'g15877':('Marcus Aurelius, Meditations','Roman','2nd c. CE','George Long, 1862'),
 'g10661':('Epictetus','Greek (Roman Empire)','c. 100 CE','George Long, 1877'),
 'g1656':('Plato, Apology','Greek','399 BCE','Benjamin Jowett, 1871'),
 'g21':('Aesop, Fables','Greek','6th c. BCE (traditional)','George Fyler Townsend, 1867'),
 'g4094':('Confucius, Analects','Chinese','5th c. BCE','James Legge, 1861'),
 'g216':('Laozi, Tao Te Ching','Chinese','6th-4th c. BCE','James Legge, 1891'),
 'g59709':('Zhuangzi','Chinese','4th c. BCE','Herbert A. Giles, 1889'),
 'g2017':('Dhammapada','Indian (Buddhist)','3rd c. BCE','F. Max Muller, 1881'),
 'g2388':('Bhagavad Gita','Indian (Hindu)','c. 200 BCE-200 CE','Edwin Arnold, 1885'),
}
ROM={'I':1,'V':5,'X':10,'L':50,'C':100}
def roman(s):
    t=0;p=0
    for c in reversed(s):
        v=ROM[c]; t+= v if v>=p else -v; p=max(p,v)
    return t
def loc(f,q):
    t=txt(f); p=pos(f,q)
    if p is None: return None
    before=t[:p]
    if f=='g21':
        lines=before.split('\n'); i=len(lines)-1
        while i>2:
            if lines[i].strip() and len(lines[i])<70 and lines[i-1]=='' and lines[i-2]=='' and False: pass
            i-=1
        # title: nearest previous line followed by two blank lines
        L=lines
        for j in range(len(L)-4,0,-1):
            if L[j].strip() and L[j+1].strip()=='' and L[j+2].strip()=='' and L[j+3].strip() and len(L[j])<70: return 'The '+L[j].strip()[4:] if False else L[j].strip()
        return None
    if f=='g15877':
        b=[(m.start(),m.group(1)) for m in re.finditer(r'(?m)^([IVX]+)\.$',before) if m.start()>0]
        book=roman(b[-1][1]) if b else None
        seg=before[b[-1][0]:] if b else before
        s=[m.group(1) for m in re.finditer(r'(?:^|\s)(\d{1,2})\. (?:(?=[A-Z\[])|$)',seg)]
        return f'{book}.{s[-1] if s else "?"}'
    if f=='g4094':
        bk=re.findall(r'(?m)^BOOK ([IVXL]+)\.',before)
        ch=re.findall(r'CHAP(?:TER|\.)\s+([IVXL]+)\.',before)
        return f'{roman(bk[-1])}.{roman(ch[-1])} (Legge numbering)'
    if f=='g216':
        c=re.findall(r'(?:^|\s)(?:Ch\. )?(\d{1,2})\. 1\. ',before)
        return str(c[-1])
    if f=='g2017':
        v=re.findall(r'(?m)^(\d{1,3})\. ',before); return 'v. '+v[-1]
    if f=='g2388':
        c=re.findall(r'(?m)^\s*CHAPTER ([IVX]+)',before); return str(roman(c[-1]))
    if f=='g10661':
        e=re.findall(r'(?:^|\s)([IVXL]+)\. (?=[A-Z])',before[before.find('ENCHEIRIDION') if 'ENCHEIRIDION' in before else 0:])
        return 'Enchiridion '+(str(roman(e[-1])) if e else '?')
    return ''
# (file, text, optional display override)
E=[
('g15877','Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.'),
('g15877','That which is not good for the swarm, neither is it good for the bee.'),
('g15877','Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.'),
('g15877','The best way of avenging thyself is not to become like [the wrong-doer].'),
('g15877','Everything is only for a day, both that which remembers and that which is remembered.'),
('g15877','Take away thy opinion, and then there is taken away the complaint, "I have been harmed." Take away the complaint, "I have been harmed," and the harm is taken away.'),
('g15877','Remember that to change thy opinion and to follow him who corrects thy error is as consistent with freedom as it is to persist in thy error.'),
('g10661','Remember that in life you ought to behave as at a banquet.'),
('g10661','Everything has two handles, the one by which it may be borne, the other by which it may not.'),
('g10661','It is a man’s own opinions which disturb him.'),
('g10661','Seek not that the things which happen should happen as you wish; but wish the things which happen to be as they are, and you will have a tranquil flow of life.'),
('g1656','the unexamined life is not worth living'),
('g1656','No evil can happen to a good man, either in life or after death.'),
('g1656','The difficulty, my friends, is not to avoid death, but to avoid unrighteousness; for that runs faster than death.'),
('g1656','he, O men, is the wisest, who, like Socrates, knows that his wisdom is in truth worth nothing'),
('g1656','I neither know nor think that I know.'),
('g21','Slow but steady wins the race.'),
('g21','Those who seek to please everybody please nobody.'),
('g21','Example is more powerful than precept.'),
('g21','In quarreling about the shadow we often lose the substance.'),
('g21','Misfortune tests the sincerity of friends.'),
('g21','Pride goes before destruction.'),
('g21','Those who suffer most cry out the least.'),
('g21','He is wise who is warned by the misfortunes of others.'),
('g4094','Is it not pleasant to learn with a constant perseverance and application?'),
('g4094','The cautious seldom err.'),
('g4094','Learning without thought is labour lost; thought without learning is perilous.'),
('g4094','The superior man is catholic and no partisan. The mean man is partisan and not catholic.'),
('g4094','When you have faults, do not fear to abandon them.'),
('g4094','Virtue is not left to stand alone. He who practises it will have neighbors.'),
('g4094','If a man in the morning hear the right way, he may die in the evening without regret.'),
('g4094','To go beyond is as wrong as to fall short.'),
('g4094','When you know a thing, to hold that you know it; and when you do not know a thing, to allow that you do not know it;-- this is knowledge.'),
('g4094','When I walk along with two others, they may serve me as my teachers.'),
('g216','The journey of a thousand li commenced with a single step.'),
('g216','He who knows other men is discerning; he who knows himself is intelligent.'),
('g216','He who overcomes others is strong; he who overcomes himself is mighty.'),
('g216','The highest excellence is like (that of) water.'),
('g216','The soft overcomes the hard; and the weak the strong.'),
('g216','Governing a great state is like cooking small fish.'),
('g216','Gravity is the root of lightness; stillness, the ruler of movement.'),
('g216','The great Tao (or way) is very level and easy; but people love the by-ways.'),
('g216','He who knows (the Tao) does not (care to) speak (about it); he who is (ever ready to) speak about it does not know it.'),
('g216','Who is content Needs fear no shame.'),
('g59709','You cannot speak of ocean to a well-frog,--the creature of a narrower sphere.'),
('g59709','You cannot speak of ice to a summer insect,--the creature of a season.'),
('g59709','My life has a limit, but my knowledge is without limit.'),
('g2017','All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.'),
('g2017','For hatred does not cease by hatred at any time: hatred ceases by love, this is an old rule.'),
('g2017','As rain breaks through an ill-thatched house, passion will break through an unreflecting mind.'),
('g2017','Earnestness is the path of immortality (Nirvana), thoughtlessness the path of death.'),
('g2017','Long is the night to him who is awake; long is a mile to him who is tired; long is life to the foolish who do not know the true law.'),
('g2017','The fool who knows his foolishness, is wise at least so far. But a fool who thinks himself wise, he is called a fool indeed.'),
('g2017','Well-makers lead the water (wherever they like); fletchers bend the arrow; carpenters bend a log of wood; wise people fashion themselves.'),
('g2017','As a solid rock is not shaken by the wind, wise people falter not amidst blame and praise.'),
('g2017','Self is the lord of self, who else could be the lord?'),
('g2017',"Not to commit any sin, to do good, and to purify one's mind, that is the teaching of (all) the Awakened."),
('g2017','Let a man overcome anger by love, let him overcome evil by good; let him overcome the greedy by liberality, the liar by truth!'),
('g2017','The fault of others is easily perceived, but that of oneself is difficult to perceive;'),
('g2017','Whatever a hater may do to a hater, or an enemy to an enemy, a wrongly-directed mind will do us greater mischief.'),
('g2017','As the bee collects nectar and departs without injuring the flower, or its colour or scent, so let a sage dwell in his village.'),
('g2017','Like a beautiful flower, full of colour, but without scent, are the fine but fruitless words of him who does not act accordingly.'),
('g2388','Let right deeds be thy motive, not the fruit which comes from them.'),
('g2388',"Better thine own work is, though done with fault, than doing others' work, ev'n excellently."),
]
out=[];bad=0
for i,(f,q) in enumerate(E,1):
    if pos(f,q) is None: print('NOTFOUND',f,q); bad+=1; continue
    w,trad,era,tr=META[f]; l=loc(f,q)
    q2=q.rstrip(';').strip()
    if f=='g21': src=f'{w}, "{l}"'
    else: src=f'{w} {l}'
    q2=q2[0].upper()+q2[1:]
    OV={'Remember that in life':'Epictetus, Enchiridion 15','Everything has two handles':'Epictetus, Enchiridion 43','Seek not that':'Epictetus, Enchiridion 8','It is a man':'Epictetus, Discourses (Long\'s selection)','Who is content':'Laozi, Tao Te Ching 44','You cannot speak of':'Zhuangzi 17','My life has a limit':'Zhuangzi 3'}
    for k,v in OV.items():
        if q.startswith(k): src=v
    if f=='g1656': src='Plato, Apology'
    out.append({'id':f'b1-{i:02d}','roll':None,'text':q2,'source':src,'tradition':trad,'era':era,'translator':tr})
json.dump(out,open(OUT,'w',encoding='utf8'),ensure_ascii=False,indent=1)
print(len(out),'written;',bad,'not found')
for o in out: print(o['id'],'|',o['source'],'|',o['text'][:60])
