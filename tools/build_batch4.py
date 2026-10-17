import re,json,sys
SRC=sys.argv[1]; OUT=sys.argv[2]
def rd(f): return open(f'{SRC}/{f}.txt',encoding='utf8').read()
def pos(t,q):
    m=re.search(r'\s+'.join(re.escape(w) for w in q.split()),t,re.I); return m.start() if m else None
D=rd('g57342'); P=rd('g78134')
DS=[('Thales',539),('Solon',890),('Chilo',1255),('Pittacus',1352),('Bias',1495),('Cleobulus',1609),('Periander',1706),('Anacharsis',1793)]
Dlines=D.split('\n'); Doff=[];o=0
for ln in Dlines: Doff.append(o); o+=len(ln)+1
dstarts=[(n,Doff[l-1]) for n,l in DS]
def sage(p):
    s=None
    for n,o in dstarts:
        if o<=p: s=n
    return s
dq=[
"Pardon is better than punishment.","Even the Gods cannot strive against necessity.","Power shows the man.",
"Do not say before hand what you are going to do; for if you fail, you will be laughed at.",
"Do not reproach a man with his misfortunes, fearing lest Nemesis may overtake you.",
"Forbear to speak evil not only of your friends, but also of your enemies.","Practise piety, with temperance.","Watch your opportunity.",
"Suretyship, and then destruction.",
"To rule one’s tongue, especially at a banquet, and not to speak ill of one’s neighbours; for if one does so one is sure to hear what one will not like.",
"Seek excess in nothing.","Moderation is the best thing.","Most men are wicked.",
"Hold your tongues, lest they should find out that you are in this ship.",
"time is the wisest of things, for it finds out everything.","necessity is the strongest of things, for it rules everything",
"intellect is the swiftest of things, for it runs through everything",
"Do you, O Thales, who cannot see what is under your feet, think that you shall understand what is in heaven?",
"those who want fewest things are nearest to the Gods.","To avoid excess in everything.","he knew nothing, except the fact of his ignorance.",
]
ERA={'Thales':'6th c. BCE','Solon':'6th c. BCE','Chilo':'6th c. BCE','Pittacus':'c. 600 BCE','Bias':'6th c. BCE','Cleobulus':'6th c. BCE','Periander':'7th-6th c. BCE'}
out=[];bad=0
for q in dq:
    p=pos(D,q)
    if p is None: print('NOTFOUND D',q); bad+=1; continue
    s=sage(p)
    if q.startswith(('those who want','To avoid excess','he knew nothing')): who,era,loc='Socrates','5th c. BCE','Socrates'
    elif s is None: who,era,loc='?','?','?'
    else: who,era,loc=s,ERA.get(s,''),s
    if q.startswith('Do you, O Thales'): who,era,loc='Thales','6th c. BCE','Thales'
    out.append(dict(text=q[0].upper()+q[1:],source=f'Diogenes Laertius, Lives, {loc}',tradition='Greek',era=era,translator='C. D. Yonge, 1853'))
# Plutarch (Goodwin 1878)
K=P.find('THE APOPHTHEGMS OR REMARKABLE SAYINGS OF KINGS AND GREAT COMMANDERS.',20000)
LC=P.find('LACONIC APOPHTHEGMS; OR REMARKABLE SAYINGS OF THE SPARTANS.',20000)
pq=[
("Cyrus","Persian (reported by Plutarch)","6th c. BCE","K","nobody ought to govern, unless he was better than those he governed."),
("Cyrus","Persian (reported by Plutarch)","6th c. BCE","K","both the seeds of plants and the lives of men resemble the soil they inhabit."),
("Semiramis","Assyrian (reported by Plutarch)","legendary","K","If thou wert not a wicked person and of insatiable covetousness, thou wouldst not disturb the mansions of the dead."),
("Artaxerxes I","Persian (reported by Plutarch)","5th c. BCE","K","it was more princely to add than to take away."),
("Artaxerxes I","Persian (reported by Plutarch)","5th c. BCE","K","for when I have given you this, I shall not be poorer, but I had been more unjust if I had granted your petition."),
("Orontes","Persian (reported by Plutarch)","4th c. BCE","K","the favorites of kings sometimes can do every thing with them, sometimes little or nothing."),
("Egyptian Kings","Egyptian (reported by Plutarch)","pharaonic era","K","The Egyptian kings, according unto their law, used to swear their judges that they should not obey the king when he commanded them to give an unjust sentence."),
("Ateas","Scythian (reported by Plutarch)","4th c. BCE","K","You reign over the Macedonians, men that have learned fighting; and I over the Scythians, which can fight with hunger and thirst."),
("Scilurus","Scythian (reported by Plutarch)","2nd c. BCE","K","if they held together, they would continue strong, but if they fell out and were divided, they would become weak."),
("Siramnes","Persian (reported by Plutarch)","5th c. BCE","K","I myself am master of my words, but the king and fortune have power over my actions."),
("Dionysius the Younger","Greek (Syracuse, via Plutarch)","4th c. BCE","K","My father bequeathed to me his government, but not his fortune."),
("Agasicles","Spartan (reported by Plutarch)","6th c. BCE","L","If he rules his subjects as fathers do their sons."),
("Agesilaus","Spartan (reported by Plutarch)","4th c. BCE","L","I don’t think that shoemaker a good workman that makes a great shoe for a little foot."),
("Agesilaus","Spartan (reported by Plutarch)","4th c. BCE","L","I’ll show that it is not the places that grace men, but men the places."),
("Agesilaus","Spartan (reported by Plutarch)","4th c. BCE","L","If so little a creature will oppose injurious violence, what think ye that men ought to do?"),
]
for who,trad,era,sec,q in pq:
    p=pos(P,q)
    if p is None: print('NOTFOUND P',q); bad+=1; continue
    sec_name='Apophthegms of Kings and Great Commanders' if sec=='K' else 'Laconic Apophthegms'
    out.append(dict(text=q[0].upper()+q[1:],source=f'Plutarch, {sec_name}: {who}',tradition=trad,era=era,translator='Several hands, ed. W. W. Goodwin, 1878'))
res=[{'id':f'b4-{i:02d}','roll':None,**o} for i,o in enumerate(out,1)]
json.dump(res,open(OUT,'w',encoding='utf8'),ensure_ascii=False,indent=1)
print(len(res),'written;',bad,'not found')
for r in res: print(r['id'],'|',r['source'],'|',r['era'],'|',r['text'][:55])
