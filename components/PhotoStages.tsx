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
  const steamRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glCanvas = glRef.current;
    const steamCanvas = steamRef.current;
    if (!glCanvas || !steamCanvas) return;
    const gl = glCanvas.getContext("webgl", { antialias: true });
    if (!gl) return;

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
    };
    window.addEventListener("resize", resize);
    resize();

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
