"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* THE SILK SHEET — one flowing sheet of cloth that IS smooth skin.   */
/* A plane of ~3,200 vertices, displaced every frame: gentle ripples  */
/* when silky, sharp creases when rough. The crease param is the whole */
/* story: crease 1 = rough, creased, dull. crease 0 = smooth, glossy. */
/* ------------------------------------------------------------------ */

export type SilkState = {
  /** 0 = silk-smooth, 1 = rough & creased */
  crease: number;
  /** base tint of the silk */
  color: string;
  /** sheen colour */
  sheen: string;
  /** how glossy the surface is */
  gloss: number;
};

const SILK_DEFAULT: SilkState = {
  crease: 0.25,
  color: "#f3d9c8",
  sheen: "#e8b4a0",
  gloss: 0.9,
};

function SilkSheet({
  state,
  interactive = false,
}: {
  state: React.MutableRefObject<SilkState>;
  interactive?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const ripple = useRef({ x: 0, y: 0, strength: 0 });
  const tmpColor = useRef(new THREE.Color());
  const tmpSheen = useRef(new THREE.Color());

  const { geometry, base, alphaMap } = useMemo(() => {
    const g = new THREE.PlaneGeometry(8.2, 4.6, 72, 44);
    const pos = g.attributes.position;
    const base = new Float32Array(pos.array.length);
    base.set(pos.array as unknown as Float32Array);
    // soft radial falloff so the sheet's rectangular border fades into
    // the background instead of reading as a hard rectangle
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 144;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(128, 72, 20, 128, 72, 130);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.62, "rgba(255,255,255,0.95)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 144);
    const alphaMap = new THREE.CanvasTexture(c);
    return { geometry: g, base, alphaMap };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = state.current;
    const pos = geometry.attributes.position;
    const arr = pos.array as Float32Array;
    const amp = 0.12 + s.crease * 0.55;
    const freq = 0.9 + s.crease * 1.6;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      let z =
        Math.sin(x * freq + t * 1.1) * amp * 0.6 +
        Math.cos(y * (freq + 0.4) + t * 0.8) * amp * 0.5 +
        Math.sin((x + y) * (freq * 0.7) + t * 0.6) * amp * 0.4;
      // pointer ripple — the silk reacts where you touch it
      if (ripple.current.strength > 0.01) {
        const dx = x - ripple.current.x;
        const dy = y - ripple.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        z +=
          Math.exp(-d * d * 0.8) *
          Math.sin(t * 9 - d * 5) *
          0.35 *
          ripple.current.strength;
      }
      arr[i + 2] = z;
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    ripple.current.strength *= 0.94;

    // glide colour + roughness toward the target state
    const c = tmpColor.current.set(s.color);
    const sh = tmpSheen.current.set(s.sheen);
    mat.current.color.lerp(c, 0.06);
    mat.current.sheenColor.lerp(sh, 0.06);
    mat.current.roughness = THREE.MathUtils.lerp(mat.current.roughness, 0.62 - s.gloss * 0.45, 0.06);
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    ripple.current.x = e.point.x;
    ripple.current.y = e.point.y;
    ripple.current.strength = 1;
  };

  return (
    <mesh ref={mesh} geometry={geometry} onPointerMove={onMove}>
      <meshPhysicalMaterial
        ref={mat}
        color={SILK_DEFAULT.color}
        roughness={0.2}
        sheen={1}
        sheenRoughness={0.35}
        sheenColor={SILK_DEFAULT.sheen}
        clearcoat={0.55}
        clearcoatRoughness={0.3}
        side={THREE.DoubleSide}
        alphaMap={alphaMap}
        transparent
      />
    </mesh>
  );
}

function Droplets({ count = 14, color = "#e8b4a0" }: { count?: number; color?: string }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pos: [
          (Math.sin(i * 2.7) * 4.6) as number,
          (Math.cos(i * 1.9) * 2.4) as number,
          (Math.sin(i * 4.1) * 1.4 + 0.6) as number,
        ] as [number, number, number],
        scale: 0.06 + ((i * 37) % 10) / 90,
        speed: 0.7 + ((i * 13) % 10) / 14,
        offset: i * 0.8,
      })),
    [count]
  );
  return (
    <group>
      {items.map((d, i) => (
        <Float key={i} speed={d.speed} rotationIntensity={0.4} floatIntensity={1.4}>
          <mesh position={d.pos} scale={d.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial
              color={color}
              roughness={0.05}
              transmission={0.6}
              thickness={0.8}
              clearcoat={1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 6, 6]} intensity={1.6} color="#fff2e2" />
      <directionalLight position={[-6, -2, 4]} intensity={0.7} color="#e8b4a0" />
      <pointLight position={[0, 3, 4]} intensity={12} color="#ffd9c2" />
    </>
  );
}

function Scene({
  children,
  camera,
  controls = true,
}: {
  children: React.ReactNode;
  camera: [number, number, number];
  controls?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: camera, fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Lights />
      {children}
      {controls && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI * 0.32}
          maxPolarAngle={Math.PI * 0.68}
          minAzimuthAngle={-Math.PI * 0.35}
          maxAzimuthAngle={Math.PI * 0.35}
        />
      )}
    </Canvas>
  );
}

