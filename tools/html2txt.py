import sys,re,html
t=open(sys.argv[1],encoding='utf8',errors='replace').read()
t=re.sub(r'(?is)<(script|style).*?</\1>','',t)
t=re.sub(r'(?i)<br\s*/?>|</p>|</div>|</h\d>|</li>|</tr>','\n',t)
t=re.sub(r'<[^>]+>','',t)
t=html.unescape(t).replace('\xa0',' ')
open(sys.argv[2],'w',encoding='utf8').write(t)
