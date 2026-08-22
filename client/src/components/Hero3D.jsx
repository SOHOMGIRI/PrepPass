import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useMouse } from "../context/MouseContext.jsx";

const lerp = (a, b, t) => a + (b - a) * t;

// Background shapes at varying depths → parallax when the group tilts.
const SHAPES = [
  { n: "octahedron", pos: [-3.4, -0.6, -3.4], s: 0.36, color: "#7a0c0c" },
  { n: "dodecahedron", pos: [3.2, 0.9, -1.6], s: 0.32, color: "#d4a72c" },
  { n: "tetrahedron", pos: [-3, 1.3, 1.5], s: 0.34, color: "#1a227e" },
  { n: "torus", pos: [3.1, -1.3, 0.9], s: 0.3, color: "#7a0c0c" },
  { n: "box", pos: [0, -2.3, -1.3], s: 0.24, color: "#d4a72c" },
  { n: "torusKnot", pos: [2.7, 1.7, -2.4], s: 0.27, color: "#1a227e" },
];

function shapeGeometry(n) {
  switch (n) {
    case "octahedron":
      return <octahedronGeometry args={[1]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[1]} />;
    case "tetrahedron":
      return <tetrahedronGeometry args={[1]} />;
    case "box":
      return <boxGeometry args={[1, 1, 1]} />;
    case "torus":
      return <torusGeometry args={[0.6, 0.22, 14, 40]} />;
    case "torusKnot":
      return <torusKnotGeometry args={[0.65, 0.2, 160, 30]} />;
    default:
      return <boxGeometry />;
  }
}

function BackgroundShapes() {
  return SHAPES.map((sh) => (
    <mesh key={sh.n} position={sh.pos} scale={sh.s} rotation={[0.5, 1, 0.3]}>
      {shapeGeometry(sh.n)}
      <meshStandardMaterial metalness={0.55} roughness={0.22} color={sh.color} />
    </mesh>
  ));
}

// Stylized "ticket" badge — metallic, slightly glassy, floating forward.
function Badge() {
  return (
    <mesh position={[0, 0, 0.2]}>
      <RoundedBox args={[2.5, 1.6, 0.3]} radius={0.16} smoothness={4}>
        <meshStandardMaterial
          metalness={0.8}
          roughness={0.08}
          color="#1a227e"
          emissive="#d4a72c"
          emissiveIntensity={0.2}
        />
      </RoundedBox>
    </mesh>
  );
}

function Scene() {
  const group = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const globalMouse = useMouse();
  const { gl } = useThree();

  // Map global mouse coords to Canvas viewport normalized [-1, 1]
  useEffect(() => {
    const el = gl.domElement;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      mouse.current = {
        x: ((globalMouse.x - r.left) / r.width) * 2 - 1,
        y: -((globalMouse.y - r.top) / r.height) * 2 - 1,
      };
    }
  }, [globalMouse, gl]);

  // Transparent background + context-loss handling.
  useEffect(() => {
    gl.setClearAlpha(0);
    const el = gl.domElement;
    const onContextLost = (e) => {
      e.preventDefault();
      console.warn("WebGL context lost. Attempting auto-restore...");
    };
    el.addEventListener("webglcontextlost", onContextLost);
    return () => {
      el.removeEventListener("webglcontextlost", onContextLost);
    };
  }, [gl]);

  // Dispose geometries and materials when Scene unmounts.
  useEffect(() => {
    return () => {
      if (group.current) {
        group.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Slow spin + subtle mouse parallax. Smooth and cheap at ~10 meshes.
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime ?? 0;
    group.current.rotation.y = lerp(
      group.current.rotation.y,
      mouse.current.x * 0.35 + t * 0.05,
      0.05
    );
    group.current.rotation.x = lerp(
      group.current.rotation.x,
      -mouse.current.y * 0.22 + Math.sin(t * 0.7) * 0.04,
      0.05
    );
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#ffffff" />
      <directionalLight position={[5, 12, 8]} intensity={1.5} color="#d4a72c" />
      <pointLight position={[-8, -3, -6]} intensity={0.55} color="#1a227e" />
      <group ref={group}>
        <Badge />
        <BackgroundShapes />
      </group>
    </>
  );
}

// Default export is the full Canvas so it can be code-split (React.lazy) by
// Landing.jsx, keeping the heavy three.js bundle off the initial load.
export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 size-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, stencil: false, depth: true }}
        dpr={[1, 1.5]}
        frameloop="always"
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handler = (e) => {
            e.preventDefault();
            console.warn(
              "WebGL context lost. Attempting auto-restore..."
            );
          };
          canvas.addEventListener("webglcontextlost", handler);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
