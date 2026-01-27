import { DiagramData, ShapeType, LineStyle, DiagramNode, DiagramEdge } from '../types';

export const generateMermaidCode = (diagram: DiagramData): string => {
  let code = 'graph TD\n';
  code += `  %% Styles \n`;

  // Generate Nodes
  diagram.nodes.forEach((node) => {
    let shapeStart = '[';
    let shapeEnd = ']';
    let label = node.text.replace(/"/g, "'");

    // Map internal types to Mermaid node shapes
    switch (node.type) {
      case ShapeType.Rounded: shapeStart = '('; shapeEnd = ')'; break;
      case ShapeType.Circle: shapeStart = '(('; shapeEnd = '))'; break;
      case ShapeType.Diamond:
      case ShapeType.Rhombus: shapeStart = '{'; shapeEnd = '}'; break;
      case ShapeType.Switch: shapeStart = '{{'; shapeEnd = '}}'; break; // Hexagon
      case ShapeType.Cylinder: shapeStart = '[('; shapeEnd = ')]'; break;
      case ShapeType.Loop: shapeStart = 'subgraph'; shapeEnd = 'end'; break; // Special handling below
      case ShapeType.User: shapeStart = '(['; shapeEnd = '])'; break; // Stadium
      case ShapeType.Class: 
          if (node.classProperties && node.classProperties.length > 0) {
              const props = node.classProperties.map(p => `${p.isMandatory ? '+' : '-'} ${p.name}: ${p.type}`).join('<br/>');
              label = `<b>${label}</b><br/>-----------------<br/>${props}`;
          }
          break;
      case ShapeType.Table:
          // Simulate a table with HTML in node label if supported, or just text representation
          if (node.tableData) {
              // Basic text align for simple mermaid rendering without heavy HTML injection which might break some renderers
              const headers = node.tableData.headers.join(' | ');
              const separator = node.tableData.headers.map(() => '---').join('|');
              const rows = node.tableData.rows.map(r => r.join(' | ')).join('<br/>');
              label = `<b>${label}</b><br/>${headers}<br/>${separator}<br/>${rows}`;
          }
          shapeStart = '['; shapeEnd = ']';
          break;
    }

    const nodeId = node.id.replace(/-/g, '_');

    if (node.type === ShapeType.Loop) {
       // Loop logic handled slightly differently or just a node
       // For simple visual correspondence in flowchart:
       code += `  ${nodeId}{{${label}}}\n`;
    } else {
       code += `  ${nodeId}${shapeStart}"${label}"${shapeEnd}\n`;
    }

    if (node.url) {
        code += `  click ${nodeId} "${node.url}" "Tooltip"\n`;
    }
    
    const styleStr = `fill:${node.style.backgroundColor},stroke:${node.style.borderColor},stroke-width:${node.style.borderWidth}px,color:${node.style.textColor},stroke-dasharray:${node.style.borderStyle === LineStyle.Dashed ? '5 5' : node.style.borderStyle === LineStyle.Dotted ? '2 2' : '0'}`;
    code += `  style ${nodeId} ${styleStr}\n`;
  });

  // Generate Edges
  diagram.edges.forEach((edge) => {
    const src = edge.source.replace(/-/g, '_');
    const trg = edge.target.replace(/-/g, '_');
    
    // Markers
    let startChar = '';
    if (edge.style.markerStart === 'arrow') startChar = '<';
    else if (edge.style.markerStart === 'circle') startChar = 'o';
    else if (edge.style.markerStart === 'square') startChar = 'x';

    let endChar = '';
    if (edge.style.markerEnd === 'arrow') endChar = '>';
    else if (edge.style.markerEnd === 'circle') endChar = 'o';
    else if (edge.style.markerEnd === 'square') endChar = 'x';

    let link = '';
    if (edge.style.strokeWidth > 2) {
        link = (startChar || '') + '==' + (endChar || '='); 
    } else if (edge.style.lineStyle !== LineStyle.Solid) {
        link = (startChar || '') + '-.' + (endChar || '-');
    } else {
        if (!startChar && !endChar) link = '---';
        else link = (startChar || '-') + '-' + (endChar || '-');
    }

    const text = edge.text ? `|${edge.text}|` : '';
    code += `  ${src} ${link} ${text} ${trg}\n`;
    code += `  linkStyle ${diagram.edges.indexOf(edge)} stroke:${edge.style.strokeColor},stroke-width:${edge.style.strokeWidth}px\n`;
  });

  return code;
};

export const parseMermaidCode = (code: string): Partial<DiagramData> | null => {
    // A very basic parser for "graph TD", "node[text]", "A --> B"
    // This is a simplified best-effort parser.
    try {
        const lines = code.split('\n');
        const nodes: DiagramNode[] = [];
        const edges: DiagramEdge[] = [];
        const nodeMap = new Map<string, DiagramNode>();

        let xCounter = 50;
        let yCounter = 50;

        lines.forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('graph') || line.startsWith('%%') || line.startsWith('style') || line.startsWith('linkStyle') || line.startsWith('click')) return;

            // Match Edges: A --> B, A -.->|text| B
            const edgeMatch = line.match(/^([a-zA-Z0-9_]+)\s?([-=.o<x]+)(?:\|(.+)\|)?\s?([a-zA-Z0-9_]+)$/);
            if (edgeMatch) {
                const [, src, link, text, trg] = edgeMatch;
                edges.push({
                    id: Math.random().toString(36).substr(2, 9),
                    source: src,
                    target: trg,
                    text: text || '',
                    style: {
                        strokeColor: '#71717a',
                        strokeWidth: link.includes('=') ? 4 : 2,
                        lineStyle: link.includes('.') ? LineStyle.Dashed : LineStyle.Solid,
                        curve: true,
                        routing: 'default',
                        markerStart: link.startsWith('<') ? 'arrow' : link.startsWith('o') ? 'circle' : 'none',
                        markerEnd: link.endsWith('>') ? 'arrow' : link.endsWith('o') ? 'circle' : 'none',
                    }
                });
                
                // Ensure nodes exist if defined only in edge
                [src, trg].forEach(nid => {
                    if (!nodeMap.has(nid)) {
                         const newNode: DiagramNode = {
                            id: nid,
                            type: ShapeType.Rectangle,
                            x: xCounter,
                            y: yCounter,
                            width: 140, height: 70,
                            text: nid,
                            style: { backgroundColor: '#1f2937', borderColor: '#10b981', borderWidth: 2, textColor: '#fff', fontSize: 14, borderStyle: LineStyle.Solid, opacity: 1, shadow: true }
                        };
                        nodes.push(newNode);
                        nodeMap.set(nid, newNode);
                        xCounter += 160;
                        if (xCounter > 800) { xCounter = 50; yCounter += 120; }
                    }
                });
                return;
            }

            // Match Nodes: ID[Text], ID((Text))
            // Simplistic regex for braces
            const nodeMatch = line.match(/^([a-zA-Z0-9_]+)(\[|\(|\{\{|\(\(|\[\()(.+)(\]|\)|\}\}|\)\)|\]\))$/);
            if (nodeMatch) {
                const [, id, open, text, close] = nodeMatch;
                let type = ShapeType.Rectangle;
                if (open === '(') type = ShapeType.Rounded;
                if (open === '((') type = ShapeType.Circle;
                if (open === '{') type = ShapeType.Diamond;
                if (open === '{{') type = ShapeType.Switch; // Approximation
                if (open === '[(') type = ShapeType.Cylinder;
                if (open === '([') type = ShapeType.User;

                if (!nodeMap.has(id)) {
                     const newNode: DiagramNode = {
                        id,
                        type,
                        x: xCounter,
                        y: yCounter,
                        width: type === ShapeType.Diamond ? 100 : 140,
                        height: type === ShapeType.Diamond ? 100 : 70,
                        text: text.replace(/"/g, ''),
                        style: { backgroundColor: '#1f2937', borderColor: '#10b981', borderWidth: 2, textColor: '#fff', fontSize: 14, borderStyle: LineStyle.Solid, opacity: 1, shadow: true }
                    };
                    nodes.push(newNode);
                    nodeMap.set(id, newNode);
                    xCounter += 160;
                    if (xCounter > 800) { xCounter = 50; yCounter += 120; }
                } else {
                    // Update existing (from edge creation)
                    const n = nodeMap.get(id)!;
                    n.type = type;
                    n.text = text.replace(/"/g, '');
                }
            }
        });

        return { nodes, edges };
    } catch (e) {
        console.error("Parse Error", e);
        return null;
    }
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};