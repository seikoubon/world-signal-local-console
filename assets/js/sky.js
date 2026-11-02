"use strict";
(() => {
 const el = id => document.getElementById(id);
 const TTL=30*60*1000, KEY='world-signal-tokyo-sky-v1';
 const dateTokyo = (date=new Date()) => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
 const stamp = ms => new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms));
 let cache=null,busy=false,lastAttempt=0;
 try {cache=JSON.parse(localStorage.getItem(KEY));} catch {}
 function moon() {
  const day=dateTokyo(), noon=Date.parse(day+'T12:00:00+09:00');
  const cycle=29.530588853, age=((noon-Date.UTC(2000,0,6,18,14))/86400000%cycle+cycle)%cycle;
  const names=['新月付近','満ちていく月','上弦付近','満ちていく月','満月付近','欠けていく月','下弦付近','欠けていく月'];
  const icons=['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  const phase=Math.floor(age/cycle*8+.5)%8;
  el('moonMain').textContent=icons[phase]+' 月齢 '+age.toFixed(1);
  el('moonDetail').textContent=names[phase]+' · '+day+' 正午 JST';
 }
 function weatherName(c) {
  if(c===0)return '快晴';if(c<=2)return '晴れ';if(c===3)return '曇り';
  if([45,48].includes(c))return '霧';if(c>=51&&c<=57)return '霧雨';
  if(c>=61&&c<=67)return '雨';if(c>=71&&c<=77)return '雪';
  if(c>=80&&c<=82)return 'にわか雨';if(c===85||c===86)return 'にわか雪';
  if(c>=95&&c<=99)return '雷雨';return '不明';
 }
 function validCurrent(c) {return c && typeof c.time==='string' && ['temperature_2m','relative_humidity_2m','wind_speed_10m','weather_code'].every(k=>typeof c[k]==='number'&&Number.isFinite(c[k]));}
 function render() {
  moon();const c=cache?.current;
  if(validCurrent(c)) {
   el('weatherMain').textContent=c.temperature_2m.toFixed(1)+' °C / '+weatherName(c.weather_code);
   el('weatherDetail').textContent='湿度 '+c.relative_humidity_2m+'% · 風速 '+c.wind_speed_10m.toFixed(1)+' m/s';
  }
  const s=cache?.sun;
  if(s?.day===dateTokyo() && /^\d{2}:\d{2}$/.test(s.rise) && /^\d{2}:\d{2}$/.test(s.set)) {
   el('sunTimes').textContent='↑ '+s.rise+' / ↓ '+s.set;el('sunDate').textContent=s.day+' · JST';
  } else {el('sunTimes').textContent='— / —';el('sunDate').textContent='当日データ未取得';}
 }
 async function refresh(force=false) {
  render();if(busy||document.hidden)return;
  const now=Date.now(),fresh=validCurrent(cache?.current)&&Number.isFinite(cache?.fetched)&&now>=cache.fetched&&now-cache.fetched<TTL;
  if(!force&&fresh&&cache?.sun?.day===dateTokyo()) {el('skyStatus').textContent='取得 '+stamp(cache.fetched)+' JST · 保存データ使用 / モデル時刻 '+cache.current.time.replace('T',' ');return;}
  if(!force&&now-lastAttempt<5*60*1000)return;
  busy=true;lastAttempt=now;el('skyRetry').disabled=true;el('skyStatus').textContent='東京の天気を取得中…';
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8000);
  try {
   const needsSun=cache?.sun?.day!==dateTokyo();
   const url=new URL('https://api.open-meteo.com/v1/forecast');
   url.search=new URLSearchParams({latitude:'35.68',longitude:'139.69',current:'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',wind_speed_unit:'ms',timezone:'Asia/Tokyo',forecast_days:'1',...(needsSun?{daily:'sunrise,sunset'}:{})});
   const res=await fetch(url,{signal:ctl.signal,credentials:'omit',referrerPolicy:'no-referrer'});
   if(!res.ok)throw Error('HTTP '+res.status);
   const data=await res.json();if(!validCurrent(data.current))throw Error('Invalid weather');
   let sun=cache?.sun;
   if(needsSun) {
    const daily=data.daily,day=dateTokyo(),rise=daily?.sunrise?.[0],set=daily?.sunset?.[0];
    if(daily?.time?.[0]!==day||typeof rise!=='string'||typeof set!=='string'||!rise.startsWith(day+'T')||!set.startsWith(day+'T'))throw Error('Invalid sun data');
    sun={day,rise:rise.slice(11,16),set:set.slice(11,16)};
   }
   cache={current:data.current,sun,fetched:Date.now()};
   try {localStorage.setItem(KEY,JSON.stringify(cache));}catch {}
   render();el('skyStatus').textContent='取得 '+stamp(cache.fetched)+' JST · モデル時刻 '+cache.current.time.replace('T',' ');el('skyRetry').hidden=true;
  } catch {
   el('skyStatus').textContent=validCurrent(cache?.current)?'更新失敗 · 過去の保存値を表示中（取得 '+stamp(cache.fetched)+' JST）':'天気を取得できませんでした。月齢は通信なしで表示しています。';el('skyRetry').hidden=false;
  } finally {clearTimeout(timer);busy=false;el('skyRetry').disabled=false;}
 }
 el('skyRetry').addEventListener('click',()=>refresh(true));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 window.addEventListener('online',()=>refresh());setInterval(()=>refresh(),60000);refresh();
})();
