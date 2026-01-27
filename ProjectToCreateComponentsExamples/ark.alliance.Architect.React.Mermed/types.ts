
export enum ShapeType {
  Rectangle = 'rect',
  Rounded = 'rounded',
  Circle = 'circle',
  Diamond = 'diamond', // Used for Decision
  Rhombus = 'rhombus', // Alias for Diamond in UI if needed, but we use Diamond for decision
  Cylinder = 'cylinder',
  Loop = 'loop',
  
  // New Shapes
  Screen = 'screen',
  Class = 'class',
  Switch = 'switch',
  User = 'user',
  Process = 'process',
  Service = 'service',
  Stream = 'stream',
  Mobile = 'mobile',
  AI = 'ai',
  Table = 'table', // New Grid/List shape

  // Dashboard Shapes
  KPI = 'kpi',
  Gauge = 'gauge',
  LineChart = 'linechart',
  BarChart = 'barchart',
  Toggle = 'toggle',
  Timeline = 'timeline',

  // Advanced IO Shapes
  Login = 'login',
  Form = 'form',
  API = 'api',
  Listener = 'listener',
  Mail = 'mail',
  Panel = 'panel',
  WriteFile = 'writefile',
  
  // Data Logic Shapes (New)
  ReadDatabase = 'readdb',
  Button = 'button',
  Mapper = 'mapper'
}

export enum LineStyle {
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
}

export type ArrowType = 'none' | 'end' | 'start' | 'both'; 
export type MarkerType = 'none' | 'arrow' | 'circle' | 'square';
export type HandleType = 'top' | 'right' | 'bottom' | 'left';

export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  fontSize: number;
  borderStyle: LineStyle;
  opacity: number;
  shadow: boolean;
}

export interface ClassProperty {
    id: string;
    name: string;
    type: string;
    isMandatory: boolean;
}

export interface TableData {
    headers: string[];
    rows: string[][];
    columnWidths?: number[]; // Added for custom column sizing
}

export interface ChartSeries {
    id: string;
    name: string;
    color: string;
    data: number[];
}

export interface TimelineMilestone {
    id: string;
    date: string;
    title: string;
    description?: string;
}

export interface DashboardData {
    // KPI
    value?: number;
    referenceValue?: number;
    unit?: string;
    
    // Gauge
    min?: number;
    max?: number;
    colorStart?: string;
    colorEnd?: string;

    // Charts
    xAxisLabel?: string;
    yAxisLabel?: string;
    categories?: string[]; // X-Axis labels
    series?: ChartSeries[];

    // Toggle
    checked?: boolean;
    onLabel?: string;
    offLabel?: string;

    // Timeline
    milestones?: TimelineMilestone[];
}

// --- New Data Interfaces ---

export type FormFieldType = 'text' | 'checkbox' | 'select' | 'date' | 'decimal' | 'integer' | 'currency';
export type PanelVisualizationType = 'text' | 'icon' | 'toggle' | 'gauge-vert' | 'gauge-circ';
export type FormActionType = 'save' | 'send' | 'create' | 'cancel' | 'none';

export interface FormField {
    id: string;
    label: string;
    type: FormFieldType;
    options?: string; // Comma separated options for select
    currency?: string; // Symbol for currency
    value?: string; // Default or display value
}

export interface PanelField {
    id: string;
    label: string;
    type: FormFieldType; // Underlying data type
    visualization: PanelVisualizationType; // How it looks
    value?: any;
    icon?: string; // generic icon name
}

export interface APIEndpoint {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    outputNodeId?: string; // Link to another node
}

export interface WriteFileData {
    fileNamePattern: string; // e.g. "Export_{Today(DDMMYY)}_{ID}"
    fileExtension: string; // e.g. "json", "xml", "csv"
}

export interface DatabaseConfig {
    dbType: 'sqlserver' | 'cosmos' | 'postgres' | 'mysql' | 'db2' | 'sqlite';
    connectionString?: string;
    table?: string;
    userId?: string;
    password?: string;
}

// New Interfaces for ReadDB, Button, Mapper

export interface ReadDatabaseData {
    connectionNodeId?: string; // Links to a Cylinder/Database node
    sqlQuery?: string;
}

export interface ButtonData {
    label: string;
    eventName: string; // e.g., "Read SQL"
    targetNodeId?: string; // The component to trigger
}

export interface MappingRule {
    id: string;
    sourceField: string; // Or the basic field name
    targetField: string;
    isExpression?: boolean; // Toggle for complex logic
    expression?: string; // e.g. @TableX.Get(id=1).Name + ' ' + src.LastName
}

export interface MapperData {
    inputClassId?: string; // ID of the Class node input
    outputClassId?: string; // ID of the Class node output
    dataSourceId?: string; // ID of a Database or ReadDB node
    referenceNodeIds?: string[]; // IDs of Table nodes used for lookup
    queryOrTable?: string; // "SELECT * FROM..." or "TableName"
    rules: MappingRule[];
}

export interface AIConfig {
    endpoint?: string; // API Endpoint
    model?: string; // e.g. gpt-4, gemini-1.5-pro
    temperature?: number; // 0.0 to 1.0
    maxTokens?: number;
    systemPrompt?: string;
    userPrompt?: string; // Can contain placeholders like {{data}}
    inputSourceNodeId?: string; // Linked ReadDB or Data source
    outputSchemaClassId?: string; // Linked Class defining the JSON structure
}

export interface IOData {
    // Form
    formFields?: FormField[];
    formAction?: FormActionType; // Button type
    targetDbTableName?: string; // For auto-sync logic
    
    // API
    endpoints?: APIEndpoint[];

    // File Listener
    directory?: string;
    filePattern?: string;
    listenerOutputNodeId?: string;

    // Mail
    smtpHost?: string;
    smtpPort?: number;
    popHost?: string;
    popPort?: number;
    email?: string;
}

export interface PanelData {
    tableName?: string;
    fields?: PanelField[];
}

export interface DiagramNode {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  url?: string; 
  subDiagramId?: string | null; 
  parentId?: string | null; // For grouping (e.g. inside a Loop)
  style: NodeStyle;
  
  // Shape specific data
  classProperties?: ClassProperty[];
  switchState?: string; // For Switch shape
  tableData?: TableData; // For Table shape
  dashboardData?: DashboardData; // For Dashboard shapes
  ioData?: IOData; // For Advanced IO shapes
  panelData?: PanelData; // For Panel Shape
  writeFileData?: WriteFileData; // For WriteFile Shape
  databaseData?: DatabaseConfig; // For Cylinder/Database Shape
  
  // Logic Data
  readDatabaseData?: ReadDatabaseData;
  buttonData?: ButtonData;
  mapperData?: MapperData;
  aiData?: AIConfig; // For AI Shape
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: HandleType; // Which side of source
  targetHandle?: HandleType; // Which side of target
  text?: string;
  style: {
    strokeColor: string;
    strokeWidth: number;
    lineStyle: LineStyle;
    animated?: boolean;
    curve: boolean; // Controls Bezier vs Straight in Default, or Rounded corners in Orthogonal
    routing: 'default' | 'orthogonal'; // New property for smart routing
    markerStart: MarkerType;
    markerEnd: MarkerType;
    markerStartColor?: string;
    markerEndColor?: string;
    markerSize?: number; // New property for arrow size
  };
}

export interface DiagramData {
  id: string;
  parentId: string | null;
  name: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface AppState {
  diagrams: Record<string, DiagramData>;
  currentDiagramId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  searchResults?: SearchResult[];
}

export interface SearchResult {
  title: string;
  uri: string;
}
