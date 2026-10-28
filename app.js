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
  // v2: humanitarian, conflict/agricultural fires, dated sentinel + radar, neighbours, extended bbox
  var hum = (S.humanitarian && typeof S.humanitarian==="object") ? S.humanitarian : null;
  var firesConflict = has(S.fires_conflict_recent) ? S.fires_conflict_recent : [];
  var firesTimeline = has(S.fires_timeline) ? S.fires_timeline : [];
  var firesNote = meta.fires_note || "";
  var neighborsUrl = (S.boundaries && S.boundaries.neighbors) || "data/boundaries/sudan_neighbors.geojson";
  var viewBbox = (meta.bbox && meta.bbox.length===4) ? meta.bbox : null; // [w,s,e,n]
  function fdate(s){ return window.SDN_FMTDATE ? window.SDN_FMTDATE(s) : String(s==null?"":s); }
  function pnum(n){ try{ return Number(n).toLocaleString(window.SDN_LANG==="ar"?"ar":(window.SDN_LANG||"fr")); }catch(e){ return String(n); } }
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

  // ---- Sentinel-2 imagery — own panes, immune to dark invert ----
  // Country-wide EOX annual mosaic (fallback) + DATED Planetary-Computer scene overlays on top.
  try{ map.createPane("sentinelPane"); map.getPane("sentinelPane").style.zIndex=250;
       map.createPane("sentinelDated"); map.getPane("sentinelDated").style.zIndex=260;
       map.createPane("sentinelRadar"); map.getPane("sentinelRadar").style.zIndex=255; }catch(e){}
  var fa = sentinel && sentinel.fallback_annual ? sentinel.fallback_annual : null;
  var composites = (fa && fa.composites) || (sentinel && sentinel.composites) || [];
  var sentYear = composites[0] ? composites[0].year : null;
  function annualUrl(year){ for(var i=0;i<composites.length;i++){ if(composites[i].year==year) return composites[i].url; } return (fa&&fa.tiles&&fa.tiles.url)||(sentinel&&sentinel.tiles.url); }
  var sentinelLayer = null, annualBase = null;
  var scenesDated = (sentinel && has(sentinel.scenes_dated)) ? sentinel.scenes_dated : [];
  if(sentinel){
    sentinelLayer = L.layerGroup();
    var at=(fa&&fa.tiles&&fa.tiles.attribution)||sentinel.attribution_s2||"";
    annualBase = L.tileLayer(annualUrl(sentYear), { attribution:at, maxZoom:16, maxNativeZoom:14, minZoom:1,
      bounds: L.latLngBounds([[8.2,21.8],[22.3,39.1]]), pane:"sentinelPane" });
    sentinelLayer.addLayer(annualBase);
    // dated scene overlays (true-color, each bounded to its footprint, date shown)
    scenesDated.forEach(function(sc){ if(!sc.tilesUrl||!sc.bbox)return;
      var b=L.latLngBounds([[sc.bbox[1],sc.bbox[0]],[sc.bbox[3],sc.bbox[2]]]);
      sentinelLayer.addLayer(L.tileLayer(sc.tilesUrl,{ attribution:sentinel.attribution_s2||"", maxZoom:18, maxNativeZoom:16, bounds:b, pane:"sentinelDated" }));
    });
  }
  // ---- Sentinel-1 radar (sees through cloud/dust) ----
  var s1Layer = null; var radar = (sentinel && sentinel.radar && sentinel.radar.tilesUrl) ? sentinel.radar : null;
  if(radar){
    var rb = radar.bbox ? L.latLngBounds([[radar.bbox[1],radar.bbox[0]],[radar.bbox[3],radar.bbox[2]]]) : undefined;
    s1Layer = L.tileLayer(radar.tilesUrl, { attribution:sentinel.attribution_s1||radar.source||"", maxZoom:18, maxNativeZoom:16, bounds:rb, pane:"sentinelRadar" });
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

  // ---- Neighbouring countries (context outline, incl. South Sudan) ----
  var neighborsLayer = L.layerGroup(); var neighborsGeo=null;
  function buildNeighbors(){ neighborsLayer.clearLayers(); if(!neighborsGeo)return;
    try{ L.geoJSON(neighborsGeo,{ style:function(){return {color:cssv("--faint"),weight:1,fill:false,opacity:.55,dashArray:"3 3"};},
      interactive:false }).eachLayer(function(l){neighborsLayer.addLayer(l);}); }catch(e){} }
  try{ fetch(neighborsUrl).then(function(r){return r.json();}).then(function(g){ neighborsGeo=g; buildNeighbors(); }).catch(function(){}); }catch(e){}

  // ---- Humanitarian: IDP localities (IOM DTM), radius ∝ population ----
  var idpSitesLayer = L.layerGroup();
  var idpSites = (hum && has(hum.idp_sites)) ? hum.idp_sites : [];
  var idpPopMax = idpSites.reduce(function(m,s){return Math.max(m,s.population||0);},1);
  function buildIdpSites(){ idpSitesLayer.clearLayers();
    idpSites.forEach(function(s){ var t=Math.sqrt((s.population||0)/idpPopMax);
      var col=cssv("--accent"), r=5+16*t;
      var m=L.circleMarker([s.lat,s.lon],{radius:r,color:col,weight:1.2,fillColor:col,fillOpacity:.28,opacity:.9});
      var nm=(window.SDN_LANG==="fr"&&s.state_fr)?s.state:s.name;
      m.bindPopup("<b>"+esc(s.name||"?")+"</b>"+(s.state?"<br><span class='muted'>"+esc(s.state)+"</span>":"")+
        "<br>"+pnum(s.population||0)+" "+T("idpPop")+(s.as_of?" <span class='muted'>("+T("humAsOf")+" "+fdate(s.as_of)+")</span>":"")+
        (s.source?"<br><span class='muted' style='font-size:10.5px'>"+esc(s.source)+"</span>":""));
      idpSitesLayer.addLayer(m);
    });
  }
  buildIdpSites();

  // ---- Humanitarian: displacement-by-state choropleth (ADM1 tinted by IDP) ----
  var idpStateLayer = L.layerGroup();
  var dispByState = (hum && has(hum.displacement_by_state)) ? hum.displacement_by_state : [];
  var idpByName={}, idpById={}, idpStateMax=1;
  dispByState.forEach(function(d){ idpStateMax=Math.max(idpStateMax,d.idp||0);
    if(d.state) idpByName[String(d.state).toLowerCase()]=d; if(d.adm1_id) idpById[d.adm1_id]=d; });
  function idpRamp(v){ var t=Math.min(1, v>0?(Math.log(1+v)/Math.log(1+idpStateMax)):0);
    // single-hue sequential on the accent blue
    var lo=hex("#cde2fb"), hi=hex("#104281"); return mix2(lo,hi,t); }
  function mix2(A,B,t){ return "rgb("+Math.round(A[0]+(B[0]-A[0])*t)+","+Math.round(A[1]+(B[1]-A[1])*t)+","+Math.round(A[2]+(B[2]-A[2])*t)+")"; }
  function dispFor(props){ var id=props.adm1_id||props.shapeISO||props.ADM1_PCODE;
    if(id && idpById[id]) return idpById[id];
    var nm=props.shapeName||props.name||props.ADM1_EN; if(nm && idpByName[String(nm).toLowerCase()]) return idpByName[String(nm).toLowerCase()];
    return null; }
  function buildIdpState(){ idpStateLayer.clearLayers(); if(!adm1geo || !dispByState.length)return;
    try{ L.geoJSON(adm1geo,{ style:function(f){ var d=dispFor(f.properties||{}); var v=d?d.idp:0;
        return {color:cssv("--line"), weight:.8, fill:true, fillColor:idpRamp(v), fillOpacity:v?.72:.08, opacity:.6}; },
      onEachFeature:function(f,l){ var d=dispFor(f.properties||{}); var nm=(f.properties&&(f.properties.shapeName||f.properties.name))||"?";
        l.bindPopup("<b>"+esc(nm)+"</b><br>"+(d?pnum(d.idp)+" "+T("idpPop")+(d.returnees?" · "+pnum(d.returnees)+" "+T("idpReturnees"):"")+(d.as_of?"<br><span class='muted'>"+T("humAsOf")+" "+fdate(d.as_of)+"</span>":""):"<span class='muted'>—</span>")); }
    }).eachLayer(function(l){idpStateLayer.addLayer(l);}); }catch(e){}
  }
  buildIdpState();

  // ---- Conflict fires (≤15 km of a recent clash) — distinct, foregrounded ----
  var firesConflictLayer = L.layerGroup();
  function buildFiresConflict(){ firesConflictLayer.clearLayers();
    var col=cssv("--ember")||"#c8361a";
    firesConflict.forEach(function(f){ var w=f.weight||f.n||1;
      firesConflictLayer.addLayer(L.circleMarker([f.lat,f.lon],{radius:4+Math.min(6,Math.log(1+w)*1.6),color:"#d8381c",weight:1.1,fillColor:"#f0461f",fillOpacity:.6,opacity:.95})
        .bindPopup("<b>"+T("lyrFiresConflict")+"</b><br><span class='muted' style='font-size:11px'>"+T("firesNoteShort")+"</span>")); });
  }
  buildFiresConflict();

  // ---- Arrows: who is advancing (derived from dated claimed captures) ----
  var arrowsLayer = L.layerGroup();
  function haversine(a,b){ var R=6371, toR=Math.PI/180;
    var dLat=(b[0]-a[0])*toR, dLon=(b[1]-a[1])*toR, la1=a[0]*toR, la2=b[0]*toR;
    var h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return 2*R*Math.asin(Math.sqrt(h)); }
  function bearing(a,b){ var toR=Math.PI/180, toD=180/Math.PI;
    var y=Math.sin((b[1]-a[1])*toR)*Math.cos(b[0]*toR);
    var x=Math.cos(a[0]*toR)*Math.sin(b[0]*toR)-Math.sin(a[0]*toR)*Math.cos(b[0]*toR)*Math.cos((b[1]-a[1])*toR);
    return (Math.atan2(y,x)*toD+360)%360; }
  function arrowhead(latlng, deg, col){
    var html='<svg width="18" height="18" viewBox="0 0 18 18" style="transform:rotate('+deg+'deg)"><path d="M9 1 L14 15 L9 11 L4 15 Z" fill="'+col+'" stroke="var(--panel)" stroke-width="1"/></svg>';
    return L.marker(latlng,{icon:L.divIcon({className:"arrowico",html:html,iconSize:[18,18],iconAnchor:[9,9]}),interactive:false,keyboard:false});
  }
  function buildArrows(){ arrowsLayer.clearLayers(); if(!claims)return;
    [["saf",claims.saf],["rsf",claims.rsf]].forEach(function(pair){
      var side=pair[0], arr=(pair[1]||[]).filter(function(c){return c.date&&isFinite(c.lat)&&isFinite(c.lon);})
        .slice().sort(function(a,b){return a.date<b.date?-1:1;});
      var col=sideColor(side);
      for(var i=1;i<arr.length;i++){ var from=[arr[i-1].lat,arr[i-1].lon], to=[arr[i].lat,arr[i].lon];
        var d=haversine(from,to); if(d<8 || d>260) continue; // local advance segments only
        arrowsLayer.addLayer(L.polyline([from,to],{color:col,weight:2.4,opacity:.8}));
        arrowsLayer.addLayer(arrowhead(to, bearing(from,to), col));
      }
      // contested localities get a ring + note (e.g. Bara, changed hands repeatedly)
      arr.forEach(function(c){ if(!c.contested)return;
        var m=L.circleMarker([c.lat,c.lon],{radius:7,color:cssv("--c-contested"),weight:2.4,fill:false,opacity:.95});
        m.bindPopup("<b>"+esc(c.place||"?")+"</b> <span class='tag'>"+T("legContested")+"</span>"+
          (c.date?"<br><span class='muted'>"+fdate(c.date)+"</span>":"")+
          "<br><span class='muted' style='font-size:11px'>"+T("arrowsCaveat")+"</span>"+
          (c.source?"<br><span class='muted' style='font-size:10.5px'>"+esc(c.source)+"</span>":""));
        arrowsLayer.addLayer(m); });
    });
  }
  buildArrows();

  // ---- layer registry (humanitarian & "who advances" foregrounded) ----
  var LAYERS = [
    {id:"adm",       labelKey:"lyrAdm",          on:true,  lyr:admGroup,           sw:"line",     avail:!!(adm0geo||adm1geo)},
    {id:"neighbors", labelKey:"lyrNeighbors",    on:true,  lyr:neighborsLayer,     sw:"nbr",      avail:true},
    {id:"idpstate",  labelKey:"lyrIdpState",     on:false, lyr:idpStateLayer,      sw:"idpfill",  avail:!!(hum&&dispByState.length&&adm1geo)},
    {id:"idpsites",  labelKey:"lyrIdpSites",     on:true,  lyr:idpSitesLayer,      sw:"idp",      avail:!!(hum&&idpSites.length)},
    {id:"ctrlapx",   labelKey:"lyrControlApprox",on:false, lyr:controlApproxLayer, sw:"ctrlfill", avail:!!ctrlApprox},
    {id:"clash",     labelKey:"lyrClash",        on:true,  lyr:clashLayer,         sw:"dot",      count:"clashCnt", avail:events.length>0},
    {id:"arrows",    labelKey:"lyrArrows",       on:true,  lyr:arrowsLayer,        sw:"arrow",    avail:!!claims},
    {id:"claimsaf",  labelKey:"lyrClaimsSaf",    on:false, lyr:claimsSafLayer,     sw:"saf",      avail:!!(claims&&has(claims.saf))},
    {id:"claimrsf",  labelKey:"lyrClaimsRsf",    on:false, lyr:claimsRsfLayer,     sw:"rsf",      avail:!!(claims&&has(claims.rsf))},
    {id:"firesC",    labelKey:"lyrFiresConflict",on:false, lyr:firesConflictLayer, sw:"firec",    avail:firesConflict.length>0},
    {id:"firms",     labelKey:"lyrFiresDensity", on:false, lyr:firesLayer,         sw:"fire",     avail:fires.length>0},
    {id:"osint",     labelKey:"lyrOsint",        on:false, lyr:osintLayer,         sw:"osint",    avail:!!osintData},
    {id:"act",       labelKey:"lyrAct",          on:false, lyr:actLayer,           sw:"sq",       avail:activity.length>0},
    {id:"sentinel",  labelKey:"lyrSentinel",     on:false, lyr:sentinelLayer,      sw:"sat",      avail:!!sentinel},
    {id:"s1",        labelKey:"lyrS1",           on:false, lyr:s1Layer,            sw:"radar",    avail:!!radar},
    {id:"sectors",   labelKey:"lyrSectors",      on:false, lyr:sectorLayer,        sw:"rect",     avail:focus.length>0},
    {id:"control",   labelKey:"lyrControl",      on:false, lyr:controlLayer,       sw:"ctrl",     avail:hasControl}
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
    else if(kind==="nbr"){ sw.style.background="transparent"; sw.style.border="1.5px dashed "+cssv("--faint"); sw.style.height="4px"; sw.style.borderRadius="2px"; sw.style.width="16px"; }
    else if(kind==="idpfill"){ sw.className="sw sq"; sw.style.background="linear-gradient(90deg,#cde2fb,#104281)"; }
    else if(kind==="idp"){ sw.style.background=cssv("--accent"); sw.style.opacity=".5"; }
    else if(kind==="arrow"){ sw.style.background="linear-gradient(90deg,"+cssv("--c-saf")+" 50%,"+cssv("--c-rsf")+" 50%)"; }
    else if(kind==="firec"){ sw.style.background="#f0461f"; }
    else if(kind==="radar"){ sw.className="sw sq"; sw.style.background="linear-gradient(135deg,#222,#aaa)"; }
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
      // Sentinel: annual-mosaic year selector + dated scene focus buttons (show the DATE)
      var sub=null;
      if(L0.id==="sentinel" && sentinel){
        sub=document.createElement("div"); sub.className="subrow"; sub.style.display=L0.on?"block":"none";
        if(composites.length){
          var sel=document.createElement("select"); sel.setAttribute("aria-label",T("sentYear"));
          composites.forEach(function(c){ var o=document.createElement("option"); o.value=c.year; o.textContent=c.label||c.year; if(c.year==sentYear)o.selected=true; sel.appendChild(o); });
          sel.addEventListener("change",function(){ sentYear=sel.value; if(annualBase) annualBase.setUrl(annualUrl(sentYear)); });
          sub.appendChild(sel);
        }
        if(scenesDated.length){
          var sb=document.createElement("div"); sb.className="focusbtns"; sb.style.marginTop="4px";
          scenesDated.forEach(function(sc){ var b=document.createElement("button"); b.className="btn"; b.type="button";
            b.textContent=(sc.label||T("sentFocusPfx"))+(sc.date?" · "+fdate(sc.date):"");
            b.addEventListener("click",function(){ var bb=sc.bbox?L.latLngBounds([[sc.bbox[1],sc.bbox[0]],[sc.bbox[3],sc.bbox[2]]]):null; if(bb)map.fitBounds(bb.pad(0.08)); });
            sb.appendChild(b); });
          sub.appendChild(sb);
        }
        lg.appendChild(sub);
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
    if(map.hasLayer(arrowsLayer)){ sec.push('<div class="legtitle">'+T("lyrArrows")+'</div>'+
      '<span class="pill" style="background:'+cssv("--c-saf")+'"></span>'+T("legArrowsSaf")+' &nbsp;'+
      '<span class="pill" style="background:'+cssv("--c-rsf")+'"></span>'+T("legArrowsRsf")+'<div class="muted" style="margin-top:2px">'+T("arrowsCaveat")+'</div>'); }
    if(map.hasLayer(idpStateLayer)){ sec.push('<div class="legtitle">'+T("legIdpState")+'</div>'+
      '<span class="pill sq" style="background:#cde2fb"></span>'+T("legLo")+' &nbsp;<span class="pill sq" style="background:#104281"></span>'+T("legHi")); }
    if(map.hasLayer(firesConflictLayer)){ sec.push('<div class="legtitle">'+T("lyrFiresConflict")+'</div>'+
      '<span class="pill" style="background:#f0461f"></span>'+T("legFiresConflict")); }
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
    // header daterange (+ event source label)
    var evSrc=(events[0]&&events[0].source)?String(events[0].source).toUpperCase():"UCDP";
    var dr=document.getElementById("daterange");
    if(dr) dr.textContent=(dateMin||"?")+" → "+(dateMax||"?")+" · "+num(events.length)+" "+T("kfClash")+" · "+T("srcLabel")+" "+evSrc;
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
  //  HUMANITARIAN hero banner + refugees-by-country panel
  // =====================================================================
  function fillHumHero(){
    var box=document.getElementById("humHero"); if(!box)return;
    if(!hum || !hum.totals){ box.hidden=true; return; }
    var tt=hum.totals; var figs=document.getElementById("humFigs");
    var parts='<div class="humhero-ttl">'+T("humTitle")+'</div>';
    if(tt.idp!=null) parts+='<div class="humfig"><b>'+pnum(tt.idp)+'</b><span class="lab">'+T("humIdp")+'</span><span class="src">'+T("humAsOf")+' '+fdate(tt.idp_as_of)+(tt.idp_source?' · '+esc(tt.idp_source):'')+'</span></div>';
    if(tt.refugees!=null) parts+='<div class="humfig"><b>'+pnum(tt.refugees)+'</b><span class="lab">'+T("humRefugees")+'</span><span class="src">'+T("humAsOf")+' '+fdate(tt.refugees_as_of)+(tt.refugees_source?' · '+esc(tt.refugees_source):'')+'</span></div>';
    figs.innerHTML=parts;
    var cav=document.getElementById("humCaveat"); if(cav) cav.textContent=T("humCaveat");
    box.hidden=false;
  }
  function fillRefugees(){
    var sec=document.getElementById("refSection"); if(!sec)return;
    var rows=(hum && has(hum.refugees_by_country)) ? hum.refugees_by_country.slice() : [];
    if(!rows.length){ sec.hidden=true; return; }
    rows.sort(function(a,b){return (b.people||b.count||0)-(a.people||a.count||0);});
    var top=rows.slice(0,12); var mx=top.reduce(function(m,r){return Math.max(m,r.people||r.count||0);},1);
    var head="<tr><th>"+T("thCountry")+"</th><th>"+T("thRefugees")+"</th></tr>";
    var body=top.map(function(r){ var v=r.people||r.count||0; var w=Math.round(120*v/mx);
      var nb=r.neighbour?' ·':'';
      return "<tr><td>"+esc(r.country)+nb+'</td><td>'+pnum(v)+' <span class="bar" style="width:'+w+'px"></span></td></tr>'; }).join("");
    document.getElementById("refCountryTable").innerHTML=head+body;
    sec.hidden=false;
  }

  // =====================================================================
  //  FIRES timeline frieze (all vs north) — two series, one axis, legend
  // =====================================================================
  function drawFiresChart(){
    var sec=document.getElementById("firesSection"); if(!sec)return;
    if(!firesTimeline.length){ sec.hidden=true; return; }
    sec.hidden=false;
    var host=document.getElementById("firesChart"); if(!host)return;
    var W=760,H=200,padL=46,padR=10,padT=10,padB=30, iw=W-padL-padR, ih=H-padT-padB;
    var tl=firesTimeline; var n=tl.length;
    var max=tl.reduce(function(m,d){return Math.max(m,d.all||0);},1);
    function niceMax(m){ var p=Math.pow(10,Math.floor(Math.log10(m))); var r=m/p; var k=r<=1?1:r<=2?2:r<=5?5:10; return k*p; }
    var ymax=niceMax(max);
    var x=function(i){return padL+(n<=1?0:(i/(n-1))*iw);};
    var y=function(v){return padT+ih-(v/ymax)*ih;};
    function path(key){ var p=""; tl.forEach(function(d,i){ p+=(i?"L":"M")+x(i).toFixed(1)+" "+y(d[key]||0).toFixed(1)+" "; }); return p; }
    var cAll=cssv("--accent"), cNorth=cssv("--ember")||"#c8361a";
    var svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(T("secFiresTitle"))+'">';
    [0,.5,1].forEach(function(f){ var yy=padT+ih-f*ih; svg+='<line class="grid" x1="'+padL+'" y1="'+yy+'" x2="'+(W-padR)+'" y2="'+yy+'"/>'+
      '<text class="ax" x="'+(padL-5)+'" y="'+(yy+3)+'" text-anchor="end">'+num(Math.round(ymax*f))+'</text>'; });
    svg+='<path d="'+path("all")+'" fill="none" stroke="'+cAll+'" stroke-width="2"/>';
    svg+='<path d="'+path("north")+'" fill="none" stroke="'+cNorth+'" stroke-width="2" stroke-dasharray="4 3"/>';
    var step=Math.ceil(n/8);
    tl.forEach(function(d,i){ if(i%step!==0 && i!==n-1)return; svg+='<text class="ax" x="'+x(i).toFixed(1)+'" y="'+(H-12)+'" text-anchor="middle">'+esc(d.month)+'</text>'; });
    // transparent hit columns for hover
    var cw=iw/Math.max(1,n);
    tl.forEach(function(d,i){ svg+='<rect class="hit" x="'+(x(i)-cw/2).toFixed(1)+'" y="'+padT+'" width="'+cw.toFixed(1)+'" height="'+ih+'" fill="transparent" data-m="'+esc(d.month)+'" data-a="'+(d.all||0)+'" data-n="'+(d.north||0)+'"/>'; });
    svg+='<line class="base" x1="'+padL+'" y1="'+(padT+ih)+'" x2="'+(W-padR)+'" y2="'+(padT+ih)+'"/></svg>';
    host.innerHTML=svg;
    var lg=document.getElementById("firesLegend");
    if(lg) lg.innerHTML='<span class="chip-c"><i style="background:'+cAll+'"></i>'+T("firesAll")+'</span><span class="chip-c"><i style="background:'+cNorth+'"></i>'+T("firesNorth")+'</span>';
  }
  function bindFiresHover(){
    var host=document.getElementById("firesChart"), tip=document.getElementById("firesTip"); if(!host||!tip)return;
    host.addEventListener("mousemove",function(ev){ var t=ev.target; if(t&&t.classList&&t.classList.contains("hit")){
      tip.style.display="block";
      tip.innerHTML="<b>"+esc(t.getAttribute("data-m"))+"</b><br>"+T("firesAll")+" : "+num(+t.getAttribute("data-a"))+"<br>"+T("firesNorth")+" : "+num(+t.getAttribute("data-n"));
      var r=host.getBoundingClientRect(); tip.style.left=Math.min(r.width-120,(ev.clientX-r.left+10))+"px"; tip.style.top=(ev.clientY-r.top-10)+"px";
    } else tip.style.display="none"; });
    host.addEventListener("mouseleave",function(){ tip.style.display="none"; });
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
  function refitAll(){ try{
    if(viewBbox){ map.fitBounds(bboxBounds(viewBbox)); return; } // extended south + neighbours context
    if(adm0Lyr) map.fitBounds(adm0Lyr.getBounds().pad(0.04));
    else if(adm1Lyr) map.fitBounds(adm1Lyr.getBounds().pad(0.04));
    else if(events.length){ map.fitBounds(L.latLngBounds(events.map(function(e){return [e.lat,e.lon];})).pad(0.05)); } }catch(e){} }

  function restyleMap(){
    if(adm0Lyr) adm0Lyr.setStyle({color:cssv("--muted")});
    if(adm1Lyr) adm1Lyr.setStyle({color:cssv("--line"),fillColor:cssv("--muted")});
    buildFires(); buildAct(); buildSectors(); buildControl(); buildOsint(); buildClaims(); buildControlApprox();
    buildNeighbors(); buildIdpSites(); buildIdpState(); buildFiresConflict(); buildArrows();
    // re-add layers that were on
    LAYERS.forEach(function(L0){ if(L0.lyr && map.hasLayer(L0.lyr)){ map.removeLayer(L0.lyr); L0.lyr.addTo(map);} });
    drawClashes(); updateLegend();
  }
  function renderAll(){ buildUI(); drawClashes(); fillStats(); fillHumHero(); fillRefugees(); buildChartToggle(); drawChart(); drawFiresChart(); fillControlSlot(); updateLegend(); }

  // init
  renderAll(); bindChartHover(); bindFiresHover(); refitAll();
  map.on("overlayadd overlayremove", updateLegend);
  var rT; window.addEventListener("resize", function(){ clearTimeout(rT); rT=setTimeout(function(){ try{ map.invalidateSize(); }catch(e){} }, 200); });
  new MutationObserver(function(){ restyleMap(); }).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  document.addEventListener("sdn-lang", function(){ renderAll(); });
})();
