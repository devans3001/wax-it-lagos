"use client";

import { useEffect, useRef } from "react";
import {
  BATH,
  BATH_DEPTH,
  COMPARE_AFTER,
  COMPARE_BEFORE,
  JOURNEY_IMGS,
  LAB_IMGS,
} from "@/lib/photos";

/* ------------------------------------------------------------------ */
/* PHOTO STAGES — the near-real pipeline. Every visual is an          */
/* AI-generated photograph in the spa's own colours; code supplies    */
/* only the motion: depth parallax, crossfades, a slider wipe, and    */
/* live steam drawn over the hero photograph.                         */
/* ------------------------------------------------------------------ */

/* --------------------------------- HERO -------------------------------- */
/* The hammam photograph + its depth map in a WebGL shader: the room  */
/* has real depth — near water moves more than the far wall — plus a  */
/* slow cinematic push-in and steam that is drawn live, every frame.  */

const VERT = `
attribute vec2 p; varying vec2 vUv;
void main(){ vUv = vec2(p.x * .5 + .5, 1.0 - (p.y * .5 + .5)); gl_Position = vec4(p, 0., 1.); }
`;
const FRAG = `
precision highp float; varying vec2 vUv;
uniform sampler2D uImg; uniform sampler2D uDepth;
uniform vec2 uMouse; uniform float uTime; uniform vec2 uCover;
void main(){
  float d = texture2D(uDepth, vUv).r;
  vec2 drift = vec2(sin(uTime * .10), cos(uTime * .083)) * .006;
  vec2 off = (uMouse + drift) * (d - .38) * .055;
  vec2 uv = (vUv - .5) * uCover * .955 + .5 + off;
  gl_FragColor = vec4(texture2D(uImg, uv).rgb, 1.);
}
`;

