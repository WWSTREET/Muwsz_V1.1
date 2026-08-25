import React from 'react';

interface StatsCardsProps {
  counts: {
    total: number;
    official: number;
    trial: number;
    expiringSoon: number;
    expired: number;
    closed: number;
  };
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ counts, activeFilter, onSelectFilter }) => {
  const cards = [
    {
      id: 'all',
      title: '机构总数',
      count: counts.total,
      bgColor: 'bg-blue-500',
      icon: 'fa-solid fa-building',
      borderActive: activeFilter === 'all' ? 'border-2 border-blue-600 shadow-sm' : 'border border-[#e8e8e8]'
    },
    {
      id: 'official',
      title: '正式',
      count: counts.official,
      bgColor: 'bg-blue-500',
      icon: 'fa-regular fa-square-check',
      borderActive: activeFilter === 'official' ? 'border-2 border-blue-600 shadow-sm' : 'border border-[#e8e8e8]'
    },
    {
      id: 'trial',
      title: '试用',
      count: counts.trial,
      bgColor: 'bg-yellow-600',
      icon: 'fa-solid fa-calendar-days',
      borderActive: activeFilter === 'trial' ? 'border-2 border-yellow-600 shadow-sm' : 'border border-[#e8e8e8]'
    },
    {
      id: 'expiringSoon',
      title: '即将到期',
      count: counts.expiringSoon,
      bgColor: 'bg-purple-500',
      icon: 'fa-solid fa-hourglass-half',
      borderActive: activeFilter === 'expiringSoon' ? 'border-2 border-purple-600 shadow-sm' : 'border border-[#e8e8e8]'
    },
    {
      id: 'expired',
      title: '已到期',
      count: counts.expired,
      bgColor: 'bg-red-400',
      icon: 'fa-regular fa-clock',
      borderActive: activeFilter === 'expired' ? 'border-2 border-red-500 shadow-sm' : 'border border-[#e8e8e8]'
    },
    {
      id: 'closed',
      title: '已关闭',
      count: counts.closed,
      bgColor: 'bg-orange-500',
      icon: 'fa-solid fa-circle-xmark',
      borderActive: activeFilter === 'closed' ? 'border-2 border-orange-600 shadow-sm' : 'border border-[#e8e8e8]'
    },
  ];

  return (
    <div className="flex gap-4 mb-6">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => onSelectFilter(card.id)}
          className={`flex-1 ${card.borderActive} rounded-sm p-4 flex flex-col justify-between min-h-[90px] cursor-pointer hover:bg-gray-50/80 transition-all`}
        >
          <div className="flex items-center text-gray-600 mb-2">
            <div className={`w-6 h-6 ${card.bgColor} text-white rounded flex items-center justify-center mr-2 text-xs`}>
              <i className={card.icon}></i>
            </div>
            <span className="text-xs">{card.title}</span>
          </div>
          <div className="text-2xl font-bold">{card.count}</div>
        </div>
      ))}
    </div>
  );
};
