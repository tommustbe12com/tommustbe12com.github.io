(function() {
  // --- Config ---
  var maxLines = 400;        // max messages kept
  var overlayId = "inlineConsoleOverlay_v1";

  if (document.getElementById(overlayId)) return; // don't double-initialize

  // --- Create UI ---
  var css = '\
  #' + overlayId + ' { position: fixed; left: 8px; bottom: 8px; width: 420px; max-height: 38vh; background: rgba(20,20,20,0.94); color: #eee; font-family: monospace; font-size: 12px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.6); z-index: 2147483647; display:flex; flex-direction:column; }\
  #' + overlayId + ' .hdr{ padding:6px 8px; display:flex; gap:8px; align-items:center; justify-content:space-between; }\
  #' + overlayId + ' .hdr .left{display:flex; gap:8px; align-items:center;}\
  #' + overlayId + ' .hdr .title{ font-weight:700; color:#fff; font-size:13px; }\
  #' + overlayId + ' .hdr button{ background:transparent; color:#ddd; border:1px solid rgba(255,255,255,0.06); padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;}\
  #' + overlayId + ' .log{ overflow:auto; padding:8px; flex:1 1 auto; }\
  #' + overlayId + ' .line{ padding:2px 0; white-space:pre-wrap; word-break:break-word; }\
  #' + overlayId + ' .line.log{ color:#d7d7d7; }\
  #' + overlayId + ' .line.info{ color:#9fe0ff; }\
  #' + overlayId + ' .line.warn{ color:#ffd86b; }\
  #' + overlayId + ' .line.err{ color:#ff9b9b; }\
  #' + overlayId + ' .controls{ display:flex; gap:6px; padding:6px 8px; align-items:center; }\
  #' + overlayId + ' .controls input[type=text]{ flex:1 1 auto; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:#eee; font-family:inherit; font-size:12px; }\
  #' + overlayId + ' .small{ font-size:11px; opacity:0.85; }\
  #' + overlayId + ' .muted{ opacity:0.7; font-size:11px; }\
  #' + overlayId + ' .drag-handle{ width:10px; height:10px; border-radius:2px; background:rgba(255,255,255,0.06); cursor:move; }\
  ';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.innerHTML = '\
    <div class="hdr">\
      <div class="left"><div class="drag-handle" title="Drag"></div><div class="title">Inline Console</div><div class="muted">(bottom-left)</div></div>\
      <div class="right">\
        <button id="ic-copy">Copy</button>\
        <button id="ic-clear">Clear</button>\
        <button id="ic-collapse">−</button>\
      </div>\
    </div>\
    <div class="log" id="ic-log" aria-live="polite"></div>\
    <div class="controls">\
      <input id="ic-eval" placeholder="Type JS and press Enter to run" aria-label="Run JS">\
      <button id="ic-run">Run</button>\
    </div>';
  document.body.appendChild(overlay);

  var logEl = document.getElementById("ic-log");
  var evalInput = document.getElementById("ic-eval");
  var runBtn = document.getElementById("ic-run");
  var clearBtn = document.getElementById("ic-clear");
  var copyBtn = document.getElementById("ic-copy");
  var collapseBtn = document.getElementById("ic-collapse");

  // --- Logging mechanics ---
  var buffer = [];

  function addLine(type, parts) {
    try {
      var time = new Date().toISOString().split("T")[1].split(".")[0];
      var text = parts.map(function(p) {
        if (p === null) return "null";
        if (p === undefined) return "undefined";
        if (typeof p === "object") {
          try { return JSON.stringify(p); } catch (e) { return String(p); }
        }
        return String(p);
      }).join(" ");
      var line = { t: time, type: type, text: text };
      buffer.push(line);
      if (buffer.length > maxLines) buffer.shift();
      render();
    } catch (e) {
      // noop
    }
  }

  function render() {
    logEl.innerHTML = "";
    for (var i = 0; i < buffer.length; i++) {
      var L = buffer[i];
      var div = document.createElement("div");
      div.className = "line " + (L.type === "error" ? "err" : L.type);
      div.textContent = "[" + L.t + "] " + L.text;
      logEl.appendChild(div);
    }
    // keep scroll at bottom
    logEl.scrollTop = logEl.scrollHeight;
  }

  // --- hook console methods ---
  var consoleMethods = ["log","info","warn","error","debug"];
  consoleMethods.forEach(function(m){
    var orig = console[m] && console[m].bind(console);
    if (!orig) return;
    console[m] = function() {
      try { addLine(m === "error" ? "error" : (m === "warn" ? "warn" : (m === "info" ? "info" : "log")), Array.prototype.slice.call(arguments)); } catch(e){}
      try { orig.apply(console, arguments); } catch(e){}
    };
  });

  // capture uncaught errors
  window.addEventListener("error", function(ev) {
    var msg = ev && ev.message ? ev.message : String(ev);
    var src = (ev && ev.filename) ? ev.filename + ":" + (ev.lineno||"?") : "";
    addLine("error", ["UncaughtError:", msg, src]);
  });

  // capture unhandled promise rejections
  window.addEventListener("unhandledrejection", function(ev) {
    try {
      var reason = ev && ev.reason ? ev.reason : ev;
      addLine("error", ["UnhandledRejection:", (typeof reason === "object") ? JSON.stringify(reason) : String(reason)]);
    } catch(e){}
  });

  // --- Wrap fetch to log requests/responses (lightweight) ---
  if (window.fetch) {
    var origFetch = window.fetch.bind(window);
    window.fetch = function(input, init) {
      try {
        var method = (init && init.method) || "GET";
        var url = (typeof input === "string") ? input : (input && input.url) || String(input);
        addLine("info", ["fetch →", method, url]);
        return origFetch(input, init).then(function(resp){
          addLine("info", ["fetch response:", resp.status, resp.url || url]);
          return resp;
        }).catch(function(err){
          addLine("error", ["fetch error:", (err && err.message) || String(err)]);
          throw err;
        });
      } catch (e) {
        return origFetch(input, init);
      }
    };
  }

  // --- Wrap XHR open/send to log ---
  (function(){
    var X = window.XMLHttpRequest;
    if (!X) return;
    function WrappedXHR(){
      var real = new X();
      var _openArgs = null;
      var origOpen = real.open;
      real.open = function() {
        _openArgs = Array.prototype.slice.call(arguments);
        try {
          var method = _openArgs[0], url = _openArgs[1];
          addLine("info", ["XHR open:", method, url]);
        } catch(e){}
        return origOpen.apply(real, arguments);
      };
      var origSend = real.send;
      real.send = function() {
        try { addLine("info", ["XHR send:", (_openArgs && _openArgs[0]) || "", (_openArgs && _openArgs[1]) || ""]); } catch(e){}
        return origSend.apply(real, arguments);
      };
      return real;
    }
    try {
      WrappedXHR.prototype = X.prototype;
      window.XMLHttpRequest = WrappedXHR;
    } catch(e){}
  })();

  // --- Controls ---
  clearBtn.addEventListener("click", function(){ buffer = []; render(); });
  copyBtn.addEventListener("click", function(){
    try {
      var text = buffer.map(function(l){ return "["+l.t+"] "+l.type+": "+l.text; }).join("\n");
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : (function(){ var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); })();
      addLine("info", ["Copied console to clipboard"]);
    } catch (e) { addLine("warn", ["Copy failed:", e && e.message || e]); }
  });

  collapseBtn.addEventListener("click", function(){
    if (logEl.style.display === "none") {
      logEl.style.display = "block";
      document.querySelector("#" + overlayId + " .controls").style.display = "flex";
      collapseBtn.textContent = "−";
    } else {
      logEl.style.display = "none";
      document.querySelector("#" + overlayId + " .controls").style.display = "none";
      collapseBtn.textContent = "+";
    }
  });

  runBtn.addEventListener("click", runEval);
  evalInput.addEventListener("keydown", function(e){
    if (e.key === "Enter") runEval();
  });

  function runEval() {
    var code = evalInput.value;
    if (!code) return;
    try {
      var res = (0, eval)(code); // indirect eval so 'this' not bound to window
      addLine("log", ["eval →", String(res)]);
    } catch (e) {
      addLine("error", ["eval error:", e && e.message || e]);
    }
  }

  // --- Drag to reposition ---
  (function enableDrag() {
    var drag = overlay.querySelector(".drag-handle");
    var startX=0, startY=0, startLeft=0, startBottom=0, dragging=false;
    drag.addEventListener("mousedown", begin);
    drag.addEventListener("touchstart", begin, {passive:true});
    function begin(e) {
      dragging = true;
      var ev = e.touches ? e.touches[0] : e;
      startX = ev.clientX; startY = ev.clientY;
      // compute current left / bottom
      var rc = overlay.getBoundingClientRect();
      startLeft = rc.left;
      startBottom = window.innerHeight - rc.bottom;
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", move, {passive:false});
      document.addEventListener("touchend", end);
      e.preventDefault && e.preventDefault();
    }
    function move(e) {
      if (!dragging) return;
      var ev = e.touches ? e.touches[0] : e;
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      var newLeft = Math.max(6, Math.min(window.innerWidth - overlay.offsetWidth - 6, startLeft + dx));
      var newBottom = Math.max(6, Math.min(window.innerHeight - overlay.offsetHeight - 6, startBottom - dy));
      overlay.style.left = newLeft + "px";
      overlay.style.bottom = newBottom + "px";
      overlay.style.right = "auto";
      e.preventDefault && e.preventDefault();
    }
    function end() {
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    }
  })();

  // --- initial banner ---
  addLine("info", ["Inline console initialized — captured: console, errors, unhandledrejection, fetch, XHR. Paste this script early to capture startup logs."]);

  // Expose small API for manual logs
  window.inlineConsole = {
    log: function(){ addLine("log", Array.prototype.slice.call(arguments)); },
    clear: function(){ buffer=[]; render(); }
  };

})();