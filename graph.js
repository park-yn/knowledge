// ISLANDS: faint grey regions drawn behind groups of related nodes.
// Names are only for your reference; they aren't shown.
const islands = {
  core:   'The main sequence',
  beyond: 'Nonperturbative QFT and its branches'
};

// x, y: where each node opens. Drag nodes around, then run
// printPositions() in the browser console to get the new numbers.
const nodes = new vis.DataSet([
  { id: 'foundations', island: 'core',   x:  315, y: -275, label: 'Some foundations',                            url: 'PDFs/foundations.pdf' },
  { id: 'geometry',    island: 'core',   x:  430, y: -140, label: 'Algebra and geometry', url: 'PDFs/geometry_symmetry.pdf' },
  { id: 'classical',   island: 'core',   x:  425, y:   70, label: 'Classical fields\nand spacetime',        url: 'PDFs/classical_fields.pdf' },
  { id: 'pqft',        island: 'core',   x:  335, y:  205, label: 'Perturbative QFT',                       url: 'PDFs/perturbative_qft.pdf' },

  { id: 'beyond',      island: 'beyond', x: -225, y:   95, label: 'Nonperturbative QFT',                    url: 'PDFs/nonperturbative_qft.pdf' },
  { id: 'susy',        island: 'beyond', x: -370, y:  -80, label: 'SUSY',                      url: 'PDFs/susy_duality.pdf' },
  { id: 'tqft',        island: 'beyond', x: -155, y: -165, label: 'TQFT',                                   url: 'PDFs/tqft.pdf' },
  { id: 'strings',     island: 'beyond', x:  -30, y:  -25, label: 'Strings, branes \nand holography',        url: 'PDFs/strings_holography.pdf' },
  { id: 'riemann',     island: 'beyond', x: -500, y:  145, label: 'Riemann surfaces',  url: 'PDFs/riemann_complex.pdf' },
  { id: 'cft',         island: 'beyond', x: -260, y:  260, label: 'CFT',                                    url: 'PDFs/cft.pdf' }
]);

// CONNECTIONS: arrow points from the prerequisite to the topic that uses it.
const edges = new vis.DataSet([
  ['foundations', 'geometry'],
  ['geometry',    'classical'],
  ['classical',   'pqft'],
  ['pqft',        'beyond'],
  ['beyond',      'susy'],
  ['beyond',      'cft'],
  ['beyond',      'tqft'],
  ['beyond',      'strings'],
  ['beyond',      'riemann']
].map(([from, to]) => ({ from, to })));

const container = document.getElementById("network");
const data = { nodes, edges };

const options = {
  interaction: { hover: true },
  nodes: {
    shape: 'box',
    color: {
      background: '#cccccc',
      border: '#2e81ff',
      highlight: { background: '#ffff99', border: '#2e81ff' }
    },
    font: { color: '#000000', size: 18, face: 'arial', vadjust: 0 },
    margin: 10
  },
  edges: {
    arrows: { middle: { enabled: true, scaleFactor: 0.9 } },
    color: { color: '#2e81ff', highlight: '#2e81ff', hover: '#2e81ff' },
    width: 1,
    hoverWidth: 0,        // no thickening on hover
    selectionWidth: 0,    // or when selected
    smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 }
  },
  physics: false        // nodes stay exactly where x, y put them
};

const network = new vis.Network(container, data, options);

// Prints every node's current position, ready to paste into the x, y fields.
function printPositions() {
  const pos = network.getPositions();
  console.log(Object.entries(pos)
    .map(([id, p]) => `${id}: x: ${Math.round(p.x)}, y: ${Math.round(p.y)}`).join('\n'));
}

// MINIMUM SPACING
// Keeps at least MIN_GAP pixels between any two node boxes, so arrowheads
// in the middle of an edge never sit on top of a node. Runs after every drag.
const MIN_GAP = 60;
const nodeSize = {};

