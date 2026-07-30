// Muscle Concrete Job Map — calendar feed reader
// Lives at: api/calendar.js in the GitHub repo. Vercel runs it automatically.
// Reads the Orders calendar's private feed server-side and hands it to the map.

const ICS_URL = process.env.CAL_ICS_URL ||
  'https://calendar.google.com/calendar/ical/orders%40muscleconcrete.com/private-e353e4dfb5a5a8377944954c309979a0/basic.ics';

export default async function handler(req, res) {
  try {
    const r = await fetch(ICS_URL, { headers: { 'User-Agent': 'MuscleConcreteJobMap/1.0' } });
    if (!r.ok) {
      res.status(502).json({ error: 'calendar feed returned ' + r.status });
      return;
    }
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
}
