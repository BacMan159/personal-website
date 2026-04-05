import React, { useRef, useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations, useFBX } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export function Avatar(props) {
    const group = useRef()

    const { scene } = useGLTF('/models/Avatar.glb')
    const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
    const { nodes, materials } = useGraph(clone)

    const idle = useFBX('/animations/Idle.fbx')
    const wave = useFBX('/animations/Wave.fbx')

    idle.animations[0].name = 'idle'
    wave.animations[0].name = 'wave'

    const { actions } = useAnimations([idle.animations[0], wave.animations[0]], group)

    useEffect(() => {
        if (!actions.wave || !actions.idle) return

        // Play wave once on entry
        actions.wave.reset()
        actions.wave.setLoop(THREE.LoopOnce, 1)
        actions.wave.clampWhenFinished = true
        actions.wave.play()

        // Cross-fade to idle after wave completes
        const waveDuration = (wave.animations[0].duration + 0.3) * 1000
        const timer = setTimeout(() => {
            actions.wave.fadeOut(1)
            actions.idle.reset().fadeIn(0.5).play()
        }, waveDuration)

        return () => clearTimeout(timer)
    }, [actions, wave.animations])

    return (
        <group ref={group} {...props} dispose={null}>
            <group scale={0.01} rotation-x={-0.2}>
                <primitive object={nodes.mixamorigHips} />
                <skinnedMesh
                    geometry={nodes.Mesh_0.geometry}
                    material={materials['Material.002']}
                    skeleton={nodes.Mesh_0.skeleton}
                    castShadow={true}
                />
            </group>
        </group>
    )
}

useGLTF.preload('/models/Avatar.glb')
