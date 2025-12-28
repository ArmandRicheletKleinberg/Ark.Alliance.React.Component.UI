import { GoogleGenAI } from "@google/genai";
import { Appointment, Dock, DockStatus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to sanitize data for the AI to reduce token usage
const prepareDataForAI = (docks: Dock[], appointments: Appointment[]) => {
  return {
    current_time: new Date().toISOString(),
    docks: docks.map(d => ({ id: d.id, name: d.name, status: d.status })),
    active_appointments: appointments.filter(a => a.status !== 'COMPLETED').map(a => ({
      id: a.id,
      scheduled: a.scheduledTime,
      type: a.poNumber ? 'INBOUND' : 'OUTBOUND',
      status: a.status,
      dock_id: a.dockId,
      po: a.poNumber,
      desadv: a.desadv
    }))
  };
};

export const analyzeWarehouseStatus = async (docks: Dock[], appointments: Appointment[]): Promise<string> => {
  try {
    const data = prepareDataForAI(docks, appointments);
    const prompt = `
      You are an expert Warehouse Dock Manager AI. Analyze the current warehouse status provided in JSON format.
      
      Data: ${JSON.stringify(data)}

      Provide a concise executive summary (max 3 sentences) of the current situation. 
      Then, list 3 bullet points with specific recommendations to optimize flow or identifying potential bottlenecks (e.g., delayed trucks, tight schedules, idle docks).
      Format the output as Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error connecting to AI Assistant. Please check your API key.";
  }
};

export const suggestDockAssignment = async (newAppointment: Partial<Appointment>, docks: Dock[], appointments: Appointment[]): Promise<string> => {
    try {
        const data = prepareDataForAI(docks, appointments);
        const prompt = `
          I need to schedule a new ${newAppointment.poNumber ? 'INBOUND' : 'OUTBOUND'} truck (PO: ${newAppointment.poNumber || 'N/A'}).
          Estimated duration: ${newAppointment.estimatedDuration} minutes.
          Desired time: ${newAppointment.scheduledTime}.

          Current Schedule Context: ${JSON.stringify(data)}

          Recommend the best Dock ID for this appointment to minimize congestion. 
          Return ONLY the recommended Dock ID string (e.g., "D-01"). If no docks are available, return "NONE".
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const text = response.text?.trim() || "";
        // Simple heuristic extraction if the model is chatty
        const match = text.match(/D-\d+/); 
        return match ? match[0] : text;
    } catch (error) {
        console.error("Gemini Assignment Error:", error);
        return "D-01"; // Fallback
    }
}
