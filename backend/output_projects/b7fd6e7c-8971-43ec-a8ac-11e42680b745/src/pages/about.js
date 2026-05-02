import React from 'react';

export default function About() {
  return (
    <section style={{ padding: '6rem 2rem', background: '#F8F4F1' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', background: '#fff', padding: '4rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--dark)', marginBottom: '1.5rem' }}>Our Story</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic' }}>
          "Baking is both an art and a science, but most importantly, it is a labor of love."
        </p>
        <p style={{ color: 'var(--text)', opacity: 0.9, lineHeight: 1.7, fontSize: '1.1rem' }}>
          Sweet Serenity Bakery was founded on a simple principle: use the highest quality organic ingredients and traditional baking methods to create food that warms the soul. Every morning before the sun rises, our bakers are already hard at work kneading dough, folding pastry, and crafting the delicious treats that our community has come to love.
        </p>
      </div>
    </section>
  );
}