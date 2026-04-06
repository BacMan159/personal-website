import * as THREE from 'three'

const HeroLights = () => {
    return (
        <>
            <spotLight position={[4,5,4]}  angle={0.4} intensity={80} penumbra={0.5} color="#4cc0f0"/>
            <spotLight position={[-3,5,5]}  angle={0.4} intensity={120} penumbra={1} color="#9d4edd"/>
            <primitive object={new THREE.RectAreaLight('#A259FF', 8, 3, 2)} position={[1,3,4]} intensity={30} rotation={[-Math.PI / 4, Math.PI / 4, 0]}/>
            <pointLight position={[0,1,0]} intensity={20} color={"#7209b7"}/>
        </>
    )
}
export default HeroLights
