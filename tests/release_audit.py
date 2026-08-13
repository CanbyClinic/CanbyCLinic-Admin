from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit
import sys,re
root=Path(__file__).resolve().parents[1]
errors=[]; pages=list(root.glob('*.html'))
for p in pages:
 s=BeautifulSoup(p.read_text(errors='ignore'),'html.parser')
 if not s.title or not s.title.get_text(strip=True):errors.append(f'{p.name}: missing title')
 if p.name!='404.html' and not s.find('h1'):errors.append(f'{p.name}: missing h1')
 if not s.html.get('lang'):errors.append(f'{p.name}: missing lang')
 for tag,attr in [('a','href'),('link','href'),('script','src'),('img','src')]:
  for el in s.find_all(tag):
   v=el.get(attr,'')
   if not v or v.startswith(('#','mailto:','tel:','data:','blob:','http://','https://','//')):continue
   v=urlsplit(v).path
   if v.startswith('/api/'):continue
   target=(root/v).resolve()
   if not target.exists():errors.append(f'{p.name}: missing {v}')
for fn in ['api/patient-intake.js','api/contact.js','api/auth/login.js','supabase/schema.sql','vercel.json','README-RELEASE.md','ANIMATION-HANDOFF.md']:
 if not (root/fn).exists():errors.append(f'missing required {fn}')
print(f'pages={len(pages)} errors={len(errors)}')
for e in errors[:200]:print('ERROR',e)
sys.exit(1 if errors else 0)
