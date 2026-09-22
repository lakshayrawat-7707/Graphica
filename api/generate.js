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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
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
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const userGoal = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  const systemPrompt = `ACT AS THE QUESTLOG AI TACTICAL COMMANDER. Analyze the user's raw objective and decompose it into a JSON array of actionable, granular 'Tactical Quests'. Schema: [{"quest_id": "1", "category": "LOGISTICS", "title": "Sample", "description": "Sample desc", "estimated_time_minutes": 30, "xp_reward": 100, "difficulty": "EASY"}]. Output strictly valid JSON without markdown formatting.`;

  try {
    const googleResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Goal: ${userGoal}` }] }]
      })
    });

    // HACKATHON FAIL-SAFE: Agar Google API 503 (High Demand) de, toh crash hone ki jagah ye mock data bhejo
    if (googleResponse.status === 503) {
      console.warn("AI Server Congested. Engaging Fail-safe protocols.");
      return res.status(200).json([
        {
          "quest_id": "fs-101",
          "category": "EMERGENCY",
          "title": "Bypass Comm-Link Congestion",
          "description": "Google AI servers are currently at maximum capacity. This is an auto-generated backup quest to keep your workflow uninterrupted.",
          "estimated_time_minutes": 15,
          "xp_reward": 500,
          "difficulty": "HARD"
        }
      ]);
    }

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error("Gemini Error:", data);
      return res.status(googleResponse.status).json(data);
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    res.status(200).json(JSON.parse(cleanJsonText));

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
}
