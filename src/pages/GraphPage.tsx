import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { getGraphData } from '../lib/graph';
import { useNavigate } from 'react-router-dom';

export function GraphPage() {
    const navigate = useNavigate();
    const notes = useLiveQuery(() => db.notes.toArray());

    const graphData = useMemo(() => {
        if (!notes) return { nodes: [], links: [] };
        return getGraphData(notes);
    }, [notes]);

    if (!notes) return <div className="p-10">Loading graph...</div>;

    return (
        <div className="w-full h-full bg-background relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h2 className="text-xl font-bold bg-background/80 px-2 py-1 rounded">Graph View</h2>
                <p className="text-xs text-muted-foreground ml-2">Click nodes to navigate</p>
            </div>

            <ForceGraph2D
                graphData={graphData}
                nodeLabel="name"
                backgroundColor="#0d1117"
                linkColor={() => "rgba(255, 255, 255, 0.1)"}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 10 / globalScale; // Smaller font
                    const radius = 4 / globalScale; // Small circle

                    // 1. Draw the Circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "#8b5cf6"; // Purple circle
                    ctx.fill();

                    // 2. Draw the Label
                    ctx.font = `${fontSize}px Inter, Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = '#94a3b8'; // SLATE-400 (uniform colour)
                    ctx.fillText(label, node.x, node.y + radius + 2); // Positioned below circle

                    // Update interaction dimensions
                    const textWidth = ctx.measureText(label).width;
                    node.__bckgDimensions = [Math.max(textWidth, radius * 2), radius * 2 + fontSize + 4];
                }}
                nodePointerAreaPaint={(node: any, color, ctx) => {
                    ctx.fillStyle = color;
                    const dims = node.__bckgDimensions;
                    if (dims) {
                        ctx.fillRect(node.x - dims[0] / 2, node.y - 4, dims[0], dims[1]);
                    }
                }}
                onNodeClick={(node: any) => {
                    navigate(`/note/${node.id}`);
                }}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
            />
        </div>
    );
}
