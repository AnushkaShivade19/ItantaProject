import React from 'react';

function HeroSection() {
  return (
    <div className="fade-in-up" style={{
      background: 'linear-gradient(to right, rgba(26, 18, 14, 0.8), rgba(26, 18, 14, 0.3)), url("https://loremflickr.com/2000/1000/bakery,shop") center/cover fixed',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0 10%',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <p className="fade-in-up delay-1" style={{ color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Established 2026
        </p>
        <h1 className="fade-in-up delay-2" style={{ fontSize: '4.5rem', color: '#fff', margin: '0 0 1.5rem 0', lineHeight: '1.1' }}>
          7th Heaven <br/><span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Bakery</span>
        </h1>
        <p className="fade-in-up delay-3" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Experience the finest artisan pastries and bespoke cakes, crafted daily with passion, precision, and the purest ingredients.
        </p>
        <div className="fade-in-up delay-3">
          <button className="btn-primary">View Our Menu</button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;