'use strict';
(function(){
 const $=(id)=>document.getElementById(id);
 const raw=$('appData');
 const db=JSON.parse(raw.textContent);
 const apps=db.apps, categories=db.cats;
 const nf=new Intl.NumberFormat('vi-VN');
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

 // Mobile navigation
 const mt=$('mobile-toggle'),menu=$('mobile-menu');
 function closeMenu(){menu.classList.remove('is-open');mt.setAttribute('aria-expanded','false');mt.textContent='☰';document.body.classList.remove('menu-open')}
 mt.addEventListener('click',()=>{let open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);mt.setAttribute('aria-expanded',String(open));mt.textContent=open?'✕':'☰';document.body.classList.toggle('menu-open',open)});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 window.addEventListener('resize',()=>{if(innerWidth>970)closeMenu()});

 // Simple visible progressive enhancement, never hide content when IntersectionObserver missing
 const reveals=[...document.querySelectorAll('.reveal')];
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}})},{threshold:.04,rootMargin:'0px 0px -20px 0px'});
  reveals.forEach(el=>observer.observe(el));
 }else reveals.forEach(el=>el.classList.add('in'));

 // Lightweight count up, initial values are already readable without JS
 if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const node=entry.target;obs.unobserve(node);const to=Number(node.dataset.target);const start=performance.now();function draw(t){let pct=Math.min(1,(t-start)/900),k=1-Math.pow(1-pct,3);node.textContent=nf.format(Math.round(to*k));if(pct<1)requestAnimationFrame(draw)}requestAnimationFrame(draw)})},{threshold:.8});
  document.querySelectorAll('.count-up').forEach(el=>obs.observe(el));
 }

 // Tabbed feature imagery
 const tabs=[...document.querySelectorAll('[data-tab]')];
 const panelIds=['filter','qos','route'];
 function showTab(which,focus=false){
  tabs.forEach(b=>{const active=b.dataset.tab===which;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus()});
  panelIds.forEach(x=>{const el=$('panel-'+x);const yes=x===which;el.hidden=!yes;el.classList.toggle('active',yes)});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>showTab(tab.dataset.tab));
  tab.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'&&e.key!=='Home'&&e.key!=='End')return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;showTab(tabs[n].dataset.tab,true)})
 });
 document.querySelectorAll('[data-open-tab]').forEach(a=>a.addEventListener('click',()=>showTab(a.dataset.openTab)));

 // Interactive DPI demo driven by the attached, actual application data
 const appSelect=$('demo-app'),policy=$('demo-policy'),action=$('demo-action');
 const choices={
  filter:[['allow','Cho phép'],['block','Chặn']],
  qos:[['high','High / Class 1'],['medium','Medium'],['low','Lowest / Others']],
  route:[['WAN1','Đi WAN1'],['WAN2','Đi WAN2']]
 };
 const lookup=new Map(apps.map(a=>[a[0].toLowerCase(),a]));
 function syncChoices(){const keep=action.value;action.innerHTML='';choices[policy.value].forEach(([value,label])=>{const opt=document.createElement('option');opt.value=value;opt.textContent=label;action.appendChild(opt)});if(choices[policy.value].some(v=>v[0]===keep))action.value=keep;else action.value=policy.value==='filter'?'block':policy.value==='qos'?'high':'WAN2';updateDemo()}
 function updateDemo(){
  let name=appSelect.value,a=lookup.get(name.toLowerCase());let mode=policy.value;let decision=action.value;
  $('demo-in').textContent=name;
  $('demo-warning').textContent='';
  if(!a){$('demo-heading').textContent='Không có mục khớp chính xác trong cơ sở dữ liệu';$('demo-description').textContent='Hãy kiểm tra danh sách hỗ trợ của firmware thực tế.';$('demo-out').textContent='Kiểm tra';return}
  if(mode==='route'&&a[2]===0){
   $('demo-heading').textContent=name+' chưa có trong danh sách App Route Policy';
   $('demo-description').textContent='Vẫn có thể nhận diện ứng dụng, nhưng không thể chọn WAN trực tiếp bằng App Service trên cơ sở dữ liệu hiện tại.';
   $('demo-warning').textContent='Hướng xử lý: xem xét Destination = Domain nếu phù hợp (ví dụ YouTube: youtube.com, googlevideo.com).';
   $('demo-out').textContent='Dùng Domain';
  }else if(mode==='route'){
   $('demo-heading').textContent=name+' hỗ trợ App Route Policy';
   $('demo-description').textContent='Ví dụ chính sách: chọn đường '+decision+' cho các kết nối phù hợp. Kết quả thực tế phụ thuộc luật và quá trình router nhận diện/học lưu lượng.';
   $('demo-warning').textContent='Kết nối đầu tiên có thể vẫn đi theo WAN mặc định.';
   $('demo-out').textContent=decision;
  }else if(mode==='qos'){
   const label={high:'Ưu tiên cao',medium:'Ưu tiên trung bình',low:'Ưu tiên thấp'}[decision];
   $('demo-heading').textContent='App QoS có thể phân loại '+name;
   $('demo-description').textContent='Đặt mức '+label+' cho ứng dụng. Router điều phối thứ tự ưu tiên khi có cạnh tranh băng thông.';
   $('demo-warning').textContent='App QoS không tự tăng tốc độ Internet của nhà mạng.';
   $('demo-out').textContent=label;
  }else{
   $('demo-heading').textContent='Có thể '+(decision==='allow'?'cho phép ':'chặn ')+name+' bằng Content Filters';
   $('demo-description').textContent='Mô phỏng chính sách '+(decision==='allow'?'Allow':'Block')+' trên nhóm người dùng/lịch được chọn. Chỉ có hiệu lực khi người quản trị cấu hình luật trên router.';
   $('demo-out').textContent=decision==='allow'?'Cho phép':'Chặn';
  }
 }
 policy.addEventListener('change',syncChoices);appSelect.addEventListener('change',updateDemo);action.addEventListener('change',updateDemo);syncChoices();

 // Full locally embedded 4,620-row searchable dataset; page size avoids huge DOM & mobile stalls
 const search=$('app-search'),category=$('app-category'),route=$('app-route-filter'),out=$('app-results'),count=$('app-count'),more=$('load-more');
 categories.forEach((c,i)=>{let opt=document.createElement('option');opt.value=String(i);opt.textContent=c.name+' ('+nf.format(c.n)+')';category.appendChild(opt)});
 const prepared=apps.map(a=>({name:a[0],cat:a[1],route:a[2],s:normalize(a[0]),c:normalize(categories[a[1]].name)}));
 let rows=prepared,shown=40,sortBy='name',sortDirection=1;
 function comparator(a,b){let x,y;if(sortBy==='name'){x=a.name;y=b.name}else if(sortBy==='cat'){x=categories[a.cat].name;y=categories[b.cat].name}else{x=a.route;y=b.route};let v=typeof x==='string'?x.localeCompare(y,'vi',{sensitivity:'base'}):x-y;return sortDirection*v||a.name.localeCompare(b.name,'vi')}
 function refresh(){
  const q=normalize(search.value.trim()),c=category.value,r=route.value;
  rows=prepared.filter(a=>(!q||a.s.includes(q)||a.c.includes(q))&&(!c||a.cat===Number(c))&&(!r||String(a.route)===r)).sort(comparator);
  shown=40;draw();
 }
 function draw(){
  out.innerHTML=rows.length?rows.slice(0,shown).map(a=>`<tr><td>${safe(a.name)}</td><td>${safe(categories[a.cat].name)}</td><td class="center"><span class="tick" aria-label="Có">✓</span></td><td class="center"><span class="tick" aria-label="Có">✓</span></td><td class="center">${a.route?'<span class="tick" aria-label="Có">✓</span>':'<span class="dash" aria-label="Không">—</span>'}</td></tr>`).join(''):'<tr><td colspan="5" style="text-align:center;padding:27px">Không tìm thấy ứng dụng phù hợp. Hãy thử một từ khóa khác.</td></tr>';
  count.textContent='Hiển thị '+nf.format(Math.min(shown,rows.length))+' / '+nf.format(rows.length)+' ứng dụng phù hợp (cơ sở dữ liệu có '+nf.format(apps.length)+' ứng dụng).';
  more.hidden=rows.length<=shown;
 }
 let pending;search.addEventListener('input',()=>{clearTimeout(pending);pending=setTimeout(refresh,110)});category.addEventListener('change',refresh);route.addEventListener('change',refresh);more.addEventListener('click',()=>{shown+=40;draw()});
 document.querySelectorAll('[data-sort]').forEach(b=>b.addEventListener('click',()=>{let k=b.dataset.sort;if(sortBy===k)sortDirection=-sortDirection;else{sortBy=k;sortDirection=1}refresh()}));
 document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>{search.value=b.dataset.quick;category.value='';route.value='';refresh();search.focus()}));
 refresh();
})();
