/* Soudan — carte du conflit. Map + stats + timeline.
   Defensive data adapter: prefers window.SUDAN (future data-agent contract),
   falls back to the current SD_* globals. Every field is feature-detected;
   a missing field never throws — the feature simply stays dark. */
(function(){
  "use strict";
  var mapEl = document.getElementById("map");
  if(!mapEl) return; // method page: no map
  var T = function(k){ return window.SDN_T ? window.SDN_T(k) : k; };
  var root = document.documentElement;
  function cssv(n){ return getComputedStyle(root).getPropertyValue(n).trim(); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];}); }
  function num(n){ try{ return Number(n).toLocaleString(window.SDN_LANG==="ar"?"ar":(window.SDN_LANG||"fr")); }catch(e){ return String(n); } }

  // =====================================================================
  //  DATA ADAPTER  — normalize whatever is present into one internal model
  // =====================================================================
  var S = window.SUDAN || {};
  function has(a){ return a && a.length; }

  // ---- actor-pair metadata (adaptable, data-driven; unknown keys degrade) ----
  var PAIR_META = {
    saf_vs_rsf:    {v:"--c-safrsf"},
    saf_vs_other:  {v:"--c-safoth"},
    rsf_vs_other:  {v:"--c-rsfoth"},
    nonstate_other:{v:"--c-nonstate"}
  };
  function normPair(raw){
    var k = String(raw||"").toLowerCase();
    if(/civ|one.?sided|civilian|unilat/.test(k)) return null; // guardrail: never a point
    if(/saf/.test(k) && /rsf/.test(k)) return "saf_vs_rsf";
    if(k==="saf_vs_rsf"||k==="saf_rsf") return "saf_vs_rsf";
    if(/rsf/.test(k) && /(other|oth|nonstate|group)/.test(k)) return "rsf_vs_other";
    if(/saf/.test(k)) return "saf_vs_other";
    if(/rsf/.test(k)) return "rsf_vs_other";
    return "nonstate_other";
  }
  function pairLabel(k){
    var t=(window.SDN_I18N&&window.SDN_I18N[window.SDN_LANG]) || {};
    var map={saf_vs_rsf:["SAF ↔ RSF (front principal)","SAF ↔ RSF (main front)"],
      saf_vs_other:["SAF ↔ autres groupes armés","SAF ↔ other armed groups"],
      rsf_vs_other:["RSF ↔ autres groupes armés","RSF ↔ other armed groups"],
      nonstate_other:["Autres (non-étatique)","Other (non-state)"]};
    var ar={saf_vs_rsf:"الجيش ↔ الدعم السريع",
      saf_vs_other:"الجيش ↔ جماعات أخرى",
      rsf_vs_other:"الدعم السريع ↔ جماعات أخرى",
      nonstate_other:"أخرى (غير دولة)"};
    if(!map[k]) return k;
    if(window.SDN_LANG==="ar") return ar[k]||map[k][0];
    return window.SDN_LANG==="en" ? map[k][1] : map[k][0];
  }
  function pairColor(k){ var m=PAIR_META[k]; return m?cssv(m.v):cssv("--c-nonstate"); }

  // ---- events (armed clashes only; civilians are NEVER points) ----
  var events = [];
  if(has(S.events)){
    S.events.forEach(function(e){
      if(+e.type===3) return; // UCDP one-sided (civilian-targeted) never a point — Darfur guardrail
      var pair = normPair(e.pair!=null?e.pair:e.type);
      if(pair===null) return; // civilian/one-sided excluded by guardrail
      events.push({lon:+e.lon, lat:+e.lat, date:String(e.date||""), pair:pair,
        deaths:+(e.deaths!=null?e.deaths:0), a:e.a, b:e.b, raw:(typeof e.pair==="string"?e.pair:""),
        adm1:(e.adm1||e.state), adm2:e.adm2, place:e.place,
        nsrc:e.nsrc, wprec:e.wprec, clarity:e.clarity});
    });
  } else if(window.SD_CLASHES && has(window.SD_CLASHES.features)){
    window.SD_CLASHES.features.forEach(function(f){
      var p=f.properties||{}; var pair=normPair(p.cat);
      if(pair===null) return;
      var c=f.geometry.coordinates;
      events.push({lon:+c[0], lat:+c[1], date:String(p.date||""), pair:pair,
        deaths:+(p.best!=null?p.best:0), a:p.a, b:p.b, adm1:p.adm1, adm2:p.adm2, place:p.place,
        nsrc:p.nsrc, wprec:p.wprec, clarity:p.clarity});
    });
  }

  // ---- fires density ----
  var fires = [];
  if(has(S.fires_density)){
    S.fires_density.forEach(function(f){ fires.push({lon:+f.lon,lat:+f.lat,n:+(f.weight!=null?f.weight:(f.n||1)),w:f.w,dmax:f.dmax}); });
  } else if(window.SD_FIRMS && has(window.SD_FIRMS.features)){
    window.SD_FIRMS.features.forEach(function(f){ var p=f.properties||{},c=f.geometry.coordinates;
      fires.push({lon:+c[0],lat:+c[1],n:+(p.n||1),w:p.w,dmax:p.dmax}); });
  }

  // ---- activity density ----
  var activity = [];
  if(window.SD_ACTIVITY && has(window.SD_ACTIVITY.features)){
    window.SD_ACTIVITY.features.forEach(function(f){ var p=f.properties||{},c=f.geometry.coordinates;
      activity.push({lon:+c[0],lat:+c[1],n:+(p.n||1),w:p.w}); });
  }

  // ---- states (clash aggregates merged with civilian-violence aggregates) ----
  var stateMap = {};
  function st(name){ name=name||"—"; return stateMap[name] || (stateMap[name]={name:name,events:0,deaths:0,civ:0,civD:0}); }
  events.forEach(function(e){ var s=st(e.adm1); s.events++; s.deaths+=e.deaths||0; });
  if(has(S.states)){
    S.states.forEach(function(r){ var s=st(r.name); if(r.events!=null)s.events=Math.max(s.events,r.events);
      if(r.deaths!=null)s.deaths=Math.max(s.deaths,r.deaths);
      if(r.civ_violence!=null)s.civ=r.civ_violence; if(r.civ_deaths!=null)s.civD=r.civ_deaths; });
  }
  if(window.SD_CIV && has(window.SD_CIV.by_state)){
    window.SD_CIV.by_state.forEach(function(r){ var s=st(r.state); s.civ=r.events||s.civ; s.civD=r.deaths_best||s.civD; });
  }
  var states = Object.keys(stateMap).map(function(k){return stateMap[k];})
    .filter(function(s){ return s.name!=="—"; })
    .sort(function(a,b){ return (b.events+b.civ)-(a.events+a.civ); });

  // ---- timeline (monthly) ----
  var timeline = [];
  if(has(S.timeline)){
    timeline = S.timeline.map(function(r){ return {month:r.month, events:+(r.events||0), deaths:+(r.deaths||0)}; });
  } else {
    var tm={};
    events.forEach(function(e){ var m=(e.date||"").slice(0,7); if(m.length!==7)return;
      if(!tm[m])tm[m]={month:m,events:0,deaths:0}; tm[m].events++; tm[m].deaths+=e.deaths||0; });
    timeline = Object.keys(tm).sort().map(function(k){return tm[k];});
  }

  // ---- meta / sources ----
  var meta = S.meta || {};
  var dateMin = meta.date_min || (window.SD_SUMMARY&&window.SD_SUMMARY.date_min) || (timeline[0]&&timeline[0].month) || "";
  var dateMax = meta.updated_through || meta.date_max || (window.SD_SUMMARY&&window.SD_SUMMARY.date_max) || (timeline.length&&timeline[timeline.length-1].month) || "";
  var firesDays = meta.fires_days || (window.SD_FIRMS&&window.SD_FIRMS.meta&&window.SD_FIRMS.meta.window_days) || 30;
  var nFireDet = (meta.counts&&meta.counts.fires_detections) || (window.SD_FIRMS&&window.SD_FIRMS.meta&&window.SD_FIRMS.meta.n_detections) || fires.reduce(function(a,f){return a+(f.n||0);},0);

  // ---- boundaries ----
  var adm0geo = window.SD_ADM0 || S.boundaries0 || null;
  var adm1geo = window.SD_ADM1 || S.boundaries1 || null;

  // ---- control (feature-detected; may be null now, present later) ----
  var control = (S.control && S.control.length) ? S.control : null;

  // ---- NEW signal layers (all additive, feature-detected) ----
  var sentinel = (S.sentinel && S.sentinel.tiles && S.sentinel.tiles.url) ? S.sentinel : null;
  var osintData = (S.osint && has(S.osint.points)) ? S.osint : null;
  var km = (S.known_maps && typeof S.known_maps==="object") ? S.known_maps : null;
  var ctrlApprox = (km && has(km.control_approx)) ? km.control_approx[0] : null; // state-level sketch descriptor
  var claims = (S.claims && (has(S.claims.saf)||has(S.claims.rsf))) ? S.claims : null;
  function fdate(s){ return window.SDN_FMTDATE ? window.SDN_FMTDATE(s) : String(s==null?"":s); }
  function sideColor(k){
    k=String(k||"").toLowerCase();
    if(k==="saf") return cssv("--c-saf");
    if(k==="rsf") return cssv("--c-rsf");
    if(k==="contested"||k==="mixed") return cssv("--c-contested");
    return cssv("--c-neutral");
  }

  // ---- focus views ----
  var focus = has(S.focus) ? S.focus.map(function(f){return {key:f.key,label:f.label,bbox:f.bbox,note:f.note};})
    : [ {key:"kord", labelKey:"fKord", bbox:[29.3,12.3,31.6,14.3]},
        {key:"fasher", labelKey:"fFasher", bbox:[24.6,12.9,26.1,14.3]} ];

  // =====================================================================
  //  MAP
  // =====================================================================
  var map = L.map("map",{zoomControl:true, preferCanvas:true, minZoom:4, maxZoom:12}).setView([14.5,29.8],6);
  L.control.scale({imperial:false}).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {subdomains:"abc", maxZoom:19, attribution:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'})
    .addTo(map).bringToBack();

  function bboxBounds(b){ // [w,s,e,n]
    if(!b || b.length<4) return null;
    return L.latLngBounds([[b[1],b[0]],[b[3],b[2]]]);
  }

  // boundaries
  var admGroup = L.layerGroup(); var adm0Lyr=null, adm1Lyr=null;
  function buildBoundaries(){
    if(adm0geo){ adm0Lyr=L.geoJSON(adm0geo,{style:function(){return {color:cssv("--muted"),weight:1.6,fill:false,opacity:.9};}}); admGroup.addLayer(adm0Lyr); }
    if(adm1geo){ adm1Lyr=L.geoJSON(adm1geo,{style:function(){return {color:cssv("--line"),weight:.9,fill:true,fillOpacity:.04,fillColor:cssv("--muted"),opacity:.8};},
      onEachFeature:function(f,l){ var n=f.properties&&(f.properties.shapeName||f.properties.name); if(n)l.bindTooltip(String(n),{sticky:true,direction:"top"}); }});
      admGroup.addLayer(adm1Lyr); }
  }
  if(adm0geo||adm1geo){ buildBoundaries(); }
  else if(S.boundaries_url){
    try{ fetch(S.boundaries_url).then(function(r){return r.json();}).then(function(g){ adm1geo=g; buildBoundaries(); refitAll(); }).catch(function(){}); }catch(e){}
  }

  // clashes
  var catState = {}; ["saf_vs_rsf","saf_vs_other","rsf_vs_other","nonstate_other"].forEach(function(k){catState[k]=true;});
  var presentCats = {}; events.forEach(function(e){presentCats[e.pair]=(presentCats[e.pair]||0)+1;});
  var curMonths = 24;
  function cutoff(months){
    if(months>=900 || !dateMax) return "0000-00";
    var parts=dateMax.split("-"); var y=+parts[0], m=+parts[1]||12, d=+parts[2]||28;
    var dt=new Date(Date.UTC(y,m-1,d)); dt.setUTCMonth(dt.getUTCMonth()-months);
    return dt.toISOString().slice(0,10);
  }
  var clashLayer=L.layerGroup();
  function rad(d){ return Math.max(3, Math.min(14, 3+Math.sqrt(Math.max(0,d))*1.1)); }
  function drawClashes(){
    clashLayer.clearLayers();
    var cut=cutoff(curMonths), shown=0;
    events.forEach(function(e){
      if(!catState[e.pair]) return;
      if(e.date && e.date<cut) return;
      shown++;
      var c=pairColor(e.pair);
      var m=L.circleMarker([e.lat,e.lon],{radius:rad(e.deaths),color:c,weight:1,fillColor:c,fillOpacity:.6,opacity:.85});
      var loc=esc(e.adm1||"")+(e.adm2?" / "+esc(e.adm2):"");
      var title = e.raw ? esc(e.raw) : (e.a ? esc(e.a)+(e.b?" vs "+esc(e.b):"") : esc(pairLabel(e.pair)));
      m.bindPopup("<b>"+title+"</b><br>"+
        "<span class='muted'>"+esc(e.date)+(loc?" · "+loc:"")+"</span><br>"+
        T("thCdeaths")+" : <b>"+num(e.deaths)+"</b>"+
        (e.nsrc?"<br><span class='muted'>"+esc(e.nsrc)+" src · "+esc(e.wprec||"?")+" géo · "+esc(e.clarity||"?")+" clarté</span>":""));
      clashLayer.addLayer(m);
    });
    var cc=document.getElementById("clashCnt"); if(cc) cc.textContent=num(shown);
  }

  // fires density
  var firesMax=fires.reduce(function(m,f){return Math.max(m,f.n);},1);
  function fireColor(n){ var t=Math.min(1,Math.log(1+n)/Math.log(1+firesMax));
    var lo=cssv("--fire-lo"), hi=cssv("--fire-hi"); return mix(lo,hi,t); }
  function mix(a,b,t){ var A=hex(a),B=hex(b); return "rgb("+Math.round(A[0]+(B[0]-A[0])*t)+","+Math.round(A[1]+(B[1]-A[1])*t)+","+Math.round(A[2]+(B[2]-A[2])*t)+")"; }
  function hex(h){ h=h.replace("#",""); if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]; return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  var firesLayer=L.layerGroup();
  function buildFires(){ firesLayer.clearLayers(); fires.forEach(function(f){
    var col=fireColor(f.n);
    firesLayer.addLayer(L.circleMarker([f.lat,f.lon],{radius:2.4+Math.min(5,Math.log(1+f.n)),color:col,weight:0,fillColor:col,fillOpacity:.55})
      .bindPopup(T("lyrFirms")+" : <b>"+num(f.n)+"</b><br><span class='muted'>"+T("legFireNote")+"</span>")); }); }
  buildFires();

  // activity density
  var actMax=activity.reduce(function(m,f){return Math.max(m,f.n);},1);
  var actLayer=L.layerGroup();
  function buildAct(){ actLayer.clearLayers(); activity.forEach(function(f){ var t=Math.min(1,f.n/actMax), col=cssv("--c-safrsf");
    actLayer.addLayer(L.circleMarker([f.lat,f.lon],{radius:5+14*Math.sqrt(t),color:col,weight:0,fillColor:col,fillOpacity:.12+.35*t})
      .bindPopup(T("lyrAct")+" : <b>"+num(f.n)+"</b>")); }); }
  buildAct();

  // focus sectors (rectangles) — pure map framing, not a data claim
  var sectorLayer=L.layerGroup();
  function buildSectors(){ sectorLayer.clearLayers(); focus.forEach(function(f){ var bb=bboxBounds(f.bbox); if(!bb)return;
    var r=L.rectangle(bb,{color:cssv("--accent"),weight:1.4,dashArray:"5 4",fill:true,fillOpacity:.05,fillColor:cssv("--accent")});
    var lbl=f.label || T(f.labelKey||""); if(lbl) r.bindTooltip(String(lbl),{permanent:false,direction:"center"});
    sectorLayer.addLayer(r); }); }
  buildSectors();

  // control sketch (optional, clearly labelled)
  var controlLayer=L.layerGroup(); var hasControl=!!control;
  function buildControl(){ if(!control)return; controlLayer.clearLayers();
    try{ L.geoJSON({type:"FeatureCollection",features:control.map(function(c){return c.type?c:{type:"Feature",geometry:c.geometry||c,properties:c.properties||c};})},
      {style:function(){return {color:cssv("--accent"),weight:1.6,dashArray:"2 3",fill:true,fillOpacity:.06,fillColor:cssv("--accent")};},
       onEachFeature:function(f,l){ var p=f.properties||{}; l.bindPopup("<b>"+T("lyrControl")+"</b><br><span class='muted'>"+esc(p.source||p.src||"?")+" — "+T("controlApprox")+"</span>"); }})
      .eachLayer(function(l){controlLayer.addLayer(l);});
    }catch(e){ hasControl=false; }
  }
  buildControl();

  // ---- Sentinel-2 imagery (EOX, keyless, CC BY 4.0) — own pane, immune to dark invert ----
  try{ map.createPane("sentinelPane"); map.getPane("sentinelPane").style.zIndex=250; }catch(e){}
  var sentYear = sentinel ? (sentinel.composites && sentinel.composites[0] ? sentinel.composites[0].year : "") : null;
  var sentinelLayer = null;
  function sentUrl(year){
    if(sentinel.composites){ for(var i=0;i<sentinel.composites.length;i++){ if(sentinel.composites[i].year==year) return sentinel.composites[i].url; } }
    return sentinel.tiles.url;
  }
  if(sentinel){
    var tb=sentinel.tiles;
    sentinelLayer = L.tileLayer(sentUrl(sentYear), {
      attribution: tb.attribution, maxZoom: tb.maxZoom||16, maxNativeZoom: tb.maxNativeZoom||14,
      minZoom: tb.minZoom||1, tileSize: tb.tileSize||256,
      bounds: (tb.bounds ? L.latLngBounds(tb.bounds) : undefined), pane:"sentinelPane"
    });
  }

  // ---- OSINT / Telegram points (unverified, aggregated per place) ----
  var osintLayer = L.layerGroup();
  function osDominant(s){ s=s||{}; var e=[["saf",s.saf||0],["rsf",s.rsf||0],["neutral",s.neutral||0]];
    e.sort(function(a,b){return b[1]-a[1];}); return (e[0][1]>0 && e[0][1]>e[1][1]) ? e[0][0] : "neutral"; }
  function buildOsint(){ osintLayer.clearLayers(); if(!osintData)return;
    osintData.points.forEach(function(p){
      var dom=osDominant(p.sides), col=sideColor(dom==="neutral"?"neutral":dom);
      var r=4+Math.min(10,Math.sqrt(p.count||1)*1.6);
      var m=L.circleMarker([p.lat,p.lon],{radius:r,color:col,weight:1,fillColor:col,fillOpacity:.5,opacity:.85});
      var s=p.sides||{};
      m.bindPopup("<b>"+esc(p.place||p.adm1||"?")+"</b>"+(p.adm1&&p.place?"<br><span class='muted'>"+esc(p.adm1)+"</span>":"")+
        "<br>"+num(p.count||0)+" "+T("osintCount")+(p.last_date?" · "+T("osintLast")+" "+fdate(p.last_date):"")+
        "<br><span class='muted'>"+T("osintSplit")+" : "+num(s.saf||0)+" / "+num(s.rsf||0)+" / "+num(s.neutral||0)+"</span>"+
        "<br><span class='muted' style='font-size:11px'>"+T("osintCaveat")+"</span>");
      osintLayer.addLayer(m);
    });
  }
  buildOsint();

  // ---- Approximate state-level control (fill by actor) — fetched geojson, replaces the v1 slot ----
  var controlApproxLayer = L.layerGroup(); var ctrlApproxGeo = null; var ctrlApproxReady = false;
  function buildControlApprox(){ controlApproxLayer.clearLayers(); if(!ctrlApproxGeo)return;
    try{ L.geoJSON(ctrlApproxGeo,{
      style:function(f){ var a=(f.properties&&f.properties.actor); var c=sideColor(a);
        return {color:c,weight:1,fillColor:c,fillOpacity:.32,opacity:.7}; },
      onEachFeature:function(f,l){ var p=f.properties||{}; var a=String(p.actor||"other").toLowerCase();
        var alab=a==="saf"?T("actorSAF"):a==="rsf"?T("actorRSF"):(a==="contested"||a==="mixed")?T("actorContested"):T("actorOther");
        l.bindPopup("<b>"+esc(p.name||"?")+"</b> — "+esc(alab)+(p.date?" <span class='muted'>("+fdate(p.date)+")</span>":"")+
          "<br><span class='muted' style='font-size:11px'>"+T("controlApproxCaveat")+"</span>"+
          (p.source?"<br><span class='muted' style='font-size:10.5px'>"+esc(p.source)+"</span>":"")); }
    }).eachLayer(function(l){controlApproxLayer.addLayer(l);}); }catch(e){}
  }
  if(ctrlApprox && ctrlApprox.geojson_url){
    // if boundaries were already fetched as geojson we still fetch the control sketch (carries actor per state)
    try{ fetch(ctrlApprox.geojson_url).then(function(r){return r.json();}).then(function(g){
      ctrlApproxGeo=g; ctrlApproxReady=true; buildControlApprox(); // populates group; shows if already toggled on
      fillControlSlot();
    }).catch(function(){}); }catch(e){}
  }

  // ---- SAF / RSF claims (claimed captures — unverified, both sides equal weight) ----
  var claimsSafLayer=L.layerGroup(), claimsRsfLayer=L.layerGroup();
  function fillClaims(g, arr, side){ g.clearLayers(); if(!arr)return;
    var col=sideColor(side);
    arr.forEach(function(c){
      var m=L.circleMarker([c.lat,c.lon],{radius:6,color:col,weight:2,fillColor:col,fillOpacity:.25,opacity:.95});
      var cl=String(c.claim||"").toLowerCase();
      var clab=cl==="captured"?T("claimCaptured"):(cl==="held"||cl==="control")?T("claimHeld"):esc(c.claim||"");
      m.bindPopup("<b>"+esc(c.place||c.adm1||"?")+"</b> <span class='tag'>"+T("claimTag")+"</span>"+
        "<br><span class='muted'>"+clab+(c.date?" · "+fdate(c.date):"")+"</span>"+
        (c.source?"<br><span class='muted' style='font-size:10.5px'>"+esc(c.source)+"</span>":""));
      g.addLayer(m);
    });
  }
  function buildClaims(){ fillClaims(claimsSafLayer, claims&&claims.saf, "saf"); fillClaims(claimsRsfLayer, claims&&claims.rsf, "rsf"); }
  buildClaims();

  // ---- layer registry ----
  var LAYERS = [
    {id:"adm",      labelKey:"lyrAdm",          on:true,  lyr:admGroup,           sw:"line", avail:!!(adm0geo||adm1geo)},
    {id:"ctrlapx",  labelKey:"lyrControlApprox",on:false, lyr:controlApproxLayer, sw:"ctrlfill", avail:!!ctrlApprox},
    {id:"clash",    labelKey:"lyrClash",        on:true,  lyr:clashLayer,         sw:"dot",  count:"clashCnt", avail:events.length>0},
    {id:"claimsaf", labelKey:"lyrClaimsSaf",    on:false, lyr:claimsSafLayer,     sw:"saf",  avail:!!(claims&&has(claims.saf))},
    {id:"claimrsf", labelKey:"lyrClaimsRsf",    on:false, lyr:claimsRsfLayer,     sw:"rsf",  avail:!!(claims&&has(claims.rsf))},
    {id:"osint",    labelKey:"lyrOsint",        on:false, lyr:osintLayer,         sw:"osint",avail:!!osintData},
    {id:"act",      labelKey:"lyrAct",          on:false, lyr:actLayer,           sw:"sq",   avail:activity.length>0},
    {id:"firms",    labelKey:"lyrFirms",        on:false, lyr:firesLayer,         sw:"fire", avail:fires.length>0},
    {id:"sentinel", labelKey:"lyrSentinel",     on:false, lyr:sentinelLayer,      sw:"sat",  avail:!!sentinel},
    {id:"sectors",  labelKey:"lyrSectors",      on:false, lyr:sectorLayer,        sw:"rect", avail:focus.length>0},
    {id:"control",  labelKey:"lyrControl",      on:false, lyr:controlLayer,       sw:"ctrl", avail:hasControl}
  ];

  // =====================================================================
  //  UI
  // =====================================================================
  function swStyle(sw,kind){
    sw.style.border=""; sw.style.background=""; sw.style.opacity="";
    if(kind==="line"){ sw.style.background="transparent"; sw.style.border="2px solid "+cssv("--muted"); sw.style.height="4px"; sw.style.borderRadius="2px"; sw.style.width="16px"; }
    else if(kind==="dot"){ sw.style.background=cssv("--c-safrsf"); }
    else if(kind==="sq"){ sw.className="sw sq"; sw.style.background=cssv("--c-safrsf"); sw.style.opacity=".5"; }
    else if(kind==="fire"){ sw.style.background="linear-gradient(90deg,"+cssv("--fire-lo")+","+cssv("--fire-hi")+")"; }
    else if(kind==="rect"){ sw.className="sw sq"; sw.style.background="transparent"; sw.style.border="1.5px dashed "+cssv("--accent"); }
    else if(kind==="ctrl"){ sw.className="sw sq"; sw.style.background=cssv("--accent"); sw.style.opacity=".4"; }
    else if(kind==="ctrlfill"){ sw.className="sw sq"; sw.style.background="linear-gradient(90deg,"+cssv("--c-saf")+" 50%,"+cssv("--c-rsf")+" 50%)"; sw.style.opacity=".55"; }
    else if(kind==="saf"){ sw.style.background="transparent"; sw.style.border="2px solid "+cssv("--c-saf"); }
    else if(kind==="rsf"){ sw.style.background="transparent"; sw.style.border="2px solid "+cssv("--c-rsf"); }
    else if(kind==="osint"){ sw.style.background=cssv("--c-neutral"); }
    else if(kind==="sat"){ sw.className="sw sq"; sw.style.background="linear-gradient(135deg,#3b5a2a,#6b7f3a)"; }
  }
  function buildUI(){
    // layers
    var lg=document.getElementById("layerGrp"); lg.innerHTML="";
    LAYERS.forEach(function(L0){
      if(!L0.avail) return;
      var row=document.createElement("label"); row.className="row";
      var cb=document.createElement("input"); cb.type="checkbox"; cb.checked=L0.on;
      var sw=document.createElement("span"); sw.className="sw"; swStyle(sw,L0.sw);
      var lab=document.createElement("span"); lab.className="lab";
      lab.textContent=T(L0.labelKey)+(L0.id==="firms"?" · "+firesDays+" j":"");
      var cnt=document.createElement("span"); cnt.className="cnt"; if(L0.count) cnt.id=L0.count;
      row.appendChild(cb); row.appendChild(sw); row.appendChild(lab); row.appendChild(cnt);
      lg.appendChild(row);
      // Sentinel year selector (shown when the imagery layer is on)
      var sub=null;
      if(L0.id==="sentinel" && sentinel && sentinel.composites && sentinel.composites.length){
        sub=document.createElement("div"); sub.className="subrow"; sub.style.display=L0.on?"block":"none";
        var sel=document.createElement("select"); sel.setAttribute("aria-label",T("sentYear"));
        sentinel.composites.forEach(function(c){ var o=document.createElement("option"); o.value=c.year; o.textContent=c.label||c.year; if(c.year==sentYear)o.selected=true; sel.appendChild(o); });
        sel.addEventListener("change",function(){ sentYear=sel.value; if(sentinelLayer) sentinelLayer.setUrl(sentUrl(sentYear)); });
        sub.appendChild(sel); lg.appendChild(sub);
      }
      cb.addEventListener("change",function(){ if(cb.checked)L0.lyr.addTo(map); else map.removeLayer(L0.lyr); if(sub)sub.style.display=cb.checked?"block":"none"; updateLegend(); });
      if(L0.on){ if(L0.lyr) L0.lyr.addTo(map); } else { if(L0.lyr) map.removeLayer(L0.lyr); }
    });
    // categories
    var cg=document.getElementById("catGrp"); cg.innerHTML="";
    ["saf_vs_rsf","saf_vs_other","rsf_vs_other","nonstate_other"].forEach(function(k){
      if(!presentCats[k]) return;
      var row=document.createElement("label"); row.className="row";
      var cb=document.createElement("input"); cb.type="checkbox"; cb.checked=catState[k];
      var sw=document.createElement("span"); sw.className="sw"; sw.style.background=pairColor(k);
      var lab=document.createElement("span"); lab.className="lab"; lab.textContent=pairLabel(k);
      var cnt=document.createElement("span"); cnt.className="cnt"; cnt.textContent=num(presentCats[k]);
      cb.addEventListener("change",function(){ catState[k]=cb.checked; drawClashes(); });
      row.appendChild(cb); row.appendChild(sw); row.appendChild(lab); row.appendChild(cnt);
      cg.appendChild(row);
    });
    // time
    var tb=document.getElementById("timeBtns"); tb.innerHTML="";
    [[3,"t3m"],[6,"t6m"],[12,"t12m"],[24,"t24m"],[999,"tall"]].forEach(function(o){
      var b=document.createElement("button"); b.className="btn"; b.type="button"; b.textContent=T(o[1]);
      b.setAttribute("aria-pressed", String(o[0]===curMonths));
      b.addEventListener("click",function(){ curMonths=o[0]; drawClashes();
        Array.prototype.forEach.call(tb.children,function(x){x.setAttribute("aria-pressed","false");}); b.setAttribute("aria-pressed","true"); });
      tb.appendChild(b);
    });
    // focus
    var fb=document.getElementById("focusBtns"); fb.innerHTML="";
    focus.concat([{key:"all",labelKey:"fAll",bbox:null}]).forEach(function(f){
      var b=document.createElement("button"); b.className="btn"; b.type="button";
      b.textContent=f.label||T(f.labelKey||f.key);
      b.addEventListener("click",function(){ var bb=bboxBounds(f.bbox); if(bb) map.fitBounds(bb.pad(0.05)); else refitAll(); });
      fb.appendChild(b);
    });
  }
  function updateLegend(){
    var leg=document.getElementById("legend"); var t=document.getElementById("legTitle"), body=document.getElementById("legBody");
    var sec=[];
    if(map.hasLayer(controlApproxLayer)){ sec.push('<div class="legtitle">'+T("legControlTitle")+'</div>'+
      '<span class="pill sq" style="background:'+cssv("--c-saf")+'"></span>'+T("actorSAF")+' &nbsp;'+
      '<span class="pill sq" style="background:'+cssv("--c-rsf")+'"></span>'+T("actorRSF")+' &nbsp;'+
      '<span class="pill sq" style="background:'+cssv("--c-contested")+'"></span>'+T("actorContested")); }
    if(map.hasLayer(osintLayer)){ sec.push('<div class="legtitle">'+T("legOsintTitle")+'</div>'+
      '<span class="pill" style="background:'+cssv("--c-saf")+'"></span>'+T("actorSAF")+' &nbsp;'+
      '<span class="pill" style="background:'+cssv("--c-rsf")+'"></span>'+T("actorRSF")+' &nbsp;'+
      '<span class="pill" style="background:'+cssv("--c-neutral")+'"></span>'+T("sideNeutral")); }
    if(map.hasLayer(firesLayer)){ sec.push('<div class="legtitle">'+T("legDensFire")+" ("+firesDays+" j)"+'</div>'+
      '<span class="pill" style="background:'+cssv("--fire-lo")+'"></span>'+T("legLo")+' &nbsp;<span class="pill" style="background:'+cssv("--fire-hi")+'"></span>'+T("legHi")+'<div class="muted" style="margin-top:2px">'+T("legFireNote")+'</div>'); }
    if(map.hasLayer(actLayer)){ sec.push('<div class="legtitle">'+T("legDensAct")+'</div>'+
      '<span class="pill sq" style="background:'+cssv("--c-safrsf")+';opacity:.3"></span>'+T("legLo")+' &nbsp;<span class="pill sq" style="background:'+cssv("--c-safrsf")+'"></span>'+T("legHi")); }
    if(!sec.length){ leg.style.display="none"; return; }
    leg.style.display="block"; t.style.display="none";
    body.innerHTML=sec.join('<div style="height:7px"></div>');
  }

  // =====================================================================
  //  STATS (key figures + per-state table)
  // =====================================================================
  function fillStats(){
    var totDeaths=events.reduce(function(a,e){return a+(e.deaths||0);},0);
    var fig=document.getElementById("statFigs");
    var cells=[
      [num(events.length), T("kfClash")],
      [num(totDeaths), T("kfDeaths")],
      [num(states.length), T("kfStates")],
      [num(nFireDet), T("kfFires")+" ("+firesDays+" j)"]
    ];
    fig.innerHTML=cells.map(function(c){return '<div class="stat"><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join("");
    // header daterange
    var dr=document.getElementById("daterange");
    if(dr) dr.textContent=(dateMin||"?")+" → "+(dateMax||"?")+" · "+num(events.length)+" "+T("kfClash");
    // state table
    var maxTot=states.reduce(function(m,s){return Math.max(m,s.events+s.civ);},1);
    var head="<tr><th>"+T("thState")+"</th><th>"+T("thClash")+"</th><th>"+T("thCdeaths")+"</th><th>"+T("thCiv")+"</th><th>"+T("thCivD")+"</th></tr>";
    var rows=states.map(function(s){
      var w=Math.round(60*(s.events+s.civ)/maxTot);
      return "<tr><td>"+esc(s.name)+' <span class="bar" style="width:'+w+'px"></span></td><td>'+num(s.events)+"</td><td>"+num(s.deaths)+"</td><td>"+num(s.civ)+"</td><td>"+num(s.civD)+"</td></tr>";
    }).join("");
    document.getElementById("stateTable").innerHTML=head+rows;
  }

  // =====================================================================
  //  TIMELINE CHART (single series, toggle events/deaths, hover tooltip)
  // =====================================================================
  var chartMetric="events";
  function drawChart(){
    var host=document.getElementById("chart"); if(!host) return;
    if(!timeline.length){ host.innerHTML='<p class="muted">—</p>'; return; }
    var W=760,H=220, padL=42,padR=10,padT=12,padB=34;
    var iw=W-padL-padR, ih=H-padT-padB;
    var vals=timeline.map(function(d){return d[chartMetric]||0;});
    var max=Math.max.apply(null,vals)||1;
    // nice ticks
    function niceMax(m){ var p=Math.pow(10,Math.floor(Math.log10(m))); var r=m/p; var n=r<=1?1:r<=2?2:r<=5?5:10; return n*p; }
    var ymax=niceMax(max);
    var n=timeline.length, gap=2, bw=(iw/n)-gap;
    var x=function(i){return padL+i*(iw/n)+gap/2;};
    var y=function(v){return padT+ih-(v/ymax)*ih;};
    var svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(T("secTimeTitle"))+'">';
    // gridlines + y labels
    [0,.25,.5,.75,1].forEach(function(f){ var yy=padT+ih-f*ih, v=Math.round(ymax*f);
      svg+='<line class="grid" x1="'+padL+'" y1="'+yy+'" x2="'+(W-padR)+'" y2="'+yy+'"/>';
      svg+='<text class="ax" x="'+(padL-5)+'" y="'+(yy+3)+'" text-anchor="end">'+num(v)+'</text>'; });
    // bars
    timeline.forEach(function(d,i){ var v=d[chartMetric]||0; var h=(v/ymax)*ih;
      svg+='<rect class="bar" x="'+x(i).toFixed(1)+'" y="'+y(v).toFixed(1)+'" width="'+Math.max(1,bw).toFixed(1)+'" height="'+Math.max(0,h).toFixed(1)+'" rx="1.5" data-m="'+esc(d.month)+'" data-v="'+v+'"/>'; });
    // x labels (every ~3rd)
    var step=Math.ceil(n/8);
    timeline.forEach(function(d,i){ if(i%step!==0 && i!==n-1) return;
      svg+='<text class="ax" x="'+(x(i)+bw/2).toFixed(1)+'" y="'+(H-14)+'" text-anchor="middle">'+esc(d.month)+'</text>'; });
    svg+='<line class="base" x1="'+padL+'" y1="'+(padT+ih)+'" x2="'+(W-padR)+'" y2="'+(padT+ih)+'"/>';
    svg+='</svg>';
    host.innerHTML=svg;
  }
  function bindChartHover(){
    var host=document.getElementById("chart"); var tip=document.getElementById("chTip"); if(!host||!tip)return;
    host.addEventListener("mousemove",function(ev){ var t=ev.target; if(t&&t.classList&&t.classList.contains("bar")){
      tip.style.display="block"; tip.innerHTML="<b>"+esc(t.getAttribute("data-m"))+"</b> · "+num(+t.getAttribute("data-v"))+" "+(chartMetric==="events"?T("tgEvents"):T("tgDeaths"));
      var r=host.getBoundingClientRect(); tip.style.left=(ev.clientX-r.left+10)+"px"; tip.style.top=(ev.clientY-r.top-10)+"px";
    } else { tip.style.display="none"; } });
    host.addEventListener("mouseleave",function(){ tip.style.display="none"; });
  }
  function buildChartToggle(){
    var tg=document.getElementById("chTog"); if(!tg)return; tg.innerHTML="";
    [["events","tgEvents"],["deaths","tgDeaths"]].forEach(function(o){
      var b=document.createElement("button"); b.className="btn"; b.type="button"; b.textContent=T(o[1]);
      b.setAttribute("aria-pressed",String(chartMetric===o[0]));
      b.addEventListener("click",function(){ chartMetric=o[0]; drawChart();
        Array.prototype.forEach.call(tg.children,function(x){x.setAttribute("aria-pressed","false");}); b.setAttribute("aria-pressed","true"); });
      tg.appendChild(b);
    });
  }

  // =====================================================================
  //  CONTROL SLOT (feature-detected honesty)
  // =====================================================================
  function fillControlSlot(){
    var el=document.getElementById("controlSlot"); if(!el)return;
    if(ctrlApprox){
      // control_approx present → prominent caveat + actor legend (replaces the "v1" note)
      el.className="guard";
      var src = ctrlApprox.source || (ctrlApprox.label||"");
      el.innerHTML="<b>"+T("lyrControlApprox")+".</b> "+T("controlApproxCaveat")+
        '<div class="chips">'+
        '<span class="chip-c"><i style="background:'+cssv("--c-saf")+'"></i>'+T("actorSAF")+'</span>'+
        '<span class="chip-c"><i style="background:'+cssv("--c-rsf")+'"></i>'+T("actorRSF")+'</span>'+
        '<span class="chip-c"><i style="background:'+cssv("--c-contested")+'"></i>'+T("actorContested")+'</span>'+
        '<span class="chip-c"><i style="background:'+cssv("--c-neutral")+'"></i>'+T("actorOther")+'</span>'+
        '</div>'+
        (src?'<div class="muted" style="margin-top:8px;font-size:11px">'+esc(src)+(ctrlApprox.date?" · "+fdate(ctrlApprox.date):"")+'</div>':"");
    } else if(hasControl){ el.className="guard"; el.innerHTML="<b>"+T("secControlTitle")+".</b> "+T("controlApprox"); }
    else { el.className="slot"; el.innerHTML="<b>"+T("secControlTitle")+".</b> "+T("controlPending"); }
  }

  // =====================================================================
  //  RENDER / THEME / LANG
  // =====================================================================
  function refitAll(){ try{ if(adm0Lyr) map.fitBounds(adm0Lyr.getBounds().pad(0.04));
    else if(adm1Lyr) map.fitBounds(adm1Lyr.getBounds().pad(0.04));
    else if(events.length){ map.fitBounds(L.latLngBounds(events.map(function(e){return [e.lat,e.lon];})).pad(0.05)); } }catch(e){} }

  function restyleMap(){
    if(adm0Lyr) adm0Lyr.setStyle({color:cssv("--muted")});
    if(adm1Lyr) adm1Lyr.setStyle({color:cssv("--line"),fillColor:cssv("--muted")});
    buildFires(); buildAct(); buildSectors(); buildControl(); buildOsint(); buildClaims(); buildControlApprox();
    // re-add layers that were on
    LAYERS.forEach(function(L0){ if(L0.lyr && map.hasLayer(L0.lyr)){ map.removeLayer(L0.lyr); L0.lyr.addTo(map);} });
    drawClashes(); updateLegend();
  }
  function renderAll(){ buildUI(); drawClashes(); fillStats(); buildChartToggle(); drawChart(); fillControlSlot(); updateLegend(); }

  // init
  renderAll(); bindChartHover(); refitAll();
  map.on("overlayadd overlayremove", updateLegend);
  var rT; window.addEventListener("resize", function(){ clearTimeout(rT); rT=setTimeout(function(){ try{ map.invalidateSize(); }catch(e){} }, 200); });
  new MutationObserver(function(){ restyleMap(); }).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  document.addEventListener("sdn-lang", function(){ renderAll(); });
})();
