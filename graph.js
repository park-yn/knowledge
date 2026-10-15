
const nodes = new vis.DataSet([

  // DIFFERENTIAL GEOMETRY
  {
    id: 7,
    label: 'Manifolds & \nreal tensor analysis',
    url: 'PDFs/manifolds.pdf'
  },
  {
    id: 8,
    label: 'Fibre Bundles',
    url: 'PDFs/fibre_bundles.pdf'
  },
  {
    id: 6,
    label: 'Lie Groups, Lie algebras\n& their representations',
    url: 'PDFs/lie_groups.pdf'
  },

  // QUANTUM FIELD THEORY
  {
    id: 2,
    label: 'QFT',
    url: 'PDFs/qft.pdf'
  },
  {
    id: 5,
    label: 'Gauge Theory',
    url: 'PDFs/gauge_theory.pdf',
    fixed: { x: true, y: true }
  },
  {
    id: 4,
    label: 'N=4 SYM',
    url: 'PDFs/n4sym.pdf'
  },

  // CONFORMAL FIELD THEORY
  {
    id: 3,
    label: 'CFT',
    url: 'PDFs/cft.pdf'
  },

  // GENERAL RELATIVITY
  {
    id: 10,
    label: 'GR',
    url: 'PDFs/gr.pdf'
  }

]);


// OPTIONAL CONNECTIONS
// Add only those you consider especially meaningful.

const edges = new vis.DataSet([

  // Example:
  // { from: 7, to: 8 }

]);


const container = document.getElementById("network");

const data = { nodes, edges };

const options = {

  interaction: {
    hover: true
  },

  nodes: {
    shape: 'box',

    color: {
      background: '#cccccc',
      border: '#2e81ff',

      highlight: {
        background: '#ffff99',
        border: '#2e81ff'
      }
    },

    font: {
      color: '#000000',
      size: 18,
      face: 'arial',
      vadjust: 0
    },

    margin: 10
  },

  edges: {
    arrows: {
      middle: {
        enabled: false,
        scaleFactor: 0.75
      }
    }
  },

  physics: {
    solver: 'barnesHut',

    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 200,
      springConstant: 0.06,
      damping: 0.3,
      avoidOverlap: 1
    },

    stabilization: {
      enabled: true,
      iterations: 250,
      updateInterval: 25
    }
  }
};


const network = new vis.Network(container, data, options);


// CLICK ON NODE TO OPEN PDF

network.on("click", function (params) {

  if (params.nodes.length > 0) {

    const node = nodes.get(params.nodes[0]);

    if (node.url) {
      window.open(node.url, "_blank");
    }

  }

});
