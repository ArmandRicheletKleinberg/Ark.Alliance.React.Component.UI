
import React, { useState, useRef, useEffect } from 'react';
import { AppState, DiagramData, DiagramNode, DiagramEdge, ShapeType, LineStyle, MarkerType, HandleType, ChatMessage, ClassProperty } from './types';
import { generateRandomId, generateMermaidCode, parseMermaidCode } from './utils/mermaidUtils';
import { getSmartEdgePath } from './utils/routingUtils';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { AIChat } from './components/AIChat';
import { searchAndAssist } from './services/geminiService';
import { Download, Upload, ArrowLeft, Code, Undo2, Redo2, FileText, Maximize2, User, Server, Smartphone, Waves, Brain, Save, FolderOpen, Sparkles, X, Plus, Paperclip, Send, Settings, RefreshCw, Eye, EyeOff, Play, Folder, Mail, CheckCircle2, RotateCcw, AlertCircle, Info, CreditCard, DollarSign, Calendar, LayoutDashboard, FileSignature, DatabaseZap, PlayCircle, GitCompare, ArrowRight, BrainCircuit } from 'lucide-react';

const INITIAL_DIAGRAM_ID = 'root';
const INITIAL_STATE: AppState = {
  currentDiagramId: INITIAL_DIAGRAM_ID,
  diagrams: {
    [INITIAL_DIAGRAM_ID]: {
      id: INITIAL_DIAGRAM_ID,
      parentId: null,
      name: 'Main Diagram',
      nodes: [],
      edges: []
    }
  }
};