function enforceSpacing() {
  const ids = nodes.getIds();
  for (const id of ids) {
    if (!nodeSize[id]) {
      const b = network.getBoundingBox(id);
      nodeSize[id] = { w: b.right - b.left, h: b.bottom - b.top };
    }
  }
  for (let pass = 0; pass < 60; pass++) {
    let moved = false;
    const pos = network.getPositions(ids);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i], b = ids[j], pa = pos[a], pb = pos[b];
        const gx = Math.abs(pa.x - pb.x) - (nodeSize[a].w + nodeSize[b].w) / 2;
        const gy = Math.abs(pa.y - pb.y) - (nodeSize[a].h + nodeSize[b].h) / 2;
        if (gx >= MIN_GAP || gy >= MIN_GAP) continue;
        // push apart along whichever axis needs the smaller move
        const needX = MIN_GAP - gx, needY = MIN_GAP - gy;
        const sx = pa.x <= pb.x ? -1 : 1, sy = pa.y <= pb.y ? -1 : 1;
        if (needX <= needY) { pa.x += sx * needX / 2; pb.x -= sx * needX / 2; }
        else                { pa.y += sy * needY / 2; pb.y -= sy * needY / 2; }
        moved = true;
      }
    }
    for (const id of ids) network.moveNode(id, pos[id].x, pos[id].y);
    if (!moved) break;
  }
}

network.on("dragEnd", function (params) {
  if (params.nodes.length) enforceSpacing();
});

// DRAW ISLANDS
// Each island is a plain grey rounded rectangle around its nodes.
const PAD = 28;          // space between nodes and the island edge
const RADIUS = 14;       // corner rounding
const ISLAND_FILL = 'rgba(0, 0, 0, 0)';   // invisible, but still grabbable

const islandRects = {};

network.on("beforeDrawing", function (ctx) {
  for (const key of Object.keys(islands)) {
    const ids = nodes.getIds({ filter: n => n.island === key });
    if (!ids.length) continue;

    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    for (const id of ids) {
      const b = network.getBoundingBox(id);
      left = Math.min(left, b.left);   right = Math.max(right, b.right);
      top = Math.min(top, b.top);      bottom = Math.max(bottom, b.bottom);
    }
    const r = { x: left - PAD, y: top - PAD, w: right - left + 2 * PAD, h: bottom - top + 2 * PAD };
    islandRects[key] = r;

    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, RADIUS);
    ctx.fillStyle = ISLAND_FILL;
    ctx.fill();
  }
});

// DRAG ISLANDS
// Grab an island anywhere outside its nodes to move the whole island.
// Grabbing a node still moves just that node; grabbing empty space still pans.
let islandDrag = null;

function canvasPoint(e) {
  const r = container.getBoundingClientRect();
  return network.DOMtoCanvas({ x: e.clientX - r.left, y: e.clientY - r.top });
}

function islandAt(e) {
  const r = container.getBoundingClientRect();
  if (network.getNodeAt({ x: e.clientX - r.left, y: e.clientY - r.top }) !== undefined) return null;
  const p = canvasPoint(e);
  const hits = Object.entries(islandRects).filter(([, b]) =>
    p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h);
  return hits.length ? hits[hits.length - 1][0] : null;
}

container.addEventListener("pointerdown", function (e) {
  const key = islandAt(e);
  if (!key) return;
  network.setOptions({ interaction: { dragView: false } });
  islandDrag = { key, last: canvasPoint(e), ids: nodes.getIds({ filter: n => n.island === key }) };
  container.style.cursor = "grabbing";
}, true);

window.addEventListener("pointermove", function (e) {
  if (!islandDrag) {
    if (e.target.closest && e.target.closest("#network")) {
      container.style.cursor = islandAt(e) ? "grab" : "";
    }
    return;
  }
  const p = canvasPoint(e);
  const dx = p.x - islandDrag.last.x, dy = p.y - islandDrag.last.y;
  islandDrag.last = p;
  const pos = network.getPositions(islandDrag.ids);
  for (const id of islandDrag.ids) network.moveNode(id, pos[id].x + dx, pos[id].y + dy);
});

window.addEventListener("pointerup", function () {
  if (!islandDrag) return;
  islandDrag = null;
  network.setOptions({ interaction: { dragView: true } });
  container.style.cursor = "grab";
  enforceSpacing();
});

// CLICK ON NODE TO OPEN PDF
network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const node = nodes.get(params.nodes[0]);
    if (node.url) {
      window.open(node.url, "_blank");
    }
  }
});
