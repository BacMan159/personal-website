import React, { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const NODE_COUNT = 400
const MAX_LINKS = 1000
const LINK_DIST = 0.45

// Camera keyframes per section. Each section has a start (top of section
// reaches viewport top) and end (bottom of section leaves viewport top).
// pos = camera world position, target = lookAt point, fov = vertical fov,
// focus = world distance the DoF focus lies at.
const SECTION_KEYFRAMES = [
    { id: 'hero',
      start: { pos: [0, 0, 2.5], target: [0, 0, 0], fov: 65, focus: 3.5, shape: 'sphere' },
      end:   { pos: [0, 0, 2.5], target: [0, 0, 0], fov: 65, focus: 3.5, shape: 'torus' } },
    { id: 'experience',
      exitAtBottom: true,
      start: { pos: [2.3, 2.2, 0.01], target: [2.3, 0, 0], fov: 45, focus: 2.3, shape: 'torus' },
      end:   { pos: [2.3, 2.2, 0.01], target: [2.3, 0, 0], fov: 45, focus: 2.3, shape: 'torus' } },
    { id: 'projects',
      start: { pos: [2.3, 2.2, 0.01], target: [0, 0, 0], fov: 50, focus: 2.3, shape: 'scatter' },
      end:   { pos: [2.4, 0.3, 1.8], target: [0, 0, 0], fov: 60, focus: 2.4, shape: 'scatter' } },
    { id: 'skills',
      start: { pos: [0.1, 2, 0.1], target: [0, 0, 0], fov: 60, focus: 1.8, shape: 'grid' },
      end:   { pos: [0.1, 2, 0.1], target: [0, 0, 0], fov: 60, focus: 1.8, shape: 'grid' } },
    { id: 'contact',
      start: { pos: [-1.5, 1, 2.7], target: [-1.5, 1, 0], fov: 60, focus: 3.7, shape: 'sphere' },
      end:   { pos: [-1.5, 1, 2.7], target: [-1.5, 1, 0], fov: 60, focus: 3.7, shape: 'sphere' } },
]

function fibonacciSpherePositions(count, radius) {
    const positions = new Float32Array(count * 3)
    const phi = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const theta = phi * i
        positions[i * 3] = Math.cos(theta) * r * radius
        positions[i * 3 + 1] = y * radius
        positions[i * 3 + 2] = Math.sin(theta) * r * radius
    }
    return positions
}

function gridPositions(count, size = 2.6) {
    const positions = new Float32Array(count * 3)
    const side = Math.ceil(Math.cbrt(count))
    const step = size / Math.max(1, side - 1)
    const half = size / 2
    for (let i = 0; i < count; i++) {
        const x = i % side
        const y = Math.floor(i / side) % side
        const z = Math.floor(i / (side * side)) % side
        positions[i * 3]     = x * step - half
        positions[i * 3 + 1] = y * step - half
        positions[i * 3 + 2] = z * step - half
    }
    return positions
}

function scatterPositions(count, range = 2.4, seed = 1) {
    const positions = new Float32Array(count * 3)
    let s = seed
    const rand = () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
    }
    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (rand() - 0.5) * 2 * range
        positions[i * 3 + 1] = (rand() - 0.5) * 2 * range
        positions[i * 3 + 2] = (rand() - 0.5) * 2 * range
    }
    return positions
}

function torusPositions(count, R = 1.2, r = 0.42) {
    const positions = new Float32Array(count * 3)
    const golden = 0.6180339887498949
    for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2
        const v = ((i * golden) % 1) * Math.PI * 2
        const cu = Math.cos(u), su = Math.sin(u)
        const cv = Math.cos(v), sv = Math.sin(v)
        const radial = R + r * cv
        positions[i * 3]     = radial * cu
        positions[i * 3 + 1] = r * sv
        positions[i * 3 + 2] = radial * su
    }
    for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        for (let k = 0; k < 3; k++) {
            const tmp = positions[i * 3 + k]
            positions[i * 3 + k] = positions[j * 3 + k]
            positions[j * 3 + k] = tmp
        }
    }
    return positions
}

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const lerp = (a, b, t) => a + (b - a) * t
const lerpVec3 = (a, b, t, out) => {
    out[0] = lerp(a[0], b[0], t)
    out[1] = lerp(a[1], b[1], t)
    out[2] = lerp(a[2], b[2], t)
    return out
}

