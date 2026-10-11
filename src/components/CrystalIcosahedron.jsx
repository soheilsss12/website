import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CrystalMark from './CrystalMark.jsx';

const FACET_COLORS = ['#d6ff74', '#9bf0bc', '#53cbb0', '#e7ffd0', '#378f79', '#b5e9a6', '#67dac1', '#7abf9a', '#def5a9', '#3b9c86'];
const ENVIRONMENT_URL = `${import.meta.env.BASE_URL}crystal-environment.jpg`;
const CRYSTAL_SPIN_SPEED = 0.24;

function createFacetColors(geometry) {
  const positions = geometry.getAttribute('position');
  const colors = new Float32Array(positions.count * 3);
  const normal = new THREE.Vector3();
  const lightDirection = new THREE.Vector3(-0.4, 0.65, 0.6).normalize();
  const first = new THREE.Vector3();
  const second = new THREE.Vector3();
  const third = new THREE.Vector3();

  for (let vertex = 0; vertex < positions.count; vertex += 3) {
    first.fromBufferAttribute(positions, vertex);
    second.fromBufferAttribute(positions, vertex + 1);
    third.fromBufferAttribute(positions, vertex + 2);
    second.sub(first);
    third.sub(first);
    normal.crossVectors(second, third).normalize();

    const faceIndex = Math.floor(vertex / 3);
    const light = 0.84 + Math.max(0, normal.dot(lightDirection)) * 0.23;
    const tint = new THREE.Color(FACET_COLORS[faceIndex % FACET_COLORS.length]).multiplyScalar(light);
    for (let point = 0; point < 3; point += 1) {
      const offset = (vertex + point) * 3;
      colors[offset] = tint.r;
      colors[offset + 1] = tint.g;
      colors[offset + 2] = tint.b;
    }
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}

function cropToEquirectangular(image) {
  const sourceWidth = image.naturalWidth || image.videoWidth || image.width;
  const sourceHeight = image.naturalHeight || image.videoHeight || image.height;
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context || !sourceWidth || !sourceHeight) return null;

  const sourceRatio = sourceWidth / sourceHeight;
  if (sourceRatio > 2) {
    const cropWidth = sourceHeight * 2;
    context.drawImage(image, (sourceWidth - cropWidth) / 2, 0, cropWidth, sourceHeight, 0, 0, width, height);
  } else if (sourceRatio < 2) {
    const cropHeight = sourceWidth / 2;
    context.drawImage(image, 0, (sourceHeight - cropHeight) / 2, sourceWidth, cropHeight, 0, 0, width, height);
  } else {
    context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(64, 64, 3, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(218,255,146,0.88)');
  gradient.addColorStop(0.22, 'rgba(129,255,174,0.58)');
  gradient.addColorStop(0.54, 'rgba(53,220,169,0.19)');
  gradient.addColorStop(1, 'rgba(53,220,169,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRenderer(host) {
  let renderer;
  try {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.55);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      premultipliedAlpha: true,
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = 'hero-crystal-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.setAttribute('role', 'presentation');
    host.appendChild(renderer.domElement);
    return renderer;
  } catch (error) {
    renderer?.dispose();
    renderer?.domElement.remove();
    throw error;
  }
}

export default function CrystalIcosahedron({ active, interactionRef }) {
  const hostRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const activeRef = useRef(active);
  const lifecycleRef = useRef({ mounted: true, controller: null });
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  activeRef.current = active;

  useLayoutEffect(() => {
    const lifecycle = lifecycleRef.current;
    lifecycle.mounted = true;

    if (lifecycle.controller) {
      if (active && !webglUnavailable) lifecycle.controller.start();
      else lifecycle.controller.stop();
      return undefined;
    }
    if (!active || webglUnavailable || !hostRef.current) return undefined;

    const host = hostRef.current;
    let renderer;
    try {
      renderer = createRenderer(host);
    } catch {
      if (lifecycle.mounted) setWebglUnavailable(true);
      return undefined;
    }

    const scene = new THREE.Scene();
    const initialBounds = host.getBoundingClientRect();
    const width = Math.max(1, initialBounds.width);
    const height = Math.max(1, initialBounds.height);
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    camera.position.set(0, 0, 4.75);
    scene.add(camera);

    const ambientLight = new THREE.HemisphereLight(0xd9ffe9, 0x08130f, 1.75);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xeaffd3, 3.1);
    keyLight.position.set(-3.4, 4.1, 3.8);
    scene.add(keyLight);
    const mintLight = new THREE.PointLight(0x65ffd0, 5.2, 8, 2);
    mintLight.position.set(2.8, 0.8, 2.2);
    scene.add(mintLight);
    const warmLight = new THREE.PointLight(0xffb77d, 2.4, 7, 2);
    warmLight.position.set(-2.6, -2.1, 1.5);
    scene.add(warmLight);
    const coreLight = new THREE.PointLight(0xcaff7c, 4.6, 3.8, 2);
    coreLight.position.set(0, 0, 0.15);

    const crystalRig = new THREE.Group();
    crystalRig.rotation.set(-0.13, 0.18, 0.03);
    scene.add(crystalRig);
    crystalRig.add(coreLight);

    const outerGeometry = new THREE.IcosahedronGeometry(1.34, 0);
    createFacetColors(outerGeometry);
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: '#e0f7dd',
      vertexColors: true,
      metalness: 0.06,
      roughness: 0.14,
      transmission: 0.7,
      thickness: 0.9,
      ior: 1.43,
      attenuationColor: new THREE.Color('#55d8ad'),
      attenuationDistance: 2.1,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color('#0a291e'),
      emissiveIntensity: 0.2,
      envMapIntensity: 1.65,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    crystalRig.add(new THREE.Mesh(outerGeometry, shellMaterial));

    const edgeGeometry = new THREE.EdgesGeometry(outerGeometry, 0.1);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: '#d8ffe5',
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const facetEdges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    facetEdges.scale.setScalar(1.002);
    facetEdges.renderOrder = 1;
    crystalRig.add(facetEdges);

    const innerRig = new THREE.Group();
    crystalRig.add(innerRig);
    const innerGeometry = new THREE.IcosahedronGeometry(0.76, 0);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: '#9ff2ca',
      metalness: 0.08,
      roughness: 0.2,
      transmission: 0.44,
      thickness: 0.56,
      ior: 1.34,
      attenuationColor: new THREE.Color('#61e6b7'),
      attenuationDistance: 1.4,
      clearcoat: 0.85,
      clearcoatRoughness: 0.14,
      emissive: new THREE.Color('#123d2c'),
      emissiveIntensity: 0.38,
      envMapIntensity: 1.15,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    innerRig.add(new THREE.Mesh(innerGeometry, innerMaterial));

    const coreGeometry = new THREE.DodecahedronGeometry(0.235, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: '#edffbd',
      emissive: new THREE.Color('#baff6b'),
      emissiveIntensity: 2.25,
      metalness: 0.12,
      roughness: 0.24,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.rotation.set(0.24, -0.34, 0.12);
    innerRig.add(core);

    const glowTexture = createGlowTexture();
    let coreGlow = null;
    if (glowTexture) {
      const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: '#a4ffc1',
        transparent: true,
        opacity: 0.56,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      });
      coreGlow = new THREE.Sprite(glowMaterial);
      coreGlow.scale.set(1.18, 1.18, 1);
      coreGlow.renderOrder = 2;
      innerRig.add(coreGlow);
    }

    renderer.setSize(width, height, false);
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const nextWidth = Math.max(1, rect.width);
      const nextHeight = Math.max(1, rect.height);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
      lifecycle.controller?.start();
    };
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(host);
    if (!resizeObserver) window.addEventListener('resize', resize, { passive: true });
    resize();

    let disposed = false;
    let environmentTarget = null;
    let environmentTexture = null;
    const sourceEnvironment = new THREE.TextureLoader().load(
      ENVIRONMENT_URL,
      (imageTexture) => {
        if (disposed || !lifecycle.mounted) {
          imageTexture.dispose();
          return;
        }
        try {
          environmentTexture = cropToEquirectangular(imageTexture.image);
          imageTexture.dispose();
          if (!environmentTexture) return;
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          try {
            pmremGenerator.compileEquirectangularShader();
            environmentTarget = pmremGenerator.fromEquirectangular(environmentTexture);
            scene.environment = environmentTarget.texture;
          } finally {
            pmremGenerator.dispose();
          }
          environmentTexture.dispose();
          environmentTexture = null;
          lifecycle.controller?.start();
        } catch {
          environmentTexture?.dispose();
          environmentTexture = null;
        }
      },
      undefined,
      () => {},
    );

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery?.matches ?? false;
    const onMotionPreferenceChange = (event) => {
      reducedMotion = event.matches;
      if (!reducedMotion) lifecycle.controller?.start();
    };
    motionQuery?.addEventListener?.('change', onMotionPreferenceChange);
    if (motionQuery && !motionQuery.addEventListener) motionQuery.addListener?.(onMotionPreferenceChange);

    const interactionTarget = interactionRef?.current || host;
    const pointer = pointerRef.current;
    const handlePointerMove = (event) => {
      const rect = interactionTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.targetX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointer.targetY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      if (reducedMotion) lifecycle.controller?.start();
    };
    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      if (reducedMotion) lifecycle.controller?.start();
    };
    interactionTarget.addEventListener('pointermove', handlePointerMove, { passive: true });
    interactionTarget.addEventListener('pointerleave', resetPointer, { passive: true });

    let frameId = 0;
    let lastTimestamp = 0;
    let elapsed = 0;
    const renderFrame = (timestamp) => {
      frameId = 0;
      if (!lifecycle.mounted || !activeRef.current || document.hidden) return;

      const delta = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.05) : 0;
      lastTimestamp = timestamp;
      elapsed += delta;
      const targetYaw = pointer.targetX * 0.78;
      const targetPitch = pointer.targetY * 0.58;
      const yawDistance = targetYaw - pointer.x;
      const pitchDistance = targetPitch - pointer.y;
      const pointerDistance = Math.hypot(yawDistance, pitchDistance);
      const pointerStep = CRYSTAL_SPIN_SPEED * delta;
      if (pointerDistance > 0 && pointerStep > 0) {
        const stepRatio = Math.min(1, pointerStep / pointerDistance);
        pointer.x += yawDistance * stepRatio;
        pointer.y += pitchDistance * stepRatio;
      }

      const idleTurn = reducedMotion ? 0 : elapsed;
      crystalRig.position.x = pointer.x * 0.55;
      crystalRig.position.y = -pointer.y * 0.55;
      crystalRig.rotation.y = 0.18 + idleTurn * CRYSTAL_SPIN_SPEED + pointer.x;
      crystalRig.rotation.x = -0.13 + pointer.y + (reducedMotion ? 0 : Math.sin(elapsed * 0.55) * 0.025);
      crystalRig.rotation.z = 0.03 + pointer.x * 0.08;
      innerRig.rotation.y = (reducedMotion ? 0 : -elapsed * 0.18) + pointer.x * 0.12;
      innerRig.rotation.x = reducedMotion ? 0 : Math.sin(elapsed * 0.38) * 0.06;
      core.rotation.y = reducedMotion ? -0.34 : -0.34 + elapsed * 0.32;
      if (coreGlow && !reducedMotion) coreGlow.material.opacity = 0.52 + Math.sin(elapsed * 1.8) * 0.06;

      renderer.render(scene, camera);
      const pointerIsSettling = pointerDistance > 0.001;
      if (!reducedMotion || pointerIsSettling) frameId = window.requestAnimationFrame(renderFrame);
    };
    const start = () => {
      if (frameId || disposed || !lifecycle.mounted || !activeRef.current || document.hidden) return;
      lastTimestamp = 0;
      renderFrame(performance.now());
    };
    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastTimestamp = 0;
    };
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (activeRef.current) start();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    const onContextLost = (event) => {
      event.preventDefault();
      stop();
      if (lifecycle.mounted) setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost, false);
      motionQuery?.removeEventListener?.('change', onMotionPreferenceChange);
      if (motionQuery && !motionQuery.removeEventListener) motionQuery.removeListener?.(onMotionPreferenceChange);
      interactionTarget.removeEventListener('pointermove', handlePointerMove);
      interactionTarget.removeEventListener('pointerleave', resetPointer);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', resize);
      sourceEnvironment.dispose();
      environmentTexture?.dispose();
      environmentTarget?.dispose();
      glowTexture?.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };

    lifecycle.controller = { start, stop, cleanup };
    if (activeRef.current) start();
    return undefined;
  }, [active, webglUnavailable]);

  useEffect(() => () => {
    const lifecycle = lifecycleRef.current;
    lifecycle.mounted = false;
    lifecycle.controller?.cleanup();
    lifecycle.controller = null;
  }, []);

  return (
    <div
      ref={hostRef}
      className={`hero-crystal-object ${webglUnavailable ? 'is-fallback' : ''}`}
      role="img"
      aria-label="کریستال سه‌بعدی بیست‌وجهی پارس با هسته‌ی نورانی؛ چرخان و واکنش‌گرا به حرکت نشانگر"
    >
      <span className="hero-crystal-glow" aria-hidden="true" />
      {webglUnavailable && <span className="hero-crystal-fallback" aria-hidden="true"><CrystalMark /></span>}
    </div>
  );
}
