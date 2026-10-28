/* Shared chrome: light/dark theme (localStorage "sdn-theme") + i18n switch
   (localStorage "sdn-lang"). Used by index.html and methode.html.
   Exposes window.SDN_T(key) and window.SDN_LANG; fires "sdn-lang" on <document>. */
(function(){
  "use strict";
  var I = window.SDN_I18N || {};
  var root = document.documentElement;

  // ---- theme ----
  function sysDark(){ try{ return matchMedia("(prefers-color-scheme: dark)").matches; }catch(e){ return false; } }
  var theme = (function(){ try{ return localStorage.getItem("sdn-theme"); }catch(e){ return null; } })() || (sysDark()?"dark":"light");
  function applyTheme(t){
    root.setAttribute("data-theme", t); theme=t;
    try{ localStorage.setItem("sdn-theme", t); }catch(e){}
  }
  applyTheme(theme);
  Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function(b){
    b.addEventListener("click", function(){ applyTheme(theme==="dark"?"light":"dark"); });
  });

  // ---- language ----
  function pickLang(){
    var q=null; try{ q=new URLSearchParams(location.search).get("lang"); }catch(e){}
    if(q && I[q]) return q;               // explicit URL choice wins
    var saved=null; try{ saved=localStorage.getItem("sdn-lang"); }catch(e){}
    if(saved && I[saved]) return saved;   // then the remembered choice
    var list = navigator.languages || [navigator.language || ""];
    for(var i=0;i<list.length;i++){ var c=String(list[i]).slice(0,2).toLowerCase(); if(I[c]) return c; }
    return I.en ? "en" : "fr";
  }
  var lang = pickLang();
  window.SDN_LANG = lang;
  window.SDN_T = function(k){ var t=I[lang]||I.en||{}; return (t && t[k]!=null)?t[k] : (I.fr&&I.fr[k]!=null?I.fr[k]:k); };
  // Format an ISO date (YYYY-MM-DD) with Intl in the current language; pass through non-ISO text.
  window.SDN_FMTDATE = function(s){
    s = String(s==null?"":s);
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(!m) return s; // free-text date (e.g. "updated continuously …") shown as-is
    try{
      var loc = window.SDN_LANG==="ar"?"ar":(window.SDN_LANG||"fr");
      return new Intl.DateTimeFormat(loc,{year:"numeric",month:"short",day:"numeric"})
        .format(new Date(Date.UTC(+m[1],+m[2]-1,+m[3])));
    }catch(e){ return s; }
  };
  // Format a "YYYY-MM" month with Intl in the current language.
  window.SDN_FMTMONTH = function(s){
    s = String(s==null?"":s);
    var m = s.match(/^(\d{4})-(\d{2})/);
    if(!m) return s;
    try{
      var loc = window.SDN_LANG==="ar"?"ar":(window.SDN_LANG||"fr");
      return new Intl.DateTimeFormat(loc,{year:"numeric",month:"long"})
        .format(new Date(Date.UTC(+m[1],+m[2]-1,1)));
    }catch(e){ return s; }
  };

  function apply(l){
    if(!I[l]) l = I.en?"en":"fr";
    lang=l; window.SDN_LANG=l;
    var t=I[l]||{};
    root.setAttribute("lang", l);
    root.setAttribute("dir", t.dir||"ltr");
    document.querySelectorAll("[data-t]").forEach(function(e){ var v=t[e.getAttribute("data-t")]; if(v!=null) e.textContent=v; });
    document.querySelectorAll("[data-tt]").forEach(function(e){ var v=t[e.getAttribute("data-tt")]; if(v!=null) e.title=v; });
    document.querySelectorAll("[data-ph]").forEach(function(e){ var v=t[e.getAttribute("data-ph")]; if(v!=null) e.placeholder=v; });
    if(t.docTitle) document.title = t.docTitle;
    document.querySelectorAll("[data-l]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-l")===l)); });
    try{ localStorage.setItem("sdn-lang", l); }catch(e){}
    try{ document.dispatchEvent(new CustomEvent("sdn-lang",{detail:l})); }catch(e){
      var ev=document.createEvent("Event"); ev.initEvent("sdn-lang",false,false); document.dispatchEvent(ev);
    }
  }
  document.querySelectorAll("[data-l]").forEach(function(b){
    b.addEventListener("click", function(){ apply(b.getAttribute("data-l")); });
  });
  apply(lang);
})();
