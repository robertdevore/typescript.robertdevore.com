"""Reproducible local/live audit. Never overwrite a captured phase."""
import argparse, collections, concurrent.futures, csv, hashlib, json, re, time
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, urldefrag
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ORIGIN = 'https://typescript.robertdevore.com'
NA = 'NOT AVAILABLE — DATA ACCESS REQUIRED'
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta={}; self.canonical=''; self.title=''; self.headings=[]; self.links=[]; self.images=[]; self.assets=[]; self.ids=set(); self.schemas=[]; self.text=[]; self.stack=[]; self.capture=None; self.schema=None; self.anchor=None; self.lang=''; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); self.stack.append(tag)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='html':self.lang=a.get('lang','')
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
        if tag in ['h1','h2','h3','title']:self.capture=[tag,'']
        if tag=='a':self.anchor={**a,'text':''}
        if tag=='img':self.images.append(a)
        if tag=='script' and a.get('type')=='application/ld+json':self.schema=''
        if a.get('src'):self.assets.append(a['src'])
        if tag=='link' and a.get('rel') in ['stylesheet','icon','preload']:self.assets.append(a.get('href',''))
        if tag in ['meta','link','img','input','br','hr','source','wbr']:self.stack.pop()
    def handle_endtag(self,tag):
        if self.capture and self.capture[0]==tag:
            if tag=='title':self.title=self.capture[1].strip()
            else:self.headings.append((tag,self.capture[1].strip()))
            self.capture=None
        if tag=='a' and self.anchor:self.links.append(self.anchor);self.anchor=None
        if tag=='script' and self.schema is not None:self.schemas.append(self.schema);self.schema=None
        if tag in self.stack:self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
    def handle_data(self,data):
        if self.capture:self.capture[1]+=data
        if self.anchor:self.anchor['text']+=data
        if self.schema is not None:self.schema+=data
        if 'main' in self.stack and not any(x in self.stack for x in ['script','style']):self.text.append(data)

def fetch(url,ua='TypeScriptCourseAudit/1.0'):
    started=time.monotonic()
    try:
        with urlopen(Request(url,headers={'User-Agent':ua}),timeout=25) as r:
            b=r.read();return dict(url=url,final=r.url,status=r.status,headers=dict(r.headers),bytes=len(b),elapsed_ms=round((time.monotonic()-started)*1000),body=b.decode('utf8','replace') if 'text/' in r.headers.get('Content-Type','') or any(x in url for x in ['robots.txt','sitemap.xml']) else '')
    except HTTPError as e:return dict(url=url,final=e.url,status=e.code,headers=dict(e.headers),error=str(e))
    except Exception as e:return dict(url=url,status=0,error=str(e))

