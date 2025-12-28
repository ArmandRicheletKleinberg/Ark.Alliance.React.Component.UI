import React, { useState, useEffect, useRef } from 'react';
import { streamService } from './services/streamService';
import { apiService } from './services/apiService';
import { ChartControls } from './components/ChartControls';
import { CryptoChart } from './components/CryptoChart';
import { ChartDataPoint, ChartStyleSettings, ThresholdLine, TrendSignal, StreamConfig } from './types';

const INITIAL_SETTINGS: ChartStyleSettings = {
  headerTitle: 'Nexus Futures Terminal',
  borderColor: '#475569',
  borderWidth: 1,
  borderRadius: 12,
  boxShadowIntensity: 10,
  backgroundImage: null,
  bgImageOpacity: 20,
  bgImageZoom: 1,
  height: 600,
  useLogScale: false,
};

// Based on the requirement:
// 1s interval -> 3 minutes history (180 seconds)
// 1m interval -> 3 hours history (180 minutes)
// We consistently fetch 180 candles.
const HISTORY_LIMIT = 180;
// STRICT BUFFER LIMIT: 
// To ensure the X-axis always displays exactly "180 x precision" history,
// and old data is removed immediately.
const MAX_DATA_BUFFER = 180; 

// Analysis Constants
const FAST_MA_PERIOD = 7;
const SLOW_MA_PERIOD = 25;

