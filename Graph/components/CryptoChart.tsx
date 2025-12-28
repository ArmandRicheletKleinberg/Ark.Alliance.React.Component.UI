import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  Area,
} from 'recharts';
import { ChartDataPoint, ChartStyleSettings, ThresholdLine, TrendSignal } from '../types';
import { Wifi, WifiOff } from 'lucide-react';

interface CryptoChartProps {
  data: ChartDataPoint[];
  settings: ChartStyleSettings;
  thresholds: ThresholdLine[];
  signals: TrendSignal[];
  isConnected: boolean;
  symbol: string;
  currentInterval: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs font-mono">
        <p className="text-slate-400 mb-1">{new Date(label).toLocaleTimeString()}</p>
        <p className="text-emerald-400">High: {data.high.toFixed(2)}</p>
        <p className="text-rose-400">Low: {data.low.toFixed(2)}</p>
        <p className="text-white font-bold">Close: {data.close.toFixed(2)}</p>
        <p className="text-slate-500 mt-1">Vol: {data.volume.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const TrendBadge = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.trendType) return null;

    let fill = '#94a3b8';
    let text = '?';
    
    if (payload.trendType === 'LONG') {
        fill = '#10b981'; // emerald-500
        text = 'L';
    } else if (payload.trendType === 'SHORT') {
        fill = '#ef4444'; // red-500
        text = 'S';
    }

    return (
        <g transform={`translate(${cx},${cy})`}>
            <circle r={10} fill={fill} stroke="#fff" strokeWidth={1} />
            <text x={0} y={4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">{text}</text>
        </g>
    );
};

export const CryptoChart: React.FC<CryptoChartProps> = ({
  data,
  settings,
  thresholds,
  signals,
  isConnected,
  symbol,
  currentInterval
}) => {
  
  // Merge signals into data stream for visualization
  const displayData = useMemo(() => {
    return data.map(pt => {
        const sig = signals.find(s => s.time === pt.time);
        return {
            ...pt,
            trendType: sig ? sig.type : null,
            trendPrice: sig ? sig.price : null
        };
    });
  }, [data, signals]);

  const minPrice = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.min(...data.map(d => d.low)) * 0.999;
  }, [data]);

  const maxPrice = useMemo(() => {
    if (data.length === 0) return 100;
    return Math.max(...data.map(d => d.high)) * 1.001;
  }, [data]);

  const borderColor = settings.borderColor || '#334155';
  const boxShadow = `0 0 ${settings.boxShadowIntensity}px ${settings.boxShadowIntensity / 5}px rgba(0,0,0,0.5)`;

  const formatXAxis = (unixTime: number) => {
    const date = new Date(unixTime);
    if (currentInterval === '1s') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
        className="relative flex flex-col bg-slate-900 transition-all duration-300"
        style={{
            height: `${settings.height}px`,
            border: `${settings.borderWidth}px solid ${borderColor}`,
            borderRadius: `${settings.borderRadius}px`,
            boxShadow: boxShadow,
            overflow: 'hidden'
        }}
    >
        {/* Background Layer */}
        {settings.backgroundImage && (
            <div 
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `url(${settings.backgroundImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    opacity: settings.bgImageOpacity / 100,
                    transform: `scale(${settings.bgImageZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out'
                }}
            />
        )}

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white tracking-tight">{settings.headerTitle}</h1>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-indigo-400 border border-slate-700">
                    {symbol.toUpperCase()} • {currentInterval}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                    {data.length > 0 ? data[data.length - 1].close.toFixed(2) : '---'}
                </span>
                {settings.useLogScale && <span className="text-[10px] text-amber-500 font-bold border border-amber-500/50 px-1 rounded">LOG</span>}
            </div>
            <div className="flex items-center gap-2">
                {isConnected ? (
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold animate-pulse">
                        <Wifi size={14} /> LIVE
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-rose-500 text-xs font-bold">
                        <WifiOff size={14} /> DISCONNECTED
                    </div>
                )}
            </div>
        </div>

        {/* Chart Area */}
        <div className="relative z-10 flex-1 w-full h-full p-2">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData}>
                    <defs>
                        <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        tickFormatter={formatXAxis}
                        stroke="#64748b"
                        fontSize={11}
                        tickMargin={10}
                        minTickGap={50}
                    />
                    <YAxis 
                        domain={[minPrice, maxPrice]} 
                        scale={settings.useLogScale ? 'log' : 'auto'}
                        type="number"
                        allowDataOverflow
                        orientation="right"
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(val) => val.toFixed(2)}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Main Price Line */}
                    <Area 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorClose)" 
                        isAnimationActive={false} // Performance critical for 1s interval
                    />

                    {/* Trend Signals */}
                    <Scatter dataKey="trendPrice" shape={<TrendBadge />} isAnimationActive={false} />

                    {/* Custom Threshold Lines */}
                    {thresholds.map((line) => (
                        <ReferenceLine 
                            key={line.id}
                            y={line.price} 
                            stroke={line.color} 
                            strokeDasharray={line.style === 'solid' ? '' : line.style === 'dashed' ? '5 5' : '1 3'}
                            label={{ position: 'left', value: line.label, fill: line.color, fontSize: 10 }}
                        />
                    ))}
                    
                    {/* Current Price Line */}
                    {data.length > 0 && (
                         <ReferenceLine 
                            y={data[data.length - 1].close} 
                            stroke="#fff" 
                            strokeDasharray="3 3" 
                            strokeOpacity={0.5}
                        />
                    )}

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};