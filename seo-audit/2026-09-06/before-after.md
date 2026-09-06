# Before and after — 2026-09-06

| Technical metric                         |                               Before |                                After |
| ---------------------------------------- | -----------------------------------: | -----------------------------------: |
| Generated HTML / sitemap candidates      |                               50 /47 |                               50 /47 |
| Indexable candidates returning200        |                                   47 |                                   47 |
| Missing or duplicate titles/descriptions |                                    0 |                                    0 |
| Missing canonicals / H1 problems         |                                 0 /0 |                                 0 /0 |
| Actual broken internal links             |                                    0 |                                    0 |
| Confirmed external404/410 destinations   |                                    0 |                                    0 |
| Indexable orphans / depth over3          |                                 0 /0 |                                 0 /0 |
| Missing image alt / dimensions           |                                 0 /0 |                                 0 /0 |
| Structured-data coverage                 |                                0 /47 |                               47 /47 |
| JSON-LD parse errors                     |                                    0 |                                    0 |
| Unique valid OG images                   |                                    1 |                                   42 |
| Missing OG image on a canonical page     |                                    0 |                                    0 |
| Tested path-normalization status         |                                  307 |                                  301 |
| Crawler/social UA probes returning200    |                               45 /45 |                               45 /45 |
| P0 / P1 root causes                      |                                 0 /1 |                                 0 /1 |
| Internal SEO / AI heuristic score        |                         Not assigned |                         Not assigned |
| Field CWV, rankings, citations           | NOT AVAILABLE — DATA ACCESS REQUIRED | NOT AVAILABLE — DATA ACCESS REQUIRED |

The baseline CSV's one broken-link flag is a parser artefact on the 404 page. The unchanged raw receipt and correction are both preserved; this is not counted as a remediation win. One after-phase GitHub GET ended in an incomplete read; the independent retry is recorded in raw/external-retry.json, rather than silently replacing the original observation. External access errors are not called broken links.

The raw Lighthouse samples and performance.csv retain every run, including the local Speed Index outlier and lower after scores. Field data is absent; no speed, ranking or citation improvement is claimed. Core curriculum titles and descriptions are unchanged, and the word-count comparison found no content loss. The expected hash changes come from visible breadcrumbs.
