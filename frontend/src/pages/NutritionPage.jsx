import { useState } from 'react';
import { Droplets, Apple, Scale, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const mealPlans = [
  {
    goal: 'Weight Loss',
    meals: [
      { time: 'Breakfast', name: 'Oats with berries & nuts', protein: 12, carbs: 45, fat: 8, calories: 300 },
      { time: 'Snack', name: 'Greek yogurt & apple', protein: 14, carbs: 22, fat: 2, calories: 160 },
      { time: 'Lunch', name: 'Grilled chicken salad', protein: 38, carbs: 18, fat: 12, calories: 340 },
      { time: 'Snack', name: 'Handful of almonds', protein: 6, carbs: 6, fat: 14, calories: 170 },
      { time: 'Dinner', name: 'Baked salmon with veggies', protein: 42, carbs: 20, fat: 16, calories: 400 },
    ]
  },
  {
    goal: 'Muscle Gain',
    meals: [
      { time: 'Breakfast', name: 'Eggs, oats & banana', protein: 28, carbs: 65, fat: 14, calories: 510 },
      { time: 'Snack', name: 'Protein shake & peanut butter toast', protein: 35, carbs: 38, fat: 12, calories: 400 },
      { time: 'Lunch', name: 'Rice, chicken & broccoli', protein: 50, carbs: 70, fat: 10, calories: 580 },
      { time: 'Snack', name: 'Cottage cheese & fruit', protein: 22, carbs: 28, fat: 4, calories: 240 },
      { time: 'Dinner', name: 'Beef stir-fry with rice', protein: 45, carbs: 60, fat: 18, calories: 580 },
      { time: 'Post-dinner', name: 'Casein protein shake', protein: 30, carbs: 8, fat: 3, calories: 180 },
    ]
  },
  {
    goal: 'Vegetarian',
    meals: [
      { time: 'Breakfast', name: 'Tofu scramble & whole grain toast', protein: 24, carbs: 42, fat: 10, calories: 360 },
      { time: 'Snack', name: 'Hummus with veggie sticks', protein: 8, carbs: 18, fat: 8, calories: 180 },
      { time: 'Lunch', name: 'Lentil dal, quinoa & salad', protein: 22, carbs: 58, fat: 6, calories: 380 },
      { time: 'Snack', name: 'Mixed nuts & seeds', protein: 8, carbs: 10, fat: 18, calories: 230 },
      { time: 'Dinner', name: 'Paneer tikka with roti & dal', protein: 30, carbs: 48, fat: 14, calories: 440 },
    ]
  }
];

const tips = [
  'Drink 2–3 litres of water daily, more on workout days.',
  'Eat protein with every meal to preserve and build muscle.',
  'Prioritize whole foods over processed options.',
  'Don\'t skip breakfast — it sets the metabolic tone.',
  'Space meals 3–4 hours apart for stable energy.',
  'Post-workout nutrition within 30–60 minutes enhances recovery.',
  'Sleep 7–9 hours for optimal hormone balance and recovery.',
  'Limit added sugars and alcohol for better body composition.',
];

// BMI Calculator (standalone for Nutrition page)
const NutritionBMI = () => {
  const [h, setH] = useState('');
  const [w, setW] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const height = parseFloat(h) / 100;
    const weight = parseFloat(w);
    if (!height || !weight || height <= 0) return;
    const bmi = (weight / (height * height)).toFixed(1);
    const cats = [
      { max: 18.5, label: 'Underweight', color: 'var(--blue)', advice: 'Consider a calorie surplus with nutrient-dense foods.' },
      { max: 25, label: 'Normal Weight', color: 'var(--green)', advice: 'Maintain your current healthy habits.' },
      { max: 30, label: 'Overweight', color: 'var(--amber)', advice: 'Focus on a moderate calorie deficit and regular cardio.' },
      { max: Infinity, label: 'Obese', color: 'var(--red)', advice: 'Consult a healthcare professional for a personalized plan.' },
    ];
    const cat = cats.find(c => parseFloat(bmi) < c.max);
    setResult({ bmi, ...cat });
  };

  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Scale size={20} color="var(--lime)" /> BMI Calculator
      </h3>
      <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--amber)' }}>
        <AlertCircle size={13} style={{ display: 'inline', marginRight: 6 }} />
        BMI is a general screening tool only. It does not account for muscle mass, bone density, or body fat distribution. Always consult a healthcare professional for a complete health assessment.
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Height (cm)</label>
          <input type="number" className="form-control" placeholder="175" value={h} onChange={e => setH(e.target.value)} min={100} max={250} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Weight (kg)</label>
          <input type="number" className="form-control" placeholder="70" value={w} onChange={e => setW(e.target.value)} min={30} max={300} />
        </div>
      </div>
      <button onClick={calc} className="btn btn-primary btn-full" style={{ marginBottom: result ? '1.25rem' : 0 }}>
        Calculate BMI
      </button>
      {result && (
        <div style={{ padding: '1.5rem', background: 'var(--dark3)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, color: result.color, lineHeight: 1 }}>{result.bmi}</p>
          <p style={{ color: result.color, fontWeight: 700, fontSize: '1.1rem', margin: '0.5rem 0' }}>{result.label}</p>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.6 }}>{result.advice}</p>
        </div>
      )}
    </div>
  );
};

