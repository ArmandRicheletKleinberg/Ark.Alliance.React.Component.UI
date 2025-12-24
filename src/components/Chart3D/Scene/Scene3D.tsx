/**
 * @fileoverview Chart3D Scene3D Canvas Component
 * @module components/Chart3D/Scene
 * 
 * Main Three.js canvas wrapper with camera, lights, and effects.
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { DataPoint, Chart3DModel } from '../Chart3D.model';
import { AxisSystem } from './AxisSystem';
import { ChartShapes } from './ChartShapes';
import { SurfaceRibbon } from './SurfaceRibbon';
import './Scene3D.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Scene3DProps {
    data: DataPoint[];
    config: Chart3DModel;
    onHoverPoint: (point: DataPoint | null) => void;
    hoveredPoint: DataPoint | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Scene3D: React.FC<Scene3DProps> = ({
    data,
    config,
    onHoverPoint,
    hoveredPoint
}) => {
    return (
        <div className="ark-scene3d">
            <Canvas shadows dpr={[1, 2]} gl={{ toneMappingExposure: 1.0 }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[15, 15, 25]} fov={50} />
                    <OrbitControls
                        target={[10, 5, 5]}
                        maxPolarAngle={Math.PI / 2 - 0.1}
                        minDistance={5}
                        maxDistance={50}
                    />

                    {/* Dark Background */}
                    <color attach="background" args={['#02040a']} />

                    {/* Environment Decor */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={40} scale={20} size={3} speed={0.4} opacity={0.2} position={[10, 5, 5]} color="#ffffff" />

                    {/* Environment Map for Reflections */}
                    <Environment preset="city" background={false} blur={0.8} />

                    {/* Lighting */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 20, 10]} intensity={0.8} color="#ffffff" />
                    <pointLight position={[-10, 5, 20]} intensity={1.5} color="#3b82f6" />
                    <pointLight position={[30, 5, -10]} intensity={1.5} color="#f43f5e" />

                    <group>
                        {config.showGrid && (
                            <AxisSystem
                                brightness={config.gridBrightness}
                                fontFamily={config.fontFamily}
                                fontSizeLabels={config.fontSizeLabels}
                                fontSizeValues={config.fontSizeValues}
                                bgImageOpacity={config.bgImageOpacity}
                                bgImageUrl={config.bgImageUrl}
                                bgImageScale={config.bgImageScale}
                            />
                        )}

                        <ChartShapes
                            data={data}
                            config={config}
                            onHover={onHoverPoint}
                            hoveredPointId={hoveredPoint?.id || null}
                        />

                        <SurfaceRibbon data={data} config={config} />
                    </group>

                    {/* Post Processing */}
                    <EffectComposer enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={0.2}
                            mipmapBlur
                            intensity={config.bloomIntensity}
                            radius={0.6}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Hover Info Overlay */}
            {hoveredPoint && (
                <div className="ark-scene3d__tooltip">
                    <h3 className="ark-scene3d__tooltip-title">Data Point</h3>
                    <div className="ark-scene3d__tooltip-row">
                        <span>Value (Y):</span>
                        <span className="ark-scene3d__tooltip-value">{hoveredPoint.y.toFixed(4)}</span>
                    </div>
                    <div className="ark-scene3d__tooltip-row">
                        <span>Time (X):</span>
                        <span>{hoveredPoint.x.toFixed(2)}</span>
                    </div>
                    <div className="ark-scene3d__tooltip-row">
                        <span>Series (Z):</span>
                        <span>{hoveredPoint.z.toFixed(2)}</span>
                    </div>
                    {hoveredPoint.open !== undefined && (
                        <>
                            <div className="ark-scene3d__tooltip-row">
                                <span>Open:</span>
                                <span>{hoveredPoint.open.toFixed(2)}</span>
                            </div>
                            <div className="ark-scene3d__tooltip-row">
                                <span>Close:</span>
                                <span>{hoveredPoint.close?.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Title Overlay */}
            <div className="ark-scene3d__title">
                <h1>Ark.Alliance.Chart3D</h1>
                <p>Real-time Visualization</p>
            </div>
        </div>
    );
};

export default Scene3D;
