
import React, { useRef } from 'react';
import { DiagramNode, DiagramEdge, LineStyle, MarkerType, ShapeType, FormFieldType, PanelVisualizationType, FormActionType } from '../types';
import { Trash2, Link, CornerDownRight, BoxSelect, Spline, Minus, MoveRight, Circle as CircleIcon, Square as SquareIcon, Activity, GitCommitHorizontal, CornerUpRight, Plus, X, ArrowRight, ArrowLeft, ArrowLeftRight, Upload, Plug, ArrowRightLeft, FunctionSquare, BrainCircuit } from 'lucide-react';

interface Props {
  selectedNode: DiagramNode | null;
  selectedEdge: DiagramEdge | null;
  onUpdateNode: (id: string, updates: Partial<DiagramNode>) => void;
  onUpdateEdge: (id: string, updates: Partial<DiagramEdge>) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onCreateSubDiagram: (nodeId: string) => void;
  onEnterSubDiagram: (subId: string) => void;
  nodes?: DiagramNode[]; // Added for linking output nodes
}

export const PropertiesPanel: React.FC<Props> = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onCreateSubDiagram,
  onEnterSubDiagram,
  nodes = []
}) => {
  const dataFileInputRef = useRef<HTMLInputElement>(null);
  
  // Handlers for Class Properties
  const addClassProperty = () => {
      if (!selectedNode) return;
      const newProp = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'newProp',
          type: 'String',
          isMandatory: false
      };
      const props = selectedNode.classProperties || [];
      onUpdateNode(selectedNode.id, { classProperties: [...props, newProp] });
  };

  const updateClassProperty = (propId: string, field: string, value: any) => {
      if (!selectedNode || !selectedNode.classProperties) return;
      const newProps = selectedNode.classProperties.map(p => 
          p.id === propId ? { ...p, [field]: value } : p
      );
      onUpdateNode(selectedNode.id, { classProperties: newProps });
  };

  const removeClassProperty = (propId: string) => {
      if (!selectedNode || !selectedNode.classProperties) return;
      const newProps = selectedNode.classProperties.filter(p => p.id !== propId);
      onUpdateNode(selectedNode.id, { classProperties: newProps });
  };
  
  // Handlers for Table Shape
  const addTableRow = () => {
      if (!selectedNode || !selectedNode.tableData) return;
      const colCount = selectedNode.tableData.headers.length;
      const newRow = new Array(colCount).fill('Data');
      const newRows = [...selectedNode.tableData.rows, newRow];
      onUpdateNode(selectedNode.id, { tableData: { ...selectedNode.tableData, rows: newRows } });
  };
  
  const addTableCol = () => {
      if (!selectedNode || !selectedNode.tableData) return;
      const newHeaders = [...selectedNode.tableData.headers, 'New Col'];
      // Default new column width to 100
      const currentWidths = selectedNode.tableData.columnWidths || new Array(selectedNode.tableData.headers.length).fill(100);
      const newWidths = [...currentWidths, 100];
      
      const newRows = selectedNode.tableData.rows.map(r => [...r, 'Data']);
      onUpdateNode(selectedNode.id, { 
          tableData: { 
              headers: newHeaders, 
              rows: newRows,
              columnWidths: newWidths
          } 
      });
  };

  const updateColumnName = (index: number, name: string) => {
      if (!selectedNode || !selectedNode.tableData) return;
      const newHeaders = [...selectedNode.tableData.headers];
      newHeaders[index] = name;
      onUpdateNode(selectedNode.id, { tableData: { ...selectedNode.tableData, headers: newHeaders } });
  };

  const updateColumnWidth = (index: number, width: number) => {
       if (!selectedNode || !selectedNode.tableData) return;
       const currentWidths = selectedNode.tableData.columnWidths || new Array(selectedNode.tableData.headers.length).fill(100);
       const newWidths = [...currentWidths];
       newWidths[index] = width;
       onUpdateNode(selectedNode.id, { tableData: { ...selectedNode.tableData, columnWidths: newWidths } });
  };

  const deleteColumn = (index: number) => {
      if (!selectedNode || !selectedNode.tableData) return;
      const newHeaders = selectedNode.tableData.headers.filter((_, i) => i !== index);
      
      const currentWidths = selectedNode.tableData.columnWidths || new Array(selectedNode.tableData.headers.length).fill(100);
      const newWidths = currentWidths.filter((_, i) => i !== index);

      const newRows = selectedNode.tableData.rows.map(row => row.filter((_, i) => i !== index));

      onUpdateNode(selectedNode.id, { 
          tableData: { 
              headers: newHeaders, 
              rows: newRows,
              columnWidths: newWidths
          } 
      });
  };

  // --- DASHBOARD HANDLERS ---
  const handleDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !selectedNode) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          try {
              const json = JSON.parse(ev.target?.result as string);
              // Basic validation - just ensure it's an object and merge
              if (json && typeof json === 'object') {
                  const currentDash = selectedNode.dashboardData || {};
                  onUpdateNode(selectedNode.id, { dashboardData: { ...currentDash, ...json } });
              } else {
                  alert("Invalid JSON data");
              }
          } catch(err) {
              alert("Error parsing JSON");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const addChartSeries = () => {
      if (!selectedNode || !selectedNode.dashboardData) return;
      const currentSeries = selectedNode.dashboardData.series || [];
      const newSeries = { 
          id: Math.random().toString(36).substr(2,9), 
          name: 'New Series', 
          color: '#ffffff', 
          data: [10, 20, 15, 30] 
      };
      onUpdateNode(selectedNode.id, { dashboardData: { ...selectedNode.dashboardData, series: [...currentSeries, newSeries] } });
  };

  const updateChartSeries = (index: number, field: string, value: any) => {
      if (!selectedNode || !selectedNode.dashboardData?.series) return;
      const newSeries = [...selectedNode.dashboardData.series];
      newSeries[index] = { ...newSeries[index], [field]: value };
      onUpdateNode(selectedNode.id, { dashboardData: { ...selectedNode.dashboardData, series: newSeries } });
  };

  const addMilestone = () => {
      if (!selectedNode || !selectedNode.dashboardData) return;
      const current = selectedNode.dashboardData.milestones || [];
      const newM = { id: Math.random().toString(36).substr(2,9), date: '2024-01-01', title: 'New Event' };
      onUpdateNode(selectedNode.id, { dashboardData: { ...selectedNode.dashboardData, milestones: [...current, newM] } });
  };

  const handleTestDbConnection = () => {
      // Simulation
      if (!selectedNode?.databaseData?.connectionString) {
          alert("Please provide a connection string.");
          return;
      }
      const type = selectedNode.databaseData.dbType || 'unknown';
      alert(`Connecting to ${type}...\n\nStatus: Success (200 OK)\nLatency: 12ms`);
  };

  // --- ADVANCED IO HANDLERS ---
  const addFormField = () => {
      if (!selectedNode) return;
      const currentFields = selectedNode.ioData?.formFields || [];
      const newField = { id: Math.random().toString(36).substr(2,9), label: 'New Field', type: 'text' as FormFieldType };
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, formFields: [...currentFields, newField] } });
  };

  const updateFormField = (index: number, field: string, value: any) => {
      if (!selectedNode || !selectedNode.ioData?.formFields) return;
      const newFields = [...selectedNode.ioData.formFields];
      newFields[index] = { ...newFields[index], [field]: value };
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, formFields: newFields } });
  };

  const deleteFormField = (index: number) => {
      if (!selectedNode || !selectedNode.ioData?.formFields) return;
      const newFields = selectedNode.ioData.formFields.filter((_, i) => i !== index);
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, formFields: newFields } });
  };

  const addPanelField = () => {
      if (!selectedNode) return;
      const current = selectedNode.panelData?.fields || [];
      const newField = { 
          id: Math.random().toString(36).substr(2,9), 
          label: 'New Data', 
          type: 'text' as FormFieldType, 
          visualization: 'text' as PanelVisualizationType,
          value: '0'
      };
      onUpdateNode(selectedNode.id, { panelData: { ...selectedNode.panelData, fields: [...current, newField] } });
  };

  const updatePanelField = (index: number, field: string, value: any) => {
      if (!selectedNode || !selectedNode.panelData?.fields) return;
      const newFields = [...selectedNode.panelData.fields];
      // @ts-ignore
      newFields[index] = { ...newFields[index], [field]: value };
      onUpdateNode(selectedNode.id, { panelData: { ...selectedNode.panelData, fields: newFields } });
  };

  const deletePanelField = (index: number) => {
      if (!selectedNode || !selectedNode.panelData?.fields) return;
      const newFields = selectedNode.panelData.fields.filter((_, i) => i !== index);
      onUpdateNode(selectedNode.id, { panelData: { ...selectedNode.panelData, fields: newFields } });
  };

  const addEndpoint = () => {
      if (!selectedNode) return;
      const currentEps = selectedNode.ioData?.endpoints || [];
      const newEp = { id: Math.random().toString(36).substr(2,9), method: 'GET', url: '/api/resource' };
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, endpoints: [...currentEps, newEp] } });
  };

  const updateEndpoint = (index: number, field: string, value: any) => {
      if (!selectedNode || !selectedNode.ioData?.endpoints) return;
      const newEps = [...selectedNode.ioData.endpoints];
      // @ts-ignore
      newEps[index] = { ...newEps[index], [field]: value };
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, endpoints: newEps } });
  };

  const deleteEndpoint = (index: number) => {
      if (!selectedNode || !selectedNode.ioData?.endpoints) return;
      const newEps = selectedNode.ioData.endpoints.filter((_, i) => i !== index);
      onUpdateNode(selectedNode.id, { ioData: { ...selectedNode.ioData, endpoints: newEps } });
  };

  // --- MAPPER HANDLERS ---
  const addMappingRule = () => {
      if (!selectedNode) return;
      const currentRules = selectedNode.mapperData?.rules || [];
      const newRule = { id: Math.random().toString(36).substr(2,9), sourceField: '', targetField: '', isExpression: false, expression: '' };
      onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, rules: [...currentRules, newRule] } });
  };

  const updateMappingRule = (index: number, field: string, value: any) => {
      if (!selectedNode || !selectedNode.mapperData?.rules) return;
      const newRules = [...selectedNode.mapperData.rules];
      // @ts-ignore
      newRules[index] = { ...newRules[index], [field]: value };
      onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, rules: newRules } });
  };

  const deleteMappingRule = (index: number) => {
      if (!selectedNode || !selectedNode.mapperData?.rules) return;
      const newRules = selectedNode.mapperData.rules.filter((_, i) => i !== index);
      onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, rules: newRules } });
  };

  const toggleReferenceTable = (refId: string) => {
      if (!selectedNode || !selectedNode.mapperData) return;
      const currentRefs = selectedNode.mapperData.referenceNodeIds || [];
      const newRefs = currentRefs.includes(refId) 
          ? currentRefs.filter(id => id !== refId) 
          : [...currentRefs, refId];
      onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData, referenceNodeIds: newRefs } });
  };


  if (!selectedNode && !selectedEdge) {
    return (
      <div 
        className="w-80 h-full flex flex-col items-center justify-center text-zinc-500"
        style={{ background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)' }}
      >
        <BoxSelect className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select an element to edit</p>
      </div>
    );
  }

  // Helper to render marker selector
  const renderMarkerSelector = (
      label: string, 
      currentType: MarkerType, 
      currentColor: string | undefined, 
      onTypeChange: (t: MarkerType) => void, 
      onColorChange: (c: string) => void
  ) => (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
         <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</label>
         {currentType !== 'none' && (
             <input
               type="color"
               value={currentColor || '#71717a'}
               onChange={(e) => onColorChange(e.target.value)}
               className="w-4 h-4 bg-transparent border-none cursor-pointer rounded overflow-hidden"
               title="Marker Color"
             />
         )}
       </div>
       <div className="grid grid-cols-4 gap-2">
         {[
           { id: 'none', icon: Minus, label: 'None' },
           { id: 'arrow', icon: MoveRight, label: 'Arrow' },
           { id: 'circle', icon: CircleIcon, label: 'Circle' },
           { id: 'square', icon: SquareIcon, label: 'Square' },
         ].map((opt) => (
            <button
                key={opt.id}
                onClick={() => onTypeChange(opt.id as MarkerType)}
                className={`p-2 rounded border flex justify-center items-center transition-all ${currentType === opt.id ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                title={opt.label}
            >
                <opt.icon size={14} />
            </button>
         ))}
       </div>
    </div>
  );

  return (
    <div 
        className="w-80 h-full overflow-y-auto"
        style={{ background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)' }}
    >
      <div className="p-4 border-b border-zinc-700/50 font-bold text-blue-400 font-['Orbitron'] tracking-wide flex justify-between items-center">
        <span>PROPERTIES</span>
        <button 
          onClick={() => selectedNode ? onDeleteNode(selectedNode.id) : selectedEdge && onDeleteEdge(selectedEdge.id)}
          className="text-red-500/80 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {selectedNode && (
          <>
            {/* DATA UPLOAD FOR DASHBOARD ITEMS */}
            {(selectedNode.type === ShapeType.KPI || selectedNode.type === ShapeType.Gauge || selectedNode.type === ShapeType.LineChart || selectedNode.type === ShapeType.BarChart || selectedNode.type === ShapeType.Timeline) && (
                <div className="pb-4 border-b border-zinc-700/50">
                    <input 
                        type="file" 
                        ref={dataFileInputRef} 
                        className="hidden" 
                        accept=".json" 
                        onChange={handleDataUpload} 
                    />
                    <button 
                        onClick={() => dataFileInputRef.current?.click()}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs py-2 rounded border border-zinc-600 border-dashed flex items-center justify-center gap-2"
                    >
                        <Upload size={14} /> Load Data (JSON)
                    </button>
                </div>
            )}

            {/* WRITE FILE EDITOR */}
            {selectedNode.type === ShapeType.WriteFile && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Filename Pattern</label>
                        <input
                            type="text"
                            value={selectedNode.writeFileData?.fileNamePattern || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { writeFileData: { ...selectedNode.writeFileData!, fileNamePattern: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-sm outline-none font-mono"
                            placeholder="Report_{Today(DDMMYY)}"
                        />
                        <p className="text-[9px] text-zinc-600">Use {'{Today(format)}'} for dynamic dates.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Extension</label>
                        <select
                            value={selectedNode.writeFileData?.fileExtension || 'json'}
                            onChange={(e) => onUpdateNode(selectedNode.id, { writeFileData: { ...selectedNode.writeFileData!, fileExtension: e.target.value } })}
                            className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                        >
                            <option value="json">.json (JSON Data)</option>
                            <option value="txt">.txt (Text)</option>
                            <option value="csv">.csv (Comma Separated)</option>
                            <option value="xml">.xml (XML Data)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* AI CONFIG EDITOR */}
            {selectedNode.type === ShapeType.AI && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-400 border-b border-zinc-700 pb-2 mb-2">
                        <BrainCircuit size={16} />
                        <span className="text-xs font-bold uppercase">AI Configuration</span>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Provider Endpoint</label>
                        <input 
                            type="text"
                            value={selectedNode.aiData?.endpoint || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, endpoint: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none"
                            placeholder="https://api.openai.com/v1..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Model</label>
                            <input 
                                type="text"
                                value={selectedNode.aiData?.model || ''}
                                onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, model: e.target.value } })}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none"
                                placeholder="gpt-4"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Max Tokens</label>
                            <input 
                                type="number"
                                value={selectedNode.aiData?.maxTokens || 1024}
                                onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, maxTokens: parseInt(e.target.value) } })}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Temperature ({selectedNode.aiData?.temperature || 0.7})</label>
                        <input 
                            type="range"
                            min="0" max="2" step="0.1"
                            value={selectedNode.aiData?.temperature || 0.7}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, temperature: parseFloat(e.target.value) } })}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    <div className="space-y-2 border-t border-zinc-700/50 pt-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">System Prompt</label>
                        <textarea
                            value={selectedNode.aiData?.systemPrompt || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, systemPrompt: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none h-16 resize-none"
                            placeholder="You are a helpful assistant..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">User Prompt</label>
                        <textarea
                            value={selectedNode.aiData?.userPrompt || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, userPrompt: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none h-20 resize-none"
                            placeholder="Analyze this data: {{data}}"
                        />
                        <p className="text-[9px] text-zinc-600">Use {'{{data}}'} to insert linked input.</p>
                    </div>

                    <div className="space-y-2 border-t border-zinc-700/50 pt-2">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Input Source (ReadDB)</label>
                        <select 
                            className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                            value={selectedNode.aiData?.inputSourceNodeId || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, inputSourceNodeId: e.target.value } })}
                        >
                            <option value="">-- None --</option>
                            {nodes.filter(n => n.type === ShapeType.ReadDatabase || n.type === ShapeType.Table).map(n => (
                                <option key={n.id} value={n.id}>{n.text}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Output Schema (Class)</label>
                        <select 
                            className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                            value={selectedNode.aiData?.outputSchemaClassId || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { aiData: { ...selectedNode.aiData, outputSchemaClassId: e.target.value } })}
                        >
                            <option value="">-- None (Free Text) --</option>
                            {nodes.filter(n => n.type === ShapeType.Class).map(n => (
                                <option key={n.id} value={n.id}>{n.text}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* READ DATABASE EDITOR */}
            {selectedNode.type === ShapeType.ReadDatabase && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Connected Database</label>
                        <select 
                            className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                            value={selectedNode.readDatabaseData?.connectionNodeId || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { readDatabaseData: { ...selectedNode.readDatabaseData, connectionNodeId: e.target.value } })}
                        >
                            <option value="">-- Select DB Node --</option>
                            {nodes.filter(n => n.type === ShapeType.Cylinder).map(n => (
                                <option key={n.id} value={n.id}>{n.text}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">SQL Query</label>
                        <textarea
                            value={selectedNode.readDatabaseData?.sqlQuery || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { readDatabaseData: { ...selectedNode.readDatabaseData, sqlQuery: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none font-mono h-24 resize-none"
                            placeholder="SELECT * FROM table WHERE id = @event.id"
                        />
                    </div>
                </div>
            )}

            {/* BUTTON EDITOR */}
            {selectedNode.type === ShapeType.Button && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Button Label</label>
                        <input
                            type="text"
                            value={selectedNode.buttonData?.label || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { buttonData: { ...selectedNode.buttonData!, label: e.target.value }, text: e.target.value })} // Sync text
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-sm outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Event Name</label>
                        <input
                            type="text"
                            value={selectedNode.buttonData?.eventName || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { buttonData: { ...selectedNode.buttonData!, eventName: e.target.value } })}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-sm outline-none font-mono"
                            placeholder="e.g. readsql data"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Target Component</label>
                        <select 
                            className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                            value={selectedNode.buttonData?.targetNodeId || ''}
                            onChange={(e) => onUpdateNode(selectedNode.id, { buttonData: { ...selectedNode.buttonData!, targetNodeId: e.target.value } })}
                        >
                            <option value="">-- Select Target --</option>
                            {nodes.filter(n => n.id !== selectedNode.id).map(n => (
                                <option key={n.id} value={n.id}>{n.text} ({n.type})</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* MAPPER EDITOR */}
            {selectedNode.type === ShapeType.Mapper && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Input Source (Class/DB)</label>
                            <select 
                                className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                                value={selectedNode.mapperData?.dataSourceId || ''}
                                onChange={(e) => onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, dataSourceId: e.target.value } })}
                            >
                                <option value="">-- Select Source --</option>
                                {nodes.filter(n => n.type === ShapeType.Class || n.type === ShapeType.Cylinder || n.type === ShapeType.ReadDatabase).map(n => (
                                    <option key={n.id} value={n.id}>{n.text} ({n.type})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Source Query / Table</label>
                            <input
                                type="text"
                                value={selectedNode.mapperData?.queryOrTable || ''}
                                onChange={(e) => onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, queryOrTable: e.target.value } })}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-300 text-xs outline-none font-mono"
                                placeholder="Table or SQL"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Output Class</label>
                            <select 
                                className="w-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded outline-none p-2"
                                value={selectedNode.mapperData?.outputClassId || ''}
                                onChange={(e) => onUpdateNode(selectedNode.id, { mapperData: { ...selectedNode.mapperData!, outputClassId: e.target.value } })}
                            >
                                <option value="">-- Select Class --</option>
                                {nodes.filter(n => n.type === ShapeType.Class).map(n => (
                                    <option key={n.id} value={n.id}>{n.text}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Reference Tables</label>
                            <div className="bg-zinc-900/50 border border-zinc-700 rounded p-2 max-h-24 overflow-y-auto">
                                {nodes.filter(n => n.type === ShapeType.Table).map(n => (
                                    <div key={n.id} className="flex items-center gap-2 mb-1 last:mb-0">
                                        <input 
                                            type="checkbox"
                                            checked={selectedNode.mapperData?.referenceNodeIds?.includes(n.id) || false}
                                            onChange={() => toggleReferenceTable(n.id)}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-xs text-zinc-300 truncate">{n.text}</span>
                                    </div>
                                ))}
                                {nodes.filter(n => n.type === ShapeType.Table).length === 0 && (
                                    <div className="text-[10px] text-zinc-600 italic">No table nodes available</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-700/50 pt-2">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Field Mappings</label>
                            <button onClick={addMappingRule} className="text-blue-400 hover:text-white text-xs flex items-center gap-1"><Plus size={12}/> Map</button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {selectedNode.mapperData?.rules.map((rule, idx) => (
                                <div key={rule.id} className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => updateMappingRule(idx, 'isExpression', !rule.isExpression)}
                                            className={`p-1 rounded text-[10px] font-bold border transition-colors ${rule.isExpression ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
                                            title="Toggle Expression Mode"
                                        >
                                            f(x)
                                        </button>
                                        <ArrowRight size={10} className="text-zinc-500"/>
                                        <input 
                                            className="flex-1 bg-transparent text-xs text-zinc-300 border-b border-zinc-700 outline-none"
                                            value={rule.targetField}
                                            onChange={(e) => updateMappingRule(idx, 'targetField', e.target.value)}
                                            placeholder="Target Field"
                                        />
                                        <button onClick={() => deleteMappingRule(idx)} className="text-zinc-600 hover:text-red-500 ml-auto"><X size={12}/></button>
                                    </div>
                                    
                                    {rule.isExpression ? (
                                        <div className="relative">
                                            <input 
                                                className="w-full bg-zinc-950 border border-purple-500/30 text-xs text-purple-300 rounded p-1 font-mono outline-none placeholder-purple-900/50"
                                                value={rule.expression || ''}
                                                onChange={(e) => updateMappingRule(idx, 'expression', e.target.value)}
                                                placeholder="@Table.Get(id=1).Name + ' ' + src.Val"
                                            />
                                        </div>
                                    ) : (
                                        <input 
                                            className="w-full bg-transparent text-xs text-zinc-400 border-b border-zinc-800 outline-none p-1 italic"
                                            value={rule.sourceField}
                                            onChange={(e) => updateMappingRule(idx, 'sourceField', e.target.value)}
                                            placeholder="Source Field Name"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-[9px] text-zinc-500 mt-2 p-1 bg-zinc-900 rounded border border-zinc-800">
                            <strong>Hint:</strong> Use <code>@TableName.Get(filter).Col</code> to reference linked tables.
                        </div>
                    </div>
                </div>
            )}

            {/* ... Rest of existing components ... */}
          </>
        )}
      </div>
    </div>
  );
};