const App: React.FC = () => {
  // --- State ---
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [history, setHistory] = useState<AppState[]>([INITIAL_STATE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  
  // AI Context Menu
  const [activeAIContextNodeId, setActiveAIContextNodeId] = useState<string | null>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiMenuMode, setAiMenuMode] = useState<'quick' | 'file'>('quick');
  const [aiFileContent, setAiFileContent] = useState<string | null>(null);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  
  // Connecting state
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [connectingHandle, setConnectingHandle] = useState<HandleType | undefined>(undefined);
  
  // Resizing state
  const [resizingNodeId, setResizingNodeId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{w: number, h: number, x: number, y: number} | null>(null);

  const [showMermaidCode, setShowMermaidCode] = useState(false);
  const [mermaidInput, setMermaidInput] = useState('');
  const [showMermaidImport, setShowMermaidImport] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextFileInputRef = useRef<HTMLInputElement>(null);

  const currentDiagram = appState.diagrams[appState.currentDiagramId];
  const selectedNode = currentDiagram.nodes.find(n => n.id === selectedNodeId) || null;
  const selectedEdge = currentDiagram.edges.find(e => e.id === selectedEdgeId) || null;

  // --- History ---
  const pushToHistory = (newState: AppState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateCurrentDiagram = (updates: Partial<DiagramData>, pushHistory = true) => {
    const currentDiag = appState.diagrams[appState.currentDiagramId];
    if (!currentDiag) return;
    const newDiagram = { ...currentDiag, ...updates };
    const newState = {
        ...appState,
        diagrams: { ...appState.diagrams, [appState.currentDiagramId]: newDiagram }
    };
    setAppState(newState);
    if (pushHistory) pushToHistory(newState);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAppState(history[historyIndex - 1]);
      setSelectedNodeId(null); 
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAppState(history[historyIndex + 1]);
      setSelectedNodeId(null);
    }
  };

  const handleDelete = () => {
      if (selectedNodeId) {
          updateCurrentDiagram({ 
              nodes: currentDiagram.nodes.filter(n => n.id !== selectedNodeId && n.parentId !== selectedNodeId), 
              edges: currentDiagram.edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId) 
          });
          setSelectedNodeId(null);
      } else if (selectedEdgeId) {
          updateCurrentDiagram({ edges: currentDiagram.edges.filter(e => e.id !== selectedEdgeId) });
          setSelectedEdgeId(null);
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? handleRedo() : handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } 
      // Delete
      else if (e.key === 'Delete' || e.key === 'Backspace') {
          // Don't delete if user is typing in an input
          if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
          handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedNodeId, selectedEdgeId]);

  // --- LOGIC: Form Data Handling ---
  const handleFormFieldChange = (nodeId: string, fieldId: string, value: string) => {
      const node = currentDiagram.nodes.find(n => n.id === nodeId);
      if (!node || !node.ioData?.formFields) return;

      const newFields = node.ioData.formFields.map(f => 
          f.id === fieldId ? { ...f, value } : f
      );

      const newNode = { ...node, ioData: { ...node.ioData, formFields: newFields } };
      // Update without pushing to history for every keystroke to avoid spamming undo stack
      setAppState(prev => {
        const currentDiag = prev.diagrams[prev.currentDiagramId];
        const newDiagram = { 
            ...currentDiag, 
            nodes: currentDiag.nodes.map(n => n.id === nodeId ? newNode : n) 
        };
        return {
            ...prev,
            diagrams: { ...prev.diagrams, [prev.currentDiagramId]: newDiagram }
        };
      });
  };

  // --- LOGIC: Parse Filename Pattern ---
  const parseFileName = (pattern: string, node: DiagramNode): string => {
      let fileName = pattern;
      const today = new Date();
      
      // Regex for {Today(Format)}
      fileName = fileName.replace(/\{Today\(([^)]+)\)\}/g, (match, format) => {
          let dateStr = "";
          // Very basic format replacement
          const year = today.getFullYear();
          const month = (today.getMonth() + 1).toString().padStart(2, '0');
          const day = today.getDate().toString().padStart(2, '0');
          const hour = today.getHours().toString().padStart(2, '0');
          const minute = today.getMinutes().toString().padStart(2, '0');
          const second = today.getSeconds().toString().padStart(2, '0');

          if (format.includes('DDMMYY')) return `${day}${month}${year.toString().slice(-2)}`;
          if (format.includes('YYYY-MM-DD')) return `${year}-${month}-${day}`;
          
          // Generic simple fallback replacement
          dateStr = format.replace('YYYY', year.toString())
                          .replace('YY', year.toString().slice(-2))
                          .replace('MM', month)
                          .replace('DD', day)
                          .replace('HH', hour)
                          .replace('mm', minute)
                          .replace('ss', second);
          return dateStr;
      });

      // Replace {ID} or {Text}
      fileName = fileName.replace(/\{ID\}/g, node.id).replace(/\{Text\}/g, node.text);

      return fileName;
  };

  // --- LOGIC: Trigger File Download ---
  const triggerFileDownload = (data: any, wfNode: DiagramNode, sourceNode: DiagramNode) => {
      if (!wfNode.writeFileData) return;
      
      const fileName = parseFileName(wfNode.writeFileData.fileNamePattern, sourceNode);
      const fullFileName = `${fileName}.${wfNode.writeFileData.fileExtension}`;
      const fileContent = JSON.stringify(data, null, 2);
      
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  // --- LOGIC: Simulate Button Event & Mapping & AI Chain ---
  const handleSimulateEvent = (e: React.MouseEvent, node: DiagramNode) => {
      e.stopPropagation();
      if (node.type !== ShapeType.Button || !node.buttonData?.targetNodeId) {
          if (node.type === ShapeType.Button) alert("No target configured for this button.");
          return;
      }

      const targetId = node.buttonData.targetNodeId;
      const targetNode = currentDiagram.nodes.find(n => n.id === targetId);
      const eventName = node.buttonData.eventName || 'event';

      if (!targetNode) {
          alert(`Target component (ID: ${targetId}) not found.`);
          return;
      }

      // --- SCENARIO: Trigger AI Agent ---
      if (targetNode.type === ShapeType.AI) {
          const aiConfig = targetNode.aiData;
          if (!aiConfig) {
              alert("AI Node Configuration missing.");
              return;
          }

          // 1. Fetch Input Data (ReadDB)
          let inputContext = "No input source linked.";
          let dbSourceDetails = "";
          
          if (aiConfig.inputSourceNodeId) {
              const sourceNode = currentDiagram.nodes.find(n => n.id === aiConfig.inputSourceNodeId);
              if (sourceNode?.type === ShapeType.ReadDatabase) {
                  dbSourceDetails = `\n[DB Source: ${sourceNode.text}]\nSQL: ${sourceNode.readDatabaseData?.sqlQuery}`;
                  inputContext = JSON.stringify([
                      { id: 101, name: "Sample Item A", status: "pending", value: 500 },
                      { id: 102, name: "Sample Item B", status: "active", value: 1200 }
                  ], null, 2);
              } else if (sourceNode?.type === ShapeType.Table) {
                  dbSourceDetails = `\n[Table Source: ${sourceNode.text}]`;
                  inputContext = JSON.stringify(sourceNode.tableData?.rows || [], null, 2);
              }
          }

          // 2. Prepare Output Schema (Class)
          let outputSchemaPrompt = "";
          let schemaDetails = "";
          if (aiConfig.outputSchemaClassId) {
              const classNode = currentDiagram.nodes.find(n => n.id === aiConfig.outputSchemaClassId);
              if (classNode?.classProperties) {
                  const props = classNode.classProperties.map(p => `${p.name} (${p.type})`).join(", ");
                  outputSchemaPrompt = `\nOUTPUT REQUIREMENT: Respond ONLY with a valid JSON object matching this schema: { ${props} }`;
                  schemaDetails = `\n[Output Schema: ${classNode.text}]\nFields: ${props}`;
              }
          }

          // 3. Construct Final Prompt (Simulation)
          const finalUserPrompt = aiConfig.userPrompt?.replace('{{data}}', inputContext) || `Analyze this data: ${inputContext}`;
          
          const simulationLog = `
--- AI AGENT SIMULATION ---
Endpoint: ${aiConfig.endpoint || 'Default'}
Model: ${aiConfig.model || 'gpt-4'}
Temp: ${aiConfig.temperature} | MaxTokens: ${aiConfig.maxTokens}

--- INPUT ---
${dbSourceDetails}
Data Context: ${inputContext.substring(0, 100)}...

--- PROMPT ---
System: ${aiConfig.systemPrompt || 'N/A'}
User: ${finalUserPrompt}
${outputSchemaPrompt}
`;
          console.log(simulationLog);

          // 4. Generate Mock Response (Based on Schema if present)
          const mockResponse = aiConfig.outputSchemaClassId 
              ? { summary: "AI Analysis Result", count: 2, recommendation: "Approve", details: "Generated based on input." }
              : { response: "This is a raw text response from the AI model based on your input." };

          alert(`${simulationLog}\n\n--- AI OUTPUT ---\n${JSON.stringify(mockResponse, null, 2)}`);

          // 5. Handle AI Outputs (Write File)
          const outgoingEdges = currentDiagram.edges.filter(edge => edge.source === targetNode.id);
          outgoingEdges.forEach(edge => {
              const outputNode = currentDiagram.nodes.find(n => n.id === edge.target);
              if (outputNode?.type === ShapeType.WriteFile) {
                  triggerFileDownload(mockResponse, outputNode, targetNode);
              } else if (outputNode?.type === ShapeType.Screen) {
                  // Visual update for screen (mock)
                  alert(`[Screen Update] Displaying AI Output on '${outputNode.text}'`);
              }
          });

      } 
      // --- SCENARIO: Read Database ---
      else if (targetNode.type === ShapeType.ReadDatabase) {
          alert(`[Event: ${eventName}]\nExecuting SQL on '${targetNode.text}'...\n\nQuery: ${targetNode.readDatabaseData?.sqlQuery || 'SELECT *...'}\n\nResult: [JSON Data Returned]`);
      } 
      // --- SCENARIO: Mapper ---
      else if (targetNode.type === ShapeType.Mapper) {
          const rules = targetNode.mapperData?.rules || [];
          const src = targetNode.mapperData?.queryOrTable || 'Source';
          const references = targetNode.mapperData?.referenceNodeIds || [];
          
          // Build simulated Output Object
          const outputObj: Record<string, any> = {};
          
          rules.forEach(rule => {
              if (rule.targetField) {
                  let value = `[${rule.sourceField}]`; // Default
                  
                  if (rule.isExpression && rule.expression) {
                      let expr = rule.expression;
                      // 1. Detect Table Reference Syntax: @TableName.Get(...).Col
                      // Very basic regex simulation
                      expr = expr.replace(/@([a-zA-Z0-9_]+)\.Get\((.*?)\)\.([a-zA-Z0-9_]+)/g, (match, tableName, filter, colName) => {
                          // Find table node
                          const refTable = currentDiagram.nodes.find(n => n.type === ShapeType.Table && n.text === tableName);
                          if (refTable && refTable.tableData) {
                              // Simulate finding value (Just pick first row for demo)
                              const colIdx = refTable.tableData.headers.indexOf(colName);
                              if (colIdx > -1 && refTable.tableData.rows.length > 0) {
                                  return `'${refTable.tableData.rows[0][colIdx]}'`; // Simulated found value
                              }
                              return `'[${colName} Not Found]'`;
                          }
                          return `'[Table ${tableName} Not Found]'`;
                      });
                      
                      // 2. Simple replace 'src.Field'
                      expr = expr.replace(/src\.([a-zA-Z0-9_]+)/g, `[Value of $1]`);
                      
                      value = `ExprResult<${expr}>`;
                  }
                  
                  outputObj[rule.targetField] = value;
              }
          });

          const outputJson = JSON.stringify(outputObj, null, 2);
          alert(`[Event: ${eventName}]\nMapping Data via '${targetNode.text}'...\n\nSource: ${src}\nReferences: ${references.length} tables\n\nOutput:\n${outputJson}`);
      } else {
          alert(`[Event: ${eventName}]\nTriggered ${targetNode.text}.`);
      }
  };

  // --- LOGIC: Sync to Database (Class Node) AND/OR Write File ---
  const handleSyncData = (e: React.MouseEvent, sourceNode: DiagramNode) => {
      e.stopPropagation();
      
      // --- LOGIC 1: WRITE FILE CHECK ---
      // Check if sourceNode is connected to a WriteFile node
      const outgoingEdges = currentDiagram.edges.filter(edge => edge.source === sourceNode.id);
      const connectedWriteFileNodes = outgoingEdges
          .map(edge => currentDiagram.nodes.find(n => n.id === edge.target))
          .filter(n => n?.type === ShapeType.WriteFile);

      if (connectedWriteFileNodes.length > 0) {
          // Prepare data
          const dataToSave = sourceNode.type === ShapeType.Form 
              ? sourceNode.ioData?.formFields?.reduce((acc: any, f) => { acc[f.label] = f.value; return acc; }, {})
              : { info: "No form data" };

          connectedWriteFileNodes.forEach(wfNode => {
              if (wfNode) triggerFileDownload(dataToSave, wfNode, sourceNode);
          });
      }

      // --- LOGIC 2: DATABASE SYNC (CLASS GENERATION) ---
      
      const tableName = sourceNode.type === ShapeType.Panel 
          ? sourceNode.panelData?.tableName 
          : sourceNode.ioData?.targetDbTableName;

      const sourceFields = sourceNode.type === ShapeType.Panel
          ? sourceNode.panelData?.fields
          : sourceNode.ioData?.formFields;

      // Only proceed with DB sync if table name is present
      if (tableName && sourceFields && sourceFields.length > 0) {
          // 1. Find existing class node with this name (case insensitive check)
          let classNode = currentDiagram.nodes.find(n => n.type === ShapeType.Class && n.text.toLowerCase() === tableName.toLowerCase());
          let isNew = false;
          
          // 2. If not found, create it
          if (!classNode) {
              isNew = true;
              const newNodeId = generateRandomId();
              classNode = {
                  id: newNodeId,
                  type: ShapeType.Class,
                  x: sourceNode.x + sourceNode.width + 100,
                  y: sourceNode.y,
                  width: 160,
                  height: 140,
                  text: tableName, // Use the name from the panel/form
                  classProperties: [],
                  style: {
                      backgroundColor: '#1f2937',
                      borderColor: '#10b981',
                      borderWidth: 2,
                      textColor: '#ffffff',
                      fontSize: 14,
                      borderStyle: LineStyle.Solid,
                      opacity: 1,
                      shadow: true
                  }
              };
          }

          // 3. Merge Properties
          const currentProps = classNode.classProperties || [];
          const newProps: ClassProperty[] = [...currentProps];

          sourceFields.forEach(field => {
              const exists = newProps.find(p => p.name.toLowerCase() === field.label.toLowerCase());
              if (!exists) {
                  // Map types
                  let type = 'String';
                  if (field.type === 'checkbox') type = 'Boolean';
                  else if (field.type === 'integer') type = 'Integer';
                  else if (field.type === 'decimal' || field.type === 'currency') type = 'Float';
                  else if (field.type === 'date') type = 'Date';

                  newProps.push({
                      id: generateRandomId(),
                      name: field.label,
                      type: type,
                      isMandatory: false
                  });
              }
          });

          const updatedClassNode = { ...classNode, classProperties: newProps };

          // 4. Update Diagram
          let newNodes = [...currentDiagram.nodes];
          let newEdges = [...currentDiagram.edges];

          if (isNew) {
              newNodes.push(updatedClassNode);
              // Auto link
              const edgeId = generateRandomId();
              newEdges.push({
                  id: edgeId,
                  source: sourceNode.id,
                  target: updatedClassNode.id,
                  text: sourceNode.type === ShapeType.Form ? 'writes to' : 'reads from',
                  style: {
                      strokeColor: '#34d399',
                      strokeWidth: 2,
                      lineStyle: LineStyle.Dashed,
                      curve: true,
                      routing: 'default',
                      markerStart: 'none',
                      markerEnd: 'arrow',
                      animated: true
                  }
              });
          } else {
              newNodes = newNodes.map(n => n.id === updatedClassNode!.id ? updatedClassNode! : n);
              // Check if edge exists
              const edgeExists = newEdges.some(e => 
                  (e.source === sourceNode.id && e.target === updatedClassNode!.id) ||
                  (e.target === sourceNode.id && e.source === updatedClassNode!.id)
              );
              if (!edgeExists) {
                   newEdges.push({
                      id: generateRandomId(),
                      source: sourceNode.id,
                      target: updatedClassNode!.id,
                      text: sourceNode.type === ShapeType.Form ? 'writes to' : 'reads from',
                      style: {
                          strokeColor: '#34d399',
                          strokeWidth: 2,
                          lineStyle: LineStyle.Dashed,
                          curve: true,
                          routing: 'default',
                          markerStart: 'none',
                          markerEnd: 'arrow',
                          animated: true
                      }
                  });
              }
          }

          updateCurrentDiagram({ nodes: newNodes, edges: newEdges });
      } else if (!connectedWriteFileNodes.length) {
          // Only alert if neither action happened
          alert("Please define a Table Name to sync to DB, or connect a WriteFile node.");
      }
  };


  // --- File Operations ---
  const handleSaveJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDiagram));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "diagram.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleLoadJSONClick = () => {
      if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const importedDiagram = JSON.parse(event.target?.result as string);
              if (importedDiagram && importedDiagram.nodes && importedDiagram.edges) {
                  updateCurrentDiagram(importedDiagram);
              } else {
                  alert("Invalid JSON format");
              }
          } catch (err) {
              alert("Error parsing JSON");
          }
      };
      reader.readAsText(file);
      // Reset input
      e.target.value = '';
  };

  // --- Geometry ---
  const getHandlePosition = (node: DiagramNode, handle?: HandleType) => {
    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    if (!handle) return { x: cx, y: cy };
    switch(handle) {
        case 'top': return { x: cx, y: node.y };
        case 'right': return { x: node.x + node.width, y: cy };
        case 'bottom': return { x: cx, y: node.y + node.height };
        case 'left': return { x: node.x, y: cy };
    }
    return { x: cx, y: cy };
  };

  // --- Actions ---
  const handleAddNode = (type: ShapeType, x: number, y: number) => {
    const isDecision = type === ShapeType.Diamond;
    const isSwitch = type === ShapeType.Switch;
    const isLoop = type === ShapeType.Loop;
    const isClass = type === ShapeType.Class;
    const isTable = type === ShapeType.Table;
    
    // Check if dropped inside a loop
    let parentId = null;
    const loop = currentDiagram.nodes.find(n => 
        n.type === ShapeType.Loop && 
        x >= n.x && x <= n.x + n.width && 
        y >= n.y && y <= n.y + n.height
    );
    if (loop) parentId = loop.id;

    // Default Dimensions based on type
    let width = 140; 
    let height = 70;
    if (isDecision || isSwitch) { width = 100; height = 100; }
    if (isLoop) { width = 200; height = 150; }
    if (isClass) { width = 160; height = 140; }
    if (isTable) { width = 220; height = 160; }
    if (type === ShapeType.User || type === ShapeType.Mobile || type === ShapeType.AI) { width = 80; height = 80; }
    // Dashboard types
    if (type === ShapeType.KPI) { width = 160; height = 100; }
    if (type === ShapeType.Gauge) { width = 140; height = 100; }
    if (type === ShapeType.LineChart || type === ShapeType.BarChart) { width = 240; height = 160; }
    if (type === ShapeType.Toggle) { width = 80; height = 40; }
    if (type === ShapeType.Timeline) { width = 300; height = 80; }
    // Interface Types
    if (type === ShapeType.Login) { width = 200; height = 180; }
    if (type === ShapeType.Form) { width = 240; height = 320; }
    if (type === ShapeType.Panel) { width = 260; height = 300; }
    if (type === ShapeType.API) { width = 200; height = 150; }
    if (type === ShapeType.Listener) { width = 180; height = 100; }
    if (type === ShapeType.Mail) { width = 180; height = 120; }
    if (type === ShapeType.WriteFile) { width = 160; height = 100; }
    if (type === ShapeType.Cylinder) { width = 140; height = 100; }
    if (type === ShapeType.ReadDatabase) { width = 180; height = 120; }
    if (type === ShapeType.Button) { width = 120; height = 50; }
    if (type === ShapeType.Mapper) { width = 200; height = 160; }

    const newNode: DiagramNode = {
      id: generateRandomId(),
      type,
      x,
      y,
      width,
      height,
      text: isLoop ? 'Loop' : isDecision ? '?' : isClass ? 'Class' : isTable ? 'Table' : type === ShapeType.KPI ? 'Revenue' : type === ShapeType.Gauge ? 'Speed' : type === ShapeType.LineChart ? 'Trend' : type === ShapeType.Login ? 'Login' : type === ShapeType.Panel ? 'Data Panel' : type === ShapeType.API ? 'API Gateway' : type === ShapeType.WriteFile ? 'Save Data' : type === ShapeType.Cylinder ? 'Database' : type === ShapeType.ReadDatabase ? 'Read DB' : type === ShapeType.Button ? 'Action' : type === ShapeType.Mapper ? 'Data Map' : type === ShapeType.AI ? 'AI Agent' : 'Node',
      parentId,
      tableData: isTable ? { 
          headers: ['Col 1', 'Col 2'], 
          rows: [['Data A', 'Data B'], ['Data C', 'Data D']],
          columnWidths: [100, 100] // Default widths
      } : undefined,
      dashboardData: {
          // Defaults
          value: 75,
          referenceValue: 100,
          unit: '%',
          min: 0,
          max: 100,
          colorStart: '#3b82f6',
          colorEnd: '#ef4444',
          checked: true,
          onLabel: 'ON',
          offLabel: 'OFF',
          xAxisLabel: 'Time',
          yAxisLabel: 'Value',
          categories: ['Jan', 'Feb', 'Mar', 'Apr'],
          series: [{ id: 's1', name: 'Series A', color: '#3b82f6', data: [10, 25, 40, 35] }],
          milestones: [{id: 'm1', date: '2024-01-01', title: 'Start'}]
      },
      ioData: {
          formFields: [
              { id: 'f1', label: 'Name', type: 'text', value: '' },
              { id: 'f2', label: 'Active', type: 'checkbox', value: 'false' }
          ],
          formAction: 'save',
          targetDbTableName: 'Users',
          endpoints: [
              { id: 'e1', method: 'GET', url: '/api/users' }
          ],
          directory: '/var/www/uploads',
          filePattern: '*.csv',
          email: 'user@example.com',
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          popHost: 'pop.example.com',
          popPort: 995
      },
      panelData: {
          tableName: 'Orders',
          fields: [
              { id: 'p1', label: 'Status', type: 'checkbox', visualization: 'toggle', value: true },
              { id: 'p2', label: 'Total', type: 'currency', visualization: 'text', value: '1250.00' },
              { id: 'p3', label: 'Progress', type: 'integer', visualization: 'gauge-circ', value: 75 },
              { id: 'p4', label: 'Load', type: 'integer', visualization: 'gauge-vert', value: 45 },
          ]
      },
      writeFileData: {
          fileNamePattern: 'Report_{Today(DDMMYY)}',
          fileExtension: 'json'
      },
      databaseData: type === ShapeType.Cylinder ? {
          dbType: 'sqlserver',
          connectionString: '',
          table: '',
          userId: '',
          password: ''
      } : undefined,
      readDatabaseData: type === ShapeType.ReadDatabase ? {
          sqlQuery: 'SELECT * FROM table'
      } : undefined,
      buttonData: type === ShapeType.Button ? {
          label: 'Trigger',
          eventName: 'readsql data'
      } : undefined,
      mapperData: type === ShapeType.Mapper ? {
          rules: [{id: 'm1', sourceField: 'id', targetField: 'userId', isExpression: false, expression: ''}],
          referenceNodeIds: []
      } : undefined,
      aiData: type === ShapeType.AI ? {
          endpoint: 'https://api.openai.com/v1',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'You are a helpful assistant.',
          userPrompt: 'Analyze: {{data}}'
      } : undefined,
      style: {
        backgroundColor: '#1f2937', 
        borderColor: '#3b82f6', // Blue default
        borderWidth: 2,
        textColor: '#ffffff',
        fontSize: 14,
        borderStyle: LineStyle.Solid,
        opacity: 1,
        shadow: true
      }
    };
    updateCurrentDiagram({ nodes: [...currentDiagram.nodes, newNode] });
  };

  const handleNodeDrag = (id: string, dx: number, dy: number) => {
    setAppState(prev => {
        const diag = prev.diagrams[prev.currentDiagramId];
        const movingNode = diag.nodes.find(n => n.id === id);
        
        let nodesToMove = [id];
        
        // If moving a loop, move its children too
        if (movingNode?.type === ShapeType.Loop) {
             const children = diag.nodes.filter(n => n.parentId === id).map(n => n.id);
             nodesToMove = [...nodesToMove, ...children];
        }

        const newNodes = diag.nodes.map(n => 
            nodesToMove.includes(n.id) 
            ? { ...n, x: Math.max(0, n.x + dx), y: Math.max(0, n.y + dy) } 
            : n
        );
        return {
            ...prev,
            diagrams: {
                ...prev.diagrams,
                [prev.currentDiagramId]: { ...diag, nodes: newNodes }
            }
        };
    });
  };

  const handleNodeDragEnd = (id: string, e: React.MouseEvent) => {
       // Check if dropped inside a loop (re-parenting)
       const rect = canvasRef.current!.getBoundingClientRect();
       const node = currentDiagram.nodes.find(n => n.id === id);
       if (!node) return;

       // Find if center of node is inside a loop
       const cx = node.x + node.width/2;
       const cy = node.y + node.height/2;

       const loop = currentDiagram.nodes.find(n => 
         n.id !== id && 
         n.type === ShapeType.Loop &&
         cx >= n.x && cx <= n.x + n.width &&
         cy >= n.y && cy <= n.y + n.height
       );

       const newParentId = loop ? loop.id : null;
       
       updateCurrentDiagram({
           nodes: currentDiagram.nodes.map(n => n.id === id ? { ...n, parentId: newParentId } : n)
       });
  };

  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResizingNodeId(id);
    setResizeStart({ 
        x: e.clientX, 
        y: e.clientY, 
        w: currentDiagram.nodes.find(n => n.id === id)!.width, 
        h: currentDiagram.nodes.find(n => n.id === id)!.height 
    });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
      if (!resizingNodeId || !resizeStart) return;
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      
      setAppState(prev => {
          const diag = prev.diagrams[prev.currentDiagramId];
          return {
              ...prev,
              diagrams: {
                  ...prev.diagrams,
                  [prev.currentDiagramId]: {
                      ...diag,
                      nodes: diag.nodes.map(n => n.id === resizingNodeId ? 
                          { ...n, width: Math.max(40, resizeStart.w + dx), height: Math.max(40, resizeStart.h + dy) } : n)
                  }
              }
          };
      });
  };

  const handleResizeEnd = () => {
      if (resizingNodeId) {
          updateCurrentDiagram({}, true); // Commit to history
          setResizingNodeId(null);
          setResizeStart(null);
      }
  };

  const startConnection = (e: React.MouseEvent, id: string, handle: HandleType) => {
    e.stopPropagation();
    setConnectingNodeId(id);
    setConnectingHandle(handle);
    setSelectedNodeId(id); 
  };

  const completeConnection = (e: React.MouseEvent, targetId: string, targetHandle: HandleType) => {
      e.stopPropagation();
      if (connectingNodeId && connectingNodeId !== targetId) {
          const newEdge: DiagramEdge = {
            id: generateRandomId(),
            source: connectingNodeId,
            target: targetId,
            sourceHandle: connectingHandle,
            targetHandle: targetHandle,
            text: '',
            style: {
              strokeColor: '#71717a',
              strokeWidth: 2,
              lineStyle: LineStyle.Solid,
              curve: true,
              routing: 'default',
              markerStart: 'none',
              markerEnd: 'arrow',
              markerSize: 10
            }
          };
          updateCurrentDiagram({ edges: [...currentDiagram.edges, newEdge] });
      }
      setConnectingNodeId(null);
      setConnectingHandle(undefined);
  };

  const handleImportMermaid = () => {
      const parsed = parseMermaidCode(mermaidInput);
      if (parsed && parsed.nodes) {
          updateCurrentDiagram({ nodes: parsed.nodes, edges: parsed.edges || [] });
          setShowMermaidImport(false);
      } else {
          alert("Could not parse Mermaid code");
      }
  };

  // --- AI Actions ---
  const handleAIAction = async (action: 'fill' | 'describe' | 'subdiagram' | 'complete') => {
      if (!activeAIContextNodeId) return;
      setIsAIProcessing(true);
      
      const node = currentDiagram.nodes.find(n => n.id === activeAIContextNodeId);
      if (!node) return;

      let prompt = "";
      switch (action) {
          case 'fill':
              if (node.type === ShapeType.Class) prompt = `Analyze the class named '${node.text}' and act as a software architect. Add 3-5 relevant properties (name, type, mandatory flag) to its classProperties list in the diagram JSON.`;
              else if (node.type === ShapeType.Table) prompt = `Analyze the table '${node.text}'. Populate it with 3-4 realistic columns in 'headers' and 3 rows of data in 'rows' inside the tableData object.`;
              else prompt = `Rename the node '${node.text}' to something more descriptive and add a relevant sub-node connected to it if it makes sense contextually.`;
              break;
          case 'describe':
              prompt = `Update the text label of node '${node.text}' to be a concise but descriptive 5-7 word summary of its likely function in this architecture.`;
              break;
          case 'subdiagram':
              prompt = `Create a sub-diagram structure for the node '${node.text}' (ID: ${node.id}). 
                        1. Create a new DiagramNode of type 'loop' or 'process' near it.
                        2. Make sure the new nodes have 'parentId' set to '${node.id}' if it is a container, OR create a link from '${node.id}' to the new flow.
                        3. Add 2-3 child nodes (e.g. Start, Action, End) to illustrate the internal process of '${node.text}'.`;
              break;
          case 'complete':
               prompt = `Look at the node '${node.text}' and its connections. Suggest and create 1-2 new nodes that should logically follow or precede it in this diagram flow. Connect them accordingly.`;
               break;
      }

      try {
          const result = await searchAndAssist(prompt, currentDiagram, []);
          if (result.updatedDiagram) {
              updateCurrentDiagram(result.updatedDiagram);
          }
          setActiveAIContextNodeId(null); 
      } catch (e) {
          console.error(e);
          alert("AI Action Failed");
      } finally {
          setIsAIProcessing(false);
      }
  };

  const handleContextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          if (ev.target?.result) {
              setAiFileContent(ev.target.result as string);
          }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset
  };

  const handleAIFileAction = async () => {
      if (!activeAIContextNodeId || !aiCustomPrompt) return;
      setIsAIProcessing(true);
      
      const node = currentDiagram.nodes.find(n => n.id === activeAIContextNodeId);
      if (!node) return;

      const prompt = `Focusing on the node '${node.text}' (ID: ${node.id}), please: ${aiCustomPrompt}`;

      try {
          const result = await searchAndAssist(prompt, currentDiagram, [], aiFileContent || undefined);
          if (result.updatedDiagram) {
              updateCurrentDiagram(result.updatedDiagram);
          }
          setActiveAIContextNodeId(null);
          setAiMenuMode('quick');
          setAiFileContent(null);
          setAiCustomPrompt('');
      } catch (e) {
          console.error(e);
          alert("AI Processing Failed");
      } finally {
          setIsAIProcessing(false);
      }
  };

  const testApiConnection = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      alert(`Testing connection to: ${url}\n\n(Simulation) Status: 200 OK\nLatency: 45ms`);
  };

  // --- Helpers for Gauge Rendering ---
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
      return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
      };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
  };

  // --- Rendering ---
  const renderEdges = () => {
    return currentDiagram.edges.map(edge => {
      const source = currentDiagram.nodes.find(n => n.id === edge.source);
      const target = currentDiagram.nodes.find(n => n.id === edge.target);
      if (!source || !target) return null;

      const start = getHandlePosition(source, edge.sourceHandle);
      const end = getHandlePosition(target, edge.targetHandle);

      // Fallback center calc if handle missing (legacy)
      if (!edge.sourceHandle) {
          start.x = source.x + source.width/2; 
          start.y = source.y + source.height/2;
      }
      if (!edge.targetHandle) {
          end.x = target.x + target.width/2;
          end.y = target.y + target.height/2;
      }

      const isSelected = selectedEdgeId === edge.id;
      const strokeColor = isSelected ? '#3b82f6' : edge.style.strokeColor;
      const isAnimated = edge.style.animated;
      
      // Calculate Path
      const d = getSmartEdgePath(
          start, 
          end, 
          source, 
          target, 
          edge.sourceHandle, 
          edge.targetHandle, 
          currentDiagram.nodes, 
          edge.style.routing || 'default',
          edge.style.curve
      );

      const markerSize = edge.style.markerSize || 10;
      const markerStartId = edge.style.markerStart && edge.style.markerStart !== 'none' ? `url(#marker-start-${edge.id})` : undefined;
      const markerEndId = edge.style.markerEnd && edge.style.markerEnd !== 'none' ? `url(#marker-end-${edge.id})` : undefined;

      // Determine Dash Array
      let dashArray = "0";
      if (edge.style.lineStyle === LineStyle.Dashed) dashArray = "5,5";
      else if (edge.style.lineStyle === LineStyle.Dotted) dashArray = "2,2";
      else if (isAnimated) dashArray = "10,5"; // Solid lines become dashed when animated to show flow

      return (
        <g 
          key={edge.id} 
          onClick={(e) => { e.stopPropagation(); setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}
          className="cursor-pointer group"
        >
          <defs>
             <marker id={`marker-start-${edge.id}`} markerWidth={markerSize} markerHeight={markerSize} refX={markerSize - 1} refY={markerSize/2} orient="auto-start-reverse">
                 {edge.style.markerStart === 'arrow' && <polygon points={`0 0, ${markerSize} ${markerSize/2}, 0 ${markerSize}`} fill={edge.style.markerStartColor || strokeColor} />}
                 {edge.style.markerStart === 'circle' && <circle cx={markerSize/2} cy={markerSize/2} r={markerSize/2 - 1} fill={edge.style.markerStartColor || strokeColor} />}
                 {edge.style.markerStart === 'square' && <rect x="0" y="0" width={markerSize} height={markerSize} fill={edge.style.markerStartColor || strokeColor} />}
             </marker>
             <marker id={`marker-end-${edge.id}`} markerWidth={markerSize} markerHeight={markerSize} refX={markerSize - 1} refY={markerSize/2} orient="auto">
                 {edge.style.markerEnd === 'arrow' && <polygon points={`0 0, ${markerSize} ${markerSize/2}, 0 ${markerSize}`} fill={edge.style.markerEndColor || strokeColor} />}
                 {edge.style.markerEnd === 'circle' && <circle cx={markerSize/2} cy={markerSize/2} r={markerSize/2 - 1} fill={edge.style.markerEndColor || strokeColor} />}
                 {edge.style.markerEnd === 'square' && <rect x="0" y="0" width={markerSize} height={markerSize} fill={edge.style.markerEndColor || strokeColor} />}
             </marker>
          </defs>
          
          <path d={d} stroke="transparent" strokeWidth="20" fill="none" />
          
          <path 
            d={d}
            stroke={strokeColor} 
            strokeWidth={edge.style.strokeWidth}
            strokeDasharray={dashArray}
            fill="none"
            markerStart={markerStartId}
            markerEnd={markerEndId}
            className={`transition-colors duration-200 ${isAnimated ? 'edge-flowing' : ''}`}
          />
          {edge.text && (
             <foreignObject x={(start.x + end.x)/2 - 40} y={(start.y + end.y)/2 - 12} width={80} height={24}>
               <div className="bg-[#0f1729]/90 text-zinc-300 text-[10px] text-center rounded border border-zinc-700 px-1 py-0.5 truncate shadow-md backdrop-blur-sm">
                 {edge.text}
               </div>
             </foreignObject>
          )}
        </g>
      );
    });
  };

  const renderHandles = (node: DiagramNode) => {
      const handles: HandleType[] = ['top', 'right', 'bottom', 'left'];
      return handles.map(h => {
          const pos = getHandlePosition(node, h);
          const isTarget = connectingNodeId && connectingNodeId !== node.id;
          return (
            <div
                key={h}
                className={`absolute w-3 h-3 bg-[#0f1729] border border-blue-500 rounded-full z-20 
                    ${isTarget ? 'opacity-100 scale-125 bg-blue-500/50' : 'opacity-0 group-hover:opacity-100 transition-opacity'}
                    cursor-crosshair hover:bg-blue-400`}
                style={{
                    left: h === 'left' ? -6 : h === 'right' ? node.width - 6 : '50%',
                    top: h === 'top' ? -6 : h === 'bottom' ? node.height - 6 : '50%',
                    marginLeft: (h === 'top' || h === 'bottom') ? -6 : 0,
                    marginTop: (h === 'left' || h === 'right') ? -6 : 0,
                }}
                onClick={(e) => isTarget ? completeConnection(e, node.id, h) : startConnection(e, node.id, h)}
            />
          );
      });
  };

  const renderShape = (node: DiagramNode) => {
    const commonStyle = {
      backgroundColor: node.style.backgroundColor,
      borderColor: selectedNodeId === node.id ? '#60a5fa' : connectingNodeId === node.id ? '#eab308' : node.style.borderColor,
      borderWidth: node.style.borderWidth,
      borderStyle: node.style.borderStyle,
      color: node.style.textColor,
      boxShadow: node.style.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : 'none',
      fontSize: `${node.style.fontSize}px`,
    };

    let content = <div className="p-2 text-center">{node.text}</div>;

    // --- NEW ADVANCED IO COMPONENTS ---

    if (node.type === ShapeType.Login) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] p-3 rounded-lg overflow-hidden" style={commonStyle}>
                <div className="text-center font-bold text-sm mb-3 text-zinc-300">{node.text}</div>
                <div className="flex flex-col gap-2">
                    <input disabled type="text" placeholder="Username" className="bg-zinc-800 text-xs px-2 py-1.5 rounded border border-zinc-600" />
                    <input disabled type="password" placeholder="Password" className="bg-zinc-800 text-xs px-2 py-1.5 rounded border border-zinc-600" />
                    <div className="text-[9px] text-blue-400 text-right cursor-pointer">Forgot Password?</div>
                    <button className="bg-blue-600 text-white text-xs py-1.5 rounded mt-1 font-medium">Log In</button>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Form) {
        const action = node.ioData?.formAction || 'save';
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="p-2 text-center font-bold border-b border-zinc-700 bg-black/20 text-sm truncate mb-1 flex items-center justify-between">
                    <span>{node.text}</span>
                    {node.ioData?.targetDbTableName && <span className="text-[9px] text-zinc-500 font-normal">→ {node.ioData.targetDbTableName}</span>}
                </div>
                <div className="flex-1 overflow-auto p-2 space-y-2">
                    {node.ioData?.formFields?.map(field => (
                        <div key={field.id} className="flex flex-col gap-1" onMouseDown={e => e.stopPropagation()}>
                            <label className="text-[10px] text-zinc-400 uppercase">{field.label}</label>
                            {field.type === 'checkbox' ? (
                                <input 
                                    type="checkbox"
                                    checked={field.value === 'true'}
                                    onChange={(e) => handleFormFieldChange(node.id, field.id, String(e.target.checked))}
                                    className="w-4 h-4 border border-zinc-600 rounded bg-zinc-800 accent-blue-500 cursor-pointer"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    className="bg-zinc-800 border border-zinc-600 text-[10px] px-2 py-1.5 rounded w-full outline-none focus:border-blue-500 text-zinc-200"
                                    value={field.value || ''}
                                    onChange={(e) => handleFormFieldChange(node.id, field.id, e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {field.options?.split(',').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <div className="relative">
                                     {field.type === 'currency' && <span className="absolute left-2 top-1.5 text-zinc-500 text-[10px]">{field.currency || '$'}</span>}
                                     <input 
                                        type={field.type === 'integer' || field.type === 'decimal' || field.type === 'currency' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                        className={`w-full bg-zinc-800 border border-zinc-600 text-[10px] py-1.5 rounded outline-none focus:border-blue-500 text-zinc-200 ${field.type === 'currency' ? 'pl-5' : 'px-2'}`}
                                        value={field.value || ''}
                                        onChange={(e) => handleFormFieldChange(node.id, field.id, e.target.value)}
                                        placeholder={field.label}
                                     />
                                </div>
                            )}
                        </div>
                    ))}
                    {(!node.ioData?.formFields || node.ioData.formFields.length === 0) && (
                        <div className="text-zinc-600 text-xs text-center italic mt-2">No fields</div>
                    )}
                </div>
                {action !== 'none' && (
                    <div className="p-2 border-t border-zinc-700/50">
                        <button 
                            className={`w-full text-xs font-bold py-1.5 rounded uppercase tracking-wider transition-colors shadow-lg ${action === 'save' ? 'bg-green-600 text-white hover:bg-green-500' : action === 'send' ? 'bg-blue-600 text-white hover:bg-blue-500' : action === 'create' ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-red-600 text-white hover:bg-red-500'}`}
                            onClick={(e) => handleSyncData(e, node)}
                        >
                            {action}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (node.type === ShapeType.Panel) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="flex justify-between items-center p-2 border-b border-zinc-700 bg-black/20">
                    <span className="text-xs font-bold truncate flex items-center gap-2">
                        <LayoutDashboard size={12} className="text-purple-400"/>
                        {node.text}
                    </span>
                    <button 
                        onClick={(e) => handleSyncData(e, node)}
                        className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700 transition-colors"
                        title="Refresh & Sync"
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-2 grid grid-cols-1 gap-2 align-content-start">
                    {node.panelData?.fields?.map(field => {
                        const viz = field.visualization;
                        return (
                            <div key={field.id} className="bg-zinc-900/40 border border-zinc-800 rounded p-2 flex items-center justify-between shadow-sm hover:border-zinc-600 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="text-zinc-500">
                                        {field.type === 'date' ? <Calendar size={12}/> : field.type === 'currency' ? <DollarSign size={12}/> : field.type === 'checkbox' ? <CheckCircle2 size={12}/> : <Info size={12}/>}
                                    </div>
                                    <span className="text-[10px] text-zinc-300 font-medium">{field.label}</span>
                                </div>
                                
                                {viz === 'toggle' ? (
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${field.value ? 'bg-green-500/80' : 'bg-zinc-700'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${field.value ? 'left-4.5' : 'left-0.5'}`}></div>
                                    </div>
                                ) : viz === 'gauge-circ' ? (
                                    <div className="w-9 h-9 relative">
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${field.value || 0}, 100`} />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-zinc-300">{field.value}%</div>
                                    </div>
                                ) : viz === 'gauge-vert' ? (
                                    <div className="h-8 w-2 bg-zinc-800 rounded-full overflow-hidden relative border border-zinc-700">
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400" style={{height: `${field.value || 0}%`}}></div>
                                    </div>
                                ) : (
                                    <span className="text-xs font-bold text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50">{field.value?.toString() || '-'}</span>
                                )}
                            </div>
                        );
                    })}
                    {(!node.panelData?.fields || node.panelData.fields.length === 0) && (
                        <div className="text-zinc-600 text-xs text-center italic mt-2">No Data Fields</div>
                    )}
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.WriteFile) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] p-2 relative" style={commonStyle}>
                <div className="flex items-center gap-2 mb-2 border-b border-zinc-700/50 pb-1">
                    <FileSignature size={16} className="text-orange-400" />
                    <span className="text-xs font-bold truncate">{node.text}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1 text-[10px] text-zinc-400 overflow-hidden text-center">
                    <div className="bg-zinc-800/50 p-1 rounded font-mono text-zinc-300 truncate">
                        {node.writeFileData?.fileNamePattern || 'No Pattern'}
                    </div>
                    <div className="text-zinc-500 font-bold">
                        .{node.writeFileData?.fileExtension || 'json'}
                    </div>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.ReadDatabase) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] p-2 relative" style={commonStyle}>
                <div className="flex items-center gap-2 mb-1 border-b border-zinc-700/50 pb-1">
                    <DatabaseZap size={16} className="text-green-400" />
                    <span className="text-xs font-bold truncate">{node.text}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Source DB Node</div>
                    <div className="bg-zinc-800/50 p-1 rounded text-[10px] text-zinc-300 truncate font-mono">
                        {currentDiagram.nodes.find(n => n.id === node.readDatabaseData?.connectionNodeId)?.text || 'Not connected'}
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">SQL Query</div>
                    <div className="bg-zinc-900/80 p-1 rounded text-[9px] text-green-300 font-mono flex-1 overflow-hidden whitespace-pre-wrap leading-tight border border-zinc-800">
                        {node.readDatabaseData?.sqlQuery || 'SELECT * ...'}
                    </div>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Button) {
        return (
            <div 
                className="w-full h-full flex flex-col items-center justify-center p-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all" 
                style={commonStyle}
                onClick={(e) => handleSimulateEvent(e, node)}
            >
                <div className="bg-blue-600 w-full h-full rounded flex items-center justify-center gap-2 shadow-lg border border-blue-400/50">
                    <PlayCircle size={16} className="text-white fill-white/20" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{node.buttonData?.label || 'Click Me'}</span>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Mapper) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="flex items-center gap-2 p-2 border-b border-zinc-700 bg-black/20">
                    <GitCompare size={14} className="text-purple-400"/>
                    <span className="text-xs font-bold truncate">{node.text}</span>
                </div>
                <div className="flex-1 p-2 flex flex-col gap-2 overflow-auto">
                    <div className="flex items-center justify-between text-[9px] text-zinc-500">
                        <span>Source</span>
                        <ArrowRight size={10}/>
                        <span>Target</span>
                    </div>
                    {node.mapperData?.rules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between bg-zinc-900/50 p-1.5 rounded border border-zinc-800">
                            {rule.isExpression ? (
                                <span className="text-[9px] text-purple-300 truncate max-w-[40%] font-mono">f(x)</span>
                            ) : (
                                <span className="text-[10px] text-zinc-300 truncate max-w-[40%]">{rule.sourceField}</span>
                            )}
                            <ArrowRight size={10} className="text-purple-500/50"/>
                            <span className="text-[10px] text-zinc-300 truncate max-w-[40%] text-right">{rule.targetField}</span>
                        </div>
                    ))}
                    {(!node.mapperData?.rules || node.mapperData.rules.length === 0) && (
                        <div className="text-zinc-600 text-[10px] text-center italic mt-2">No mappings</div>
                    )}
                </div>
                <div className="p-1 bg-zinc-900 border-t border-zinc-800 text-[9px] text-zinc-500 text-center truncate">
                    Refs: {node.mapperData?.referenceNodeIds?.length || 0}
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.API) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="flex items-center gap-2 p-2 border-b border-zinc-700 bg-black/20">
                    <Server size={14} className="text-blue-400"/>
                    <span className="text-xs font-bold truncate">{node.text}</span>
                </div>
                <div className="flex-1 overflow-auto p-2 space-y-2">
                    {node.ioData?.endpoints?.map(ep => {
                        const linkedNode = currentDiagram.nodes.find(n => n.id === ep.outputNodeId);
                        return (
                            <div key={ep.id} className="bg-zinc-900/50 border border-zinc-700 rounded p-1.5 flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className={`text-[9px] font-bold px-1 rounded ${ep.method === 'GET' ? 'bg-green-900 text-green-300' : ep.method === 'POST' ? 'bg-blue-900 text-blue-300' : ep.method === 'DELETE' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>{ep.method}</span>
                                    <button 
                                        className="text-[9px] bg-zinc-700 hover:bg-zinc-600 px-1.5 py-0.5 rounded flex items-center gap-1"
                                        onClick={(e) => testApiConnection(e, ep.url)}
                                    >
                                        <Play size={8}/> Test
                                    </button>
                                </div>
                                <div className="text-[10px] text-zinc-400 truncate font-mono" title={ep.url}>{ep.url}</div>
                                {linkedNode && (
                                    <div className="flex items-center gap-1 text-[9px] text-cyan-500 border-t border-zinc-800 pt-1 mt-0.5">
                                        <ArrowLeft size={8} className="rotate-180"/> 
                                        <span className="truncate">To: {linkedNode.text}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Listener) {
        const linkedNode = currentDiagram.nodes.find(n => n.id === node.ioData?.listenerOutputNodeId);
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f1729] p-2 relative" style={commonStyle}>
                <div className="absolute top-2 left-2 text-zinc-500"><Eye size={14}/></div>
                <Folder size={32} className="text-yellow-500/80 mb-1" />
                <div className="text-xs font-bold truncate w-full text-center">{node.text}</div>
                <div className="text-[10px] text-zinc-400 truncate w-full text-center bg-zinc-800/50 rounded px-1 mt-1 font-mono">
                    {node.ioData?.filePattern || '*.*'}
                </div>
                {linkedNode && (
                    <div className="absolute bottom-1 right-2 text-[9px] text-cyan-500 flex items-center gap-1">
                        ➜ {linkedNode.text}
                    </div>
                )}
            </div>
        );
    }

    if (node.type === ShapeType.Mail) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] p-2 relative" style={commonStyle}>
                <div className="flex items-center gap-2 mb-2 border-b border-zinc-700/50 pb-1">
                    <Mail size={16} className="text-purple-400" />
                    <span className="text-xs font-bold truncate">{node.text}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1 text-[10px] text-zinc-400 overflow-hidden">
                    <div className="flex justify-between">
                        <span>SMTP:</span> <span className="text-zinc-300">{node.ioData?.smtpHost || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>POP:</span> <span className="text-zinc-300">{node.ioData?.popHost || 'Not set'}</span>
                    </div>
                    <div className="mt-auto pt-1 text-center text-zinc-500 truncate border-t border-zinc-800">
                        {node.ioData?.email || 'user@local'}
                    </div>
                </div>
            </div>
        );
    }

    // --- DASHBOARD COMPONENTS ---

    if (node.type === ShapeType.KPI) {
        return (
            <div className="w-full h-full flex flex-col justify-between bg-[#0f1729] p-4 relative" style={{...commonStyle, borderRadius: '8px'}}>
                 <div className="text-xs text-zinc-400 font-bold uppercase">{node.text}</div>
                 <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-3xl font-bold" style={{color: commonStyle.color}}>{node.dashboardData?.value}</span>
                     <span className="text-sm text-zinc-500">{node.dashboardData?.unit}</span>
                 </div>
                 {node.dashboardData?.referenceValue !== undefined && (
                     <div className="text-[10px] text-zinc-600 border-t border-zinc-800 pt-1 mt-1">
                         Target: {node.dashboardData.referenceValue} {node.dashboardData.unit}
                     </div>
                 )}
            </div>
        );
    }

    if (node.type === ShapeType.Gauge) {
        const cx = node.width / 2;
        const cy = node.height * 0.8;
        const radius = Math.min(node.width, node.height * 1.5) / 2 - 10;
        const min = node.dashboardData?.min || 0;
        const max = node.dashboardData?.max || 100;
        const val = node.dashboardData?.value || 0;
        const pct = Math.min(1, Math.max(0, (val - min) / (max - min)));
        const angle = 180 * pct;

        return (
            <div className="w-full h-full bg-[#0f1729] flex flex-col items-center justify-between p-2" style={{...commonStyle, borderRadius: '8px'}}>
                <div className="text-xs font-bold text-zinc-400 mb-1">{node.text}</div>
                <svg width="100%" height="100%" viewBox={`0 0 ${node.width} ${node.height}`}>
                    <defs>
                        <linearGradient id={`grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={node.dashboardData?.colorStart || '#3b82f6'} />
                            <stop offset="100%" stopColor={node.dashboardData?.colorEnd || '#ef4444'} />
                        </linearGradient>
                    </defs>
                    <path d={describeArc(cx, cy, radius, 0, 180)} fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round"/>
                    <path d={describeArc(cx, cy, radius, 0, angle)} fill="none" stroke={`url(#grad-${node.id})`} strokeWidth="8" strokeLinecap="round"/>
                    {/* Needle */}
                    <path 
                        d={`M ${cx - 2} ${cy} L ${cx + 2} ${cy} L ${cx} ${cy - radius + 5} Z`} 
                        fill="#fff" 
                        transform={`rotate(${angle - 90}, ${cx}, ${cy})`}
                    />
                    <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{val}</text>
                    <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="10">{node.dashboardData?.unit}</text>
                </svg>
            </div>
        );
    }

    if (node.type === ShapeType.Toggle) {
        const checked = node.dashboardData?.checked || false;
        return (
            <div 
                className={`w-full h-full flex items-center justify-between px-2 cursor-pointer transition-colors duration-300 ${checked ? 'bg-blue-900/30' : 'bg-zinc-900/30'}`}
                style={{...commonStyle, borderRadius: '20px', borderWidth: 2}}
                onClick={(e) => {
                    // Quick toggle logic
                    e.stopPropagation();
                    const newData = { ...node.dashboardData, checked: !checked };
                    updateCurrentDiagram({ nodes: currentDiagram.nodes.map(n => n.id === node.id ? { ...n, dashboardData: newData } : n) }, false);
                }}
            >
                <span className="text-xs font-bold px-1 select-none">{checked ? node.dashboardData?.onLabel : node.dashboardData?.offLabel}</span>
                <div className={`w-6 h-6 rounded-full shadow-md transition-all duration-300 ${checked ? 'bg-blue-500 ml-auto' : 'bg-zinc-600 mr-auto'}`}></div>
            </div>
        );
    }

    if (node.type === ShapeType.Timeline) {
        return (
            <div className="w-full h-full bg-[#0f1729] flex flex-col p-2 relative overflow-hidden" style={{...commonStyle, borderRadius: '4px'}}>
                 <div className="text-xs font-bold text-zinc-400 mb-4">{node.text}</div>
                 <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-zinc-700 mt-2"></div>
                 <div className="flex justify-between items-center relative z-10 px-4 h-full">
                     {node.dashboardData?.milestones?.map((m, i) => (
                         <div key={i} className="flex flex-col items-center group">
                             <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0f1729] mb-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                             <div className="text-[9px] text-zinc-400">{m.date}</div>
                             <div className="text-[10px] font-bold text-zinc-200">{m.title}</div>
                         </div>
                     ))}
                     {(!node.dashboardData?.milestones || node.dashboardData.milestones.length === 0) && (
                         <div className="text-xs text-zinc-600 italic w-full text-center mt-4">No milestones</div>
                     )}
                 </div>
            </div>
        );
    }

    if (node.type === ShapeType.LineChart || node.type === ShapeType.BarChart) {
        const isLine = node.type === ShapeType.LineChart;
        const data = node.dashboardData?.series || [];
        const categories = node.dashboardData?.categories || [];
        
        // Simple scaling
        let maxVal = 0;
        data.forEach(s => s.data.forEach(v => { if(v > maxVal) maxVal = v; }));
        if (maxVal === 0) maxVal = 10;

        const padding = 20;
        const w = node.width - padding * 2;
        const h = node.height - padding * 2 - 20; // -20 for labels

        return (
             <div className="w-full h-full bg-[#0f1729] flex flex-col p-2" style={{...commonStyle, borderRadius: '4px'}}>
                 <div className="text-xs font-bold text-zinc-400 mb-1 flex justify-between">
                     <span>{node.text}</span>
                     {data.length > 0 && <span className="text-[8px] flex gap-2">
                         {data.map((s,i) => <span key={i} style={{color: s.color}}>● {s.name}</span>)}
                     </span>}
                 </div>
                 <svg width="100%" height="100%" viewBox={`0 0 ${node.width} ${node.height - 20}`} style={{overflow: 'visible'}}>
                     {/* Axis lines */}
                     <line x1={padding} y1={padding} x2={padding} y2={h + padding} stroke="#334155" strokeWidth="1"/>
                     <line x1={padding} y1={h + padding} x2={w + padding} y2={h + padding} stroke="#334155" strokeWidth="1"/>
                     
                     {data.map((series, sIdx) => {
                         if (isLine) {
                            const points = series.data.map((val, i) => {
                                const x = padding + (i / (Math.max(1, categories.length - 1))) * w;
                                const y = (h + padding) - (val / maxVal) * h;
                                return `${x},${y}`;
                            }).join(' ');
                            return <polyline key={sIdx} points={points} fill="none" stroke={series.color} strokeWidth="2" />;
                         } else {
                            // Bar
                            const barW = (w / categories.length) / data.length - 2;
                            return series.data.map((val, i) => {
                                const x = padding + (w / categories.length) * i + (barW * sIdx) + 2;
                                const barH = (val / maxVal) * h;
                                const y = (h + padding) - barH;
                                return <rect key={i} x={x} y={y} width={barW} height={barH} fill={series.color} opacity="0.8" />;
                            });
                         }
                     })}

                     {/* X Labels */}
                     {categories.map((cat, i) => {
                         const x = padding + (i / (isLine ? Math.max(1, categories.length - 1) : categories.length)) * w + (isLine ? 0 : (w/categories.length)/2);
                         return <text key={i} x={x} y={h + padding + 12} fontSize="8" fill="#64748b" textAnchor="middle">{cat}</text>;
                     })}
                 </svg>
             </div>
        );
    }


    // --- Complex Shapes (Existing) ---

    if (node.type === ShapeType.Class) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="p-2 text-center font-bold border-b border-zinc-700 bg-black/20 text-sm truncate">
                    {node.text}
                </div>
                <div className="flex-1 p-2 text-[10px] text-left overflow-hidden space-y-0.5">
                    {node.classProperties && node.classProperties.length > 0 ? (
                        node.classProperties.map(prop => (
                            <div key={prop.id} className="flex gap-1 truncate">
                                <span className="text-blue-500">{prop.isMandatory ? '+' : '-'}</span>
                                <span className={prop.isMandatory ? 'font-bold text-zinc-200' : 'text-zinc-300'}>{prop.name}:</span>
                                <span className="text-zinc-500 italic">{prop.type}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-zinc-600 italic text-center mt-2">No properties</div>
                    )}
                </div>
            </div>
        );
    }
    
    if (node.type === ShapeType.Table) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden" style={commonStyle}>
                <div className="p-2 text-center font-bold border-b border-zinc-700 bg-black/20 text-sm truncate mb-1">
                    {node.text}
                </div>
                <div className="flex-1 overflow-auto p-1">
                    <table className="w-full text-[10px] text-left border-collapse table-fixed">
                        <colgroup>
                            {node.tableData?.headers.map((_, i) => (
                                <col key={i} style={{ width: node.tableData?.columnWidths?.[i] ? `${node.tableData.columnWidths[i]}px` : 'auto' }} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr>
                                {node.tableData?.headers.map((h, i) => (
                                    <th key={i} className="border-b border-zinc-600 p-1 text-blue-400 font-normal truncate overflow-hidden">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {node.tableData?.rows.map((row, r) => (
                                <tr key={r} className="border-b border-zinc-800/50">
                                    {row.map((cell, c) => (
                                        <td key={c} className="p-1 text-zinc-300 border-r border-zinc-800/50 last:border-0 truncate overflow-hidden">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Screen) {
        return (
             <div className="w-full h-full flex flex-col bg-[#0f1729] overflow-hidden rounded-md" style={commonStyle}>
                 <div className="h-5 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                 </div>
                 <div className="flex-1 flex items-center justify-center p-2">
                     {node.text}
                 </div>
             </div>
        );
    }

    if (node.type === ShapeType.Switch) {
        return (
            <div className="w-full h-full flex items-center justify-center relative">
                  <div 
                    className="w-full h-full absolute inset-0 transition-colors bg-[#0f1729]"
                    style={{
                       backgroundColor: commonStyle.backgroundColor,
                       borderColor: commonStyle.borderColor,
                       borderWidth: commonStyle.borderWidth,
                       borderStyle: commonStyle.borderStyle,
                       clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                    }}
                 />
                 <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                     <polygon 
                        points="25,0 75,0 100,50 75,100 25,100 0,50" 
                        vectorEffect="non-scaling-stroke"
                        fill="none" 
                        stroke={commonStyle.borderColor} 
                        strokeWidth={commonStyle.borderWidth}
                        transform={`scale(${node.width/100}, ${node.height/100})`}
                     />
                 </svg>
                 
                 <div className="relative z-10 text-center pointer-events-none p-2 w-[70%] text-xs">
                    <div className="font-bold mb-1">{node.text}</div>
                    {node.switchState && <div className="text-[10px] text-blue-400">({node.switchState})</div>}
                 </div>
            </div>
        );
    }

    if (node.type === ShapeType.Cylinder) {
        return (
            <div className="w-full h-full relative" style={{color: commonStyle.color, fontSize: commonStyle.fontSize}}>
                <div className="absolute top-0 left-0 w-full h-[20%] rounded-[50%] z-10 border-2"
                     style={{
                         backgroundColor: commonStyle.backgroundColor,
                         borderColor: commonStyle.borderColor,
                         borderWidth: commonStyle.borderWidth
                     }} 
                />
                <div className="absolute top-[10%] left-0 w-full h-[80%] border-x-2 border-b-0 z-0"
                      style={{
                         backgroundColor: commonStyle.backgroundColor,
                         borderColor: commonStyle.borderColor,
                         borderWidth: commonStyle.borderWidth,
                         borderStyle: commonStyle.borderStyle
                     }}
                />
                <div className="absolute bottom-0 left-0 w-full h-[20%] rounded-[50%] z-10 border-2"
                     style={{
                         backgroundColor: commonStyle.backgroundColor,
                         borderColor: commonStyle.borderColor,
                         borderWidth: commonStyle.borderWidth
                     }} 
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 pt-4 pointer-events-none">
                     {node.text}
                </div>
            </div>
        );
    }
    
    if (node.type === ShapeType.Loop) {
        return (
            <div className="w-full h-full relative">
                <div 
                  className="absolute top-0 left-0 bg-blue-700/80 text-white text-[10px] px-2 py-0.5 rounded-br z-10"
                  style={{ borderTopLeftRadius: '4px' }}
                >
                    LOOP
                </div>
                <div 
                   className="w-full h-full border-2 rounded flex items-start justify-center pt-6"
                   style={{
                       ...commonStyle,
                       backgroundColor: node.style.backgroundColor + '10', // Very transparent
                       borderStyle: 'dashed'
                   }}
                >
                   <span className="opacity-50">{node.text}</span>
                </div>
            </div>
        );
    }

    if (node.type === ShapeType.Diamond) {
        return (
            <div className="w-full h-full flex items-center justify-center relative">
                 <div 
                    className="w-full h-full absolute inset-0 rotate-45 border-2 transition-colors bg-[#0f1729]"
                    style={{
                       backgroundColor: commonStyle.backgroundColor,
                       borderColor: commonStyle.borderColor,
                       borderWidth: commonStyle.borderWidth,
                       borderStyle: commonStyle.borderStyle,
                       boxShadow: commonStyle.boxShadow
                    }}
                 />
                 <div className="relative z-10 text-center pointer-events-none p-2 w-[70%]">
                    {node.text}
                 </div>
            </div>
        );
    }

    // --- Icon Based Shapes ---
    const IconShape = ({ Icon, label }: { Icon: any, label: string }) => (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center" style={commonStyle}>
            <Icon size={32} className="mb-1 opacity-80" strokeWidth={1.5} />
            <div className="text-xs font-medium leading-tight">{label}</div>
        </div>
    );

    if (node.type === ShapeType.User) return <IconShape Icon={User} label={node.text} />;
    if (node.type === ShapeType.Service) return <IconShape Icon={Server} label={node.text} />;
    if (node.type === ShapeType.Stream) return <IconShape Icon={Waves} label={node.text} />;
    if (node.type === ShapeType.Mobile) return <IconShape Icon={Smartphone} label={node.text} />;
    if (node.type === ShapeType.AI) return <IconShape Icon={Brain} label={node.text} />;

    
    const borderRadius = node.type === ShapeType.Circle ? '50%' : node.type === ShapeType.Rounded ? '20px' : '4px';
    return (
        <div 
           className="w-full h-full flex items-center justify-center text-center"
           style={{ ...commonStyle, borderRadius }}
        >
           {content}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0f1729] text-zinc-100 font-light"
        onMouseMove={handleResizeMove}
        onMouseUp={handleResizeEnd}
    >
      <style>{`
        @keyframes flow {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
        }
        .edge-flowing {
            animation: flow 1s linear infinite;
        }
        .ai-glow {
            animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
      
      {/* Invisible file input for loading JSON */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleLoadJSON}
      />
      
      {/* Invisible file input for AI Context */}
      <input
        type="file"
        ref={contextFileInputRef}
        className="hidden"
        accept=".txt,.md,.json,.js,.ts,.tsx,.java,.cs,.py,.cpp,.c,.h,.html,.css" // Common text/code types
        onChange={handleContextFileUpload}
      />

      {/* HEADER: Ark Alliance Style */}
      <header
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 15, 26, 0.95) 0%, rgba(17, 24, 39, 0.95) 50%, rgba(13, 17, 23, 0.95) 100%)',
          borderColor: 'rgba(55, 65, 81, 0.5)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              {/* Logo with glow */}
              <div className="relative flex-shrink-0 self-center">
                <div
                  className="absolute inset-[-4px] rounded-full animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                    filter: 'blur(4px)'
                  }}
                />
                <div
                  className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-zinc-900 border border-blue-500/30"
                  style={{
                    boxShadow: `0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)`
                  }}
                >
                  <Brain className="text-blue-400" size={24} />
                </div>
              </div>

              {/* Branding */}
              <div className="flex flex-col justify-center min-w-0">
                <h1
                  className="text-lg font-bold tracking-wide leading-tight"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(to right, #60a5fa, #22d3ee, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(96, 165, 250, 0.3)',
                  }}
                >
                  Ark.Alliance
                </h1>
                <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase leading-tight text-zinc-400">
                    MERMAID ARCHITECT <span className="text-zinc-600">•</span> AI POWERED
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <div className="flex bg-[#111827] rounded-lg p-0.5 border border-zinc-700/50">
                    <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"><Undo2 size={16} /></button>
                    <div className="w-px bg-zinc-700 my-1 mx-0.5"></div>
                    <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"><Redo2 size={16} /></button>
                </div>
                
                <button 
                  onClick={handleSaveJSON} 
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all flex items-center gap-2"
                >
                    <Save size={14} /> SAVE
                </button>
                 <button 
                  onClick={handleLoadJSONClick} 
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all flex items-center gap-2"
                >
                    <FolderOpen size={14} /> LOAD
                </button>
                 <button 
                  onClick={() => setShowMermaidCode(!showMermaidCode)} 
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="View Code"
                >
                    <Code size={18} />
                </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR CONTAINER */}
        <div className="h-full relative z-20">
             <Toolbar />
        </div>

        <div className="flex-1 relative bg-[#0f1729] overflow-hidden select-none">
          {/* Animated Background simulation */}
           <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ 
                backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             {renderEdges()}
             {connectingNodeId && connectingHandle && (
                 <path d="" /> 
             )}
          </svg>

          <div 
            ref={canvasRef}
            className="w-full h-full relative"
            onDrop={(e) => {
                const shapeType = e.dataTransfer.getData('shapeType') as ShapeType;
                if(shapeType) {
                    e.preventDefault();
                    const rect = canvasRef.current!.getBoundingClientRect();
                    handleAddNode(shapeType, e.clientX - rect.left, e.clientY - rect.top);
                }
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); setConnectingNodeId(null); setActiveAIContextNodeId(null); setAiMenuMode('quick'); }}
          >
            {currentDiagram.nodes.map(node => (
              <div
                key={node.id}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  zIndex: node.type === ShapeType.Loop ? 0 : 10 // loops behind
                }}
                className={`absolute group select-none ${selectedNodeId === node.id ? 'z-20' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
              >
                {/* Draggable Area */}
                <div 
                   className="w-full h-full cursor-move"
                   draggable
                   onDragStart={(e) => { e.dataTransfer.setDragImage(new Image(), 0, 0); }}
                   onDrag={(e) => {
                       if (e.clientX === 0 && e.clientY === 0) return;
                       const rect = canvasRef.current!.getBoundingClientRect();
                       handleNodeDrag(node.id, (e.clientX - rect.left) - node.x - node.width/2, (e.clientY - rect.top) - node.y - node.height/2);
                   }}
                   onDragEnd={(e) => handleNodeDragEnd(node.id, e)}
                >
                    {renderShape(node)}
                </div>

                {/* Handles for connections */}
                {renderHandles(node)}

                {/* AI Context Button - appears on hover or selection */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveAIContextNodeId(node.id); setAiMenuMode('quick'); }}
                  className={`absolute -top-3 -right-3 p-1.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 hover:scale-110 hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all z-40 ${selectedNodeId === node.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  title="Ask AI about this node"
                >
                    <Sparkles size={12} />
                </button>

                {/* AI Context Menu */}
                {activeAIContextNodeId === node.id && (
                    <div 
                        className="absolute top-0 right-0 transform translate-x-full translate-y-0 ml-2 bg-[#111827]/95 border border-zinc-700/50 backdrop-blur-md rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1 transition-all"
                        style={{ width: aiMenuMode === 'file' ? '280px' : '192px', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                    >
                        <div className="flex justify-between items-center mb-1 pb-1 border-b border-zinc-700/50">
                             <span className="text-[10px] font-bold text-blue-400 uppercase font-['Orbitron']">
                                 {aiMenuMode === 'file' ? 'File Analysis' : 'AI Actions'}
                             </span>
                             <button onClick={(e) => { e.stopPropagation(); setActiveAIContextNodeId(null); setAiMenuMode('quick'); }} className="text-zinc-500 hover:text-white"><X size={12}/></button>
                        </div>
                        {isAIProcessing ? (
                            <div className="text-xs text-blue-300 p-2 flex items-center gap-2"><Sparkles className="animate-spin text-cyan-400" size={12}/> Analyzing...</div>
                        ) : (
                            <>
                                {aiMenuMode === 'quick' ? (
                                    <>
                                        {(node.type === ShapeType.Class || node.type === ShapeType.Table) && (
                                            <button onClick={(e) => { e.stopPropagation(); handleAIAction('fill'); }} className="text-left text-xs text-zinc-300 hover:bg-blue-600/20 hover:text-blue-200 p-1.5 rounded transition-colors flex items-center gap-2"><FileText size={12}/> Fill Data / Props</button>
                                        )}
                                        {(node.type === ShapeType.Loop || node.type === ShapeType.Process) && (
                                            <button onClick={(e) => { e.stopPropagation(); handleAIAction('subdiagram'); }} className="text-left text-xs text-zinc-300 hover:bg-blue-600/20 hover:text-blue-200 p-1.5 rounded transition-colors flex items-center gap-2"><FolderOpen size={12}/> Create Sub-Diagram</button>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); handleAIAction('complete'); }} className="text-left text-xs text-zinc-300 hover:bg-blue-600/20 hover:text-blue-200 p-1.5 rounded transition-colors flex items-center gap-2"><Plus size={12}/> Complete Flow</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleAIAction('describe'); }} className="text-left text-xs text-zinc-300 hover:bg-blue-600/20 hover:text-blue-200 p-1.5 rounded transition-colors flex items-center gap-2"><FileText size={12}/> Auto-Describe</button>
                                        
                                        <div className="h-px bg-zinc-700/50 my-1"></div>
                                        <button onClick={(e) => { e.stopPropagation(); setAiMenuMode('file'); }} className="text-left text-xs text-cyan-400 hover:bg-cyan-500/10 p-1.5 rounded transition-colors flex items-center gap-2 font-medium"><Paperclip size={12}/> Analyze File & Fill...</button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 p-1" onClick={e => e.stopPropagation()}>
                                        <div className="flex gap-2 items-center">
                                            <button 
                                                onClick={() => setAiMenuMode('quick')}
                                                className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
                                            ><ArrowLeft size={12}/></button>
                                            <span className="text-[10px] text-zinc-400">Contextual Prompt</span>
                                        </div>
                                        
                                        <div className="bg-[#0f1729] border border-zinc-700/50 rounded p-2 text-xs">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] text-zinc-500 uppercase">Context File</span>
                                                <button 
                                                    onClick={() => contextFileInputRef.current?.click()}
                                                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                                                >
                                                    {aiFileContent ? 'Change' : 'Select'} <Paperclip size={10}/>
                                                </button>
                                            </div>
                                            {aiFileContent ? (
                                                <div className="text-[10px] text-cyan-500 italic truncate max-w-full">File Loaded ({aiFileContent.length} chars)</div>
                                            ) : (
                                                <div className="text-[10px] text-zinc-600 italic">No file selected.</div>
                                            )}
                                        </div>

                                        <textarea 
                                            className="w-full h-20 bg-[#0f1729] border border-zinc-700/50 rounded p-2 text-xs text-zinc-200 focus:border-cyan-500/50 outline-none resize-none placeholder-zinc-600"
                                            placeholder="Ex: Extract fields from this C# class for the selected node..."
                                            value={aiCustomPrompt}
                                            onChange={(e) => setAiCustomPrompt(e.target.value)}
                                        />
                                        
                                        <button 
                                            onClick={handleAIFileAction}
                                            disabled={!aiCustomPrompt}
                                            className="w-full bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] rounded py-1.5 text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Sparkles size={12}/> Run Analysis
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Resize Handle (only when selected) */}
                {selectedNodeId === node.id && (
                    <div 
                        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-sm z-30"
                        onMouseDown={(e) => handleResizeStart(e, node.id)}
                    />
                )}
                
                {(node.subDiagramId || node.url) && (
                    <div className="absolute -bottom-4 left-0 w-full flex justify-center gap-1">
                        {node.url && <div className="text-[9px] text-cyan-400">🔗</div>}
                        {node.subDiagramId && <div className="text-[9px] text-blue-400">↳</div>}
                    </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Import Modal */}
          {showMermaidImport && (
               <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                   <div className="bg-[#111827] border border-zinc-700 p-6 rounded-xl w-[500px] shadow-2xl">
                       <h2 className="text-lg font-bold text-blue-400 mb-4 font-['Orbitron']">Import Mermaid Code</h2>
                       <textarea 
                          className="w-full h-40 bg-[#0f1729] border border-zinc-700 rounded p-3 text-xs font-mono text-zinc-300 focus:border-blue-500 outline-none mb-4"
                          placeholder="Paste graph TD..."
                          value={mermaidInput}
                          onChange={e => setMermaidInput(e.target.value)}
                       />
                       <div className="flex justify-end gap-2">
                           <button onClick={() => setShowMermaidImport(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                           <button onClick={handleImportMermaid} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Import</button>
                       </div>
                   </div>
               </div>
          )}

          {/* Mermaid Preview */}
          {showMermaidCode && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#111827]/95 backdrop-blur border border-zinc-700 rounded-lg p-4 shadow-2xl z-30 max-h-48 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-bold text-xs uppercase font-['Orbitron']">Mermaid Source</span>
                <button onClick={() => setShowMermaidCode(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <pre className="text-xs text-zinc-300 font-mono select-all">
                {generateMermaidCode(currentDiagram)}
              </pre>
            </div>
          )}
        </div>

        <div className="flex border-l border-zinc-700/50 relative z-20 shadow-xl">
           <PropertiesPanel 
             selectedNode={selectedNode}
             selectedEdge={selectedEdge}
             onUpdateNode={(id, u) => updateCurrentDiagram({ nodes: currentDiagram.nodes.map(n => n.id === id ? { ...n, ...u } : n) })}
             onUpdateEdge={(id, u) => updateCurrentDiagram({ edges: currentDiagram.edges.map(e => e.id === id ? { ...e, ...u } : e) })}
             onDeleteNode={(id) => updateCurrentDiagram({ nodes: currentDiagram.nodes.filter(n => n.id !== id && n.parentId !== id), edges: currentDiagram.edges.filter(e => e.source !== id && e.target !== id) })}
             onDeleteEdge={(id) => updateCurrentDiagram({ edges: currentDiagram.edges.filter(e => e.id !== id) })}
             onCreateSubDiagram={() => {}}
             onEnterSubDiagram={() => {}}
             nodes={currentDiagram.nodes} // Passing all nodes to props panel for linking
           />
           <div className="w-80 border-l border-zinc-700/50">
             <AIChat 
               currentDiagram={currentDiagram} 
               onUpdateDiagram={(newDiag) => updateCurrentDiagram(newDiag)} 
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
