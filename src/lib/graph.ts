import type { Note } from '../types';

export interface GraphNode {
    id: string;
    name: string;
    val: number;
}

export interface GraphLink {
    source: string;
    target: string;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export function getGraphData(notes: Note[]): GraphData {
    const nodes: GraphNode[] = notes.map(note => ({
        id: note.id,
        name: note.title || 'Untitled',
        val: 1
    }));

    const links: GraphLink[] = [];
    const titleToIdMap = new Map<string, string>();
    notes.forEach(note => {
        if (note.title) titleToIdMap.set(note.title, note.id);
    });

    notes.forEach(note => {
        // Search for [[Title]] or [[Title|Alias]]
        const regex = /\[\[(.*?)(?:\|.*?)?\]\]/g;
        let match;
        while ((match = regex.exec(note.content)) !== null) {
            const targetTitle = match[1];
            const targetId = titleToIdMap.get(targetTitle);

            if (targetId && targetId !== note.id) {
                // Avoid duplicate links
                const exists = links.some(l => l.source === note.id && l.target === targetId);
                if (!exists) {
                    links.push({
                        source: note.id,
                        target: targetId
                    });
                }
            }
        }
    });

    return { nodes, links };
}
