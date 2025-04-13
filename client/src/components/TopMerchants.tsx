import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  logoUrl: string;
  points: number;
  prize: number;
  rank: number;
}

interface TopMerchantsProps {
  merchants: Merchant[];
  timeLeft?: string;
}

const TopMerchants: React.FC<TopMerchantsProps> = ({ merchants, timeLeft }) => {
  return (
    <Card className="fin-card w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-finOrange" />
          Top Merchants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {merchants.map((merchant) => (
            <div 
              key={merchant.id} 
              className="flex flex-col items-center bg-sidebar p-4 rounded-lg fin-shadow"
            >
              <div className="relative mb-2">
                <div className="w-17 h17 rounded-lg overflow-hidden bg-finDarkBlue/30 flex items-center justify-center">
                  {merchant.logoUrl ? (
                    <img 
                      src={merchant.logoUrl} 
                      alt={`${merchant.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-finOrange">
                      {merchant.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-finOrange text-finDarkBlue flex items-center justify-center text-xs font-bold">
                  {merchant.rank}
                </div>
              </div>
              
              <h3 className="font-medium text-center mt-2">{merchant.name}</h3>
              
              <div className="mt-2 bg-finDarkBlue/10 px-3 py-1 rounded-full text-xs">
                Spent ₹{merchant.points}
              </div>
              
             
            </div>
          ))}
        </div>
        
     
      </CardContent>
    </Card>
  );
};

export default TopMerchants;
