const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];
const FACET_COLORS = ['#d6ff74', '#9bf0bc', '#53cbb0', '#e7ffd0', '#378f79', '#b5e9a6'];
const VERTICES = RAW_VERTICES.map((vertex) => {
  const length = Math.hypot(...vertex);
  return vertex.map((coordinate) => coordinate / length);
});
const CRYSTAL_FACETS = (() => {
  const rotationX = -0.48;
  const rotationY = 0.62;
  const rotated = VERTICES.map(([x, y, z]) => {
    const yAfterX = y * Math.cos(rotationX) - z * Math.sin(rotationX);
    const zAfterX = y * Math.sin(rotationX) + z * Math.cos(rotationX);
    return [x * Math.cos(rotationY) + zAfterX * Math.sin(rotationY), yAfterX, -x * Math.sin(rotationY) + zAfterX * Math.cos(rotationY)];
  });
  const projected = rotated.map(([x, y, z]) => {
    const scale = 3.8 / (3.8 - z);
    return [60 + x * 47 * scale, 60 + y * 47 * scale];
  });
  return FACES.map((face, index) => ({
    index,
    depth: face.reduce((sum, vertexIndex) => sum + rotated[vertexIndex][2], 0) / 3,
    points: face.map((vertexIndex) => projected[vertexIndex].map((value) => value.toFixed(2)).join(',')).join(' '),
  })).sort((left, right) => left.depth - right.depth);
})();

export default function CrystalMark({ className = '' }) {
  return (
    <svg className={`pars-crystal-logo ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {CRYSTAL_FACETS.map(({ index, points }) => (
        <polygon
          key={index}
          points={points}
          fill={FACET_COLORS[index % FACET_COLORS.length]}
          fillOpacity="0.78"
          stroke="#ecffd9"
          strokeWidth="0.8"
          strokeOpacity="0.78"
          strokeLinejoin="round"
        />
      ))}
      <circle cx="60" cy="60" r="9" fill="#0a1d17" fillOpacity="0.9" stroke="#b9f8c5" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="5.6" fill="#d6ff74" />
      <circle cx="58.4" cy="58.2" r="1.9" fill="#ffffff" fillOpacity="0.96" />
    </svg>
  );
}