def csvwrite(out,name,rows,append=False):
    file=out/name
    if file.exists():fields=next(csv.reader(file.open()))
    else:fields=list(rows[0]) if rows else ['phase','result']
    fields += sorted(set().union(*(r.keys() for r in rows))-set(fields)) if rows else []
    old=list(csv.DictReader(file.open())) if append and file.exists() else []
    with file.open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(old+rows)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--phase',required=True,choices=['baseline','after']);ap.add_argument('--root',required=True);ap.add_argument('--out',default='seo-audit/2026-09-06');a=ap.parse_args();out=Path(a.out);root=Path(a.root)
    receipt=out/'raw'/f'{a.phase}-responses.json'
    if receipt.exists():raise SystemExit('Phase already captured; use a new workspace instead of overwriting.')
    source={}
    for p in Path('content').glob('*/*.md'):
        m=json.loads(p.read_text().splitlines()[0]);source[f'/{p.parent.name}/{m["slug"]}/']=str(p)
    paths={('/'+str(p.relative_to(root)).replace('index.html','')):p for p in root.rglob('*.html')}
    paths['/404/']=paths.pop('/404.html')
    pages={ORIGIN+u:Page(p.read_text()) for u,p in paths.items()}
    sitemap=set(re.findall(r'<loc>(.*?)</loc>',(root/'sitemap.xml').read_text()))
    urls=list(pages)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:live=dict(zip(urls,ex.map(fetch,urls)))
    receipt.write_text(json.dumps(live,indent=2)+'\n')
    depth={ORIGIN+'/':0};queue=collections.deque(depth)
    while queue:
        u=queue.popleft()
        for l in pages[u].links:
            v=urldefrag(urljoin(u,l.get('href','')))[0].split('?')[0]
            if v in pages and v not in depth:depth[v]=depth[u]+1;queue.append(v)
    inbound=collections.Counter();internal=[];external=[];broken=[]
    for u,p in pages.items():
        for l in p.links:
            v,frag=urldefrag(urljoin(u,l.get('href','')));clean=v.split('?')[0]
            if not v.startswith('http'):continue
            row=dict(phase=a.phase,source_url=u,destination_url=v,anchor_text=' '.join(l['text'].split()),link_context='HTML anchor',rel=l.get('rel',''))
            if urlsplit(v).netloc==urlsplit(ORIGIN).netloc:
                target=root/urlsplit(clean).path.lstrip('/');target=target/'index.html' if target.is_dir() else target
                target=paths.get(urlsplit(clean).path,target)
                valid=target.exists();fragment_ok=not frag or (clean in pages and frag in pages[clean].ids)
                if clean in pages:inbound[clean]+=1
                row.update(http_status=200 if valid else 404,final_url=v,chain_length=0,verification='local target + fragment' if valid and fragment_ok else 'missing local target or fragment')
                internal.append(row)
                if not valid or not fragment_ok:broken.append(dict(row,link_type='internal',evidence=row['verification']))
            else:external.append(row)
    exturls=sorted(set(x['destination_url'] for x in external))
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:ext=dict(zip(exturls,ex.map(fetch,exturls)))
    # External receipts omit full copyrighted documents; preserve headers/status/final URLs.
    (out/'raw'/f'{a.phase}-external.json').write_text(json.dumps({u:{k:v for k,v in r.items() if k!='body'} for u,r in ext.items()},indent=2)+'\n')
    for r in external:
        x=ext[r['destination_url']];status=x['status'];r.update(http_status=status,final_url=x.get('final',''),chain_length='not captured; final URL only',verification='reachable' if status==200 else 'blocked/indeterminate' if status in [0,401,403,405,429] else 'needs review')
        if status in [404,410]:broken.append(dict(r,link_type='external',evidence='GET returned '+str(status)))
    titles=collections.Counter(p.title for u,p in pages.items() if u in sitemap);descs=collections.Counter(p.meta.get('description','') for u,p in pages.items() if u in sitemap)
    inventory=[];metadata=[];schemas=[];images=[];content=[];keywords=[]
    for u,p in pages.items():
        prod=live[u];robot=p.meta.get('robots','')+' '+prod.get('headers',{}).get('X-Robots-Tag','');indexable='noindex' not in robot and prod['status']==200;types=[];valid=True
        for raw in p.schemas:
            try:
                obj=json.loads(raw)
                for x in obj.get('@graph',[obj]):types.extend(x.get('@type',[]) if isinstance(x.get('@type'),list) else [x.get('@type','')])
            except Exception:valid=False
        main=' '.join(' '.join(p.text).split());h1=[x[1] for x in p.headings if x[0]=='h1'];d=p.meta.get('description','');pagepath=urlsplit(u).path;kind=pagepath.split('/')[1] or 'home';issues=[]
        if u in sitemap:
            if not p.title:issues.append('missing title')
            if not d:issues.append('missing description')
            if p.canonical!=u:issues.append('canonical mismatch')
            if len(h1)!=1:issues.append('H1 count')
            if not p.schemas:issues.append('no structured data (opportunity, not search requirement)')
        row=dict(phase=a.phase,url=u,source_file=source.get(pagepath,'scripts/build.mjs' if kind!='labs' else 'labs/browser/index.html'),page_type=kind,local_status=404 if pagepath=='/404/' else 200,production_status=prod['status'],indexable=indexable,robots_directives=robot.strip(),canonical=p.canonical,canonical_target_status=live.get(p.canonical,{}).get('status',''),title=p.title,title_length=len(p.title),meta_description=d,description_length=len(d),h1=' | '.join(h1),heading_structure=json.dumps(p.headings),word_count=len(main.split()),lang=p.lang,author=p.meta.get('author',''),published_date='',modified_date='',breadcrumbs=any(l.get('aria-label')=='Breadcrumb' for l in p.links) or 'BreadcrumbList' in types,schema_types=';'.join(types),internal_inbound_links=inbound[u],internal_outbound_links=sum(x['source_url']==u for x in internal),external_outbound_links=len([x for x in external if x['source_url']==u]),broken_internal_links=sum(x['source_url']==u and x['link_type']=='internal' for x in broken),broken_external_links=sum(x['source_url']==u and x['link_type']=='external' for x in broken),image_count=len(p.images),missing_alt=sum('alt' not in im for im in p.images),missing_dimensions=sum(not im.get('width') or not im.get('height') for im in p.images),page_depth=depth.get(u,''),orphan=u not in depth,sitemap_included=u in sitemap,duplicate_title=titles[p.title]>1 if u in sitemap else False,duplicate_description=descs[d]>1 if u in sitemap else False,content_hash=hashlib.sha256(main.encode()).hexdigest(),issues=';'.join(issues))
        inventory.append(row);metadata.append(dict(row,**{k.replace(':','_'):p.meta.get(k,'') for k in ['og:title','og:description','og:url','og:type','og:image','twitter:card']}));schemas.append(dict(phase=a.phase,url=u,schema_types=';'.join(types),json_ld_blocks=len(p.schemas),valid_json=valid,visible_match='manual template/content review required' if types else 'N/A',rich_result_eligible='not claimed',issues='' if valid else 'JSON parse error',recommended_action='describe visible content; no fabricated course eligibility'))
        for im in p.images+([{'src':p.meta['og:image'],'alt':p.meta.get('og:image:alt',''),'width':p.meta.get('og:image:width',''),'height':p.meta.get('og:image:height',''),'role':'OG'}] if p.meta.get('og:image') else []):
            iu=urljoin(u,im.get('src',''));f=root/urlsplit(iu).path.lstrip('/');images.append(dict(phase=a.phase,page_url=u,image_url=iu,alt_text=im.get('alt',''),alt_present='alt' in im,decorative=im.get('alt')=='',width=im.get('width',''),height=im.get('height',''),loading=im.get('loading','not in page viewport' if im.get('role') else 'eager'),format=f.suffix,local_exists=f.exists(),file_bytes=f.stat().st_size if f.exists() else '',issues='' if f.exists() else 'missing asset'))
        if u in sitemap:
            content.append(dict(row,primary_purpose=d,search_intent='learn and practice' if kind in ['lessons','builds'] else 'navigate course/reference',target_audience='developers with basic programming familiarity',central_entity=h1[0] if h1 else '',primary_query_theme=h1[0] if h1 else '',supporting_topics=';'.join(x[1] for x in p.headings if x[0]=='h2'),first_hand_signals='compiler-run examples, real diagnostics, exercises, linked source' if kind=='lessons' else 'owned curriculum and project briefs',content_gap='human review notes in methodology.md',competing_internal_url='',recommended_action='preserve technical meaning; distinguish introductory versus advanced lessons'))
            keywords.append(dict(phase=a.phase,url=u,primary_topic=h1[0],primary_entity='TypeScript',search_intent='learning/reference',primary_query_theme=h1[0],secondary_queries=d,related_entities='JavaScript; runtime; compiler',relevant_questions='How do I use '+h1[0]+'?',competing_internal_url='',content_gap='see content review',recommended_action='keep topic-specific verified examples'))
    csvwrite(out,f'{a.phase}.csv',inventory)
    for name,rows in [('site-inventory.csv',inventory),('metadata-audit.csv',metadata),('schema-audit.csv',schemas),('image-audit.csv',images),('content-audit.csv',content),('keyword-map.csv',keywords),('indexability.csv',inventory),('crawlability.csv',inventory),('internal-links.csv',internal),('external-links.csv',external),('broken-links.csv',broken)]:csvwrite(out,name,rows,append=a.phase=='after')
    indexed=[r for r in inventory if r['sitemap_included']]
    summary=dict(phase=a.phase,generated_pages=len(pages),canonical_pages=len(indexed),indexable_pages=sum(r['indexable'] for r in inventory),missing_titles=sum(not r['title'] for r in indexed),duplicate_titles=sum(r['duplicate_title'] for r in indexed),missing_descriptions=sum(not r['meta_description'] for r in indexed),duplicate_descriptions=sum(r['duplicate_description'] for r in indexed),missing_canonicals=sum(not r['canonical'] for r in indexed),h1_problems=sum('H1 count' in r['issues'] for r in indexed),broken_internal_links=sum(r['link_type']=='internal' for r in broken),external_404_410_destinations=len(set(r['destination_url'] for r in broken if r['link_type']=='external')),external_indeterminate_destinations=sum(x['status'] in [0,401,403,405,429] for x in ext.values()),indexable_orphans=sum(r['orphan'] and r['indexable'] for r in inventory),indexable_depth_over_three=sum(isinstance(r['page_depth'],int) and r['page_depth']>3 and r['indexable'] for r in inventory),schema_coverage=sum(bool(r['schema_types']) for r in indexed),schema_parse_errors=sum(not r['valid_json'] for r in schemas),missing_alt=sum(r['missing_alt'] for r in inventory),missing_dimensions=sum(r['missing_dimensions'] for r in inventory),unique_og_images=len(set(r['og_image'] for r in metadata if r['sitemap_included'])),production_non200_canonical=sum(r['production_status']!=200 for r in indexed),field_CWV=NA,rankings=NA,ai_citations=NA,internal_scores='Not assigned: incomplete field/platform data; raw metrics are reported instead.')
    (out/f'{a.phase}-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
