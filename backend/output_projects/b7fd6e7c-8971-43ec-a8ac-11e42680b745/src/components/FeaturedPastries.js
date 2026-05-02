import React from 'react';

export default function FeaturedPastries() {
  const pastries = [
    { id: 1, name: 'Artisan Sourdough', desc: 'Crispy crust, chewy center. Fermented for 48 hours.', price: '$8', img: 'https://loremflickr.com/800/600/sourdough,bread' },
    { id: 2, name: 'Strawberry Tart', desc: 'Fresh local strawberries over a vanilla bean custard.', price: '$6', img: 'https://loremflickr.com/800/600/pastry,tart' },
    { id: 3, name: 'Chocolate Éclair', desc: 'Choux pastry filled with rich dark chocolate cream.', price: '$5', img: 'https://loremflickr.com/800/600/pastry,chocolate' }
  ];

  return (
    <section style={{ background: '#fff', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '1rem' }}>Our Menu</p>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Signature Creations</h2>
      </div>
      
      <div className="responsive-grid">
        {pastries.map((p, i) => (
          <div key={p.id} className="fade-in" style={{ 
            animationDelay: `${i * 0.2}s`, 
            borderRadius: '16px', 
            overflow: 'hidden', 
            background: 'var(--light)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '250px', overflow: 'hidden' }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '20px', background: 'var(--primary)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 'bold' }}>
                {p.price}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{p.name}</h3>
              <p style={{ color: 'var(--text)', opacity: 0.8, lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}