import React from 'react';

export default function Hero() {
  return (
    <section className="fade-in" style={{
      background: 'linear-gradient(rgba(44, 37, 35, 0.6), rgba(44, 37, 35, 0.6)), url("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=2000&q=80") center/cover fixed',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '4.5rem', color: '#fff', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Sweet Serenity Bakery</h1>
      <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6, opacity: 0.9 }}>
        Artisan pastries, handcrafted cakes, and organic breads baked fresh every single morning.
      </p>
      <button className="btn">View Menu</button>
    </section>
  );
}