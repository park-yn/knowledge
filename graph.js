const nodes = new vis.DataSet([
  { id: 2, label: 'QFT', url: 'PDFs/qft.pdf'  },
  { id: 3, label: 'CFT', url: 'PDFs/cft.pdf' },
  { id: 4, label: 'N=4 SYM', url: 'PDFs/n4sym.pdf' },
  { id: 5, label: 'Gauge Theory', url: 'PDFs/gauge_theory.pdf',fixed: { x: true, y: true } },
  { id: 6, label: 'Lie Groups, Lie algebras\n& their representations', url: 'PDFs/lie_groups.pdf' },
  { id: 7, label: 'Manifolds & \nreal tensor analysis', url: 'PDFs/manifolds.pdf', x:-8000, y: 0,  fixed: { x: true, y: true } },
  { id: 8, label: 'Fibre Bundles', url: 'PDFs/fibre_bundles.pdf' },
  { id: 10, label: 'GR', url: 'PDFs/gr.pdf' }
]);

const edges = new vis.DataSet([
  { from: 2, to: 3, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 2, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 3, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 5, to: 4, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 6, to: 5, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 7, to: 8, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 8, to: 5, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 7, to: 6, arrows: { middle: { enabled: true, type: 'arrow' } } },
  { from: 7, to: 10, arrows: { middle: { enabled: true, type: 'arrow' } } }
]);

const container = document.getElementById("network");
const data = { nodes, edges };
const options = { interaction: { hover: true }, nodes: {
  shape: 'box',    
  font: {
    color: '#000000',    // black label
    size: 18,            // readable inside node
    face: 'arial',
    vadjust: 0           // vertically centered
  },
  margin: 10              // spacing between label and circle edge
},  edges: { arrows: { middle: { enabled: true, scaleFactor: 0.75}}}, 
    physics: {
      solver: 'barnesHut', // ← default, "bouncy" physics
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 200,      // ← controls spacing
        springConstant: 0.06,
        damping: 0.3,          // ← lower = more bounce
        avoidOverlap: 1         // ← prevent node overlap
      },
      stabilization: {
        enabled: true,
        iterations: 250,
        updateInterval: 25
      }  
    } 
  };
const network = new vis.Network(container, data, options);



network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const node = nodes.get(params.nodes[0]);
    if (node.url) window.open(node.url, "_blank");
  }
});
