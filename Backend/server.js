const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Test route ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ FreshSense server is running!' });
});

// ── Analyze food ──────────────────────────────────────────────
app.post('/api/analyze', (req, res) => {
  const results = [
    { item:'Fresh Vegetables', status:'Fresh',    shelf_life:'5-7 days in refrigerator',       storage:'Store in refrigerator crisper drawer',          confidence:'91%', tips:'Keep vegetables in a cool dry place. Store in airtight containers to maintain freshness. Check daily for any signs of spoilage.' },
    { item:'Fruit',            status:'Fresh',    shelf_life:'3-5 days at room temperature',    storage:'Store at room temperature away from sunlight',   confidence:'88%', tips:'Keep fruits away from direct sunlight. Some fruits release ethylene gas which speeds up ripening of nearby fruits. Refrigerate once ripe.' },
    { item:'Cooked Food',      status:'Use Soon', shelf_life:'3-4 days in refrigerator',        storage:'Store in airtight container in refrigerator',    confidence:'85%', tips:'Always store cooked food in airtight containers. Never leave cooked food at room temperature for more than 2 hours. Reheat thoroughly before eating.' },
    { item:'Dairy Product',    status:'Fresh',    shelf_life:'7 days after opening',             storage:'Keep refrigerated at all times',                 confidence:'92%', tips:'Always check the expiry date. Keep dairy products in the coldest part of the refrigerator. Never leave dairy out at room temperature for more than 2 hours.' },
    { item:'Meat',             status:'Use Soon', shelf_life:'1-2 days in refrigerator',        storage:'Store in refrigerator or freeze immediately',    confidence:'89%', tips:'Raw meat should always be stored at the bottom of the refrigerator to prevent cross contamination. Freeze if not using within 2 days. Always cook thoroughly.' },
    { item:'Bread',            status:'Fresh',    shelf_life:'5-7 days at room temperature',    storage:'Store in a cool dry place in original packaging', confidence:'94%', tips:'Keep bread in its original packaging or a bread box. Avoid storing in the refrigerator as it dries out faster. Freeze for longer storage up to 3 months.' },
    { item:'Eggs',             status:'Fresh',    shelf_life:'3-5 weeks in refrigerator',       storage:'Store in original carton in the refrigerator',   confidence:'96%', tips:'Always store eggs in their original carton. Keep in the coldest part of the fridge not the door. Do not wash eggs before storing as this removes the protective coating.' },
    { item:'Rice',             status:'Fresh',    shelf_life:'1-2 years in airtight container', storage:'Store in cool dry place in airtight container',  confidence:'97%', tips:'Store uncooked rice in an airtight container away from moisture. Cooked rice should be refrigerated within 1 hour. Never leave cooked rice at room temperature for more than 2 hours.' },
    { item:'Fish',             status:'Use Soon', shelf_life:'1-2 days in refrigerator',        storage:'Store on ice in the coldest part of fridge',     confidence:'87%', tips:'Fresh fish should be stored at 0 degrees Celsius. Wrap tightly in plastic wrap or foil. Use within 1-2 days or freeze immediately for longer storage.' },
    { item:'Cheese',           status:'Fresh',    shelf_life:'1-4 weeks depending on type',     storage:'Wrap in wax paper and store in refrigerator',    confidence:'90%', tips:'Wrap cheese in wax paper or parchment paper to allow it to breathe. Store in the vegetable drawer of the refrigerator. Keep away from strong-smelling foods.' }
  ];

  const index  = Math.floor(Date.now() / 1000) % results.length;
  const result = results[index];
  setTimeout(() => { res.json(result); }, 1500);
});

// ── Contact route ─────────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }
  console.log(`📩 Contact from ${name} (${email}): ${message}`);
  res.json({ success: true });
});

// ── Get scans ─────────────────────────────────────────────────
app.get('/api/scans', (req, res) => {
  res.json([]);
});

// ── Get contacts ──────────────────────────────────────────────
app.get('/api/contacts', (req, res) => {
  res.json([]);
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FreshSense server is running on port ${PORT}`);
});