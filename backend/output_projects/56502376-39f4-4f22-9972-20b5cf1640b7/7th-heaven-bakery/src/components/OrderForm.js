import React from 'react';

export default function OrderForm() {
  return (
    <section style={{
      background: 'url("https://loremflickr.com/2000/1000/baking,ingredients") center/cover fixed',
      padding: '8rem 2rem',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26, 18, 14, 0.4)' }}></div>
      
      <div className="section-container fade-in-up" style={{ padding: '0', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ 
          maxWidth: '650px', 
          margin: '0 auto', 
          padding: '4rem 3rem',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Request an Order</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>Tell us about your event and we'll craft the perfect centerpiece.</p>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <input type="text" className="form-input" placeholder="First Name" />
              <input type="text" className="form-input" placeholder="Last Name" />
            </div>
            <input type="email" className="form-input" placeholder="Email Address" />
            <select className="form-input" style={{ appearance: 'none', color: 'var(--text-secondary)' }}>
              <option value="">Select Event Type...</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate</option>
              <option value="other">Other</option>
            </select>
            <textarea className="form-input" placeholder="Describe your dream cake or pastry request..." rows="5"></textarea>
            
            <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1.2rem' }}>
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}