// Water tracker
const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const goal = 8;
  const pct = Math.min((glasses / goal) * 100, 100);
  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Droplets size={20} color="var(--blue)" /> Daily Water Tracker
      </h3>
      <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Goal: 8 glasses (2 litres) per day. Resets each browser session.</p>
      <div className="progress-bar-wrap" style={{ marginBottom: '1rem' }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--blue)' }} />
      </div>
      <p style={{ textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--gray-light)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--blue)' }}>{glasses}</span> / {goal} glasses
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button onClick={() => setGlasses(g => Math.max(0, g - 1))} className="btn btn-dark">- Remove</button>
        <button onClick={() => setGlasses(g => Math.min(goal + 4, g + 1))} className="btn btn-primary" style={{ background: 'var(--blue)', borderColor: 'var(--blue)' }}>
          <Droplets size={14} /> + Add Glass
        </button>
        <button onClick={() => setGlasses(0)} className="btn btn-dark">Reset</button>
      </div>
      {glasses >= goal && (
        <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 600, marginTop: '0.75rem', fontSize: '0.9rem' }}>🎉 Daily goal achieved!</p>
      )}
    </div>
  );
};

const NutritionPage = () => {
  const [activePlan, setActivePlan] = useState(0);
  const [expandedTip, setExpandedTip] = useState(null);

  const plan = mealPlans[activePlan];
  const totals = plan.meals.reduce((acc, m) => ({
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
    calories: acc.calories + m.calories,
  }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Nutrition & <span className="text-lime">Wellness</span></h1>
          <p className="section-subtitle mt-2">General nutrition guidance for your fitness goals. Not personalized medical advice.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Plan selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {mealPlans.map((p, i) => (
            <button key={i} onClick={() => setActivePlan(i)}
              className={`btn ${activePlan === i ? 'btn-primary' : 'btn-dark'}`}>
              <Apple size={15} /> {p.goal}
            </button>
          ))}
        </div>

        {/* Macro totals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Calories', value: totals.calories, unit: 'kcal', color: 'var(--amber)' },
            { label: 'Protein', value: totals.protein, unit: 'g', color: 'var(--blue)' },
            { label: 'Carbs', value: totals.carbs, unit: 'g', color: 'var(--lime)' },
            { label: 'Fat', value: totals.fat, unit: 'g', color: 'var(--red)' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
              <p style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{unit} {label}</p>
            </div>
          ))}
        </div>

        {/* Meal plan table */}
        <div className="table-wrapper" style={{ marginBottom: '2.5rem' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>{plan.goal} — Sample Daily Meal Plan</h3>
            <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>For general guidance only — individual needs vary</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Meal</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {plan.meals.map((m, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--lime)', fontWeight: 600, fontSize: '0.8rem' }}>{m.time}</td>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td>{m.protein}g</td>
                  <td>{m.carbs}g</td>
                  <td>{m.fat}g</td>
                  <td style={{ fontWeight: 600 }}>{m.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tools row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <NutritionBMI />
          <WaterTracker />
        </div>

        {/* Tips */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Fitness & Nutrition <span className="text-lime">Tips</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 28, height: 28, background: 'rgba(132,204,22,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem', color: 'var(--lime)' }}>
                  {i + 1}
                </div>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPage;
