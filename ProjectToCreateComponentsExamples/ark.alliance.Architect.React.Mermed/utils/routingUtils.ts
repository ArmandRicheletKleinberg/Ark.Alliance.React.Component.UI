import { DiagramNode, HandleType } from '../types';

interface Point { x: number; y: number; }
interface Rect { left: number; top: number; right: number; bottom: number; }

// Configuration
const GRID_MARGIN = 20; // Space around nodes to create routing channels
const BUFFER = 10; // Extra buffer for collision check

const getRect = (node: DiagramNode): Rect => ({
  left: node.x,
  top: node.y,
  right: node.x + node.width,
  bottom: node.y + node.height,
});

const inflateRect = (rect: Rect, amount: number): Rect => ({
  left: rect.left - amount,
  top: rect.top - amount,
  right: rect.right + amount,
  bottom: rect.bottom + amount,
});

// A* Node for Grid Routing
interface GraphNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent?: GraphNode;
}

// Check if a point is inside any inflated node rect
const isBlocked = (x: number, y: number, nodes: DiagramNode[], excludeIds: string[]): boolean => {
  for (const node of nodes) {
    if (excludeIds.includes(node.id)) continue;
    const r = inflateRect(getRect(node), BUFFER);
    if (x > r.left && x < r.right && y > r.top && y < r.bottom) return true;
  }
  return false;
};

// Generate interesting grid lines based on nodes and start/end points
const generateGrid = (start: Point, end: Point, nodes: DiagramNode[]): { xLines: number[], yLines: number[] } => {
  const xSet = new Set<number>();
  const ySet = new Set<number>();

  const add = (p: Point) => { xSet.add(Math.floor(p.x)); ySet.add(Math.floor(p.y)); };

  add(start);
  add(end);

  nodes.forEach(node => {
    const r = inflateRect(getRect(node), GRID_MARGIN);
    xSet.add(Math.floor(r.left));
    xSet.add(Math.floor(r.right));
    ySet.add(Math.floor(r.top));
    ySet.add(Math.floor(r.bottom));
  });

  const sortNum = (a: number, b: number) => a - b;
  return {
    xLines: Array.from(xSet).sort(sortNum),
    yLines: Array.from(ySet).sort(sortNum),
  };
};

// Heuristic: Manhattan Distance
const heuristic = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Main A* Pathfinding
const findOrthogonalPath = (start: Point, end: Point, nodes: DiagramNode[], startNodeId: string, endNodeId: string): Point[] => {
  const { xLines, yLines } = generateGrid(start, end, nodes);
  
  // Find grid indices for start and end (nearest)
  // We snap to exact grid lines if possible, or add them if missing (already added in generateGrid)
  
  const openSet: GraphNode[] = [];
  const closedSet = new Set<string>();
  const key = (x: number, y: number) => `${x},${y}`;

  const startNode: GraphNode = { x: start.x, y: start.y, g: 0, h: heuristic(start, end), f: 0 };
  openSet.push(startNode);

  // Safety break
  let iterations = 0;
  const MAX_ITERATIONS = 3000;

  let closestNode: GraphNode = startNode;
  let minH = startNode.h;

  while (openSet.length > 0) {
    iterations++;
    if (iterations > MAX_ITERATIONS) break; // Fallback if no path found

    // Sort by F (lowest first) - simple array sort for simplicity
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    if (current.h < minH) {
        minH = current.h;
        closestNode = current;
    }

    // Goal Check (within small tolerance)
    if (Math.abs(current.x - end.x) < 5 && Math.abs(current.y - end.y) < 5) {
      // Reconstruct
      const path: Point[] = [];
      let temp: GraphNode | undefined = current;
      while (temp) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path;
    }

    closedSet.add(key(current.x, current.y));

    // Neighbors: Up, Down, Left, Right along grid lines
    const xIdx = xLines.indexOf(current.x);
    const yIdx = yLines.indexOf(current.y);

    const neighbors: Point[] = [];
    if (xIdx > 0) neighbors.push({ x: xLines[xIdx - 1], y: current.y });
    if (xIdx < xLines.length - 1) neighbors.push({ x: xLines[xIdx + 1], y: current.y });
    if (yIdx > 0) neighbors.push({ x: current.x, y: yLines[yIdx - 1] });
    if (yIdx < yLines.length - 1) neighbors.push({ x: current.x, y: yLines[yIdx + 1] });

    for (const neighbor of neighbors) {
      if (closedSet.has(key(neighbor.x, neighbor.y))) continue;

      // Check collision on segment
      // Simplified: check midpoint
      const midX = (current.x + neighbor.x) / 2;
      const midY = (current.y + neighbor.y) / 2;
      
      // If passing through a node that is NOT start or end, penalize heavily or block
      if (isBlocked(midX, midY, nodes, [startNodeId, endNodeId])) continue;

      const gScore = current.g + heuristic(current, neighbor);
      
      const existing = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
      if (existing && gScore >= existing.g) continue;

      const neighborNode: GraphNode = {
        x: neighbor.x,
        y: neighbor.y,
        g: gScore,
        h: heuristic(neighbor, end),
        f: gScore + heuristic(neighbor, end),
        parent: current
      };

      if (!existing) openSet.push(neighborNode);
      else {
          existing.g = gScore;
          existing.f = neighborNode.f;
          existing.parent = current;
      }
    }
  }
  
  // Fallback: Direct line if A* fails
  return [start, end];
};

