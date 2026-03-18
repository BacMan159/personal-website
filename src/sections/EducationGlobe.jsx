import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import TitleHeader from "../components/TitleHeader.jsx";
import { educationLocations as locations } from "../constants/index.js";

// ─── Config ────────────────────────────────────────────────────────────────────

const GLOBE_RADIUS = 1.25;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function latLngToVec3(lat, lng, radius = GLOBE_RADIUS) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function buildArcPoints(loc1, loc2, radius = GLOBE_RADIUS, segments = 80) {
    const v1 = latLngToVec3(loc1.lat, loc1.lng, radius);
    const v2 = latLngToVec3(loc2.lat, loc2.lng, radius);
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const v = new THREE.Vector3().lerpVectors(v1, v2, t).normalize();
        const height = Math.sin(Math.PI * t) * 0.45;
        v.multiplyScalar(radius + height);
        points.push(v);
    }
    return points;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function GlobePin({ location, isActive, onClick }) {
    const groupRef = useRef();
    const position = latLngToVec3(location.lat, location.lng, GLOBE_RADIUS);
    const normal = position.clone().normalize();

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const float = isActive ? Math.sin(clock.getElapsedTime() * 2) * 0.012 : 0;
            groupRef.current.position.copy(position.clone().add(normal.clone().multiplyScalar(float)));
        }
    });

    const quaternion = useMemo(() => {
        const up = new THREE.Vector3(0, 1, 0);
        return new THREE.Quaternion().setFromUnitVectors(up, normal);
    }, [normal]);

    const color = new THREE.Color(location.color);
    const scale = isActive ? 1.35 : 1;

    return (
        <group ref={groupRef} position={position} quaternion={quaternion} scale={[scale, scale, scale]}>
            {/* Pin head — sphere at top */}
            <mesh
                position={[0, 0.13, 0]}
                onClick={(e) => { e.stopPropagation(); onClick(location.id); }}
                onPointerOver={() => document.body.style.cursor = "pointer"}
                onPointerOut={() => document.body.style.cursor = "default"}
            >
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 2.5 : 1}
                    roughness={0.2}
                    metalness={0.4}
                />
            </mesh>

            {/* Pin needle — cone pointing down to surface */}
            <mesh position={[0, 0.055, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.022, 0.11, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.3} />
            </mesh>

            {/* Base ring shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.028, 0.048, 32]} />
                <meshBasicMaterial color={color} transparent opacity={isActive ? 0.6 : 0.3} side={THREE.DoubleSide} />
            </mesh>

            {isActive && (
                <Html
                    position={normal.clone().multiplyScalar(0.35)}
                    center
                    distanceFactor={4}
                    zIndexRange={[100, 0]}
                    style={{ pointerEvents: "none" }}
                >
                    <div style={{
                        background: "rgba(14, 14, 16, 0.96)",
                        border: `1px solid ${location.color}`,
                        borderRadius: 12,
                        padding: "14px 18px",
                        minWidth: 200,
                        boxShadow: `0 8px 32px ${location.color}55`,
                        backdropFilter: "blur(12px)",
                        animation: "fadeIn 0.25s ease",
                    }}>
                        <img src={location.logoPath} alt={location.name} style={{ width: 28, height: 28, objectFit: "contain", marginBottom: 4 }} />
                        <div style={{ color: location.color, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                            {location.years}
                        </div>
                        <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>
                            {location.degree}
                        </div>
                        <div style={{ color: "#d9ecff", fontSize: 12, marginBottom: 8 }}>
                            {location.name}
                        </div>
                        <div style={{ color: "#839cb5", fontSize: 11, marginBottom: 10 }}>
                            📍 {location.location}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

function GlobeArc({ loc1, loc2 }) {
    const points = useMemo(() => buildArcPoints(loc1, loc2), [loc1, loc2]);
    const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
    const tubeRef = useRef();

    useFrame(({ clock }) => {
        if (tubeRef.current?.material) {
            tubeRef.current.material.dashOffset = -clock.getElapsedTime() * 0.3;
        }
    });

    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 50, 0.006, 5, false), [curve]);

    return (
        <mesh ref={tubeRef} geometry={geometry}>
            <meshBasicMaterial color="#C8972B" transparent opacity={0.7} />
        </mesh>
    );
}

function EarthSphere() {
    const texture = useTexture("/textures/earth-map.jpg");
    return (
        <mesh>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
        </mesh>
    );
}

const ufPos = latLngToVec3(locations[0].lat, locations[0].lng);
const UF_INIT_ROT_Y = Math.atan2(-ufPos.x, ufPos.z);

function GlobeMesh({ activeId, onPinClick }) {
    const globeRef = useRef();
    const targetRotY = useRef(UF_INIT_ROT_Y);
    const prevActiveId = useRef(null);

    useFrame(() => {
        if (!globeRef.current) return;

        // Recalculate target rotation when active pin changes
        if (activeId !== prevActiveId.current) {
            prevActiveId.current = activeId;
            if (activeId !== null) {
                const loc = locations.find((l) => l.id === activeId);
                if (loc) {
                    const pos = latLngToVec3(loc.lat, loc.lng);
                    targetRotY.current = Math.atan2(-pos.x, pos.z);
                }
            }
        }

        // Smoothly lerp toward target rotation
        globeRef.current.rotation.y = THREE.MathUtils.lerp(
            globeRef.current.rotation.y,
            targetRotY.current,
            0.05
        );
    });

    return (
        <group ref={globeRef}>
            <Suspense fallback={
                <mesh>
                    <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
                    <meshStandardMaterial color="#0a1f3d" roughness={0.8} metalness={0.1} />
                </mesh>
            }>
                <EarthSphere />
            </Suspense>

            <mesh>
                <sphereGeometry args={[GLOBE_RADIUS + 0.002, 24, 24]} />
                <meshBasicMaterial color="#1c1c21" wireframe transparent opacity={0.15} />
            </mesh>

            <mesh>
                <sphereGeometry args={[GLOBE_RADIUS + 0.08, 32, 32]} />
                <meshBasicMaterial color="#1a4a8a" transparent opacity={0.06} side={THREE.BackSide} />
            </mesh>

            <GlobeArc loc1={locations[0]} loc2={locations[1]} />

            {locations.map((loc) => (
                <GlobePin
                    key={loc.id}
                    location={loc}
                    isActive={activeId === loc.id}
                    onClick={onPinClick}
                />
            ))}
        </group>
    );
}

function Scene({ activeId, onPinClick }) {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4488ff" />
            <pointLight position={[0, 0, 4]} intensity={0.6} color="#1a4a8a" />
            <Stars radius={80} depth={50} count={800} factor={3} saturation={0.2} fade speed={0.5} />
            <GlobeMesh activeId={activeId} onPinClick={onPinClick} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(3 * Math.PI) / 4}
                rotateSpeed={0.5}
            />
        </>
    );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function EducationGlobe() {
    const [activeId, setActiveId] = useState(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const globeContainerRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setCanvasReady(true); },
            { threshold: 0.1 }
        );
        if (globeContainerRef.current) observer.observe(globeContainerRef.current);
        return () => observer.disconnect();
    }, []);

    const handlePinClick = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const renderCard = (loc) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <button
                onClick={() => handlePinClick(loc.id)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "#f8f9fc",
                    border: `1px solid ${activeId === loc.id ? loc.color : "#d1d5db"}`,
                    borderRadius: activeId === loc.id ? "14px 14px 0 0" : 14,
                    padding: "14px 20px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: activeId === loc.id ? `0 6px 24px ${loc.color}33` : "0 1px 4px rgba(0,0,0,0.06)",
                    width: "100%",
                    textAlign: "left",
                }}
            >
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: loc.color, boxShadow: `0 0 8px ${loc.color}`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>{loc.name}</div>
                    <div style={{ color: "#374151", fontSize: 12, marginTop: 2 }}>{loc.degree}</div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 1 }}>{loc.years} · {loc.location}</div>
                </div>
                <img src={loc.imgPath} alt={loc.name} style={{ width: "clamp(80px, 30%, 140px)", objectFit: "contain", flexShrink: 1 }} />
            </button>

            {activeId === loc.id && (
                <div style={{
                    background: "#ffffff",
                    border: `1px solid ${loc.color}`,
                    borderTop: "none",
                    borderRadius: "0 0 14px 14px",
                    padding: "14px 16px",
                    animation: "fadeIn 0.25s ease",
                }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {loc.highlights.map((h) => (
                            <span key={h} style={{
                                background: `${loc.color}18`,
                                color: loc.color,
                                border: `1px solid ${loc.color}44`,
                                borderRadius: 20,
                                padding: "3px 8px",
                                fontSize: 10,
                                fontWeight: 500,
                            }}>{h}</span>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid #d1d5db", paddingTop: 10 }}>
                        <div style={{ color: loc.color, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>
                            Capstone Project
                        </div>
                        <div style={{ color: "#111827", fontSize: 12, fontWeight: 600 }}>
                            {loc.Capstone}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <section id="education" className="section-padding w-full">
            <div className="w-full md:px-10 px-5">
                <TitleHeader title="Education" subtitle="My Academic Journey - Across the Globe" />

                <div className="edu-layout">

                    {/* LEFT — UF */}
                    <div className="edu-col">
                        {renderCard(locations[0])}
                    </div>

                    {/* CENTER — Globe */}
                    <div className="edu-globe" style={{ animation: "floatUp 0.9s ease 0.2s both" }}>
                        <div ref={globeContainerRef} style={{
                            width: "100%",
                            height: 400,
                            borderRadius: 24,
                            overflow: "hidden",
                            position: "relative",
                            border: "1px solid #1c1c21",
                            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                        }}>
                            {canvasReady ? (
                                <Canvas
                                    camera={{ position: [0, 0, 5.5], fov: 42 }}
                                    style={{ background: "transparent" }}
                                    gl={{ antialias: true, alpha: true }}
                                    dpr={[1, 1.5]}
                                >
                                    <Scene activeId={activeId} onPinClick={handlePinClick} />
                                </Canvas>
                            ) : (
                                <div style={{ width: "100%", height: "100%", background: "#060b18", borderRadius: 24 }} />
                            )}

                            {!activeId && (
                                <div style={{
                                    position: "absolute",
                                    bottom: 16,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "rgba(14, 14, 16, 0.8)",
                                    border: "1px solid #1c1c21",
                                    borderRadius: 20,
                                    padding: "6px 16px",
                                    color: "#839cb5",
                                    fontSize: 12,
                                    backdropFilter: "blur(8px)",
                                    whiteSpace: "nowrap",
                                }}>
                                    🌐 Drag to rotate · Click a pin to view details
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — VIT */}
                    <div className="edu-col">
                        {renderCard(locations[1])}
                    </div>

                </div>
            </div>
        </section>
    );
}
