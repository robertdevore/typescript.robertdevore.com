# Data availability — 2026-09-06

| Source                                   | Availability                         | Limits                                                                                                                                 |
| ---------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Repository and pinned build              | Available                            | Untouched archived build; generated output and source inspected.                                                                       |
| Production HTTP/DNS/TLS                  | Available                            | Dated active probes, not a complete access-log history.                                                                                |
| Lighthouse 13.4.1                        | Available                            | Single mobile simulated-throttling run per template/phase; installed Chrome, same machine. Not statistical evidence of a speed change. |
| Google Search Console                    | NOT AVAILABLE — DATA ACCESS REQUIRED | Clicks, impressions, CTR, positions, coverage and generative-AI inclusion setting not verified.                                        |
| Bing Webmaster Tools                     | NOT AVAILABLE — DATA ACCESS REQUIRED | Index coverage and AI reports not verified.                                                                                            |
| Analytics and complete edge/request logs | NOT AVAILABLE — DATA ACCESS REQUIRED | Cannot enumerate historical 404/5xx URLs or quantify traffic; beacon presence is not account data access.                              |
| CrUX / field CWV                         | NOT AVAILABLE — DATA ACCESS REQUIRED | No field LCP, INP, CLS or representative visitor distribution claimed.                                                                 |
| Authorized rank tracker                  | NOT AVAILABLE — DATA ACCESS REQUIRED | Search-tool observations are not Google/Bing rank measurements.                                                                        |
| Controlled AI answer/citation panels     | NOT AVAILABLE — DATA ACCESS REQUIRED | No fabricated mentions, citations, competitors or AI visibility score.                                                                 |
| Social platform debugger/cache           | NOT AVAILABLE — DATA ACCESS REQUIRED | Image GETs, type, dimensions and metadata verified directly.                                                                           |

Read-only probes with crawler user-agent strings returned 200 at baseline. They do not impersonate verified crawler IP ranges and cannot prove that every genuine provider request succeeds. No training policy, DNS, WAF, analytics configuration or search-account setting was changed.
