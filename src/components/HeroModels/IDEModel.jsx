import { RoundedBox, Text, Float, MeshTransmissionMaterial } from "@react-three/drei";

function MacButton({ color, position }) {
    return (
        <mesh position={position}>
            <circleGeometry args={[0.08, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
    );
}

export function GlassIDE({ groupRef, scale, position, rotation }) {
    return (
        <group scale={scale} position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
                <group ref={groupRef}>
                    {/* Glass Outer Panel */}
                    <RoundedBox args={[6, 3.5, 0.25]} radius={0.25} smoothness={6}>
                        <MeshTransmissionMaterial
                            thickness={0.8}
                            roughness={0.25}
                            transmission={1}
                            ior={1.2}
                            chromaticAberration={0.05}
                            backside
                            samples={8}
                            resolution={512}
                            color="#a5f3fc"
                            distortion={0.1}
                            distortionScale={0.2}
                            temporalDistortion={0.1}
                        />
                    </RoundedBox>

                    {/* Inner panel */}
                    <RoundedBox args={[5.6, 3.1, 0.05]} radius={0.2} position={[0, 0, 0.2]}>
                        <meshStandardMaterial color="#0f172a" transparent={true} opacity={0.7} />
                    </RoundedBox>

                    {/* Sidebar */}
                    <RoundedBox args={[1.5, 2.8, 0.05]} radius={0.15} position={[-2, -0.2, 0.22]}>
                        <meshStandardMaterial color="#111827" transparent={true} opacity={0.6} />
                    </RoundedBox>

                    {/* Title Bar */}
                    <RoundedBox args={[5.6, 0.4, 0.05]} radius={0.15} position={[0, 1.4, 0.25]}>
                        <meshStandardMaterial color="#1f2937" transparent={true} opacity={0.6} />
                    </RoundedBox>

                    {/* macOS Buttons */}
                    <MacButton color="#ff5f57" position={[-2.4, 1.4, 0.32]} />
                    <MacButton color="#febc2e" position={[-2.1, 1.4, 0.32]} />
                    <MacButton color="#28c840" position={[-1.8, 1.4, 0.32]} />

                    {/* Tab */}
                    <RoundedBox args={[1.2, 0.3, 0.05]} radius={0.1} position={[-0.7, 1.4, 0.3]}>
                        <meshStandardMaterial color="#374151" />
                    </RoundedBox>

                    <Text position={[-0.7, 1.4, 0.35]} fontSize={0.15} color="#e5e7eb">
                        App.jsx
                    </Text>

                    {/* File tree — folders (wider, lighter) and indented files */}
                    {[
                        { width: 0.9, x: -2.0, y:  1.1, color: "#94a3b8" }, // src/
                        { width: 0.7, x: -1.85, y:  0.75, color: "#475569" }, // App.jsx
                        { width: 0.65, x: -1.85, y:  0.45, color: "#475569" }, // main.jsx
                        { width: 0.85, x: -2.0, y:  0.1, color: "#94a3b8" }, // components/
                        { width: 0.7, x: -1.85, y: -0.2, color: "#475569" }, // NavBar.jsx
                        { width: 0.6, x: -1.85, y: -0.5, color: "#475569" }, // Button.jsx
                        { width: 0.8, x: -2.0, y: -0.85, color: "#94a3b8" }, // constants/
                        { width: 0.65, x: -1.85, y: -1.15, color: "#475569" }, // index.js
                    ].map((item, i) => (
                        <RoundedBox
                            key={`tree-${i}`}
                            args={[item.width, 0.1, 0.02]}
                            radius={0.03}
                            position={[item.x, item.y - 0.2, 0.3]}
                        >
                            <meshStandardMaterial color={item.color} />
                        </RoundedBox>
                    ))}

                    {/* Code lines */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <RoundedBox
                            key={i}
                            args={[3.5 - Math.random(), 0.12, 0.02]}
                            radius={0.05}
                            position={[0.5 + Math.random() * 0.3, 1 - i * 0.35, 0.3]}
                        >
                            <meshStandardMaterial color="#475569" />
                        </RoundedBox>
                    ))}
                </group>
            </Float>
        </group>
    );
}

export default GlassIDE;
