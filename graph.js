const nodes = new vis.DataSet([
  { id: 1, label: 'QM', url: 'PDFs/qm.pdf' },
  { id: 2, label: 'QFT', url: 'PDFs/qft.pdf' },
  { id: 3, label: 'CFT', url: 'PDFs/cft.pdf' },
  { id: 4, label: 'N=4 SYM', url: 'PDFs/n4sym.pdf' },
  { id: 5, label: 'Gauge Theory', url: 'PDFs/gauge_theory.pdf' },
  { id: 6, label: 'Lie Groups', url: 'PDFs/lie_groups.pdf' },
  { id: 7, label: 'Manifolds', url: 'PDFs/manifolds.pdf' },
  { id: 8, label: 'Fibre Bundles', url: 'PDFs/fibre_bundles.pdf' },
  { id: 9, label: 'AdS/CFT', url: 'PDFs/ads_cft.pdf' },
  { id: 10, label: 'GR', url: 'PDFs/gr.pdf' },
  { id: 11, label: 'Black Holes', url: 'PDFs/black_holes.pdf' },
]);

const edges = new vis.DataSet([
  { from: 1, to: 2, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 2, to: 3, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 2, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 4, to: 9, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 3, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 5, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 6, to: 5, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 7, to: 6, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 8, to: 6, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 9, to: 11, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 10, to: 11, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 7, to: 10, arrows: { middle: { enabled: true, type: 'arrow' } } }
]);

const container = document.getElementById("network");
const data = { nodes, edges };
const options = { interaction: { hover: true }, nodes: { shape: 'dot', size: 20 } };
const network = new vis.Network(container, data, options);

network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const node = nodes.get(params.nodes[0]);
    if (node.url) window.open(node.url, "_blank");
  }
});
