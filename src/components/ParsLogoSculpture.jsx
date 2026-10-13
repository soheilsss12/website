import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import ParsLogoMark from './ParsLogoMark.jsx';

const SVG_URL = new URL('../../pars-mark.svg', import.meta.url).href;
const SVG_BOUNDS = { x: 108, y: 0, width: 616, height: 466 };
const MODEL_SCALE = 0.00365;
const CENTER_X = SVG_BOUNDS.x + SVG_BOUNDS.width / 2;
const CENTER_Y = SVG_BOUNDS.y + SVG_BOUNDS.height / 2;
const EXTRUDE_DEPTH = 24;
const BEVEL_THICKNESS = 2.4;
const BEVEL_SIZE = 1.2;
const FACE_Z = (EXTRUDE_DEPTH + BEVEL_THICKNESS + 0.7) * MODEL_SCALE;
const LAYER_COLORS = new Set(['5cc6d9', '6166aa', '68a6d9', '592c7a']);

function isReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function addExtrudedMark(data, root) {
  const layers = new Map();

  data.paths.forEach((path) => {
    const color = path.color.getHexString().toLowerCase();
    if (!LAYER_COLORS.has(color)) return;

    path.toShapes().forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: EXTRUDE_DEPTH,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: BEVEL_SIZE,
        bevelThickness: BEVEL_THICKNESS,
        curveSegments: 10,
        steps: 1,
      });
      geometry.computeBoundingBox();
      const bounds = geometry.boundingBox;

      // The source also contains a wordmark below the icon; the original SVG
      // viewBox clips it away, so keep only the paths inside that exact mark box.
      if (
        bounds.max.y < SVG_BOUNDS.y
        || bounds.min.y > SVG_BOUNDS.y + SVG_BOUNDS.height
        || bounds.max.x < SVG_BOUNDS.x
        || bounds.min.x > SVG_BOUNDS.x + SVG_BOUNDS.width
      ) {
        geometry.dispose();
        return;
      }

      geometry.scale(MODEL_SCALE, -MODEL_SCALE, MODEL_SCALE);
      geometry.translate(-CENTER_X * MODEL_SCALE, CENTER_Y * MODEL_SCALE, 0);
      const geometries = layers.get(color) ?? [];
      geometries.push(geometry);
      layers.set(color, geometries);
    });
  });

  if (layers.size !== 4) throw new Error('Could not build all four Pars mark color layers.');

  const colorMaterials = new Map([
    ['5cc6d9', { color: '#5CC6D9', emissive: '#5CC6D9' }],
    ['6166aa', { color: '#6166AA', emissive: '#6166AA' }],
    ['68a6d9', { color: '#68A6D9', emissive: '#68A6D9' }],
    ['592c7a', { color: '#592C7A', emissive: '#592C7A' }],
  ]);

  layers.forEach((geometries, hex) => {
    const geometry = geometries.length === 1
      ? geometries[0]
      : mergeGeometries(geometries, false);
    if (!geometry) {
      geometries.forEach((part) => part.dispose());
      throw new Error(`Could not combine the ${hex} Pars mark geometry.`);
    }
    if (geometries.length > 1) geometries.forEach((part) => part.dispose());

    const color = colorMaterials.get(hex);
    const material = new THREE.MeshPhysicalMaterial({
      color: color.color,
      emissive: color.emissive,
      emissiveIntensity: 0.035,
      metalness: 0.08,
      roughness: 0.24,
      clearcoat: 0.92,
      clearcoatRoughness: 0.17,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    root.add(mesh);
  });
}

export default function ParsLogoSculpture({ active = true, interactionRef = null }) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);
  const controllerRef = useRef(null);
  const activeRef = useRef(active);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    let frameId = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let scene = null;
    let rig = null;
    let camera = null;
    let modelReady = false;
    let texture = null;
    let resizeObserver = null;
    let prefersLessMotion = isReducedMotion();
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const interactionTarget = interactionRef?.current ?? host;
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    };

    const start = () => {
      if (disposed || !activeRef.current || document.hidden || frameId || !modelReady) return;
      if (!scene || !rig || !camera || !rendererRef.current) return;
      if (prefersLessMotion) draw(performance.now());
      else frameId = requestAnimationFrame(draw);
    };

    const draw = (time) => {
      frameId = 0;
      if (disposed || !activeRef.current || document.hidden || !scene || !rig || !camera) return;
      const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = time;

      if (!prefersLessMotion) {
        elapsed += delta;
        pointer.x += (pointer.targetX - pointer.x) * Math.min(1, delta * 4.2);
        pointer.y += (pointer.targetY - pointer.y) * Math.min(1, delta * 4.2);
        rig.rotation.y = -0.13 + Math.sin(elapsed * 0.43) * 0.105 + pointer.x * 0.48;
        rig.rotation.x = 0.075 + Math.cos(elapsed * 0.37) * 0.045 - pointer.y * 0.34;
        rig.rotation.z = Math.sin(elapsed * 0.31) * 0.018;
        rig.position.y = Math.sin(elapsed * 0.72) * 0.026;
      } else {
        pointer.x = 0;
        pointer.y = 0;
        rig.rotation.set(0.075, -0.13, 0);
        rig.position.y = 0;
      }

      rendererRef.current?.render(scene, camera);
      const pointerSettling = Math.abs(pointer.x - pointer.targetX) > 0.001
        || Math.abs(pointer.y - pointer.targetY) > 0.001;
      if (!prefersLessMotion || pointerSettling) frameId = requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      if (prefersLessMotion || event.pointerType === 'touch') return;
      const bounds = interactionTarget.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.targetX = (((event.clientX - bounds.left) / bounds.width) - 0.5) * 0.8;
      pointer.targetY = (((event.clientY - bounds.top) / bounds.height) - 0.5) * 0.65;
      start();
    };

    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      start();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotionPreferenceChange = (event) => {
      prefersLessMotion = event.matches;
      if (prefersLessMotion) {
        pointer.targetX = 0;
        pointer.targetY = 0;
        stop();
      }
      start();
    };

    const resize = () => {
      if (disposed || !rendererRef.current || !camera) return;
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      rendererRef.current.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      start();
    };

    try {
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      rendererRef.current = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0xffffff, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.setAttribute('role', 'presentation');
      host.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
      camera.position.set(0, 0, 4.9);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x592c7a, 1.5));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
      keyLight.position.set(-3.8, 4.5, 6);
      scene.add(keyLight);
      const cyanLight = new THREE.PointLight(0x5cc6d9, 17, 7, 2);
      cyanLight.position.set(-2.3, 1.3, 2.6);
      scene.add(cyanLight);
      const blueLight = new THREE.PointLight(0x68a6d9, 15, 7, 2);
      blueLight.position.set(2.2, -0.1, 2.7);
      scene.add(blueLight);
      const violetLight = new THREE.PointLight(0x592c7a, 12, 6, 2);
      violetLight.position.set(0.5, 2.6, -1.7);
      scene.add(violetLight);

      rig = new THREE.Group();
      rig.rotation.order = 'YXZ';
      scene.add(rig);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
      } else {
        window.addEventListener('resize', resize, { passive: true });
      }
      resize();

      interactionTarget.addEventListener('pointermove', onPointerMove, { passive: true });
      interactionTarget.addEventListener('pointerleave', onPointerLeave, { passive: true });
      document.addEventListener('visibilitychange', onVisibilityChange);
      if (motionQuery?.addEventListener) motionQuery.addEventListener('change', onMotionPreferenceChange);
      else motionQuery?.addListener(onMotionPreferenceChange);
      controllerRef.current = { start, stop };

      new SVGLoader().load(SVG_URL, (data) => {
        if (disposed) return;
        try {
          addExtrudedMark(data, rig);
          new THREE.TextureLoader().load(
            SVG_URL,
            (loadedTexture) => {
              if (disposed) {
                loadedTexture.dispose();
                return;
              }
              texture = loadedTexture;
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
              const faceMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
                toneMapped: false,
                side: THREE.DoubleSide,
              });
              const face = new THREE.Mesh(
                new THREE.PlaneGeometry(SVG_BOUNDS.width * MODEL_SCALE, SVG_BOUNDS.height * MODEL_SCALE),
                faceMaterial,
              );
              face.position.set(0, 0, FACE_Z);
              face.renderOrder = 5;
              face.frustumCulled = false;
              rig.add(face);
              modelReady = true;
              setStatus('ready');
              start();
            },
            undefined,
            (error) => {
              if (!disposed) {
                console.error('Unable to load the Pars mark front face.', error);
                setStatus('fallback');
              }
            },
          );
          resize();
        } catch (error) {
          console.error('Unable to build the Pars logo sculpture.', error);
          setStatus('fallback');
        }
      }, undefined, (error) => {
        if (!disposed) {
          console.error('Unable to load the Pars logo SVG.', error);
          setStatus('fallback');
        }
      });
    } catch (error) {
      console.error('WebGL is unavailable for the Pars logo sculpture.', error);
      setStatus('fallback');
    }

    return () => {
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      interactionTarget.removeEventListener('pointermove', onPointerMove);
      interactionTarget.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (motionQuery?.removeEventListener) motionQuery.removeEventListener('change', onMotionPreferenceChange);
      else motionQuery?.removeListener(onMotionPreferenceChange);
      controllerRef.current = null;
      texture?.dispose();
      if (rig) {
        rig.traverse((object) => {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material?.dispose();
        });
      }
      rendererRef.current?.dispose();
      rendererRef.current?.domElement.remove();
      rendererRef.current = null;
    };
  }, [interactionRef]);

  useEffect(() => {
    activeRef.current = active;
    if (active) controllerRef.current?.start();
    else controllerRef.current?.stop();
  }, [active]);

  return (
    <div
      ref={hostRef}
      className={`pars-logo-sculpture ${status === 'fallback' ? 'is-fallback' : ''} ${active ? 'is-active' : 'is-idle'}`}
      role="img"
      aria-label="نشان سه‌بعدی پارس"
    >
      <div className="pars-logo-sculpture__aura" aria-hidden="true" />
      <div className={`pars-logo-sculpture__fallback ${status === 'ready' ? 'is-hidden' : ''}`} aria-hidden="true">
        <ParsLogoMark animated decorative className="pars-logo-sculpture__fallback-mark" />
      </div>
    </div>
  );
}
