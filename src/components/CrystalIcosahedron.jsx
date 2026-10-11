import { useEffect, useRef } from 'react';

const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const VERTICES = RAW_VERTICES.map((point) => {
  const length = Math.hypot(...point);
  return point.map((coordinate) => coordinate / length);
});
const FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];
const FACET_COLORS = [
  '#d6ff74', '#9bf0bc', '#53cbb0', '#e7ffd0', '#378f79',
  '#b5e9a6', '#67dac1', '#7abf9a', '#def5a9', '#3b9c86',
];
const LIGHT = [-0.46, -0.62, 0.64];

function rotateVertex([x, y, z], rotationX, rotationY, rotationZ) {
  const cosX = Math.cos(rotationX); const sinX = Math.sin(rotationX);
  const cosY = Math.cos(rotationY); const sinY = Math.sin(rotationY);
  const cosZ = Math.cos(rotationZ); const sinZ = Math.sin(rotationZ);
  const yAfterX = y * cosX - z * sinX;
  const zAfterX = y * sinX + z * cosX;
  const xAfterY = x * cosY + zAfterX * sinY;
  const zAfterY = -x * sinY + zAfterX * cosY;
  return [
    xAfterY * cosZ - yAfterX * sinZ,
    xAfterY * sinZ + yAfterX * cosZ,
    zAfterY,
  ];
}

function normalFor(a, b, c) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  const length = Math.hypot(...normal) || 1;
  normal = normal.map((coordinate) => coordinate / length);
  const center = [a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]];
  if (normal[0] * center[0] + normal[1] * center[1] + normal[2] * center[2] < 0) {
    normal = normal.map((coordinate) => -coordinate);
  }
  return normal;
}

export default function CrystalIcosahedron({ active }) {
  const meshRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !active) return undefined;

    const faceNodes = new Map(
      Array.from(mesh.querySelectorAll('[data-crystal-face]'), (node) => [Number(node.dataset.crystalFace), node]),
    );
    let frameId = 0;
    let lastFrame = 0;
    let previousOrder = [];
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const frameInterval = reducedMotion ? 32 : 16;

    const draw = (timestamp) => {
      if (timestamp - lastFrame < frameInterval) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      pointer.y += (pointer.targetY - pointer.y) * 0.12;
      const rotationX = (reducedMotion ? 0 : timestamp * 0.00018) - pointer.y * 0.46;
      const rotationY = (reducedMotion ? 0 : timestamp * 0.00032) + pointer.x * 0.56;
      const rotationZ = pointer.x * 0.07;
      const rotated = VERTICES.map((vertex) => rotateVertex(vertex, rotationX, rotationY, rotationZ));
      const perspective = 4.2;
      const projected = rotated.map(([x, y, z]) => {
        const scale = perspective / (perspective - z);
        return [200 + x * 148 * scale, 200 + y * 148 * scale];
      });

      const orderedFaces = FACES.map((face, index) => {
        const [a, b, c] = face.map((vertexIndex) => rotated[vertexIndex]);
        const depth = (a[2] + b[2] + c[2]) / 3;
        const normal = normalFor(a, b, c);
        const illumination = Math.max(0, normal[0] * LIGHT[0] + normal[1] * LIGHT[1] + normal[2] * LIGHT[2]);
        const points = face.map((vertexIndex) => projected[vertexIndex].map((value) => value.toFixed(2)).join(',')).join(' ');
        return { index, depth, illumination, points };
      }).sort((left, right) => left.depth - right.depth);

      const nextOrder = orderedFaces.map(({ index }) => index);
      const orderChanged = nextOrder.some((index, position) => index !== previousOrder[position]);
      orderedFaces.forEach(({ index, depth, illumination, points }) => {
        const polygon = faceNodes.get(index);
        if (!polygon) return;
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill-opacity', String(Math.min(0.76, 0.19 + illumination * 0.4 + Math.max(0, depth) * 0.16)));
        polygon.setAttribute('stroke-opacity', String(0.3 + Math.max(0, depth) * 0.42));
        if (orderChanged) mesh.appendChild(polygon);
      });
      if (orderChanged) previousOrder = nextOrder;

      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frameId);
  }, [active]);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pointer = pointerRef.current;
    pointer.targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    pointer.targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
  };

  const resetPointer = () => {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
  };

  return (
    <div className="hero-crystal-object" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <span className="hero-crystal-glow" aria-hidden="true" />
      <svg className="hero-crystal-mesh" viewBox="0 0 400 400" role="img" aria-label="کریستال سه‌بعدی بیست‌وجهی پارس؛ چرخان و واکنش‌گرا به حرکت موس">
        <g ref={meshRef}>
          {FACES.map((face, index) => (
            <polygon
              key={index}
              data-crystal-face={index}
              points={face.map((vertexIndex) => `${200 + VERTICES[vertexIndex][0] * 148},${200 + VERTICES[vertexIndex][1] * 148}`).join(' ')}
              fill={FACET_COLORS[index % FACET_COLORS.length]}
              fillOpacity="0.34"
              stroke="#e8ffd9"
              strokeWidth="1.1"
              strokeLinejoin="round"
              strokeOpacity="0.56"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