/* ------------------------------- HERO -------------------------------- */
export function HeroCanvas() {
  const state = useRef<SilkState>({ ...SILK_DEFAULT });
  return (
    <Scene camera={[0, 0.4, 8.6]}>
      <group rotation={[0.08, 0, 0.02]}>
        <SilkSheet state={state} interactive />
      </group>
      <Droplets />
    </Scene>
  );
}

/* ------------------------------ JOURNEY ------------------------------ */
/* Scroll progress (0..1) drives the silk: rough at the start, smooth   */
/* by the end — the silk heals as you travel the four stages.           */
export function JourneyCanvas({
  progress,
}: {
  progress: React.MutableRefObject<number>;
}) {
  const state = useRef<SilkState>({ ...SILK_DEFAULT, crease: 0.95 });
  return (
    <Scene camera={[0, 0.2, 8.8]} controls={false}>
      <JourneyUpdater state={state} progress={progress} />
      <group rotation={[0, 0, 0]}>
        <SilkSheet state={state} />
      </group>
    </Scene>
  );
}

function JourneyUpdater({
  state,
  progress,
}: {
  state: React.MutableRefObject<SilkState>;
  progress: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    state.current.crease = THREE.MathUtils.lerp(0.95, 0.05, p);
    state.current.gloss = THREE.MathUtils.lerp(0.25, 1, p);
  });
  return null;
}

/* ------------------------------ COMPARE ------------------------------ */
/* Slider 0..100 → crease 1..0. Before = creased + dull. After = silk.  */
export function CompareCanvas({
  slider,
}: {
  slider: React.MutableRefObject<number>;
}) {
  const state = useRef<SilkState>({ ...SILK_DEFAULT, crease: 0.9 });
  return (
    <Scene camera={[0, 0, 8.4]} controls={false}>
      <CompareUpdater state={state} slider={slider} />
      <SilkSheet state={state} />
    </Scene>
  );
}

function CompareUpdater({
  state,
  slider,
}: {
  state: React.MutableRefObject<SilkState>;
  slider: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    const v = THREE.MathUtils.clamp(slider.current, 0, 100) / 100;
    state.current.crease = THREE.MathUtils.lerp(0.95, 0.05, v);
    state.current.gloss = THREE.MathUtils.lerp(0.25, 1, v);
  });
  return null;
}

/* -------------------------------- LAB -------------------------------- */
/* Pick a treatment: the silk re-tints and re-textures itself.          */
export const LAB_MODES: Record<string, SilkState> = {
  wax: { crease: 0.05, color: "#f3d9c8", sheen: "#e8b4a0", gloss: 1 },
  scrub: { crease: 0.35, color: "#f2c4a8", sheen: "#ffb08a", gloss: 0.75 },
  hammam: { crease: 0.15, color: "#fbf0e4", sheen: "#ffffff", gloss: 0.85 },
  massage: { crease: 0.2, color: "#ecc9b4", sheen: "#d99a7a", gloss: 0.8 },
};

export function LabCanvas({
  mode,
}: {
  mode: React.MutableRefObject<string>;
}) {
  const state = useRef<SilkState>({ ...LAB_MODES.wax });
  return (
    <Scene camera={[0, 0, 8.4]}>
      <LabUpdater state={state} mode={mode} />
      <SilkSheet state={state} interactive />
      <Droplets count={8} color="#f3d9c8" />
    </Scene>
  );
}

function LabUpdater({
  state,
  mode,
}: {
  state: React.MutableRefObject<SilkState>;
  mode: React.MutableRefObject<string>;
}) {
  useFrame(() => {
    const target = LAB_MODES[mode.current] ?? LAB_MODES.wax;
    state.current.crease = THREE.MathUtils.lerp(state.current.crease, target.crease, 0.08);
    state.current.gloss = THREE.MathUtils.lerp(state.current.gloss, target.gloss, 0.08);
    state.current.color = target.color;
    state.current.sheen = target.sheen;
  });
  return null;
}
