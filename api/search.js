import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query 'q'" });

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q + ' NBA basketball')}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36'
      }
    });

    const imageRegex = /https?:\/\/[^\s"\'<>]+\.(?:jpg|jpeg|png)/gi;
    const matches = response.data.match(imageRegex) || [];
    const uniqueMatches = [...new Set(matches)];

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, count: uniqueMatches.length, images: uniqueMatches.slice(0, 25) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
