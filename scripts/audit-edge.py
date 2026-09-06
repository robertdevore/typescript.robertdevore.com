"""Capture scoped edge redirects and user-agent probes; no configuration writes."""
import argparse,json
from pathlib import Path
from urllib.request import Request,build_opener,HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import urljoin,urlsplit
import importlib.util
spec=importlib.util.spec_from_file_location("audit_site",Path(__file__).with_name("audit-site.py"))
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
fetch,csvwrite,ORIGIN=audit.fetch,audit.csvwrite,audit.ORIGIN
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args):return None
p=argparse.ArgumentParser();p.add_argument('--phase',required=True);p.add_argument('--out',default='seo-audit/2026-09-06');a=p.parse_args();out=Path(a.out);receipt=out/'raw'/f'{a.phase}-edge.json'
if receipt.exists():raise SystemExit('Already captured')
rows=[];raw=[]
variants=[ORIGIN+'/',ORIGIN.replace('https:','http:')+'/',ORIGIN+'/lessons/performance',ORIGIN+'/lessons/performance?audit=keep',ORIGIN+'/lessons/performance/?audit=keep',ORIGIN+'/index.html',ORIGIN+'/definitely-not-a-lesson/', 'https://www.typescript.robertdevore.com/', 'http://www.typescript.robertdevore.com/']
for source in variants:
    url=source;chain=[]
    for _ in range(6):
        try:
            r=build_opener(NoRedirect).open(Request(url,headers={'User-Agent':'TypeScriptCourseAudit/1.0'}),timeout=20);status=r.status;headers=dict(r.headers);r.close()
        except HTTPError as e:status=e.code;headers=dict(e.headers)
        except Exception as e:chain.append({'url':url,'status':0,'error':str(e)});break
        loc=headers.get('Location',headers.get('location',''));chain.append({'url':url,'status':status,'location':loc,'headers':headers})
        if status not in [301,302,303,307,308] or not loc:break
        url=urljoin(url,loc)
    raw.append({'source':source,'chain':chain});rows.append(dict(phase=a.phase,source_url=source,source_variant='host/path/query probe',http_status=chain[0]['status'],target_url=chain[0].get('location',''),chain_length=len(chain)-1,final_status=chain[-1]['status'],canonical_target=url,query_preserved='audit=keep' in url if 'audit=keep' in source else 'N/A',verification='live GET',issues='temporary slash redirect' if chain[0]['status']==307 else 'unprovisioned www subdomain' if chain[0]['status']==0 else ''))
receipts=[];bots=[]
for bot,purpose in [('Googlebot','search indexing'),('bingbot','search indexing'),('OAI-SearchBot','AI search'),('ChatGPT-User','user-triggered fetch'),('GPTBot','training; policy unchanged'),('Claude-SearchBot','AI search'),('PerplexityBot','AI search'),('Twitterbot','social preview'),('facebookexternalhit','social preview')]:
    for path in ['/robots.txt','/sitemap.xml','/','/lessons/performance/','/assets/social.png']:
        r=fetch(ORIGIN+path,bot);r.pop('body',None);receipts.append(dict(crawler=bot,**r));bots.append(dict(crawler=bot,purpose=purpose,robots_access='Allow: / for all; unchanged',live_status=r['status'],waf_or_cdn_result='request allowed' if r['status']==200 else 'blocked/indeterminate',recommended_action='verify genuine provider IPs with logs; UA spoofing does not prove crawler access',action_taken='read-only probe',evidence=f'raw/{a.phase}-edge.json {path}',phase=a.phase))
receipt.write_text(json.dumps({'redirects':raw,'crawlers':receipts},indent=2)+'\n');csvwrite(out,'redirects.csv',rows,append=a.phase=='after');csvwrite(out,'crawler-access.csv',bots,append=a.phase=='after');print('Captured',len(rows),'redirect variants and',len(bots),'crawler probes')
