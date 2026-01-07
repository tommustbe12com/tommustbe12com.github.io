(function () {
  const canvas = document.getElementById('starsCanvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) { console.warn('WebGL not supported'); return; }

  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize() { canvas.width = Math.floor(innerWidth * DPR); canvas.height = Math.floor(innerHeight * DPR); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; gl.viewport(0, 0, canvas.width, canvas.height); }
  window.addEventListener('resize', resize); resize();

  const vert = `attribute vec3 aPos; attribute float aSize; varying float vDepth; uniform mat4 uProj; uniform float uPixelRatio; void main(){ vec4 pos = vec4(aPos,1.0); gl_Position = uProj * pos; gl_PointSize = aSize * uPixelRatio; vDepth = -aPos.z; }`;
  const frag = `precision mediump float; varying float vDepth; uniform float uOpacity; void main(){ vec2 uv = gl_PointCoord - 0.5; float r = length(uv); float alpha = smoothstep(0.5, 0.0, r); // soft circle
    // depth-based tint (farther = dimmer)
    float d = clamp(1.0 - (vDepth/200.0), 0.0, 1.0);
    // greenish star color (tuned to be warmer/greener)
    vec3 base = vec3(0.40, 0.95, 0.35);
    gl_FragColor = vec4(base * d, alpha * uOpacity * d);
  }`;

  function compileShader(src, type) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); } return s; }
  const vS = compileShader(vert, gl.VERTEX_SHADER); const fS = compileShader(frag, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram(); gl.attachShader(prog, vS); gl.attachShader(prog, fS); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  const aPos = gl.getAttribLocation(prog, 'aPos'); const aSize = gl.getAttribLocation(prog, 'aSize');
  const uProj = gl.getUniformLocation(prog, 'uProj'); const uPixelRatio = gl.getUniformLocation(prog, 'uPixelRatio'); const uOpacity = gl.getUniformLocation(prog, 'uOpacity');

  const COUNT = 1400; const depth = 600;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * innerWidth * 0.12;
    const y = (Math.random() - 0.5) * innerHeight * 0.12;
    const z = -Math.random() * depth;
    positions[i * 3 + 0] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    sizes[i] = 1.0 + Math.random() * 3.2;
  }

  const posBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
  const sizeBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer); gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(aPos); gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aSize); gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer); gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

  function setProjection() {
    const aspect = canvas.width / canvas.height; const fov = 60 * Math.PI / 180; const near = 0.1; const far = 1000;
    const f = 1.0 / Math.tan(fov / 2);
    const proj = new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniform1f(uPixelRatio, DPR);
  }

  let velocity = 0.02; const minSpeed = 0.015; const maxSpeed = 0.5; let targetSpeed = minSpeed; let scrollTimeout;

  function computeTarget() { const doc = document.documentElement; const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight); const s = (window.scrollY || 0) / maxScroll; return s; }

  window.addEventListener('scroll', () => {
    const factor = computeTarget();
    targetSpeed = minSpeed + Math.pow(factor, 1.8) * (maxSpeed - minSpeed);
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { targetSpeed = minSpeed; }, 200);
  }, { passive: true });

  window.addEventListener('wheel', (e) => { velocity += Math.sign(e.deltaY) * 0.06; velocity = Math.max(minSpeed, Math.min(maxSpeed, velocity)); });

  function onResize() { DPR = Math.min(window.devicePixelRatio || 1, 2); resize(); setProjection(); }
  window.addEventListener('resize', onResize);

  let last = performance.now(); function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    velocity += (targetSpeed - velocity) * 0.035;
    velocity = Math.max(minSpeed * 0.5, Math.min(maxSpeed * 1.2, velocity));

    for (let i = 0; i < COUNT; i++) {
      let z = positions[i * 3 + 2]; z += velocity * (30 + (sizes[i] - 1.0) * 6) * dt * 60;
      if (z > 20) {
    z -= depth;
    positions[i * 3 + 0] = (Math.random() - 0.5) * innerWidth * 0.12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * innerHeight * 0.12;
      }
      positions[i * 3 + 2] = z;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer); gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

    // subtle green ambient clear so the scene reads as greenish
    gl.clearColor(0.02, 0.06, 0.03, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uOpacity, 0.65);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    requestAnimationFrame(frame);
  }

  setProjection(); requestAnimationFrame(frame);

  document.getElementById('btnPulse')?.addEventListener('click', () => { velocity += 0.9; setTimeout(() => { velocity = Math.max(minSpeed, velocity * 0.25); }, 220); });

    })();

// Existing script content
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const broughtFrom = getQueryParam("broughtFrom");
if (broughtFrom === "blackBeltGame") {
    alert("Hello! Welcome to my site. It looks like you came here from my Black Belt Game! Have fun exploring my site!");

    const encodedWebhookUrl = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMzOTI4MTExMDIzNjEzNTU0NC9kRzA4cmpDOGpXVkIzNFNuSXVjbF9ua1I3OTh1M0I2dmtmcnNUNWdSY3dGVExXRkNlRXRpbzYwS1lnX0xoczkycnpnLQ==";
    const webhookUrl = atob(encodedWebhookUrl);

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "User came from Black Belt Game!" })
    });
} else if (broughtFrom === "senseiGameJam") {
    alert("Hello! Welcome to my site. It looks like you came here from my Sensei Game Jam Game! Have fun exploring my site!");

    const encodedWebhookUrl = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMzOTI4MTExMDIzNjEzNTU0NC9kRzA4cmpDOGpXVkIzNFNuSXVjbF9ua1I3OTh1M0I2dmtmcnNUNWdSY3dGVExXRkNlRXRpbzYwS1lnX0xoczkycnpnLQ==";
    const webhookUrl = atob(encodedWebhookUrl);

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "User came from Sensei Game Jam Game!" })
    });
}

const ytWrapper = document.getElementById("youtube-carousel-wrapper");
const channelId = "UCJJUPBhRVePwRmBP9xEh_hg";
let ytSlides = [];
let currentYtSlide = 0;

async function loadLatestYouTubeVideos() {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const data = await res.json();

    const videos = data.items
      .filter(item => !item.link.includes("/shorts/"))
      .slice(0, 3);

    if (videos.length === 0) {
      ytWrapper.innerHTML = "<p>No recent videos found.</p>";
      return;
    }

    // Create all slides and iframes immediately
    videos.forEach((video, index) => {
      const videoId = video.link.split("v=")[1];
      const slide = document.createElement("div");
      slide.classList.add("youtube-carousel-slide");
      if (index === 0) slide.classList.add("active");

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = video.title;
      iframe.setAttribute("frameborder", "0");
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.allowFullscreen = true;

      slide.appendChild(iframe);
      ytWrapper.appendChild(slide);
      ytSlides.push(slide);
      
    });

    initYouTubeCarousel();

  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    ytWrapper.innerHTML = "<p>Failed to load videos.</p>";
  }
}

function initYouTubeCarousel() {
  const prevBtn = document.querySelector(".youtube-btn.prev");
  const nextBtn = document.querySelector(".youtube-btn.next");

  function showSlide(index) {
    ytSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentYtSlide = (currentYtSlide - 1 + ytSlides.length) % ytSlides.length;
    showSlide(currentYtSlide);
  });

  nextBtn.addEventListener("click", () => {
    currentYtSlide = (currentYtSlide + 1) % ytSlides.length;
    showSlide(currentYtSlide);
  });

  setInterval(() => {
    currentYtSlide = (currentYtSlide + 1) % ytSlides.length;
    showSlide(currentYtSlide);
  }, 10000);
}

// Load on page load
loadLatestYouTubeVideos();
