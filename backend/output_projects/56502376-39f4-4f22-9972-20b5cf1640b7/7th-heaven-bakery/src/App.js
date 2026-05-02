import React from 'react';
import './styles.css';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import OrderForm from './components/OrderForm';

function App() {
  return (
    <div className="App">
      <HeroSection />
      <MenuSection />
      <ReviewsSection />
      <OrderForm />
    </div>
  );
}

export default App;