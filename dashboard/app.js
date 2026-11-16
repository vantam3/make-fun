'use strict';
const D = window.UNDERCURRENT;
const $ = id => document.getElementById(id);
const money = n => '$' + (n >= 1e9 ? (n/1e9).toFixed(2)+'B' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : Math.round(n).toLocaleString('en-US'));
const pct = n => n == null ? 'Unreported' : (n > 0 ? '+' : '') + n.toFixed(2) + '%';
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved = new Set();
try { const stored = JSON.parse(localStorage.getItem('undercurrent-selected') || '[]'); if (Array.isArray(stored)) saved = new Set(stored.filter(x=>typeof x==='string')); } catch {}
let peerMode = false, sort = 'rank', direction = 1;
function persist() { try { localStorage.setItem('undercurrent-selected',JSON.stringify([...saved].sort())); } catch {} }
function options(id, values) { for (const v of [...new Set(values)].sort()) { const o = document.createElement('option'); o.value=v; o.textContent=v; $(id).append(o); } }
options('category', [...D.rows,...D.peers].map(p=>p.category));
options('chain', [...D.rows,...D.peers].flatMap(p=>p.chains));
$('asof').textContent = D.as_of;
$('universe').textContent = D.rows.length;
$('coverage').textContent = D.rows.filter(p=>p.watchlist).length + ' / ' + D.watchlist_size;
$('peers').textContent = D.peers.length;
$('source').textContent = 'SOURCE / ' + (typeof D.source === 'string' ? D.source : JSON.stringify(D.source));
function render() {
  const query = $('search').value.trim().toLowerCase();
  const rows = (peerMode ? D.peers : D.rows).filter(p => (!query || [p.name,p.slug,p.category,...p.chains].join(' ').toLowerCase().includes(query)) && (!$('category').value || p.category===$('category').value) && (!$('chain').value || p.chains.includes($('chain').value)) && (!$('scope').value || ($('scope').value==='official' ? D.rows.some(r=>r.slug===p.slug && r.watchlist) : saved.has(p.slug))));
  rows.sort((a,b)=> { const x=a[sort], y=b[sort]; if(x==null && y!=null)return 1; if(y==null && x!=null)return -1; const cmp=typeof x==='string' ? (x<y?-1:x>y?1:0) : (x??0)-(y??0); return direction*cmp || (a.slug<b.slug?-1:a.slug>b.slug?1:0); });
  $('rows').innerHTML = rows.map(p=>`<tr><td>${p.rank ?? '—'}</td><td><button class="protocol" data-detail="${esc(p.slug)}">${esc(p.name)}<small>${esc(p.category)} · ${esc(p.chains.join(', ') || 'Chains unreported')}</small></button></td><td>${money(p.tvl_usd)}</td><td class="${p.change_7d>0?'up':p.change_7d<0?'down':'quiet'}">${pct(p.change_7d)}</td><td>${money(peerMode?p.mcap_usd:p.implied_value_usd)}<small>${peerMode?'Recorded market cap':money(p.low_usd)+' – '+money(p.high_usd)}</small></td><td><span class="badge">${peerMode?'TOKEN RECORDED':p.watchlist?'WATCHLIST':'NO TOKEN RECORDED'}</span></td><td><button class="save" data-save="${esc(p.slug)}" aria-label="Select ${esc(p.name)}" aria-pressed="${saved.has(p.slug)}">${saved.has(p.slug)?'★':'☆'}</button></td></tr>`).join('');
  $('empty').hidden=rows.length>0;
  $('count').textContent=rows.length+' protocols';
  $('shown').textContent=rows.length+' of '+(peerMode?D.peers.length:D.rows.length)+' entries · '+saved.size+' selected';
  $('value-head').textContent=peerMode?'Recorded market cap ↕':'Conditional value ↕';
  for(const b of document.querySelectorAll('[data-sort]')) b.parentElement.setAttribute('aria-sort',b.dataset.sort===sort?(direction===1?'ascending':'descending'):'none');
}
function detail(slug) {
  const p=(peerMode?D.peers:D.rows).find(r=>r.slug===slug); if(!p)return;
  const isPeer=peerMode;
  $('detail-body').innerHTML=`<div class="eyebrow">RESEARCH FILE / ${esc(p.slug)}</div><h2 id="detail-title">${esc(p.name)}</h2><p>${esc(p.category)} · ${esc(p.chains.join(' / ') || 'Chains unreported')}</p><span class="badge">${isPeer?'TOKEN RECORDED':p.watchlist?'OFFICIAL WATCHLIST':'NO TOKEN RECORDED'}</span><div class="valuation">${money(isPeer?p.mcap_usd:p.implied_value_usd)}</div><p>${isPeer?'Recorded market cap used for calibration.':'Conditional implied market cap · scenario range '+money(p.low_usd)+' – '+money(p.high_usd)+'. This range is heuristic, not a confidence interval.'}</p><div class="metrics"><div><span>SNAPSHOT TVL</span><b>${money(p.tvl_usd)}</b></div><div><span>7D TVL CHANGE</span><b>${pct(p.change_7d)}</b></div><div><span>TRACKED SINCE</span><b>${esc(p.listed_at || 'Unreported')}</b></div></div>${isPeer?`<h3>Calibration evidence</h3><p>Recorded symbol: ${esc(p.symbol || 'Unreported')}; Gecko identifier: ${esc(p.gecko_id || 'Unreported')}. Market cap / TVL: ${p.ratio.toFixed(3)}×. This is recorded evidence, not a recommendation.</p>`:`<h3>How this value was derived</h3><div class="formula">TVL × ${p.ratio.toFixed(3)}× peer ratio × ${p.growth_multiplier.toFixed(3)} growth × ${p.maturity_multiplier.toFixed(3)} maturity</div><p>${p.peer_n} positive category peers; ${(p.peer_weight*100).toFixed(1)}% category weight, remainder global. Category median: ${p.peer_median===null?'unavailable':p.peer_median.toFixed(3)+'×'}. Global median: ${D.global.median.toFixed(3)}×. Tracking age: ${p.age_days===null?'unreported':p.age_days+' days'}; tracking age is not launch age.</p><h3>No-cost research / contribution plan</h3><ol>${p.farm_steps.map(s=>'<li>'+esc(s)+'</li>').join('')}</ol>`}<h3>Risks & evidence limits</h3><p>TVL is not revenue or redeemable equity; it may include recursive deposits. Category peers differ in supply, rights and accounting. Seven-day changes can reflect asset prices. Missing token records do not establish token absence. No launch, eligibility, allocation or reward is promised. Independently verify official documentation before any action.</p><p>Snapshot as of ${esc(D.as_of)}. No live market data or wallet connection.</p>`;
  $('detail').showModal(); $('detail').scrollTop=0;
}
$('rows').addEventListener('click',e=> { const d=e.target.closest('[data-detail]'), b=e.target.closest('[data-save]'); if(d)detail(d.dataset.detail); if(b){const slug=b.dataset.save;saved.has(slug)?saved.delete(slug):saved.add(slug);persist();render();} });
for(const id of ['search','category','chain','scope']) $(id).addEventListener(id==='search'?'input':'change',render);
$('clear').onclick=()=>{for(const id of ['search','category','chain','scope'])$(id).value='';render();};
for(const b of document.querySelectorAll('[data-sort]')) b.onclick=()=>{const k=peerMode && b.dataset.sort==='implied_value_usd'?'mcap_usd':b.dataset.sort; direction=sort===k?-direction:(['name','rank'].includes(k)?1:-1);sort=k;render();};
function mode(peer){peerMode=peer;sort=peer?'mcap_usd':'rank';direction=peer?-1:1;$('radar-tab').setAttribute('aria-pressed',String(!peer));$('peer-tab').setAttribute('aria-pressed',String(peer));$('scope').value='';render();}
$('radar-tab').onclick=()=>mode(false);$('peer-tab').onclick=()=>mode(true);
$('detail-close').onclick=()=>$('detail').close();
$('method-close').onclick=()=>$('method').close();
$('method-open').onclick=()=>$('method').showModal();
$('method-body').innerHTML=`<p>Positive recorded market-cap / TVL pairs form ${D.peers.length} calibration peers. Ratios are winsorized at each set's 10th and 90th percentiles, then summarized by median and quartiles. Global median: ${D.global.median.toFixed(3)}×.</p><p>Category medians shrink toward the global median in log space with weight n / (n + 8). A category with no usable peers uses the global median. TVL is multiplied by that ratio, a bounded growth adjustment (1 + 0.25 × seven-day percentage / 100, clamped to ±50%) and a maturity factor (0.8 to 1.0 across 730 tracking days; 0.9 if unknown). Missing growth uses neutral 1.0. Tracking dates do not establish launch dates.</p><p>The scenario range uses peer quartile dispersion, sparse-category weight and missing data; its factor is bounded from 2 to 12. It expresses model sensitivity, not a statistical confidence interval. Values are rounded whole USD, capped at $100 trillion, and sorted descending with slug as a stable tie-break.</p><p>Only records without token indicators, plus all official watchlist entries, enter the conditional board. Token-recorded calibration peers have a separate tab. No missing record proves token absence. No probability of issuance or token price is estimated.</p><p>All plans are $0 research, paper exercises or explicitly available faucet testnets. No deposits, trades, transfers or wallet connections are required. Source data and methodology are fixed to this snapshot.</p>`;
render();
