
import React from 'react';
import { ShapeType } from '../types';
import { 
  Square, Circle, Diamond, Cylinder, RefreshCw, GitMerge, 
  Monitor, Layout, Hexagon, User, Server, Waves, Smartphone, Brain, Settings, Table,
  Gauge, Activity, BarChart3, ToggleLeft, Calendar, DollarSign,
  LogIn, FormInput, Globe, FileInput, Mail, LayoutDashboard, FileSignature,
  DatabaseZap, PlayCircle, GitCompare
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: ShapeType) => {
    e.dataTransfer.setData('shapeType', type);
  };

  const toolClass = "w-full p-2.5 mb-2 bg-[rgba(255,255,255,0.03)] rounded-lg hover:bg-[linear-gradient(135deg,#2563eb,#3b82f6)] hover:shadow-[0_4px_15px_rgba(59,130,246,0.3)] border border-transparent hover:border-blue-400/30 cursor-grab transition-all duration-200 flex items-center gap-3 group";
  const iconClass = "w-5 h-5 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0";
  const labelClass = "text-sm text-zinc-400 group-hover:text-white font-medium transition-colors";
  const separatorClass = "w-full h-px bg-zinc-700/50 my-3";
  const sectionTitleClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2 mt-4 font-['Orbitron']";

  return (
    <div 
      className="w-56 h-full flex flex-col py-4 px-3 select-none overflow-y-auto"
      style={{
        background: 'rgba(17, 24, 39, 0.9)',
        borderRight: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className={sectionTitleClass}>Basic Shapes</div>
      
      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Process)}
        className={toolClass}
        title="Process"
      >
        <Square className={iconClass} />
        <span className={labelClass}>Process</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Rounded)}
        className={toolClass}
        title="Start/End"
      >
        <div className={`w-5 h-5 border-2 border-zinc-400 rounded-lg group-hover:border-white transition-colors`} />
        <span className={labelClass}>Round</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Circle)}
        className={toolClass}
        title="Connector"
      >
        <Circle className={iconClass} />
        <span className={labelClass}>Circle</span>
      </div>

      <div className={sectionTitleClass}>Logic & Flow</div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Diamond)}
        className={toolClass}
        title="Decision"
      >
        <GitMerge className={iconClass} />
        <span className={labelClass}>Decision</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Switch)}
        className={toolClass}
        title="Switch"
      >
        <Hexagon className={iconClass} />
        <span className={labelClass}>Switch</span>
      </div>
      
      <div className={sectionTitleClass}>Data & Struct</div>
      
       <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Cylinder)}
        className={toolClass}
        title="Database"
      >
        <Cylinder className={iconClass} />
        <span className={labelClass}>Database</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Table)}
        className={toolClass}
        title="Table/Grid"
      >
        <Table className={iconClass} />
        <span className={labelClass}>Table</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Loop)}
        className={toolClass}
        title="Loop/Container"
      >
        <RefreshCw className={iconClass} />
        <span className={labelClass}>Loop</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Class)}
        className={toolClass}
        title="Class Model"
      >
        <Layout className={iconClass} />
        <span className={labelClass}>Class</span>
      </div>

      <div className={sectionTitleClass}>Components</div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Screen)}
        className={toolClass}
        title="Screen/UI"
      >
        <Monitor className={iconClass} />
        <span className={labelClass}>Screen</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.User)}
        className={toolClass}
        title="User"
      >
        <User className={iconClass} />
        <span className={labelClass}>User</span>
      </div>

       <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Service)}
        className={toolClass}
        title="Service/API"
      >
        <Server className={iconClass} />
        <span className={labelClass}>Service</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Stream)}
        className={toolClass}
        title="Streaming"
      >
        <Waves className={iconClass} />
        <span className={labelClass}>Stream</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Mobile)}
        className={toolClass}
        title="Mobile"
      >
        <Smartphone className={iconClass} />
        <span className={labelClass}>Mobile</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.AI)}
        className={toolClass}
        title="AI Process"
      >
        <Brain className={iconClass} />
        <span className={labelClass}>AI Model</span>
      </div>

      <div className={sectionTitleClass}>Dashboard</div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.KPI)}
        className={toolClass}
        title="KPI Card"
      >
        <DollarSign className={iconClass} />
        <span className={labelClass}>KPI</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Gauge)}
        className={toolClass}
        title="Circular Gauge"
      >
        <Gauge className={iconClass} />
        <span className={labelClass}>Gauge</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.LineChart)}
        className={toolClass}
        title="Line Chart"
      >
        <Activity className={iconClass} />
        <span className={labelClass}>Line Chart</span>
      </div>

       <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.BarChart)}
        className={toolClass}
        title="Bar Chart"
      >
        <BarChart3 className={iconClass} />
        <span className={labelClass}>Bar Chart</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Toggle)}
        className={toolClass}
        title="Toggle Switch"
      >
        <ToggleLeft className={iconClass} />
        <span className={labelClass}>Toggle</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Timeline)}
        className={toolClass}
        title="Timeline"
      >
        <Calendar className={iconClass} />
        <span className={labelClass}>Timeline</span>
      </div>

      <div className={sectionTitleClass}>Interfaces</div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Login)}
        className={toolClass}
        title="Login Page"
      >
        <LogIn className={iconClass} />
        <span className={labelClass}>Login</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Form)}
        className={toolClass}
        title="Form Builder"
      >
        <FormInput className={iconClass} />
        <span className={labelClass}>Form</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Panel)}
        className={toolClass}
        title="Control Panel"
      >
        <LayoutDashboard className={iconClass} />
        <span className={labelClass}>Panel</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.API)}
        className={toolClass}
        title="REST API"
      >
        <Globe className={iconClass} />
        <span className={labelClass}>REST API</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Listener)}
        className={toolClass}
        title="File Listener"
      >
        <FileInput className={iconClass} />
        <span className={labelClass}>Listener</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Mail)}
        className={toolClass}
        title="Mailbox"
      >
        <Mail className={iconClass} />
        <span className={labelClass}>Mailbox</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.WriteFile)}
        className={toolClass}
        title="Write File"
      >
        <FileSignature className={iconClass} />
        <span className={labelClass}>Write File</span>
      </div>

      <div className={sectionTitleClass}>Logic Data</div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.ReadDatabase)}
        className={toolClass}
        title="Read Database"
      >
        <DatabaseZap className={iconClass} />
        <span className={labelClass}>Read DB</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Button)}
        className={toolClass}
        title="Action Button"
      >
        <PlayCircle className={iconClass} />
        <span className={labelClass}>Button</span>
      </div>

      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, ShapeType.Mapper)}
        className={toolClass}
        title="Data Mapper"
      >
        <GitCompare className={iconClass} />
        <span className={labelClass}>Mapper</span>
      </div>
      
      <div className="mt-auto pt-4 text-[10px] text-zinc-600 text-center">
          v1.5.0
      </div>
    </div>
  );
};
