import { GoogleGenAI, Type } from "@google/genai";
import { DiagramData, DiagramNode, DiagramEdge, ShapeType, LineStyle, MarkerType } from '../types';

// Helper to ensure we have a key (UI should handle the check, but good to have safety)
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const searchAndAssist = async (
  prompt: string, 
  currentDiagram: DiagramData,
  history: any[],
  fileContext?: string
): Promise<{ text: string, searchResults?: any[], updatedDiagram?: DiagramData }> => {
  const ai = getClient();
  const modelId = "gemini-3-pro-preview"; // Use powerful model for logic and tools

  // Note: Google Search tool cannot be used simultaneously with responseSchema/responseMimeType 'application/json'.
  // We prioritize structured JSON output for diagram modification over live search for this specific function.
  // const tools: any[] = [{ googleSearch: {} }]; 

  // Schema for modifying the diagram
  // We allow the model to return a completely new list of nodes/edges if it wants to modify
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      explanation: { type: Type.STRING, description: "Explanation of what was done or answer to the user." },
      modifyDiagram: { type: Type.BOOLEAN, description: "Whether the diagram was modified." },
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING }, // rect, circle, screen, class, table, etc.
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            text: { type: Type.STRING },
            parentId: { type: Type.STRING },
            style: {
                type: Type.OBJECT,
                properties: {
                    backgroundColor: {type: Type.STRING},
                    borderColor: {type: Type.STRING},
                    borderWidth: {type: Type.NUMBER},
                    textColor: {type: Type.STRING},
                    fontSize: {type: Type.NUMBER},
                }
            },
            // Optional property list for Class shapes
            classProperties: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        isMandatory: { type: Type.BOOLEAN }
                    }
                }
            },
            // Optional Table Data
            tableData: {
                type: Type.OBJECT,
                properties: {
                    headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    rows: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING } 
                        } 
                    }
                }
            }
          }
        }
      },
      edges: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            source: { type: Type.STRING },
            target: { type: Type.STRING },
            text: { type: Type.STRING },
            style: {
                type: Type.OBJECT,
                properties: {
                    strokeColor: { type: Type.STRING },
                    strokeWidth: { type: Type.NUMBER },
                    lineStyle: { type: Type.STRING }, // solid, dashed, dotted
                    animated: { type: Type.BOOLEAN },
                    markerStart: { type: Type.STRING }, // none, arrow, circle, square
                    markerEnd: { type: Type.STRING },
                    markerSize: { type: Type.NUMBER }
                }
            }
          }
        }
      }
    }
  };

  try {
    let context = `
      You are an expert Mermaid diagram architect assistant.
      Current Diagram JSON:
      ${JSON.stringify({ nodes: currentDiagram.nodes, edges: currentDiagram.edges })}

      User Request: ${prompt}
    `;

    if (fileContext) {
        context += `
        \n--- REFERENCE FILE CONTENT START ---
        ${fileContext}
        --- REFERENCE FILE CONTENT END ---
        
        Instruction: Use the content above to fulfill the user's request. 
        If the user asks to populate a Class, extract properties from the code/text.
        If the user asks to populate a Table, extract data rows.
        `;
    }

    context += `
      Instructions:
      1. Use your knowledge to answer questions.
      2. If the user asks to modify, create, or restructure the diagram, provide the NEW full list of nodes and edges in the JSON response.
      3. Maintain existing styles unless asked to change. 
      4. For new nodes, generate sensible X,Y coordinates (spread them out).
      5. Available shapes: rect, rounded, circle, diamond, cylinder, loop, screen, class, switch, user, process, service, stream, mobile, ai, table.
      6. IMPORTANT: If updating 'table' nodes, ensure 'tableData' is populated. If updating 'class' nodes, ensure 'classProperties' are populated.
      7. To insert a child diagram into a loop: create new nodes, place them geographically "inside" the loop node coordinates, and set their 'parentId' to the loop node's ID.
      8. Return an explanation.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: context,
      config: {
        // tools: tools, // Disabled to allow responseSchema
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const output = JSON.parse(response.text || "{}");
    // const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let searchResults: any[] = [];
    // if (grounding) {
    //     searchResults = grounding
    //         .filter((c: any) => c.web && c.web.uri && c.web.title)
    //         .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
    // }

    let updatedDiagram: DiagramData | undefined = undefined;

    if (output.modifyDiagram && output.nodes) {
        // Merge AI response with current structure types
        // The AI output might be partial on style, so we need to default
        const newNodes: DiagramNode[] = output.nodes.map((n: any) => ({
            id: n.id || Math.random().toString(36).substr(2,9),
            type: (n.type as ShapeType) || ShapeType.Rectangle,
            x: n.x || 0,
            y: n.y || 0,
            width: n.type === 'class' ? 160 : n.type === 'table' ? 200 : 150, // Default width
            height: n.type === 'class' ? 140 : n.type === 'table' ? 160 : 80, // Default height
            text: n.text || "Node",
            parentId: n.parentId || null,
            classProperties: n.classProperties || [],
            tableData: n.tableData,
            style: {
                backgroundColor: n.style?.backgroundColor || '#1f2937', // Zinc 800
                borderColor: n.style?.borderColor || '#34d399', // Emerald 400
                borderWidth: n.style?.borderWidth || 2,
                textColor: n.style?.textColor || '#f4f4f5', // Zinc 100
                fontSize: 14,
                borderStyle: LineStyle.Solid,
                opacity: 1,
                shadow: true,
            },
            subDiagramId: null
        }));

        const newEdges: DiagramEdge[] = (output.edges || []).map((e: any) => ({
            id: e.id || Math.random().toString(36).substr(2,9),
            source: e.source,
            target: e.target,
            text: e.text || "",
            style: {
                strokeColor: e.style?.strokeColor || '#71717a', // Zinc 500
                strokeWidth: e.style?.strokeWidth || 2,
                lineStyle: (e.style?.lineStyle as LineStyle) || LineStyle.Solid,
                animated: e.style?.animated || false,
                curve: true,
                routing: 'default',
                markerStart: (e.style?.markerStart as MarkerType) || 'none',
                markerEnd: (e.style?.markerEnd as MarkerType) || 'arrow',
                markerSize: e.style?.markerSize || 10
            }
        }));

        updatedDiagram = {
            ...currentDiagram,
            nodes: newNodes,
            edges: newEdges
        };
    }

    return {
        text: output.explanation || "Processed your request.",
        searchResults,
        updatedDiagram
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Sorry, I encountered an error processing your request." };
  }
};