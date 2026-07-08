'use client';

import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Card, CardContent } from '../../../_componentAPI/card';

// Icon name → component mapping (resolved client-side, never passed from server)
const ICON_MAP = {
  'dollar-sign': DollarSign,
  'shopping-cart': ShoppingCart,
  users: Users,
  package: Package,
  'trending-up': TrendingUp,
};

const TYPE_GRADIENTS = {
  grass: 'from-emerald-400 to-green-500',
  electric: 'from-yellow-400 to-amber-500',
  fire: 'from-orange-400 to-red-500',
  water: 'from-blue-400 to-cyan-500',
  psychic: 'from-pink-400 to-purple-500',
  default: 'from-slate-400 to-slate-600',
};

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon] || Package;
        return (
          <Card key={stat.label} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={cn(
                  'p-3 rounded-xl bg-linear-to-br text-white',
                  TYPE_GRADIENTS[stat.type] || TYPE_GRADIENTS.default
                )}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
                {stat.subtext && <p className="text-xs text-slate-400 mt-0.5">{stat.subtext}</p>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
