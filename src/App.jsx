import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html, Environment, ContactShadows } from '@react-three/drei'
import './App.css'

// ─── 3D Rose Model ────────────────────────────────────────────────────────────

function Rose() {
  const { scene } = useGLTF('./rose.glb')
  const groupRef = useRef()

  // Enable shadows on every mesh in the model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material.map) {
        child.material.map.colorSpace = THREE.SRGBColorSpace
        child.material.map.needsUpdate = true
      }
    }
  })

  // Slow auto-rotation on Y-axis
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// ─── Loading Fallback ─────────────────────────────────────────────────────────

function Loader() {
  return (
    <Html center>
      <div className="loader">
        <div className="loader-petals">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="petal" style={{ '--i': i }} />
          ))}
        </div>
        <p className="loader-text">Blooming…</p>
      </div>
    </Html>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="root">
      {/* ── Overlay UI ── */}
      <header className="header">
        <span className="header-eyebrow">✦ Digital Sculpture</span>
        <h1 className="header-title">The Midnight<br />Rose</h1>
      </header>

      <footer className="footer">
        <p className="footer-sub">An interactive 3D digital sculpture</p>
        <div className="footer-hint">
          <span>drag to rotate</span>
          <span className="divider">·</span>
          <span>scroll to zoom</span>
          <span className="divider">·</span>
          <span>right-drag to pan</span>
        </div>
      </footer>

      {/* ── 3D Canvas ── */}
      <Canvas
        className="canvas"
        shadows
        camera={{ position: [0, 1.2, 4], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.35} color="#ffe8f0" />

        {/* Main key light – warm, directional, casts shadows */}
        <directionalLight
          position={[3, 5, 3]}
          intensity={2.5}
          color="#fff5e8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />

        {/* Soft fill from the opposite side */}
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.6}
          color="#c0a0c8"
        />

        {/* Top-front spotlight for petal highlights */}
        <spotLight
          position={[0, 6, 3]}
          angle={0.45}
          penumbra={0.8}
          intensity={3}
          color="#ffd6e8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Subtle cool rim from below-back */}
        <pointLight position={[0, -2, -3]} intensity={0.4} color="#6040a0" />

        {/* Environment for subtle reflections */}
        <Environment preset="night" />

        {/* Rose model with suspense loading */}
        <Suspense fallback={<Loader />}>
          <Rose />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.55}
            scale={6}
            blur={2.5}
            far={4}
            color="#1a0010"
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={9}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  )
}
