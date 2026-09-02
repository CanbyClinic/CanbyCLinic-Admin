'use client';

/* eslint-disable react-hooks/immutability -- React Three Fiber animation is intentionally imperative inside useFrame. */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';

const routeScenes: Record<string, { asset: string; variant: string }> = {
  '/': { asset: '/assets/scenes/h-01-arrival.png', variant: 'home' },
  '/services': { asset: '/assets/scenes/s-01-consultation.png', variant: 'services' },
  '/appointments': { asset: '/assets/scenes/a-01-entrance.png', variant: 'appointments' },
  '/new-patients': { asset: '/assets/scenes/n-01-preparation.png', variant: 'new-patients' },
  '/resources': { asset: '/assets/scenes/r-01-resources.png', variant: 'resources' },
  '/visit': { asset: '/assets/scenes/v-01-reseda.png', variant: 'visit' },
  '/our-clinic': { asset: '/assets/scenes/o-01-team.png', variant: 'our-clinic' },
};

function Box({ position, scale, color, roughness = .72, metalness = .04 }: { position: [number, number, number]; scale: [number, number, number]; color: string; roughness?: number; metalness?: number }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={scale} /><meshStandardMaterial color={color} roughness={roughness} metalness={metalness} /></mesh>;
}

function GlassPanel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[3.4, 5.2, .08]} />
      <meshPhysicalMaterial color="#dce9eb" transparent opacity={.16} roughness={.16} metalness={.05} transmission={.45} thickness={.18} />
    </mesh>
  );
}

function HallwayDetails({ variant, progress }: { variant: string; progress: React.MutableRefObject<number> }) {
  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);
  const resourceRack = useRef<THREE.Group>(null);
  const table = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const p = progress.current;
    const open = THREE.MathUtils.smoothstep(p, .05, .36);
    if (leftDoor.current) leftDoor.current.rotation.y = THREE.MathUtils.damp(leftDoor.current.rotation.y, -open * 1.16, 5, delta);
    if (rightDoor.current) rightDoor.current.rotation.y = THREE.MathUtils.damp(rightDoor.current.rotation.y, open * 1.16, 5, delta);
    if (resourceRack.current) resourceRack.current.rotation.y = THREE.MathUtils.damp(resourceRack.current.rotation.y, (p - .35) * -.18, 4, delta);
    if (table.current) table.current.position.z = THREE.MathUtils.damp(table.current.position.z, -1.2 + p * 1.8, 4, delta);
  });

  if (variant === 'visit') {
    return (
      <group rotation-x={-Math.PI / 2.8} position={[0, -1.7, 1.2]}>
        <Box position={[0, 0, 0]} scale={[8, .08, 5]} color="#27333a" roughness={.86} />
        {[-2.2, 0, 2.2].map((x) => <Box key={x} position={[x, .06, 0]} scale={[.035, .02, 4.2]} color="#e9d18a" />)}
      </group>
    );
  }

  if (variant === 'resources') {
    return (
      <group ref={resourceRack} position={[2.25, -1.2, .3]}>
        <Box position={[0, -.4, 0]} scale={[2.6, .12, 1]} color="#875f3e" />
        {['#084eb0', '#e7e2d7', '#10940b', '#d9d0bf', '#456f92', '#eef0e9'].map((color, index) => (
          <Box key={color + index} position={[-1.02 + index * .4, .05 + index * .04, 0]} scale={[.28, 1.2, .06]} color={color} roughness={.9} />
        ))}
      </group>
    );
  }

  if (variant === 'new-patients') {
    return (
      <group ref={table} position={[2.2, -1.45, -1.2]} rotation-x={-.08}>
        <Box position={[0, 0, 0]} scale={[3.5, .14, 2.15]} color="#8b6444" roughness={.95} />
        <Box position={[-.8, .13, -.1]} scale={[1.1, .035, 1.45]} color="#f1ede3" />
        <Box position={[.5, .16, -.2]} scale={[.42, .46, .42]} color="#d98d2b" roughness={.6} />
        <Box position={[1.1, .14, .45]} scale={[.9, .03, .62]} color="#084eb0" roughness={.9} />
      </group>
    );
  }

  return (
    <group>
      <group ref={leftDoor} position={[-1.7, 0, 1.65]}>
        <GlassPanel position={[1.7, 0, 0]} />
      </group>
      <group ref={rightDoor} position={[1.7, 0, 1.65]}>
        <GlassPanel position={[-1.7, 0, 0]} />
      </group>
      <Box position={[-3.7, 0, 1.7]} scale={[.24, 5.6, .3]} color="#21313a" metalness={.35} />
      <Box position={[3.7, 0, 1.7]} scale={[.24, 5.6, .3]} color="#21313a" metalness={.35} />
      <Box position={[0, 2.72, 1.7]} scale={[7.6, .2, .3]} color="#21313a" metalness={.35} />
      {variant === 'services' && [-2.45, -.82, .82, 2.45].map((x) => <Box key={x} position={[x, -1.3, -.55]} scale={[1.26, 2.55, .15]} color={x < 0 ? '#6b7e87' : '#89948c'} roughness={.58} />)}
    </group>
  );
}

function Scene({ asset, variant }: { asset: string; variant: string }) {
  const texture = useTexture(asset);
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const { camera, pointer, invalidate } = useThree();
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    document.documentElement.classList.add('world-ready');
    return () => document.documentElement.classList.remove('world-ready');
  }, [texture]);

  useFrame((_, delta) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    progress.current = p;
    const px = reduced ? 0 : pointer.x * .16;
    const py = reduced ? 0 : pointer.y * .08;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, .08 + py - p * .16, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6.6 - Math.min(p, .32) * 5.6, 3, delta);
    camera.lookAt(0, 0, -2.8);
    if (group.current) {
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, pointer.x * -.08, 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * .012, 4, delta);
    }
    invalidate();
  });

  return (
    <>
      <fog attach="fog" args={['#07131b', 6, 18]} />
      <ambientLight intensity={1.3} color="#dfeaf0" />
      <directionalLight position={[3, 6, 5]} intensity={2.2} color="#fff0d7" castShadow />
      <pointLight position={[-3, 1, 1]} intensity={9} distance={9} color="#77a9ff" />
      <group ref={group}>
        <mesh position={[0, 0, -3.45]}>
          <planeGeometry args={[12.4, 7.25]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -2.15, -.45]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#202a2e" roughness={.78} metalness={.04} transparent opacity={.78} />
        </mesh>
        <HallwayDetails variant={variant} progress={progress} />
      </group>
      {!reduced && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Noise opacity={.018} blendFunction={BlendFunction.SOFT_LIGHT} />
          <Vignette eskil={false} offset={.18} darkness={.72} />
        </EffectComposer>
      )}
    </>
  );
}

export default function ClinicWorld() {
  const pathname = usePathname();
  const scene = routeScenes[pathname];
  if (!scene) return null;

  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas key={scene.asset} dpr={[1, 1.7]} frameloop="always" camera={{ position: [0, .08, 6.6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}><Scene asset={scene.asset} variant={scene.variant} /></Suspense>
      </Canvas>
    </div>
  );
}