// Build a flat list of breakpoints { y, state } from current DOM measurements.
// Each section locks its camera within [top + PAD, bottom - PAD] (start at top
// edge, end at bottom edge). Between sections, the camera interpolates from
// one section's end state to the next section's start state.
function measureBreakpoints() {
    const breakpoints = []
    const vh = window.innerHeight || 800
    for (const sec of SECTION_KEYFRAMES) {
        const el = document.getElementById(sec.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        const bottom = rect.bottom + window.scrollY
        // Lock the camera one viewport BEFORE the section enters the screen
        // (scrollY = top - vh → section's top edge is at viewport bottom) and
        // start the OUT transition when the section's bottom edge reaches the
        // viewport's vertical mid-line (scrollY = bottom - vh/2). The
        // transition into the next section then plays out across the 100vh
        // gap, finishing before that section enters.
        const lockStart = top - vh
        const lockEnd = Math.max(lockStart + 1, sec.exitAtBottom ? bottom : bottom - vh / 2)
        breakpoints.push({ y: lockStart, state: sec.start })
        breakpoints.push({ y: lockEnd, state: sec.end })
    }
    breakpoints.sort((a, b) => a.y - b.y)
    return breakpoints
}

function ScrollCamera({ focusRef, shapeBlendRef }) {
    const { camera } = useThree()
    const breakpointsRef = useRef([])
    const targetState = useRef({
        pos: [0, 0, 3.6],
        target: [0, 0, 0],
        fov: 62,
        focus: 3.6,
    })
    const currentState = useRef({
        pos: [0, 0, 3.6],
        target: [0, 0, 0],
        fov: 62,
        focus: 3.6,
    })

    useEffect(() => {
        const remeasure = () => { breakpointsRef.current = measureBreakpoints() }
        remeasure()
        const id = setTimeout(remeasure, 100)
        const id2 = setTimeout(remeasure, 600)
        window.addEventListener('resize', remeasure)
        return () => {
            clearTimeout(id); clearTimeout(id2)
            window.removeEventListener('resize', remeasure)
        }
    }, [])

    useFrame((state, delta) => {
        const bps = breakpointsRef.current
        if (bps.length === 0) return
        const y = window.scrollY
        // Find the bracketing segment.
        let i = 0
        while (i < bps.length - 1 && bps[i + 1].y < y) i++
        const a = bps[i]
        const b = bps[Math.min(i + 1, bps.length - 1)]
        const span = Math.max(1, b.y - a.y)
        const raw = Math.min(1, Math.max(0, (y - a.y) / span))
        const t = easeInOut(raw)

        const tgt = targetState.current
        lerpVec3(a.state.pos, b.state.pos, t, tgt.pos)
        lerpVec3(a.state.target, b.state.target, t, tgt.target)
        tgt.fov = lerp(a.state.fov, b.state.fov, t)
        tgt.focus = lerp(a.state.focus, b.state.focus, t)

        // Exponential smoothing toward target so even instant scroll snaps glide.
        const k = 1 - Math.pow(0.001, delta)
        const cur = currentState.current
        lerpVec3(cur.pos, tgt.pos, k, cur.pos)
        lerpVec3(cur.target, tgt.target, k, cur.target)
        cur.fov = lerp(cur.fov, tgt.fov, k)
        cur.focus = lerp(cur.focus, tgt.focus, k)

        camera.position.set(cur.pos[0], cur.pos[1], cur.pos[2])
        camera.lookAt(cur.target[0], cur.target[1], cur.target[2])
        if (Math.abs(camera.fov - cur.fov) > 0.01) {
            camera.fov = cur.fov
            camera.updateProjectionMatrix()
        }
        if (focusRef) focusRef.current = cur.focus
        if (shapeBlendRef) {
            // Within a section both endpoints share a shape so any t resolves
            // to that shape; in a gap the two shapes differ and t eases between.
            shapeBlendRef.current.from = a.state.shape || 'sphere'
            shapeBlendRef.current.to = b.state.shape || 'sphere'
            shapeBlendRef.current.t = t
        }
    })

    return null
}

function ParticleField({ shapeBlendRef }) {
    const orangeRef = useRef(null)
    const whiteRef = useRef(null)
    const groupRef = useRef(null)
    const mouseNDC = useRef({ x: -10, y: -10, active: false })
    const offsetA = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
    const offsetB = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
    const lineRef = useRef(null)
    const linePositions = useMemo(() => new Float32Array(MAX_LINKS * 6), [])
    const lineColors = useMemo(() => new Float32Array(MAX_LINKS * 6), [])

    const { shapesA, shapesB } = useMemo(() => {
        const A = {
            sphere:  fibonacciSpherePositions(PARTICLE_COUNT, 1.5),
            torus:   torusPositions(PARTICLE_COUNT, 1.2, 0.42),
            grid:    gridPositions(PARTICLE_COUNT, 2.6),
            scatter: scatterPositions(PARTICLE_COUNT, 2.4, 7),
        }
        const B = {
            sphere:  fibonacciSpherePositions(PARTICLE_COUNT, 1.6),
            torus:   torusPositions(PARTICLE_COUNT, 1.25, 0.45),
            grid:    gridPositions(PARTICLE_COUNT, 2.7),
            scatter: scatterPositions(PARTICLE_COUNT, 2.5, 19),
        }
        return { shapesA: A, shapesB: B }
    }, [])

    const liveA = useMemo(() => new Float32Array(shapesA.sphere), [shapesA])
    const liveB = useMemo(() => new Float32Array(shapesB.sphere), [shapesB])

    const circleTexture = useMemo(() => {
        const size = 64
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        grad.addColorStop(0, 'rgba(255,255,255,1)')
        grad.addColorStop(0.4, 'rgba(255,255,255,0.9)')
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, size, size)
        const tex = new THREE.CanvasTexture(canvas)
        tex.needsUpdate = true
        return tex
    }, [])

    useEffect(() => {
        const onMouseMove = (e) => {
            mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1
            mouseNDC.current.active = true
        }
        const onMouseLeave = () => { mouseNDC.current.active = false }

        window.addEventListener('mousemove', onMouseMove, { passive: true })
        window.addEventListener('mouseleave', onMouseLeave)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseleave', onMouseLeave)
        }
    }, [])

    useFrame((state, delta) => {
        const blend = shapeBlendRef ? shapeBlendRef.current : null
        const fromKey = blend ? blend.from : 'sphere'
        const toKey = blend ? blend.to : 'sphere'
        const t = blend ? blend.t : 0
        const cam = state.camera
        const interactive = mouseNDC.current.active

        const rayOriginLocal = new THREE.Vector3()
        const rayDirLocal = new THREE.Vector3()
        if (interactive && groupRef.current) {
            const inv = groupRef.current.quaternion.clone().invert()
            rayOriginLocal.copy(cam.position).applyQuaternion(inv)
            const farPoint = new THREE.Vector3(mouseNDC.current.x, mouseNDC.current.y, 0.5)
            farPoint.unproject(cam)
            rayDirLocal.copy(farPoint).sub(cam.position).normalize().applyQuaternion(inv)
        }

        const REPEL_RADIUS = 0.15
        const REPEL_STRENGTH = 0.03
        const RECOVER = 0.12

        const updatePoints = (geom, lerpStart, lerpEnd, offsets) => {
            if (!geom) return
            const arr = geom.attributes.position.array
            const r2 = REPEL_RADIUS * REPEL_RADIUS
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3
                const baseX = lerpStart[i3] * (1 - t) + lerpEnd[i3] * t
                const baseY = lerpStart[i3 + 1] * (1 - t) + lerpEnd[i3 + 1] * t
                const baseZ = lerpStart[i3 + 2] * (1 - t) + lerpEnd[i3 + 2] * t

                if (interactive) {
                    const px = baseX - rayOriginLocal.x
                    const py = baseY - rayOriginLocal.y
                    const pz = baseZ - rayOriginLocal.z
                    const proj = px * rayDirLocal.x + py * rayDirLocal.y + pz * rayDirLocal.z
                    if (proj > 0) {
                        const perpX = px - proj * rayDirLocal.x
                        const perpY = py - proj * rayDirLocal.y
                        const perpZ = pz - proj * rayDirLocal.z
                        const perp2 = perpX * perpX + perpY * perpY + perpZ * perpZ
                        if (perp2 < r2 && perp2 > 0.0001) {
                            const perp = Math.sqrt(perp2)
                            const falloff = 1 - perp / REPEL_RADIUS
                            const push = (REPEL_STRENGTH * falloff * falloff) / perp
                            offsets[i3]     += perpX * push
                            offsets[i3 + 1] += perpY * push
                            offsets[i3 + 2] += perpZ * push
                        }
                    }
                }

                offsets[i3]     *= 1 - RECOVER
                offsets[i3 + 1] *= 1 - RECOVER
                offsets[i3 + 2] *= 1 - RECOVER

                arr[i3]     = baseX + offsets[i3]
                arr[i3 + 1] = baseY + offsets[i3 + 1]
                arr[i3 + 2] = baseZ + offsets[i3 + 2]
            }
            geom.attributes.position.needsUpdate = true
        }

        const fromA = shapesA[fromKey] || shapesA.sphere
        const toA = shapesA[toKey] || shapesA.sphere
        const fromB = shapesB[fromKey] || shapesB.sphere
        const toB = shapesB[toKey] || shapesB.sphere
        updatePoints(orangeRef.current?.geometry, fromA, toA, offsetA)
        updatePoints(whiteRef.current?.geometry, fromB, toB, offsetB)

        const aArr = orangeRef.current?.geometry.attributes.position.array
        if (aArr && lineRef.current) {
            const stride = Math.max(1, Math.floor(PARTICLE_COUNT / NODE_COUNT))
            const time = state.clock.elapsedTime
            const PULSE_SPEED = 0.6
            const PULSE_THRESHOLD = 0.35
            let seg = 0
            const r2 = LINK_DIST * LINK_DIST
            for (let i = 0; i < NODE_COUNT && seg < MAX_LINKS; i++) {
                const ix = (i * stride) * 3
                const ax = aArr[ix], ay = aArr[ix + 1], az = aArr[ix + 2]
                for (let j = i + 1; j < NODE_COUNT && seg < MAX_LINKS; j++) {
                    const jx = (j * stride) * 3
                    const dx = ax - aArr[jx]
                    const dy = ay - aArr[jx + 1]
                    const dz = az - aArr[jx + 2]
                    const d2 = dx * dx + dy * dy + dz * dz
                    if (d2 >= r2) continue

                    const phase = (i * 0.917 + j * 1.379) % (Math.PI * 2)
                    const pulse = 0.5 + 0.5 * Math.sin(time * PULSE_SPEED + phase)
                    if (pulse < PULSE_THRESHOLD) continue

                    const fade = (pulse - PULSE_THRESHOLD) / (1 - PULSE_THRESHOLD)
                    const distAlpha = 1 - Math.sqrt(d2) / LINK_DIST
                    const alpha = distAlpha * fade

                    const o = seg * 6
                    linePositions[o]     = ax
                    linePositions[o + 1] = ay
                    linePositions[o + 2] = az
                    linePositions[o + 3] = aArr[jx]
                    linePositions[o + 4] = aArr[jx + 1]
                    linePositions[o + 5] = aArr[jx + 2]
                    const cr = 0.35 * alpha
                    const cg = 0.78 * alpha
                    const cb = alpha
                    lineColors[o]     = cr; lineColors[o + 1] = cg; lineColors[o + 2] = cb
                    lineColors[o + 3] = cr; lineColors[o + 4] = cg; lineColors[o + 5] = cb
                    seg++
                }
            }
            const geom = lineRef.current.geometry
            geom.attributes.position.needsUpdate = true
            geom.attributes.color.needsUpdate = true
            geom.setDrawRange(0, seg * 2)
        }

        // Slow autorotation only — camera handles all section transitions now.
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.06
        }
    })

    return (
        <group ref={groupRef}>
            <points ref={orangeRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[liveA, 3]} count={PARTICLE_COUNT} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.04}
                    map={circleTexture}
                    alphaMap={circleTexture}
                    color={new THREE.Color('#0A84FF')}
                    transparent={true}
                    opacity={0.85}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <points ref={whiteRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[liveB, 3]} count={PARTICLE_COUNT} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.028}
                    map={circleTexture}
                    alphaMap={circleTexture}
                    color={new THREE.Color('#5AC8FA')}
                    transparent={true}
                    opacity={0.7}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={MAX_LINKS * 2} />
                    <bufferAttribute attach="attributes-color" args={[lineColors, 3]} count={MAX_LINKS * 2} />
                </bufferGeometry>
                <lineBasicMaterial
                    vertexColors={true}
                    transparent={true}
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    )
}

