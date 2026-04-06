import { OrbitControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { GlassIDE } from "./IDEModel";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <HeroLights />
        <Environment preset="city" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 9}
          maxAzimuthAngle={Math.PI / 9}
        />

        <Suspense fallback={null}>
          <Particles />
          <GlassIDE
            scale={isMobile ? 1 : isTablet ? 1 : 1.5}
            position={isMobile ? [0, -1.5, 0] : isTablet ? [0, -1, 0] : [0, -1, 0]}
            rotation={[0, -Math.PI / 8, 0]}
          />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
  );
};

export default HeroExperience;
