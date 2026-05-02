import React from 'react';
import Hero from '../components/Hero';
import FeaturedPastries from '../components/FeaturedPastries';
import About from './about';
import '../styles/globals.css';

export default function IndexPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '1.5rem 2rem', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.5rem' }}>Sweet Serenity</h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 500 }}>Home</a>
            <a href="#menu" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 500 }}>Menu</a>
            <a href="#about" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 500 }}>About Us</a>
          </div>
        </div>
      </nav>
      
      <Hero />
      <div id="menu">
        <FeaturedPastries />
      </div>
      <div id="about">
        <About />
      </div>
      
      <footer style={{ background: 'var(--dark)', color: '#fff', padding: '3rem 2rem', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ opacity: 0.8 }}>© 2026 Sweet Serenity Bakery. All rights reserved.</p>
      </footer>
    </div>
  );
}