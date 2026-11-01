const KEY='bambooMoney_v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const today=()=>new Date().toISOString().slice(0,10);
const monthNow=()=>today().slice(0,7);
const money=n=>'Rp'+Number(n||0).toLocaleString('id-ID');
const monthName=m=>{if(!m)return '';const [y,mo]=m.split('-').map(Number);return new Date(y,mo-1,1).toLocaleDateString('id-ID',{month:'long',year:'numeric'});};
let data=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{opening:{bank:0,wallet:0},tx:[]}}catch{return {opening:{bank:0,wallet:0},tx:[]}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function sumAccount(account){let v=Number(data.opening?.[account]||0);for(const t of data.tx){if(t.type==='income'&&t.account===account)v+=t.amount;if((t.type==='expense'||t.type==='invest')&&t.account===account)v-=t.amount;if(t.type==='transfer'){if(t.from===account)v-=t.amount;if(t.to===account)v+=t.amount;}}return v;}
function investTotal(){return data.tx.filter(t=>t.type==='invest').reduce((a,t)=>a+t.amount,0);}
function txMonthTotal(m,type){return data.tx.filter(t=>t.date.startsWith(m)&&t.type===type).reduce((a,t)=>a+t.amount,0);}
function addTx(t){data.tx.push({...t,id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())});save();render();toast('Transaksi berhasil disimpan');}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300);}
function accountName(a){return a==='bank'?'Bank':'Dompet';}
function iconFor(t){return ({income:'📥',expense:'🛍️',transfer:'🔁',invest:'🌱'})[t.type]||'🧾';}
function labelFor(t){if(t.type==='transfer')return `Transfer ${accountName(t.from)} → ${accountName(t.to)}`;if(t.type==='invest')return 'Setoran investasi';return t.title;}
function amountText(t){if(t.type==='income')return '+'+money(t.amount);if(t.type==='expense'||t.type==='invest')return '-'+money(t.amount);return money(t.amount);}
function amountClass(t){return t.type==='income'?'positive':t.type==='expense'||t.type==='invest'?'negative':'neutral';}
function dateText(d){return new Date(d+'T00:00:00').toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});}
function txMeta(t){if(t.type==='transfer')return `${dateText(t.date)} · ${accountName(t.from)} ke ${accountName(t.to)}`;return `${dateText(t.date)} · ${t.type==='invest'?'Investasi':accountName(t.account)}`;}
function renderList(el,items){if(!items.length){el.innerHTML='<div class="empty-state"><b>🌿</b>Belum ada transaksi di periode ini.</div>';return;}el.innerHTML=items.slice().sort((a,b)=>b.date.localeCompare(a.date)||String(b.id).localeCompare(String(a.id))).map(t=>`<div class="tx-item"><div class="tx-icon">${iconFor(t)}</div><div class="tx-main"><strong>${esc(labelFor(t))}</strong><small>${esc(txMeta(t))}${t.note?' · '+esc(t.note):''}</small></div><div class="tx-amount ${amountClass(t)}">${amountText(t)}</div></div>`).join('');}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){const bank=sumAccount('bank'),wallet=sumAccount('wallet'),m=monthNow();$('#totalBalance').textContent=money(bank+wallet);$('#bankBalance').textContent=money(bank);$('#walletBalance').textContent=money(wallet);$('#dashboardInvest').textContent=money(investTotal());$('#investBalance').textContent=money(investTotal());$('#investCount').textContent=data.tx.filter(t=>t.type==='invest').length+' kali setoran tercatat';$('#currentMonth').textContent=monthName(m);$('#monthIncome').textContent=money(txMonthTotal(m,'income'));$('#monthExpense').textContent=money(txMonthTotal(m,'expense'));$('#todayLabel').textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});renderList($('#recentList'),data.tx.slice(-5));renderList($('#investmentList'),data.tx.filter(t=>t.type==='invest'));
 renderMonthPage('txMonth','allTransactions','txIncome','txExpense');renderMonthPage('historyMonth','historyList','historyIncome','historyExpense');$('#historyCount').textContent=data.tx.filter(t=>t.date.startsWith($('#historyMonth').value||m)).length;
 $('#initialBank').value=data.opening.bank||0;$('#initialWallet').value=data.opening.wallet||0;
}
function renderMonthPage(inputId,listId,incomeId,expenseId){const m=$('#'+inputId).value||monthNow();const items=data.tx.filter(t=>t.date.startsWith(m));$('#'+incomeId).textContent=money(items.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0));$('#'+expenseId).textContent=money(items.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0));renderList($('#'+listId),items);}
function showPage(page){$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));$$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));closeDrawer();$('#mainContent').scrollTop=0;if(page==='transactions'||page==='history')render();if(page==='investment')renderList($('#investmentList'),data.tx.filter(t=>t.type==='invest'));}
function openDrawer(){$('#drawer').classList.add('open');$('#scrim').classList.add('show');}
function closeDrawer(){$('#drawer').classList.remove('open');$('#scrim').classList.remove('show');}
function setFormDates(){['incomeForm','expenseForm','transferForm','investForm'].forEach(id=>{const f=$('#'+id);f.elements.date.value=today();});}
function readAmount(form){const n=Number(form.elements.amount.value);if(!Number.isSafeInteger(n)||n<=0){toast('Masukkan jumlah uang yang benar.');return null;}return n;}
function submitMoney(formId,type){const f=$('#'+formId);f.addEventListener('submit',e=>{e.preventDefault();const amount=readAmount(f);if(!amount)return;const account=f.elements.account.value;if(type!=='income'&&sumAccount(account)<amount){toast('Saldo '+accountName(account)+' tidak mencukupi.');return;}addTx({type,date:f.elements.date.value,title:f.elements.title.value.trim(),amount,account,note:f.elements.note.value.trim()});f.reset();f.elements.date.value=today();});}
submitMoney('incomeForm','income');submitMoney('expenseForm','expense');
$('#transferForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,amount=readAmount(f),from=f.elements.from.value,to=f.elements.to.value;if(!amount)return;if(from===to){toast('Pilih rekening asal dan tujuan yang berbeda.');return;}if(sumAccount(from)<amount){toast('Saldo '+accountName(from)+' tidak mencukupi.');return;}addTx({type:'transfer',date:f.elements.date.value,amount,from,to,note:f.elements.note.value.trim()});f.reset();f.elements.date.value=today();});
$('#investForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,amount=readAmount(f),account=f.elements.account.value;if(!amount)return;if(sumAccount(account)<amount){toast('Saldo '+accountName(account)+' tidak mencukupi.');return;}addTx({type:'invest',date:f.elements.date.value,title:f.elements.title.value.trim(),amount,account});f.reset();f.elements.date.value=today();});
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>{closeQuick();showPage(b.dataset.go)}));
$('#menuBtn').onclick=openDrawer;$('#bottomMenu').onclick=openDrawer;$('#closeDrawer').onclick=closeDrawer;$('#scrim').onclick=closeDrawer;
function openQuick(){$('#quickModal').classList.add('show')}function closeQuick(){$('#quickModal').classList.remove('show')}
$('#quickAdd').onclick=openQuick;$('#bottomAdd').onclick=openQuick;$('#closeQuick').onclick=closeQuick;$('#quickModal').addEventListener('click',e=>{if(e.target.id==='quickModal')closeQuick()});
$('#txMonth').value=monthNow();$('#historyMonth').value=monthNow();$('#txMonth').addEventListener('change',()=>renderMonthPage('txMonth','allTransactions','txIncome','txExpense'));$('#historyMonth').addEventListener('change',()=>{renderMonthPage('historyMonth','historyList','historyIncome','historyExpense');$('#historyCount').textContent=data.tx.filter(t=>t.date.startsWith($('#historyMonth').value)).length;});
$('#saveOpening').onclick=()=>{if(data.tx.length){toast('Saldo awal terkunci setelah transaksi pertama.');return;}data.opening={bank:Math.max(0,Number($('#initialBank').value)||0),wallet:Math.max(0,Number($('#initialWallet').value)||0)};save();render();toast('Saldo awal berhasil disimpan.');};
$('#exportData').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='bamboo-money-cadangan-'+today()+'.json';a.click();URL.revokeObjectURL(url);toast('Cadangan data diunduh.');};
$('#importData').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!parsed||!parsed.opening||!Array.isArray(parsed.tx))throw Error();if(!confirm('Impor akan mengganti data saat ini. Lanjutkan?'))return;data=parsed;save();render();toast('Data berhasil dipulihkan.');}catch{toast('File cadangan tidak valid.');}e.target.value='';});
setFormDates();render();
if('serviceWorker'in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
