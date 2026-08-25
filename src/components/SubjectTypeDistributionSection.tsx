import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface SubjectTypeItem {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  platforms: {
    name: string;
    key: string;
    count: number;
    icon: string;
    brandColor: string;
    platformBg: string;
  }[];
}

const SUBJECT_TYPE_DATA: SubjectTypeItem[] = [
  {
    id: 'gov',
    name: '党政机关',
    count: 3623,
    percentage: 1.36,
    color: '#ff7a45', // 珊瑚橙/暖红
    platforms: [
      { name: '抖音', key: 'douyin', count: 462, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 384, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 770, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 240, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 1767, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'public_inst',
    name: '事业单位',
    count: 4333,
    percentage: 1.63,
    color: '#69b1ff', // 浅蓝
    platforms: [
      { name: '抖音', key: 'douyin', count: 520, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 410, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 1250, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 310, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 1843, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'personal',
    name: '个人',
    count: 78836,
    percentage: 29.64,
    color: '#36cfc9', // 青绿
    platforms: [
      { name: '抖音', key: 'douyin', count: 32450, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 18620, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 11200, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 15466, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 1100, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'social_org',
    name: '社会组织',
    count: 5778,
    percentage: 2.17,
    color: '#ffc53d', // 亮金黄
    platforms: [
      { name: '抖音', key: 'douyin', count: 680, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 520, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 2150, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 488, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 1940, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'overseas',
    name: '境外机构',
    count: 3,
    percentage: 0.0,
    color: '#b37feb', // 浅紫
    platforms: [
      { name: '抖音', key: 'douyin', count: 0, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 0, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 1, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 1, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 1, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'state_owned',
    name: '国有企业',
    count: 4889,
    percentage: 1.84,
    color: '#13c2c2', // 蓝绿
    platforms: [
      { name: '抖音', key: 'douyin', count: 820, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 640, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 1980, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 520, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 929, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  },
  {
    id: 'private_enterprise',
    name: '非国有企业',
    count: 168495,
    percentage: 63.36,
    color: '#85a5ff', // 浅靛蓝
    platforms: [
      { name: '抖音', key: 'douyin', count: 72150, icon: 'fa-brands fa-tiktok', brandColor: '#000000', platformBg: '#000000' },
      { name: '今日头条', key: 'toutiao', count: 28400, icon: 'fa-solid fa-newspaper', brandColor: '#ff4d4f', platformBg: '#ff4d4f' },
      { name: '微信公众号', key: 'wechat', count: 42300, icon: 'fa-brands fa-weixin', brandColor: '#52c41a', platformBg: '#52c41a' },
      { name: '新浪微博', key: 'weibo', count: 19200, icon: 'fa-brands fa-weibo', brandColor: '#faad14', platformBg: '#faad14' },
      { name: '网站', key: 'website', count: 6445, icon: 'fa-solid fa-earth-americas', brandColor: '#1677ff', platformBg: '#1677ff' },
    ]
  }
];

export const SubjectTypeDistributionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCount = 265957;

  // Auto-carousel timer
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SUBJECT_TYPE_DATA.length);
    }, 3200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const currentSubject = SUBJECT_TYPE_DATA[activeIndex] || SUBJECT_TYPE_DATA[0];

  // Calculate max for bar scale
  const maxPlatformCount = Math.max(...currentSubject.platforms.map(p => p.count), 1);
  const niceMax = Math.ceil(maxPlatformCount * 1.15) || 100;

  // Grid tick lines for bar chart (5 ticks)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(ratio => Math.round(niceMax * ratio));

  return (
    <div
      className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-xs mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
          <h3 className="font-bold text-gray-800 text-xs">主体类型分布统计</h3>
          <span className="text-[11px] text-gray-400">
            (环形图自动轮播联动各主体平台分布，点击或悬浮可锁定查看)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{isPaused ? '已暂停轮播' : '自动轮播中 (3s)'}</span>
        </div>
      </div>

      {/* Main Grid: Left Donut + Right Bars */}
      <div className="grid grid-cols-12 gap-4 items-center min-h-[300px]">
        {/* Left Column: Donut Chart with Center Total & Active Callout tooltip */}
        <div className="col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SUBJECT_TYPE_DATA}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                  startAngle={90}
                  endAngle={-270}
                  onClick={(_, idx) => setActiveIndex(idx)}
                  className="cursor-pointer outline-none"
                >
                  {SUBJECT_TYPE_DATA.map((entry, index) => {
                    const isSelected = index === activeIndex;
                    return (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.color}
                        stroke={isSelected ? '#ffffff' : 'transparent'}
                        strokeWidth={isSelected ? 3 : 0}
                        style={{
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: 'center center',
                          transition: 'all 0.3s ease',
                          filter: isSelected ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' : 'none'
                        }}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-[11px] text-gray-400 font-normal tracking-wide">总数</span>
              <span className="text-xl font-bold font-mono text-gray-900 leading-tight">
                {totalCount.toLocaleString()}
              </span>
            </div>

            {/* Custom Active Floating Callout Tooltip (Styled as in reference screenshot) */}
            <div
              className="absolute z-20 pointer-events-none transition-all duration-300 ease-out"
              style={{
                top: '18%',
                left: '6%',
              }}
            >
              <div className="bg-white/95 backdrop-blur-xs border border-orange-200 rounded shadow-md px-2.5 py-1.5 flex items-center space-x-1.5 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: currentSubject.color }}
                ></span>
                <span className="text-gray-800 font-medium whitespace-nowrap">
                  {currentSubject.name}:
                </span>
                <span className="font-bold text-gray-900 font-mono">
                  {currentSubject.count.toLocaleString()}
                </span>
                <span className="text-gray-500 font-mono text-[11px]">
                  ({currentSubject.percentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Legend Pills */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] mt-1 px-2">
            {SUBJECT_TYPE_DATA.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center space-x-1.5 px-2 py-0.5 rounded cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium shadow-2xs'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custom Stylized Horizontal Bar Chart for Active Subject */}
        <div className="col-span-7 flex flex-col justify-center pl-4 border-l border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentSubject.color }}
              ></span>
              <span className="text-xs font-bold text-gray-800">
                【{currentSubject.name}】各平台台账分布
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                合计: {currentSubject.count.toLocaleString()} ({currentSubject.percentage}%)
              </span>
            </div>
          </div>

          {/* Bars Area with vertical grid lines */}
          <div className="relative pr-6">
            {/* Background Grid Lines & Ticks */}
            <div className="absolute inset-0 pl-10 pr-6 flex justify-between pointer-events-none">
              {ticks.map((val, idx) => (
                <div key={idx} className="h-full border-l border-dashed border-gray-200 relative flex flex-col justify-between">
                  <div></div>
                  <span className="text-[10px] font-mono text-gray-400 translate-y-5 -translate-x-1/2">
                    {val.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* List of Platform Horizontal Bars */}
            <div className="space-y-4 relative z-10 py-1">
              {currentSubject.platforms.map((plat) => {
                const widthPercent = Math.max(
                  plat.count > 0 ? (plat.count / niceMax) * 100 : 0.5,
                  plat.count > 0 ? 3 : 0.5
                );

                return (
                  <div key={plat.key} className="flex items-center group">
                    {/* Platform Icon Badge */}
                    <div className="w-8 flex-shrink-0 flex items-center justify-center">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs shadow-2xs transition-transform group-hover:scale-105"
                        style={{ backgroundColor: plat.platformBg }}
                      >
                        {plat.key === 'website' ? (
                          <i className="fa-solid fa-earth-americas text-[11px]"></i>
                        ) : plat.key === 'douyin' ? (
                          <i className="fa-brands fa-tiktok text-[11px]"></i>
                        ) : plat.key === 'toutiao' ? (
                          <span className="text-[9px] font-bold">头条</span>
                        ) : plat.key === 'wechat' ? (
                          <i className="fa-brands fa-weixin text-[12px]"></i>
                        ) : plat.key === 'weibo' ? (
                          <i className="fa-brands fa-weibo text-[12px]"></i>
                        ) : (
                          <i className="fa-solid fa-globe text-[11px]"></i>
                        )}
                      </div>
                    </div>

                    {/* Bar Track + Soft Rounded Bar with Count Label on Right */}
                    <div className="flex-1 ml-2.5 flex items-center">
                      <div className="w-full bg-gray-50/80 rounded-full h-4 overflow-hidden relative flex items-center">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: '#91caff', // Soft periwinkle light blue as in screenshot
                            boxShadow: '0 1px 3px rgba(22, 119, 255, 0.15)'
                          }}
                        ></div>
                      </div>
                      {/* Count number label directly right of bar */}
                      <span className="ml-3 text-xs font-mono font-bold text-gray-700 w-14 text-left">
                        {plat.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom X-Axis line */}
            <div className="ml-10 border-b border-gray-200 mt-6 pt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
