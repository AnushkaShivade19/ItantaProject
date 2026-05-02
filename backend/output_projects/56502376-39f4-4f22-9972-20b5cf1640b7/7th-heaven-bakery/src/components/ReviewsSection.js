import React from 'react';

export default function ReviewsSection() {
  const reviews = [
    { name: 'Sarah Jenkins', role: 'Wedding Client', text: 'The custom cake they designed for our wedding was nothing short of a masterpiece. It tasted even better than it looked!', stars: 5, img: 'https://loremflickr.com/150/150/face,woman' },
    { name: 'Michael Chen', role: 'Local Foodie', text: 'Best sourdough in the city. The crust is perfectly blistered and the crumb is incredibly tender. I come here every morning.', stars: 5, img: 'https://loremflickr.com/150/150/face,man' },
    { name: 'Elena Rodriguez', role: 'Event Planner', text: '7th Heaven is my go-to for all corporate events. Their pastry platters are always the highlight of the morning meetings.', stars: 5, img: 'https://loremflickr.com/150/150/face,person' }
  ];

  return (
    <section style={{ padding: '6rem 2rem', background: '#F8F4F1' }}>
      <div className="section-container" style={{ padding: '0' }}>
        <h2 className="section-title fade-in-up">What Our Patrons Say</h2>
        
        <div className="reviews-scroll fade-in-up delay-1" style={{ 
          display: 'flex', 
          gap: '2rem', 
          overflowX: 'auto', 
          paddingBottom: '2rem',
          scrollSnapType: 'x mandatory'
        }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ 
              minWidth: '350px', 
              background: '#fff', 
              padding: '2.5rem', 
              borderRadius: '16px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
              scrollSnapAlign: 'start',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2rem', color: 'var(--primary-color)', opacity: '0.3', position: 'absolute', top: '1.5rem', left: '2rem', fontFamily: 'serif' }}>"</div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem', position: 'relative', zIndex: '1' }}>
                {review.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={review.img} alt={review.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--accent-color)' }}>{review.name}</h4>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500' }}>{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}