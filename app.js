const $=s=>document.querySelector(s),m=n=>CONFIG.moneda+n.toFixed(2);
const wa=t=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
const cart=()=>JSON.parse(localStorage.getItem("fn_cart")||"{}");
const save=c=>{localStorage.setItem("fn_cart",JSON.stringify(c));const b=$("#cnt");if(b)b.textContent=Object.values(c).reduce((a,b)=>a+b,0)};
const guardar=o=>{const S=CONFIG.supabase;if(!S||!S.url||!S.anonKey)return;
  fetch(S.url+"/rest/v1/pedidos",{method:"POST",keepalive:true,headers:{apikey:S.anonKey,Authorization:"Bearer "+S.anonKey,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(o)}).catch(()=>{})};
const P=id=>PRODUCTOS.find(p=>p.id===id);
const fb=p=>"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120"><rect x="8" y="14" width="74" height="98" rx="8" fill="#fff" stroke="${p.col}" stroke-width="3"/><rect x="8" y="14" width="74" height="30" rx="8" fill="${p.col}"/><rect x="8" y="34" width="74" height="10" fill="${p.col}"/><path d="M45 52v18M36 61h18" stroke="${p.col}" stroke-width="5" stroke-linecap="round"/><rect x="20" y="80" width="50" height="5" rx="2.5" fill="${p.col}" opacity=".35"/><rect x="20" y="91" width="32" height="5" rx="2.5" fill="${p.col}" opacity=".35"/></svg>`);
const img=p=>`<img src="img/${p.id}.jpg" alt="${p.nombre}" loading="lazy" onerror="this.onerror=null;this.src='${fb(p)}'">`;
const li=s=>"<ul>"+s.split(";").map(x=>`<li>${x}</li>`).join("")+"</ul>";
function layout(){
  document.body.insertAdjacentHTML("afterbegin",`<header><div class="w bar"><a class="logo" href="index.html">✚ ${CONFIG.tienda}</a><nav><a href="index.html#catalogo">Productos</a><a href="receta.html">Subir receta</a><a href="info.html">Ayuda</a></nav><a class="cb" href="carrito.html">Carrito<b id="cnt">0</b></a></div></header>`);
  document.body.insertAdjacentHTML("beforeend",`<footer><div class="w"><div><b>${CONFIG.tienda}</b><br>${CONFIG.direccion}<br>${CONFIG.horario}<br>${CONFIG.email}</div><div><a href="info.html#envios">Envíos y pagos</a><a href="info.html#devoluciones">Devoluciones</a><a href="receta.html">Medicamentos con receta</a></div><div><a href="info.html#privacidad">Privacidad</a><a href="info.html#terminos">Términos y condiciones</a><a href="info.html#aviso">Aviso legal</a></div></div><div class="w" style="margin-top:20px;font-size:13px">Los medicamentos pueden tener contraindicaciones. Lee el prospecto y consulta a tu médico o farmacéutico. Ante una urgencia, llama a emergencias.</div></footer><a class="fab" href="${wa("Hola, tengo una consulta")}" target="_blank" rel="noopener">WhatsApp</a>`);
  save(cart());
}
function card(p){return `<a class="card" href="producto.html?id=${p.id}"><div class="ph">${p.rx?'<span class="tag">Requiere receta</span>':""}${img(p)}</div><div class="cb2"><b>${p.nombre}</b><small>${p.pres}</small><span class="pr">${m(p.precio)}</span></div></a>`}
function home(){
  const cats=["Todo",...new Set(PRODUCTOS.map(p=>p.cat))];let c="Todo",q="";
  $("#chips").innerHTML=cats.map(x=>`<button class="chip" data-c="${x}">${x}</button>`).join("");
  const n=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const r=()=>{document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b.dataset.c===c));
    const l=PRODUCTOS.filter(p=>(c==="Todo"||p.cat===c)&&n(p.nombre+p.activo+p.indicaciones+p.cat).includes(n(q)));
    $("#grid").innerHTML=l.length?l.map(card).join(""):'<p class="empty">Sin resultados. Escríbenos por WhatsApp y te ayudamos.</p>'};
  $("#chips").onclick=e=>{if(e.target.dataset.c){c=e.target.dataset.c;r()}};$("#q").oninput=e=>{q=e.target.value;r()};r();
}
function prod(){
  const p=P(new URLSearchParams(location.search).get("id"));
  if(!p){$("#app").innerHTML='<p class="empty">Producto no encontrado. <a href="index.html">Volver a la tienda</a></p>';return}
  document.title=p.nombre+" · "+CONFIG.tienda;
  const d=(t,b,open)=>`<details ${open?"open":""}><summary>${t}</summary>${b}</details>`;
  $("#app").innerHTML=`<div class="crumb"><a href="index.html">Inicio</a> / ${p.cat} / ${p.nombre}</div><div class="pg"><div class="ph">${p.rx?'<span class="tag">Requiere receta</span>':""}${img(p)}</div><div><h1>${p.nombre}</h1><p style="color:var(--mut)">${p.resumen}</p><p><b>Principio activo:</b> ${p.activo}<br><b>Forma:</b> ${p.forma}<br><b>Presentación:</b> ${p.pres}</p><div class="pr" style="font-size:32px;font-weight:800">${m(p.precio)}</div>${p.rx?`<div class="note"><b>Medicamento con receta.</b> Al finalizar tu pedido por WhatsApp te pediremos la foto de la receta vigente antes de dispensarlo.</div>`:""}<p><button class="btn" id="add">Añadir al carrito</button> <a class="btn o" target="_blank" rel="noopener" href="${wa("Hola, tengo una consulta sobre "+p.nombre)}">Consultar al farmacéutico</a></p><p id="ok" style="color:var(--pine);font-weight:600"></p></div></div>
  <div style="max-width:820px;padding-bottom:48px">${d("Para qué se usa",li(p.indicaciones),1)}${d("Composición",`<p>${p.composicion}</p>`)}${d("Cómo se usa y dosis",`<p>${p.posologia}</p>`,1)}${d("No lo uses si (contraindicaciones)",li(p.contra))}${d("Efectos adversos posibles",li(p.efectos))}${d("Advertencias y precauciones",li(p.adv))}${d("Conservación",`<p>${p.cons} Mantener fuera del alcance y de la vista de los niños. No usar después de la fecha de caducidad.</p>`)}<div class="note">Información de carácter general. No sustituye al prospecto del fabricante ni a la consulta con tu médico o farmacéutico. Ante una sobredosis o reacción grave, acude a urgencias.</div></div>`;
  $("#add").onclick=()=>{const c=cart();c[p.id]=(c[p.id]||0)+1;save(c);$("#ok").textContent="Añadido. Ver carrito →";$("#ok").onclick=()=>location="carrito.html"};
}
function carro(){
  const pay=()=>{const t=document.querySelector("[name=p]:checked").value==="Transfermóvil";$("#tm").hidden=!t;$("#go").textContent=t?"Enviar pedido y comprobante por WhatsApp":"Pedir por WhatsApp";if(!t)return;const T=CONFIG.transfermovil;
    $("#tm").innerHTML=`<div class="qr"><img src="${T.qr}" alt="Código QR de pago Transfermóvil"><p>Total a pagar: <b>${m(r.d.tot)}</b></p><a class="btn" href="${T.enlace}" target="_blank" rel="noopener">Ir a Transfermóvil</a><p class="or">o simplemente escanea el código desde la app</p><p style="margin:0;font-size:14px"><b>${T.titular}</b><br>${T.cuenta}</p><ol><li>Paga el total exacto.</li><li>Guarda la captura del comprobante.</li><li>Pulsa «Enviar pedido y comprobante» y adjunta la captura en WhatsApp.</li></ol></div>`};
  document.querySelector(".pay").onchange=pay;
  const r=()=>{const c=cart(),ids=Object.keys(c).filter(P);let sub=0;
    $("#items").innerHTML=ids.length?ids.map(i=>{const p=P(i);sub+=p.precio*c[i];return `<div class="it">${img(p)}<div><b>${p.nombre}</b>${p.rx?' <span class="tag" style="position:static">Receta</span>':""}<br><small>${m(p.precio)}</small></div><div class="q"><button data-m="${i}">−</button> ${c[i]} <button data-a="${i}">+</button></div></div>`}).join(""):'<p class="empty">Tu carrito está vacío. <a href="index.html">Ver productos</a></p>';
    const env=!ids.length||sub>=CONFIG.envioGratisDesde?0:CONFIG.envio,tot=sub+env;
    $("#sum").innerHTML=`<div class="row"><span>Subtotal</span><span>${m(sub)}</span></div><div class="row"><span>Envío</span><span>${env?m(env):"Gratis"}</span></div><div class="row tot"><span>Total</span><span>${m(tot)}</span></div>`;
    r.d={c,ids,sub,env,tot};pay()};
  $("#items").onclick=e=>{const c=cart(),a=e.target.dataset.a,s=e.target.dataset.m;if(a)c[a]++;if(s&&--c[s]<1)delete c[s];save(c);r()};
  $("#f").onsubmit=e=>{e.preventDefault();const{c,ids,sub,env,tot}=r.d;if(!ids.length)return;const f=new FormData(e.target),id="FN"+Date.now().toString().slice(-6);
    const rx=ids.some(i=>P(i).rx);
    const msg=`Hola ${CONFIG.tienda}, quiero hacer un pedido (${id}):\n\n`+ids.map(i=>`• ${c[i]} x ${P(i).nombre} — ${m(P(i).precio*c[i])}`).join("\n")+`\n\nSubtotal: ${m(sub)}\nEnvío: ${env?m(env):"Gratis"}\n*Total: ${m(tot)}*\n\nNombre: ${f.get("n")}\nTeléfono: ${f.get("t")}\nDirección: ${f.get("d")}\nForma de pago: ${f.get("p")}${f.get("p")==="Transfermóvil"?" (ya pagué, adjunto la captura del comprobante en este chat)":""}\nNotas: ${f.get("o")||"-"}`+(rx?"\n\n⚠️ Mi pedido incluye medicamentos con receta. Adjunto la foto de la receta en este chat.":"");
    guardar({id,nombre:f.get("n"),telefono:f.get("t"),direccion:f.get("d"),notas:f.get("o")||null,pago:f.get("p"),items:ids.map(i=>({id:i,nombre:P(i).nombre,cant:c[i],precio:P(i).precio})),subtotal:sub,envio:env,total:tot,requiere_receta:!!rx,consentimiento:true});
    window.open(wa(msg),"_blank");};
  r();
}
document.addEventListener("DOMContentLoaded",()=>{layout();({home,prod,carro}[document.body.dataset.p]||(()=>{}))()});
