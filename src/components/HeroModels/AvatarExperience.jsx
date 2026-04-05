import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar.jsx";

const AvatarLights = () => (
    <>
        {/* High ambient for even, studio-style base illumination */}
        <ambientLight intensity={1.4} color="#e8f0f4" />

        {/* Key light — soft warm, front-left */}
        <spotLight
            position={[-2, 5, 4]}
            angle={0.4}
            intensity={6}
            penumbra={1}
            color="#fff5e8"
            castShadow={true}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={20}
            shadow-bias={-0.0005}
            shadow-radius={10}
        />
        {/* Fill light — cool, front-right */}
        <spotLight
            position={[3, 4, 3]}
            angle={0.5}
            intensity={3}
            penumbra={1}
            color="#ddeeff"
        />
        {/* Rim light — subtle back edge separation */}
        <spotLight
            position={[0, 4, -4]}
            angle={0.6}
            intensity={5}
            penumbra={1}
            color="#c8dde8"
        />
        {/* Ground bounce */}
        <pointLight position={[0, -1, 2]} intensity={2} color="#e8f0f4" />
    </>
);

const AvatarExperience = () => {
    return (
        <Canvas
            camera={{ position: [0, 1.4, 2.5], fov: 60 }}
            className="bg-transparent"
            gl={{ antialias: true, alpha: true }}
            shadows="soft"
            dpr={[1, 1.5]}
        >
            <AvatarLights />
            <Suspense fallback={null}>
                <Avatar
                    position={[0, -0.3, 0]}
                    rotation={[0, -0.25, 0]}
                />
            </Suspense>

            {/* Shadow-only floor — soft, faint drop shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow={true}>
                <planeGeometry args={[6, 6]} />
                <shadowMaterial transparent={true} opacity={0.08} />
            </mesh>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={(2 * Math.PI) / 3}
                minAzimuthAngle={-Math.PI / 5}
                maxAzimuthAngle={Math.PI / 5}
                target={[0, 0.8, 0]}
            />
        </Canvas>
    );
};

export default AvatarExperience;