const getControlPoint = (p1: Point, p2: Point, p3: Point, radius: number): string => {
   // Create a quadratic bezier curve for the corner
   // We need to shorten the lines p1-p2 and p2-p3 by radius
   const d1 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
   const d2 = Math.hypot(p3.x - p2.x, p3.y - p2.y);

   const r = Math.min(radius, d1/2, d2/2);
   
   if (r < 1) return `L ${p2.x} ${p2.y}`; // Too small to round

   // Point on p1-p2
   const f1 = (d1 - r) / d1;
   const x1 = p1.x + (p2.x - p1.x) * f1;
   const y1 = p1.y + (p2.y - p1.y) * f1;

   // Point on p2-p3
   const f2 = r / d2;
   const x2 = p2.x + (p3.x - p2.x) * f2;
   const y2 = p2.y + (p3.y - p2.y) * f2;

   return `L ${x1} ${y1} Q ${p2.x} ${p2.y} ${x2} ${y2}`;
};

export const getSmartEdgePath = (
  start: Point, 
  end: Point, 
  sourceNode: DiagramNode, 
  targetNode: DiagramNode, 
  sourceHandle: HandleType | undefined,
  targetHandle: HandleType | undefined,
  nodes: DiagramNode[],
  routingType: 'default' | 'orthogonal',
  curve: boolean // If orthogonal: rounded corners? If default: bezier vs straight?
): string => {

  if (routingType === 'default') {
    // Legacy / Direct Routing
    if (curve) {
        let cp1x = start.x, cp1y = start.y, cp2x = end.x, cp2y = end.y;
        const dist = Math.hypot(end.x - start.x, end.y - start.y) * 0.5;

        if (sourceHandle === 'top') cp1y -= dist;
        if (sourceHandle === 'bottom') cp1y += dist;
        if (sourceHandle === 'left') cp1x -= dist;
        if (sourceHandle === 'right') cp1x += dist;
        
        if (targetHandle === 'top') cp2y -= dist;
        if (targetHandle === 'bottom') cp2y += dist;
        if (targetHandle === 'left') cp2x -= dist;
        if (targetHandle === 'right') cp2x += dist;

        if (!sourceHandle) cp1x = start.x + (end.x - start.x)/2;
        
        return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
    } else {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
  }

  // Orthogonal Smart Routing
  // 1. Calculate Start/End Offset Points based on Handles to ensure leaving in correct direction
  const offset = 20;
  const startOff = { ...start };
  const endOff = { ...end };

  if (sourceHandle === 'top') startOff.y -= offset;
  else if (sourceHandle === 'bottom') startOff.y += offset;
  else if (sourceHandle === 'left') startOff.x -= offset;
  else if (sourceHandle === 'right') startOff.x += offset;

  if (targetHandle === 'top') endOff.y -= offset;
  else if (targetHandle === 'bottom') endOff.y += offset;
  else if (targetHandle === 'left') endOff.x -= offset;
  else if (targetHandle === 'right') endOff.x += offset;

  // 2. Find path
  const rawPoints = findOrthogonalPath(startOff, endOff, nodes, sourceNode.id, targetNode.id);
  
  // 3. Prepend actual start, Append actual end
  const points = [start, ...rawPoints, end];

  // 4. Smooth or Straighten
  let d = `M ${points[0].x} ${points[0].y}`;
  
  if (curve) {
    // Rounded Corners
    for (let i = 1; i < points.length - 1; i++) {
        const pPrev = points[i-1];
        const pCurr = points[i];
        const pNext = points[i+1];
        d += " " + getControlPoint(pPrev, pCurr, pNext, 10);
    }
    d += ` L ${points[points.length-1].x} ${points[points.length-1].y}`;
  } else {
    // Sharp Corners
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  return d;
};
