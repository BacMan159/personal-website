import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Avatar } from '../HeroModels/Avatar.jsx'

/**
 * Lightweight R3F canvas used inside the fixed bubble button.
 * Camera is zoomed to head/shoulders. No OrbitControls — purely decorative.
 * Avatar.jsx handles wave-then-idle sequencing internally on mount.
 */
const BubbleLights = () => (
  <>
    <ambientLight intensity={1.6} color="#e8f0f4" />
    <spotLight
      position={[-1.5, 4, 3]}
      angle={0.45}
      intensity={7}
      penumbra={1}
      color="#fff5e8"
    />
    <spotLight
      position={[2, 3, 2]}
      angle={0.5}
      intensity={3.5}
      penumbra={1}
      color="#ddeeff"
    />
    <pointLight position={[0, -0.5, 1.5]} intensity={1.5} color="#e8f0f4" />
  </>
)

const BacManBubbleCanvas = () => (
  <Canvas
    // Tight crop — camera looks at face/chest only
    camera={{ position: [0, 1.55, 1.6], fov: 24 }}
    className="!w-full !h-full"
    gl={{ antialias: true, alpha: true }}
    dpr={[1, 1.5]}
    style={{ background: 'transparent' }}
  >
    <BubbleLights />
    <Suspense fallback={null}>
      <Avatar position={[-0.05, -2, 0]} rotation={[-0.55, -0.15, 0]} />
    </Suspense>
  </Canvas>
)

export default BacManBubbleCanvas
