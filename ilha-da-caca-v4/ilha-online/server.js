// Servidor da Ilha da Caça: entrega a página e repassa mensagens entre os jogadores de cada sala.
const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const PORT=process.env.PORT||3000;
// Procura o jogo em public/index.html ou, se não achar, em index.html solto na raiz.
const PAGE=[path.join(__dirname,'public','index.html'),path.join(__dirname,'index.html')].find(f=>fs.existsSync(f))||path.join(__dirname,'public','index.html');
const TOPICS=new Set(['an','hit','spawn','dmg','kill']),KEYS=['x','z','r','w','at','on','dd','t'],MAX=16;
const rooms=new Map(),uid=()=>Math.random().toString(36).slice(2,8);
const srv=http.createServer((q,s)=>{
  if(q.url==='/health'){s.writeHead(200);return s.end('ok')}
  fs.readFile(PAGE,(e,d)=>{if(e){s.writeHead(500);return s.end('erro')}s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d)})});
const wss=new WebSocketServer({server:srv,maxPayload:8192});
wss.on('connection',(ws,req)=>{
  const name=(new URL(req.url,'http://x').searchParams.get('sala')||'ilha').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,32)||'ilha';
  let room=rooms.get(name);if(!room){room={c:new Map(),dirty:false};rooms.set(name,room)}
  if(room.c.size>=MAX){ws.close(1013,'sala cheia');return}
  const me={id:uid(),ws,p:{},n:0,ts:Date.now()};room.c.set(me.id,me);room.dirty=true;
  ws.send(JSON.stringify({t:'hi',id:me.id}));
  ws.on('message',raw=>{
    const now=Date.now();if(now-me.ts>1000){me.ts=now;me.n=0}if(++me.n>100)return;
    let m;try{m=JSON.parse(raw)}catch{return}
    if(m.t==='p'&&m.d&&typeof m.d==='object'){
      for(const k of KEYS)if(k in m.d){const v=m.d[k];if(v===null)delete me.p[k];else if(Number.isFinite(+v))me.p[k]=+v}
      room.dirty=true;
    }else if(m.t==='e'&&TOPICS.has(m.topic)){
      const s=JSON.stringify({t:'e',topic:m.topic,data:m.data,peer:me.id});
      for(const c of room.c.values())if(c.ws.readyState===1)c.ws.send(s);
    }});
  ws.on('close',()=>{room.c.delete(me.id);room.dirty=true;if(!room.c.size)rooms.delete(name)});
  ws.on('error',()=>{});
});
setInterval(()=>{for(const r of rooms.values())if(r.dirty){r.dirty=false;
  const s=JSON.stringify({t:'peers',list:[...r.c.values()].map(c=>({peer:c.id,presence:c.p}))});
  for(const c of r.c.values())if(c.ws.readyState===1)c.ws.send(s)}},50);
srv.listen(PORT,()=>console.log('Ilha da Caça rodando em http://localhost:'+PORT));
