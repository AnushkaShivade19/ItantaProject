import React from 'react';

export default function MenuSection() {
  const items = [
    { id: 1, name: 'Artisan Sourdough', price: '$8', desc: 'Naturally leavened, 24-hour fermentation', img: 'https://loremflickr.com/800/600/bread,bakery' },
    { id: 2, name: 'Butter Croissant', price: '$4', desc: 'Flaky, buttery layers baked fresh daily', img: 'https://loremflickr.com/800/600/croissant,bakery' },
    { id: 3, name: 'Bespoke Wedding Cake', price: '$150+', desc: 'Custom designs for your special day', img: 'https://loremflickr.com/800/600/cake,wedding' },
    { id: 4, name: 'Raspberry Tart', price: '$6', desc: 'Fresh berries on a vanilla custard base', img: 'https://loremflickr.com/800/600/tart,dessert' }
  ];

  return (
    <section className="section-container" style={{ background: '#fff' }}>
      <h2 className="section-title fade-in-up">Signature Pastries</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        marginTop: '3rem'
      }}>
        {items.map((item, index) => (
          <div key={item.id} className="fade-in-up" style={{ 
            animationDelay: `${index * 0.15}s`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                   onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                   onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            </div>
            <div style={{ padding: '1.8rem', background: '#fff', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '20px', background: 'var(--primary-color)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(226, 180, 154, 0.4)' }}>
                {item.price}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}