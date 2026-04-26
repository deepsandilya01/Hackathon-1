import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeIncident(title, description) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an emergency response AI for a hospitality venue. 
Analyze this incident and respond ONLY in JSON format with no extra text:
{
  "type": one of ["Fire", "Medical", "Security", "Natural Disaster", "Other"],
  "severity": one of ["Low", "Medium", "High", "Critical"],
  "isFake": boolean (true if it sounds like a prank, spam, or hoax, false if it seems like a real report),
  "confidenceScore": number between 0 and 100,
  "suggestedActions": array of strings containing 2-3 immediate actionable steps for the staff
}

Incident Title: ${title}
Incident Description: ${description}

Base severity on potential threat to human life and property.`;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    
    // Remove potential markdown formatting for JSON block
    if (textResult.startsWith("\`\`\`json")) {
        textResult = textResult.substring(7);
        if (textResult.endsWith("\`\`\`")) {
            textResult = textResult.substring(0, textResult.length - 3);
        }
    } else if (textResult.startsWith("\`\`\`")) {
        textResult = textResult.substring(3);
        if (textResult.endsWith("\`\`\`")) {
            textResult = textResult.substring(0, textResult.length - 3);
        }
    }

    const parsedData = JSON.parse(textResult.trim());
    return {
      type: parsedData.type || "Other",
      severity: parsedData.severity || "Medium",
      isFake: typeof parsedData.isFake === 'boolean' ? parsedData.isFake : false,
      confidenceScore: typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 80,
      suggestedActions: Array.isArray(parsedData.suggestedActions) ? parsedData.suggestedActions : []
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { type: "Other", severity: "Medium", isFake: false, confidenceScore: 50, suggestedActions: [] };
  }
}

export async function analyzeQuickIncident(message) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an emergency response AI for a hospitality venue.
A user has sent an unstructured emergency message. Extract the details and respond ONLY in JSON format with no extra text:
{
  "title": string (A concise 5-8 word title summarizing the incident),
  "location": string (Extract the location if mentioned, otherwise "Unknown"),
  "type": one of ["Fire", "Medical", "Security", "Natural Disaster", "Other"],
  "severity": one of ["Low", "Medium", "High", "Critical"],
  "isFake": boolean (true if it sounds like a prank/hoax, false if it seems real),
  "confidenceScore": number between 0 and 100,
  "suggestedActions": array of strings containing 2-3 immediate actionable steps for the staff
}

User Message: "${message}"`;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    
    if (textResult.startsWith("\`\`\`json")) {
        textResult = textResult.substring(7);
        if (textResult.endsWith("\`\`\`")) {
            textResult = textResult.substring(0, textResult.length - 3);
        }
    } else if (textResult.startsWith("\`\`\`")) {
        textResult = textResult.substring(3);
        if (textResult.endsWith("\`\`\`")) {
            textResult = textResult.substring(0, textResult.length - 3);
        }
    }

    const parsedData = JSON.parse(textResult.trim());
    return {
      title: parsedData.title || "Emergency Reported",
      location: parsedData.location || "Unknown",
      type: parsedData.type || "Other",
      severity: parsedData.severity || "High", // Default to high for unstructured panics
      isFake: typeof parsedData.isFake === 'boolean' ? parsedData.isFake : false,
      confidenceScore: typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 70,
      suggestedActions: Array.isArray(parsedData.suggestedActions) ? parsedData.suggestedActions : ["Contact reporter immediately to verify."]
    };
  } catch (error) {
    console.error("AI Quick Analysis failed:", error);
    return { 
      title: "Emergency Reported", location: "Unknown", type: "Other", severity: "High", 
      isFake: false, confidenceScore: 50, suggestedActions: ["Contact reporter immediately."] 
    };
  }
}
