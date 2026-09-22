export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ error: 'Missing goal in request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "ACT AS THE QUESTLOG AI TACTICAL COMMANDER. Analyze the user's raw objective and decompose it into a JSON array of actionable, granular 'Tactical Quests'. Schema: [{quest_id, category, title, description, estimated_time_minutes (25-60), xp_reward (50-500), difficulty ('EASY', 'MEDIUM', 'HARD')}]. Output strictly valid JSON." }]
        },
        contents: [
          { parts: [{ text: goal }] }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(response.status).json({ error: 'Failed to fetch from Gemini' });
    }

    const data = await response.json();
    let textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean response (removes markdown code blocks if any)
    textContent = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const quests = JSON.parse(textContent);
      return res.status(200).json(quests);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, textContent);
      return res.status(500).json({ error: 'Failed to parse JSON response' });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
