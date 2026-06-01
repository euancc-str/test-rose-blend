import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html, Environment } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'
function Rose() {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'rose.glb')
  const groupRef = useRef()

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true

      // Override with a chrome + iridescent physical material
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x050505),        // near black base
        metalness: 1.0,                           // full metal
        roughness: 0.05,                          // almost mirror
        envMapIntensity: 2.5,
        iridescence: 1.0,                         // rainbow oil-slick effect
        iridescenceIOR: 1.8,
        iridescenceThicknessRange: [100, 400],    // controls color spread
        reflectivity: 1.0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      })
    }
  })

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}
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

export default function App() {
  return (
    <div className="root">
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

      <Canvas
        className="canvas"
        shadows
        camera={{ position: [0, 1.2, 4], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Environment preset="city" background={false} />

        {/* White key light */}
        <directionalLight position={[3, 5, 3]} intensity={2} color="#ffffff" castShadow />

        {/* Pink/rose accent — shows as red iridescence */}
        <pointLight position={[2, 2, 3]} intensity={6} color="#ff3060" />

        {/* Teal accent — shows as cyan iridescence */}
        <pointLight position={[-2, 1, 2]} intensity={5} color="#00ffcc" />

        {/* Cool blue rim from behind */}
        <pointLight position={[0, 1, -4]} intensity={4} color="#3040ff" />

        {/* Soft white fill so petals aren't pitch black */}
        <ambientLight intensity={0.3} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <Rose />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  )
}