export function PhotoBath() {
  const glRef = useRef<HTMLCanvasElement>(null);
  const tapRef = useRef<HTMLCanvasElement>(null);
  const steamRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glCanvas = glRef.current;
    const tapCanvas = tapRef.current;
    const steamCanvas = steamRef.current;
    if (!glCanvas || !tapCanvas || !steamCanvas) return;
    const gl = glCanvas.getContext("webgl", { antialias: true });
    if (!gl) return;
    /* tap anchor points in CSS pixels — filled by resize() through the
       shader's cover-fit math; declared before resize() can first run. */
    const tap = { sx: 0, sy: 0, ix: 0, iy: 0 };

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);

    let loaded = 0;
    let imgAspect = 1.5;
    const loadTex = (src: string, unit: number) => {
      const img = new Image();
      img.onload = () => {
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        if (unit === 0) {
          imgAspect = img.width / img.height;
          resize();
        }
        loaded++;
      };
      img.src = src;
    };
    loadTex(BATH, 0);
    loadTex(BATH_DEPTH, 1);
    gl.uniform1i(U("uImg"), 0);
    gl.uniform1i(U("uDepth"), 1);

    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      glCanvas.width = window.innerWidth * dpr;
      glCanvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      const ca = window.innerWidth / window.innerHeight;
      let sx = 1, sy = 1;
      if (ca > imgAspect) sy = imgAspect / ca;
      else sx = ca / imgAspect;
      gl.uniform2f(U("uCover"), sx, sy);
      steamCanvas.width = window.innerWidth;
      steamCanvas.height = window.innerHeight;
      tapCanvas.width = window.innerWidth;
      tapCanvas.height = window.innerHeight;
      // Map the tap's position in the photograph (spout 63%/27%, landing
      // 62.5%/60%) through the shader's cover-fit so the live water stays
      // glued to the painted tap on any screen shape.
      const coverX = ca > imgAspect ? 1 : ca / imgAspect;
      const coverY = ca > imgAspect ? imgAspect / ca : 1;
      const mapX = (ix: number) => ((ix - 0.5) / (coverX * 0.955) + 0.5) * window.innerWidth;
      const mapY = (iy: number) => ((iy - 0.5) / (coverY * 0.955) + 0.5) * window.innerHeight;
      tap.sx = mapX(0.635);
      tap.sy = mapY(0.258);
      tap.ix = mapX(0.623);
      tap.iy = mapY(0.618);
    };
    window.addEventListener("resize", resize);
    resize();

    /* the running tap — the photograph has the tap and its stream painted
       in; this layer makes the water move: flowing highlights down the
       stream, a glow and expanding ripples where it lands. Drawn on its
       own canvas that shares the photo's push-in animation, anchored
       through the same cover-fit math as the shader. */
    const tctx = tapCanvas.getContext("2d")!;
    const drawTap = (t: number) => {
      const W = tapCanvas.width;
      if (!W || tap.iy <= tap.sy) return;
      tctx.clearRect(0, 0, tapCanvas.width, tapCanvas.height);
      const x = tap.sx;
      const y0 = tap.sy;
      const y1 = tap.iy;
      const wob = Math.sin(t * 0.0021) * 1.3;
      const wStream = Math.max(3, W * 0.0042);
      // the stream body — a soft, slightly tapered ribbon
      const grad = tctx.createLinearGradient(0, y0, 0, y1);
      grad.addColorStop(0, "rgba(225,243,238,0.34)");
      grad.addColorStop(0.75, "rgba(225,243,238,0.20)");
      grad.addColorStop(1, "rgba(225,243,238,0.30)");
      tctx.fillStyle = grad;
      tctx.beginPath();
      tctx.moveTo(x - wStream / 2 + wob * 0.3, y0);
      tctx.lineTo(x + wStream / 2 + wob * 0.3, y0);
      tctx.lineTo(x + wStream * 0.8 + wob, y1);
      tctx.lineTo(x - wStream * 0.8 + wob, y1);
      tctx.closePath();
      tctx.fill();
      // flowing highlights — bright dashes racing down the stream
      for (let k = 0; k < 9; k++) {
        const f = (t * 0.00042 + k / 9) % 1;
        const yy = y0 + f * (y1 - y0);
        const a = 0.30 * Math.sin(f * Math.PI);
        tctx.fillStyle = `rgba(240,252,248,${a})`;
        const ww = wStream * (0.5 + f * 0.5);
        tctx.fillRect(x - ww / 2 + wob * (0.3 + f * 0.7), yy, ww, 9 + f * 7);
      }
      // impact glow
      const pulse = 0.13 + Math.sin(t * 0.003) * 0.035;
      const g = tctx.createRadialGradient(tap.ix, y1, 0, tap.ix, y1, 30);
      g.addColorStop(0, `rgba(235,248,242,${pulse})`);
      g.addColorStop(1, "rgba(235,248,242,0)");
      tctx.fillStyle = g;
      tctx.beginPath();
      tctx.arc(tap.ix, y1, 30, 0, 7);
      tctx.fill();
      // ripples — expanding ellipses where the stream lands
      for (let k = 0; k < 3; k++) {
        const f = (t * 0.00016 + k / 3) % 1;
        const rx = 7 + f * 52;
        tctx.strokeStyle = `rgba(232,246,240,${0.26 * (1 - f)})`;
        tctx.lineWidth = 1.4;
        tctx.beginPath();
        tctx.ellipse(tap.ix, y1, rx, rx * 0.30, 0, 0, 7);
        tctx.stroke();
      }
    };

    /* live steam — soft sprites rising over the bath, screen blend */
    const sctx = steamCanvas.getContext("2d")!;
    const puffs = Array.from({ length: 26 }, () => ({
      x: 0.18 + Math.random() * 0.68,
      y: Math.random(),
      r: 40 + Math.random() * 90,
      sp: 0.00045 + Math.random() * 0.0009,
      sway: Math.random() * Math.PI * 2,
    }));
    const drawSteam = (t: number) => {
      const W = steamCanvas.width, H = steamCanvas.height;
      sctx.clearRect(0, 0, W, H);
      for (const p of puffs) {
        p.y -= p.sp * 16;
        if (p.y < -0.15) {
          p.y = 1.02;
          p.x = 0.18 + Math.random() * 0.68;
        }
        const px = (p.x + Math.sin(t * 0.0004 + p.sway) * 0.012) * W;
        const py = (0.86 - p.y * 0.62) * H;
        const a = Math.sin(Math.min(Math.max(p.y, 0), 1) * Math.PI) * 0.13;
        const g = sctx.createRadialGradient(px, py, 0, px, py, p.r);
        g.addColorStop(0, `rgba(235,244,238,${a})`);
        g.addColorStop(1, "rgba(235,244,238,0)");
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(px, py, p.r, 0, 7);
        sctx.fill();
      }
    };

    let raf = 0;
    const frame = (t: number) => {
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      if (loaded === 2) {
        gl.uniform2f(U("uMouse"), mx, my);
        gl.uniform1f(U("uTime"), t / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      drawTap(t);
      drawSteam(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={glRef} className="absolute inset-0 h-full w-full animate-[push_26s_ease-in-out_infinite_alternate]" />
      <canvas ref={tapRef} className="absolute inset-0 h-full w-full pointer-events-none mix-blend-screen animate-[push_26s_ease-in-out_infinite_alternate]" />
      <canvas ref={steamRef} className="absolute inset-0 h-full w-full pointer-events-none mix-blend-screen opacity-80" />
      <div className="pointer-events-none absolute -inset-[20%] bg-[radial-gradient(42%_34%_at_68%_30%,rgba(255,205,130,0.14),transparent_70%)] mix-blend-screen animate-[drift_11s_ease-in-out_infinite_alternate]" />
      <style>{`
        @keyframes push { from { transform: scale(1); } to { transform: scale(1.055); } }
        @keyframes drift { from { transform: translate(-2.5%, -1%); } to { transform: translate(2.5%, 1.5%); } }
      `}</style>
    </div>
  );
}

/* -------------------------------- JOURNEY -------------------------------- */
/* Four photographs of the visit; scroll progress crossfades them.    */

export function JourneyBackdrop({
  progress,
}: {
  progress: React.MutableRefObject<number>;
}) {
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = Math.min(Math.max(progress.current, 0), 1) * (JOURNEY_IMGS.length - 1);
      imgs.current.forEach((img, i) => {
        if (!img) return;
        const w = Math.max(0, 1 - Math.abs(p - i));
        img.style.opacity = String(w);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cocoa">
      {JOURNEY_IMGS.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          ref={(el) => {
            imgs.current[i] = el;
          }}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover animate-[push_18s_ease-in-out_infinite_alternate]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      <style>{`@keyframes push { from { transform: scale(1); } to { transform: scale(1.07); } }`}</style>
    </div>
  );
}

/* ---------------------------------- LAB ---------------------------------- */
/* One photograph per treatment; switching crossfades the stack.      */

export function LabPhoto({ mode }: { mode: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Object.entries(LAB_IMGS).map(([id, src]) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            mode === id ? "opacity-100 animate-[push_16s_ease-in-out_infinite_alternate]" : "opacity-0"
          }`}
        />
      ))}
      <style>{`@keyframes push { from { transform: scale(1); } to { transform: scale(1.08); } }`}</style>
    </div>
  );
}

/* -------------------------------- COMPARE -------------------------------- */
/* Two real water states; the slider wipes between them.              */

export function ComparePhotos({ value }: { value: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={COMPARE_BEFORE} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COMPARE_AFTER}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${value}%)` }}
      />
    </div>
  );
}