function DoF({ focusRef }) {
    const { camera } = useThree()
    const dofRef = useRef(null)
    const targetVec = useMemo(() => new THREE.Vector3(), [])
    const fwd = useMemo(() => new THREE.Vector3(), [])
    useFrame(() => {
        const eff = dofRef.current
        if (!eff || !focusRef.current) return
        camera.getWorldDirection(fwd)
        targetVec.copy(camera.position).addScaledVector(fwd, focusRef.current)
        if (eff.target) eff.target.copy(targetVec)
        const coc = eff.circleOfConfusionMaterial?.uniforms
        if (coc?.focusDistance) {
            const d = focusRef.current
            coc.focusDistance.value = Math.min(1, Math.max(0, (d - camera.near) / (camera.far - camera.near)))
        }
    })
    return (
        <EffectComposer>
            <DepthOfField
                ref={dofRef}
                focusDistance={0.02}
                focalLength={0.08}
                bokehScale={2.2}
            />
        </EffectComposer>
    )
}

// TEMP DEBUG — remove when camera tuning is done.
const DEBUG_AXES = false

function CameraReadout({ targetEl }) {
    const { camera } = useThree()
    const fwd = useMemo(() => new THREE.Vector3(), [])
    const tgt = useMemo(() => new THREE.Vector3(), [])
    useFrame(() => {
        const el = targetEl.current
        if (!el) return
        camera.getWorldDirection(fwd)
        tgt.copy(camera.position).addScaledVector(fwd, 1)
        const f = (n) => n.toFixed(2)
        el.textContent =
            `pos  [${f(camera.position.x)}, ${f(camera.position.y)}, ${f(camera.position.z)}]\n` +
            `look [${f(tgt.x)}, ${f(tgt.y)}, ${f(tgt.z)}]\n` +
            `fov  ${f(camera.fov)}   scrollY ${Math.round(window.scrollY)}`
    })
    return null
}

