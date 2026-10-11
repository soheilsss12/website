import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const clamp = THREE.MathUtils.clamp;

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function drawCRTScreen(canvas, time, lookX, lookY, speaking) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const unit = width / 768;
  const s = (value) => value * unit;
  const cycle = time % 28;
  const glitch = (cycle > 2.2 && cycle < 3.15)
    || (cycle > 5.75 && cycle < 6.55)
    || (cycle > 12.1 && cycle < 12.9);
  const horizontalBeam = cycle > 13.15 && cycle < 14.5;
  const blink = Math.max(0, 1 - Math.abs(cycle - 9.85) / 0.88);
  const idleBlink = Math.max(0, 1 - Math.abs((time % 4.6) - 0.08) / 0.11);
  const eyeBlink = Math.max(blink, speaking ? idleBlink : 0);
  const eyesVisible = speaking || (cycle > 4.15 && cycle < 11.7) || (cycle > 17.2 && cycle < 27.5);
  const eyeHeight = THREE.MathUtils.lerp(height * 0.105, height * 0.022, eyeBlink);
  const eyeWidth = width * 0.128;
  const gazeX = clamp(lookX, -1, 1) * width * 0.014;
  const gazeY = clamp(lookY, -1, 1) * height * 0.012;

  context.clearRect(0, 0, width, height);
  roundedRect(context, 0, 0, width, height, s(35));
  context.save();
  context.clip();

  const glass = context.createLinearGradient(0, 0, width, height);
  glass.addColorStop(0, '#171819');
  glass.addColorStop(0.48, '#101212');
  glass.addColorStop(1, '#07090a');
  context.fillStyle = glass;
  context.fillRect(0, 0, width, height);

  const reflection = context.createRadialGradient(s(370), s(265), s(25), s(370), s(265), s(450));
  reflection.addColorStop(0, 'rgba(132, 127, 103, 0.2)');
  reflection.addColorStop(0.52, 'rgba(105, 108, 102, 0.075)');
  reflection.addColorStop(1, 'rgba(2, 4, 5, 0)');
  context.fillStyle = reflection;
  context.fillRect(0, 0, width, height);

  // Fine phosphor texture and low-level CRT noise.
  for (let index = 0; index < 68; index += 1) {
    const x = (index * 173 + 31) % width;
    const y = (index * 271 + 59) % height;
    context.fillStyle = index % 5 === 0 ? 'rgba(230, 235, 227, 0.1)' : 'rgba(182, 190, 183, 0.045)';
    context.fillRect(x, y, s(index % 11 === 0 ? 2 : 1), s(1));
  }

  if (glitch) {
    const pulse = 0.38 + Math.abs(Math.sin(time * 47)) * 0.46;
    for (let row = 0; row < 9; row += 1) {
      const y = s(302 + row * 9 + Math.sin(time * 23 + row) * 5);
      const x = s(282 + ((row * 47) % 62));
      const barWidth = s(70 + ((row * 53) % 138));
      const color = row % 3 === 0 ? `rgba(232, 63, 75, ${pulse})` : row % 3 === 1 ? `rgba(97, 240, 149, ${pulse * 0.88})` : `rgba(115, 163, 255, ${pulse * 0.6})`;
      context.fillStyle = color;
      context.fillRect(x, y, barWidth, s(row % 2 ? 3 : 2));
    }
    context.font = `${s(7)}px monospace`;
    context.fillStyle = `rgba(229, 236, 217, ${pulse * 0.7})`;
    context.fillText('010 LISA / SIGNAL 45.5N', s(310), s(391));
  }

  if (horizontalBeam) {
    const beamAlpha = 0.68 + Math.sin(time * 10) * 0.14;
    context.shadowColor = 'rgba(147, 132, 255, 0.78)';
    context.shadowBlur = s(11);
    context.fillStyle = `rgba(158, 143, 255, ${beamAlpha})`;
    context.fillRect(width * 0.03, height * 0.42, width * 0.45, s(4));
    context.shadowBlur = 0;
  }

  if (eyesVisible) {
    const eyeY = height * 0.49 + gazeY;
    const eyeCenters = [width * 0.28 + gazeX, width * 0.72 + gazeX];
    eyeCenters.forEach((eyeX, index) => {
      const outerGlow = context.createRadialGradient(eyeX, eyeY, s(8), eyeX, eyeY, width * 0.18);
      outerGlow.addColorStop(0, 'rgba(218, 241, 255, 0.56)');
      outerGlow.addColorStop(0.34, 'rgba(151, 199, 255, 0.25)');
      outerGlow.addColorStop(1, 'rgba(92, 150, 220, 0)');
      context.fillStyle = outerGlow;
      context.beginPath();
      context.ellipse(eyeX, eyeY, width * 0.164, Math.max(height * 0.042, eyeHeight * 1.3), 0, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.shadowColor = 'rgba(194, 224, 255, 0.96)';
      context.shadowBlur = s(34);
      const core = context.createRadialGradient(eyeX - eyeWidth * 0.16, eyeY - eyeHeight * 0.2, s(2), eyeX, eyeY, eyeWidth * 1.08);
      core.addColorStop(0, '#fffefa');
      core.addColorStop(0.58, '#f1f1ed');
      core.addColorStop(0.86, '#d6e3ed');
      core.addColorStop(1, 'rgba(188, 216, 241, 0.72)');
      context.fillStyle = core;
      context.beginPath();
      context.ellipse(eyeX, eyeY, eyeWidth, eyeHeight, index ? 0.012 : -0.012, 0, Math.PI * 2);
      context.fill();
      context.restore();

      // A dim iris shifts inside each luminous eye, so the face acknowledges the pointer.
      context.fillStyle = 'rgba(55, 66, 74, 0.18)';
      context.beginPath();
      context.ellipse(eyeX + gazeX * 0.18 + (index ? s(3) : -s(3)), eyeY + gazeY * 0.12, s(9), Math.max(s(3), eyeHeight * 0.15), 0, 0, Math.PI * 2);
      context.fill();
    });
  }

  // Soft curved reflection on the glass, then the characteristic horizontal phosphor lines.
  const sheen = context.createLinearGradient(0, 0, width * 0.76, height);
  sheen.addColorStop(0, 'rgba(229, 239, 239, 0.035)');
  sheen.addColorStop(0.26, 'rgba(229, 239, 239, 0.0)');
  sheen.addColorStop(0.72, 'rgba(229, 239, 239, 0.025)');
  sheen.addColorStop(1, 'rgba(229, 239, 239, 0.0)');
  context.fillStyle = sheen;
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgba(217, 230, 229, 0.052)';
  for (let y = 0; y < height; y += s(4)) context.fillRect(0, y, width, s(1));

  const vignette = context.createRadialGradient(s(384), s(340), s(180), s(384), s(340), s(510));
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.46)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function makeCRTScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  drawCRTScreen(canvas, 0, 0, 0, false);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function makeCurvedScreenGeometry(width, height, segmentsX = 40, segmentsY = 34, bulge = 0.055) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let row = 0; row <= segmentsY; row += 1) {
    const v = row / segmentsY;
    for (let column = 0; column <= segmentsX; column += 1) {
      const u = column / segmentsX;
      const x = (u - 0.5) * width;
      const y = (v - 0.5) * height;
      const z = bulge * (1 - ((u * 2 - 1) ** 2)) * (1 - ((v * 2 - 1) ** 2));
      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let row = 0; row < segmentsY; row += 1) {
    for (let column = 0; column < segmentsX; column += 1) {
      const a = row * (segmentsX + 1) + column;
      const b = a + 1;
      const c = b + segmentsX + 1;
      const d = a + segmentsX + 1;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeTorsoGeometry() {
  const profile = [
    new THREE.Vector2(2.48, -4.55),
    new THREE.Vector2(2.54, -3.9),
    new THREE.Vector2(2.5, -3.15),
    new THREE.Vector2(2.38, -2.65),
    new THREE.Vector2(2.08, -2.34),
    new THREE.Vector2(1.56, -2.08),
    new THREE.Vector2(1.06, -1.87),
    new THREE.Vector2(0.64, -1.64),
    new THREE.Vector2(0.45, -1.39),
  ];
  const smoothProfile = new THREE.SplineCurve(profile).getPoints(52);
  const geometry = new THREE.LatheGeometry(smoothProfile, 72);
  geometry.scale(1, 1, 0.56);
  geometry.computeVertexNormals();
  return geometry;
}

function makeTube(points, radius, segments = 52) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

function Cable({ points, radius = 0.027, color = '#191b1c' }) {
  const geometry = useMemo(() => makeTube(points, radius), [points, radius]);
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} roughness={0.43} metalness={0.2} />
    </mesh>
  );
}

function MonitorDetails({ speaking, scanRef, ledMaterialRef }) {
  return (
    <>
      <mesh ref={scanRef} position={[0, 0.17, 0.566]}>
        <planeGeometry args={[2.27, 0.018]} />
        <meshBasicMaterial color="#d6e7e4" transparent opacity={0.23} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh position={[0, -1.27, 0.505]}>
        <boxGeometry args={[0.14, 0.028, 0.018]} />
        <meshStandardMaterial color="#51585a" roughness={0.54} />
      </mesh>
      <mesh position={[-0.42, -1.27, 0.505]}>
        <sphereGeometry args={[0.036, 20, 16]} />
        <meshStandardMaterial ref={ledMaterialRef} color="#8bb6da" emissive="#5291ca" emissiveIntensity={speaking ? 2.2 : 0.8} roughness={0.28} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[0.26 + index * 0.135, -1.275, 0.507]}>
          <sphereGeometry args={[index === 0 ? 0.038 : 0.026, 18, 14]} />
          <meshStandardMaterial
            color={index === 0 && speaking ? '#9dbbd5' : '#55585a'}
            emissive={index === 0 && speaking ? '#5387ae' : '#151718'}
            emissiveIntensity={index === 0 && speaking ? 1.25 : 0.12}
            roughness={0.4}
            metalness={0.25}
          />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.57, 0.05, 0.03]}>
          {Array.from({ length: 8 }, (_, index) => (
            <mesh key={index} position={[side * 0.008, 0.68 - index * 0.16, 0]} rotation={[0, 0, side * -0.09]}>
              <boxGeometry args={[0.055, 0.074, 0.028]} />
              <meshStandardMaterial color="#767675" roughness={0.58} metalness={0.22} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function CRTHead({ pointer, isSpeaking, reducedMotion, projectStartedAt }) {
  const headRef = useRef(null);
  const scanRef = useRef(null);
  const ledMaterialRef = useRef(null);
  const lastScreenDraw = useRef(0);
  const screenTexture = useMemo(makeCRTScreenTexture, []);
  const screenGeometry = useMemo(() => makeCurvedScreenGeometry(2.4, 2.18, 42, 38, 0.055), []);
  const shellGeometry = useMemo(() => new RoundedBoxGeometry(3.15, 3.25, 0.78, 8, 0.17), []);
  const rearGeometry = useMemo(() => new RoundedBoxGeometry(2.86, 2.98, 0.34, 8, 0.15), []);
  const sideGeometry = useMemo(() => new RoundedBoxGeometry(0.17, 2.92, 0.7, 6, 0.07), []);
  const outerTrimGeometry = useMemo(() => new RoundedBoxGeometry(3.03, 3.12, 0.16, 8, 0.15), []);
  const bezelGeometry = useMemo(() => new RoundedBoxGeometry(2.75, 2.78, 0.12, 8, 0.13), []);
  const glassGeometry = useMemo(() => makeCurvedScreenGeometry(2.44, 2.22, 38, 36, 0.058), []);

  useEffect(() => () => screenTexture.dispose(), [screenTexture]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const screenTime = projectStartedAt == null
      ? (isSpeaking ? time : 0)
      : Math.max(0, (performance.now() - projectStartedAt) / 1000);
    if (headRef.current) {
      const yaw = pointer.current.x * 0.18 + Math.sin(time * 0.27) * (reducedMotion.current ? 0 : 0.012);
      const pitch = -pointer.current.y * 0.11 + Math.sin(time * 0.19) * (reducedMotion.current ? 0 : 0.008);
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, yaw, 3.6, delta);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, pitch, 3.6, delta);
      headRef.current.rotation.z = THREE.MathUtils.damp(headRef.current.rotation.z, -pointer.current.x * 0.022, 3.2, delta);
    }

    if (scanRef.current) {
      const cycle = screenTime % 28;
      const interference = projectStartedAt != null && ((cycle > 2.2 && cycle < 3.15) || (cycle > 5.75 && cycle < 6.55) || (cycle > 12.1 && cycle < 12.9));
      const progress = reducedMotion.current ? 0.18 : (screenTime * 0.21) % 1;
      scanRef.current.visible = interference;
      scanRef.current.position.y = -0.98 + progress * 2.25;
      scanRef.current.material.opacity = interference ? 0.18 : 0;
    }

    if (time - lastScreenDraw.current > 1 / 24) {
      drawCRTScreen(screenTexture.image, screenTime, pointer.current.x, pointer.current.y, isSpeaking);
      screenTexture.needsUpdate = true;
      lastScreenDraw.current = time;
    }

    if (ledMaterialRef.current) {
      ledMaterialRef.current.emissiveIntensity = isSpeaking ? 2.3 + Math.sin(time * 10) * 0.65 : 0.6 + Math.sin(time * 1.5) * 0.16;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.14, 0]} scale={[1.035, 0.97, 1]} rotation={[0, 0, -0.018]}>
      <mesh geometry={rearGeometry} position={[0, 0, -0.4]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#4e6680" roughness={0.48} metalness={0.25} />
      </mesh>
      <mesh geometry={sideGeometry} position={[1.57, 0.01, -0.16]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#536f8d" roughness={0.44} metalness={0.24} clearcoat={0.18} />
      </mesh>
      <mesh geometry={shellGeometry} position={[0, 0, -0.03]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#77797a" roughness={0.43} metalness={0.2} clearcoat={0.16} clearcoatRoughness={0.35} />
      </mesh>
      <mesh geometry={outerTrimGeometry} position={[0, 0, 0.335]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#9d9d9b" roughness={0.36} metalness={0.2} clearcoat={0.28} clearcoatRoughness={0.27} />
      </mesh>
      <mesh geometry={bezelGeometry} position={[0, 0.08, 0.425]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#252728" roughness={0.34} metalness={0.18} clearcoat={0.2} />
      </mesh>
      <mesh position={[1.68, 0.06, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.185, 0.205, 0.18, 36]} />
        <meshPhysicalMaterial color="#202223" roughness={0.39} metalness={0.26} clearcoat={0.2} />
      </mesh>

      <mesh geometry={screenGeometry} position={[0, 0.17, 0.496]}>
        <meshBasicMaterial map={screenTexture} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={glassGeometry} position={[0, 0.17, 0.505]}>
        <meshPhysicalMaterial
          color="#b9c6c7"
          roughness={0.12}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.06}
          transparent
          opacity={0.13}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <MonitorDetails speaking={isSpeaking} scanRef={scanRef} ledMaterialRef={ledMaterialRef} />
    </group>
  );
}

function PersonRig({ isSpeaking, projectStartedAt }) {
  const characterRef = useRef(null);
  const bodyRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);
  const { size } = useThree();
  const torsoGeometry = useMemo(makeTorsoGeometry, []);
  const sweaterTexture = useLoader(THREE.TextureLoader, '/lisa-knit-texture.png');
  const sweaterMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c1c6ce',
    map: sweaterTexture,
    bumpMap: sweaterTexture,
    bumpScale: 0.027,
    roughness: 0.94,
    metalness: 0,
  }), [sweaterTexture]);

  const isMobile = size.width < 640;
  const isCompact = size.width < 1000;
  const scale = isMobile ? 0.58 : isCompact ? 0.74 : 0.91;
  const aspect = size.width / Math.max(1, size.height);
  const wideOffset = clamp((aspect - 1.6) / 0.55, 0, 1);
  const desktopX = THREE.MathUtils.lerp(1.13, 0.8, wideOffset);
  const rootPosition = isMobile ? [0, -1.34, 0] : isCompact ? [0.96, -0.08, 0] : [desktopX, -0.22, 0];

  useEffect(() => {
    sweaterTexture.colorSpace = THREE.SRGBColorSpace;
    sweaterTexture.wrapS = THREE.RepeatWrapping;
    sweaterTexture.wrapT = THREE.RepeatWrapping;
    sweaterTexture.repeat.set(6, 4);
    sweaterTexture.anisotropy = 8;
    sweaterTexture.needsUpdate = true;
  }, [sweaterTexture]);

  useEffect(() => {
    const onPointerMove = (event) => {
      pointer.current.x = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointer.current.y = clamp(1 - (event.clientY / window.innerHeight) * 2, -1, 1);
    };
    const resetPointer = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => { reducedMotion.current = motionQuery.matches; };
    updateMotionPreference();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    motionQuery.addEventListener?.('change', updateMotionPreference);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', resetPointer);
      motionQuery.removeEventListener?.('change', updateMotionPreference);
      sweaterMaterial.dispose();
    };
  }, [sweaterMaterial]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const idle = reducedMotion.current ? 0 : 1;
    if (characterRef.current) {
      const sway = Math.sin(time * 0.32) * 0.016 * idle;
      characterRef.current.rotation.y = THREE.MathUtils.damp(characterRef.current.rotation.y, pointer.current.x * 0.025 + sway, 2.6, delta);
      characterRef.current.position.y = rootPosition[1] + Math.sin(time * 0.62) * 0.013 * idle;
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.z = THREE.MathUtils.damp(bodyRef.current.rotation.z, pointer.current.x * -0.008, 2.4, delta);
    }
  });

  const cableSets = useMemo(() => [
    { points: [[-1.22, 0.82, -0.38], [-1.68, 0.62, -0.4], [-1.8, 0.02, -0.29], [-1.76, -0.62, -0.14], [-1.35, -1.2, 0.06], [-0.92, -1.8, 0.42], [-0.7, -2.55, 0.56]], radius: 0.010, color: '#26292a' },
    { points: [[-1.42, 0.12, -0.39], [-1.8, -0.2, -0.31], [-1.9, -0.88, -0.12], [-1.66, -1.55, 0.22], [-1.16, -1.78, 0.5], [-0.58, -2.2, 0.62], [-0.3, -3.1, 0.55]], radius: 0.008, color: '#101314' },
    { points: [[1.24, 0.8, -0.38], [1.68, 0.58, -0.34], [1.84, 0.02, -0.2], [1.8, -0.62, -0.03], [1.42, -1.1, 0.16], [1.1, -1.78, 0.42], [1.24, -2.62, 0.46]], radius: 0.010, color: '#1b1e1f' },
    { points: [[1.4, 0.18, -0.39], [1.75, -0.22, -0.28], [1.76, -0.86, -0.08], [1.54, -1.34, 0.25], [1.9, -1.84, 0.2], [2.03, -2.48, 0.07], [1.8, -3.05, 0.1]], radius: 0.007, color: '#111415' },
  ], []);

  return (
    <group ref={characterRef} position={rootPosition} scale={scale}>
      <group ref={bodyRef}>
        <mesh geometry={torsoGeometry} position={[0, 0, -0.22]} scale={[1.08, 1, 1.08]} castShadow receiveShadow material={sweaterMaterial} />
        <mesh position={[0, -1.56, -0.2]} scale={[1, 1, 0.76]}>
          <cylinderGeometry args={[0.28, 0.37, 0.76, 48, 1, false]} />
          <meshPhysicalMaterial color="#aa9184" roughness={0.74} clearcoat={0.025} />
        </mesh>
        <mesh position={[0, -1.97, 0.04]} scale={[1, 1, 0.76]} castShadow receiveShadow material={sweaterMaterial}>
          <cylinderGeometry args={[0.4, 0.56, 0.5, 56, 1, false]} />
        </mesh>
      </group>

      {cableSets.map((cable, index) => <Cable key={index} {...cable} />)}
      <CRTHead pointer={pointer} isSpeaking={isSpeaking} reducedMotion={reducedMotion} projectStartedAt={projectStartedAt} />
    </group>
  );
}

function Scene({ isSpeaking, projectStartedAt }) {
  return (
    <>
      <ambientLight intensity={0.92} color="#f5f2ec" />
      <hemisphereLight args={['#fffdf9', '#77716b', 0.72]} />
      <directionalLight position={[-3.8, 5.2, 6]} intensity={2.45} color="#fff8ef" />
      <pointLight position={[3.2, 0.4, 3.4]} intensity={13} distance={9} color="#9eafc0" />
      <pointLight position={[-3.3, -0.8, -1.8]} intensity={7} distance={8} color="#ad9688" />
      <PersonRig isSpeaking={isSpeaking} projectStartedAt={projectStartedAt} />
    </>
  );
}

export default function AssistantScene({ isSpeaking = false, projectStartedAt = null }) {
  return (
    <div className="assistant-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 8.6], fov: 35, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.04;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        fallback={<div className="scene-fallback" />}
      >
        <Scene isSpeaking={isSpeaking} projectStartedAt={projectStartedAt} />
      </Canvas>
    </div>
  );
}