function App() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [signals, setSignals] = useState<TrendSignal[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdLine[]>([]);
  const [settings, setSettings] = useState<ChartStyleSettings>(INITIAL_SETTINGS);
  const [isConnected, setIsConnected] = useState(false);
  const [currentInterval, setCurrentInterval] = useState('1m');
  const [currentSymbol, setCurrentSymbol] = useState('solusdt');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const streamConfig: StreamConfig = {
    endpoint: 'wss://fstream.binance.com/ws/',
    symbol: currentSymbol,
    interval: currentInterval
  };

  // Helper: Calculate Simple Moving Average
  const calculateSMA = (data: ChartDataPoint[], period: number) => {
    if (data.length < period) return null;
    const slice = data.slice(data.length - period);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    return sum / period;
  };

  // Trend Analysis Logic
  const analyzeTrend = (currentData: ChartDataPoint[]) => {
    if (currentData.length < SLOW_MA_PERIOD + 1) return;

    // Get current and previous data points
    const currentPoints = currentData;
    const prevPoints = currentData.slice(0, -1);

    // Calculate current MAs
    const currFastMA = calculateSMA(currentPoints, FAST_MA_PERIOD);
    const currSlowMA = calculateSMA(currentPoints, SLOW_MA_PERIOD);

    // Calculate previous MAs
    const prevFastMA = calculateSMA(prevPoints, FAST_MA_PERIOD);
    const prevSlowMA = calculateSMA(prevPoints, SLOW_MA_PERIOD);

    if (!currFastMA || !currSlowMA || !prevFastMA || !prevSlowMA) return;

    const lastPoint = currentPoints[currentPoints.length - 1];
    let newType: 'LONG' | 'SHORT' | null = null;

    // Crossover Logic
    // Long: Fast crosses above Slow
    if (prevFastMA <= prevSlowMA && currFastMA > currSlowMA) {
        newType = 'LONG';
    } 
    // Short: Fast crosses below Slow
    else if (prevFastMA >= prevSlowMA && currFastMA < currSlowMA) {
        newType = 'SHORT';
    }

    if (newType) {
        setSignals(prev => {
            // Avoid duplicate signals for the same timestamp
            const exists = prev.find(s => s.time === lastPoint.time && s.type === newType);
            if (exists) return prev;
            return [...prev, {
                id: `${lastPoint.time}-${newType}`,
                time: lastPoint.time,
                type: newType,
                price: lastPoint.close
            }];
        });
    }
  };

  // Manage Data Stream & History Fetch
  useEffect(() => {
    let mounted = true;

    const initDataStream = async () => {
      // 1. Reset state and disconnect previous stream
      streamService.disconnect();
      setIsConnected(false);
      setIsLoadingHistory(true);
      
      // Clear data immediately to avoid showing mismatched intervals/symbols
      setData([]); 
      setSignals([]); // Clear signals on context switch

      // 2. Fetch Historical Data from REST API
      const history = await apiService.fetchHistoricalData(
        streamConfig.symbol, 
        streamConfig.interval, 
        HISTORY_LIMIT
      );

      if (!mounted) return;

      // 3. Set Historical Data
      setData(history);
      setIsLoadingHistory(false);

      // 4. Connect WebSocket for Real-time updates
      setIsConnected(true);
      streamService.connect(
        streamConfig.endpoint,
        streamConfig.symbol,
        streamConfig.interval,
        (newDataPoint, isCandleClose) => {
          setData(prev => {
            const last = prev[prev.length - 1];
            
            // If empty (shouldn't happen often due to history fetch), just add
            if (!last) return [newDataPoint];

            let newSet;
            // If same time, update last candle (it's still open)
            if (last.time === newDataPoint.time) {
              const updated = [...prev];
              updated[updated.length - 1] = newDataPoint;
              newSet = updated;
            } else {
              // New candle - Sliding Window Logic
              newSet = [...prev, newDataPoint];
              // Sliding window: Strict limit to maintain exact time window
              if (newSet.length > MAX_DATA_BUFFER) {
                  newSet = newSet.slice(newSet.length - MAX_DATA_BUFFER);
              }
            }
            
            // Run Analysis on updated dataset
            analyzeTrend(newSet);
            
            return newSet;
          });
        },
        (newSignal) => {
          // Deprecated: StreamService signals are removed, but we keep the callback arg for type compatibility if needed
        }
      );
    };

    initDataStream();

    return () => {
      mounted = false;
      streamService.disconnect();
      setIsConnected(false);
    };
  }, [currentInterval, currentSymbol]); // Trigger on interval OR symbol change

  const updateSettings = (newSettings: Partial<ChartStyleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addThreshold = (line: ThresholdLine) => {
    setThresholds(prev => [...prev, line]);
  };

  const removeThreshold = (id: string) => {
    setThresholds(prev => prev.filter(t => t.id !== id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
        document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Listener for ESC key exit
  useEffect(() => {
    const handleChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Chart Workspace */}
      <div 
        ref={containerRef}
        className={`flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 overflow-auto ${isFullscreen ? 'p-0' : ''}`}
      >
         <div className={`w-full max-w-6xl transition-all ${isFullscreen ? 'h-screen max-w-none' : ''} relative`}>
            
            {/* Loading Overlay */}
            {isLoadingHistory && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-mono text-indigo-400">Loading History...</span>
                    </div>
                </div>
            )}

            <CryptoChart 
                data={data}
                settings={{
                    ...settings,
                    height: isFullscreen ? window.innerHeight : settings.height,
                    borderRadius: isFullscreen ? 0 : settings.borderRadius,
                    borderWidth: isFullscreen ? 0 : settings.borderWidth,
                }}
                thresholds={thresholds}
                signals={signals}
                isConnected={isConnected && !isLoadingHistory}
                symbol={streamConfig.symbol}
                currentInterval={currentInterval}
            />
         </div>
      </div>

      {/* Control Sidebar */}
      {!isFullscreen && (
        <ChartControls 
            settings={settings}
            updateSettings={updateSettings}
            thresholds={thresholds}
            addThreshold={addThreshold}
            removeThreshold={removeThreshold}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            currentInterval={currentInterval}
            setInterval={setCurrentInterval}
            currentSymbol={currentSymbol}
            setSymbol={setCurrentSymbol}
        />
      )}
      
      {/* Floating Control Button in Fullscreen */}
      {isFullscreen && (
        <button 
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-50 bg-slate-800/80 p-2 rounded-full hover:bg-slate-700 text-white"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
        </button>
      )}

    </div>
  );
}

export default App;