const HeroBackground = () => {
    const focusRef = useRef(3.6)
    const shapeBlendRef = useRef({ from: 'sphere', to: 'sphere', t: 0 })
    const readoutRef = useRef(null)
    return (
        <>
            <div className="bl-bg-fixed" aria-hidden="true">
                <div className="bl-glass-backdrop">
                    <div className="bl-glass-orb" />
                    <div className="bl-glass-orb" />
                    <div className="bl-glass-orb" />
                    <div className="bl-glass-orb" />
                </div>
                <Canvas
                    camera={{ position: [0, 0, 3.6], fov: 62, near: 0.1, far: 20 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ScrollCamera focusRef={focusRef} shapeBlendRef={shapeBlendRef} />
                    <ParticleField shapeBlendRef={shapeBlendRef} />
                    <DoF focusRef={focusRef} />
                    {DEBUG_AXES && (
                        <>
                            <axesHelper args={[2]} />
                            <gridHelper args={[6, 12, '#8B0000', '#3A0000']} />
                            <CameraReadout targetEl={readoutRef} />
                        </>
                    )}
                </Canvas>
            </div>
            {DEBUG_AXES && (
                <div
                    ref={readoutRef}
                    style={{
                        position: 'fixed',
                        top: 80,
                        right: 12,
                        background: 'rgba(0,0,0,0.75)',
                        color: '#5AC8FA',
                        font: '11px/1.4 ui-monospace, SFMono-Regular, monospace',
                        padding: '8px 10px',
                        whiteSpace: 'pre',
                        border: '1px solid #0A84FF',
                        borderRadius: 6,
                        pointerEvents: 'none',
                        zIndex: 1000,
                    }}
                />
            )}
        </>
    )
}

export default HeroBackground
