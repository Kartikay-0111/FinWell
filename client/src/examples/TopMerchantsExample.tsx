import React from 'react';
import TopMerchants from '../components/TopMerchants';

// Example merchant data
const exampleMerchants = [
  {
    id: '2',
    name: 'Zerodha',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoh0gltGjPotGY7_V3t5poMWCybxZSeFtACA&s', // Replace with actual logo path
    points: 1200,
    prize: 5000,
    rank: 2
  },
  {
    id: '1',
    name: 'Swiggy',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png', // Replace with actual logo path
    points: 1500,
    prize: 10000,
    rank: 1
  },
  {
    id: '3',
    name: 'Blinkit',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Blinkit-yellow-rounded.svg/1200px-Blinkit-yellow-rounded.svg.png', // Replace with actual logo path
    points: 1000,
    prize: 2500,
    rank: 3
  }
];

const TopMerchantsExample: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Top Merchants Example</h1>

      <TopMerchants
        merchants={exampleMerchants}
        timeLeft="00d 00h 43m 51s"
      />
    </div>
  );
};

export default TopMerchantsExample;
