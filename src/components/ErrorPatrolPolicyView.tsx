import React, { useState } from 'react';

export const ErrorPatrolPolicyView: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [frequency, setFrequency] = useState('每六小时巡查（默认）');
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);
  const [maxDays, setMaxDays] = useState('1天（默认）');
  const [isMaxDaysOpen, setIsMaxDaysOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const frequencyOptions = [
    '每小时巡查',
    '每两小时巡查',
    '每四小时巡查',
    '每六小时巡查（默认）',
    '每十二小时巡查',
    '每日巡查',
  ];

  const maxDaysOptions = [
    '1天（默认）',
    '3天',
    '7天',
    '14天',
    '30天',
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className="bg-white flex flex-col space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
          <span className="font-bold text-gray-800 text-xs">巡查策略配置</span>
        </div>

        {/* Switch Toggle */}
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isEnabled ? 'bg-[#1677ff]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
              isEnabled ? 'translate-x-5 text-[#1677ff]' : 'translate-x-0 text-gray-400'
            }`}
          >
            {isEnabled ? '开' : '关'}
          </span>
        </button>

        {/* Info Tip */}
        <span className="text-gray-500 text-xs flex items-center">
          <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 配置发现错误表述后系统自动复核与巡查机制，以持续追踪并确认错误是否已被修正
        </span>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-6 shadow-2xs">
        <div className="grid grid-cols-2 gap-10 text-xs">
          {/* Left Column: 巡查频率 */}
          <div className="space-y-2">
            <div>
              <label className="block text-gray-700 font-medium">
                <span className="text-red-500 mr-1">*</span>巡查频率
              </label>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center">
                <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 发现被转办后，系统将按此频率重新访问原链接进行复核巡查。
              </div>
            </div>

            <div className="relative pt-1">
              <div
                onClick={() => setIsFrequencyOpen(!isFrequencyOpen)}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer hover:border-[#1677ff] text-gray-700 transition-colors"
              >
                <span>{frequency}</span>
                <i className={`fa-solid fa-angle-down text-gray-400 text-xs transition-transform ${isFrequencyOpen ? 'rotate-180' : ''}`}></i>
              </div>

              {isFrequencyOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e8e8e8] rounded shadow-lg z-20 py-1 max-h-48 overflow-y-auto">
                  {frequencyOptions.map(opt => (
                    <div
                      key={opt}
                      onClick={() => {
                        setFrequency(opt);
                        setIsFrequencyOpen(false);
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-50 transition-colors ${
                        frequency === opt ? 'text-[#1677ff] font-medium bg-blue-50/60' : 'text-gray-700'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 最大可循环运行天数 */}
          <div className="space-y-2">
            <div>
              <label className="block text-gray-700 font-medium">
                <span className="text-red-500 mr-1">*</span>最大可循环运行天数
              </label>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center">
                <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 超过此周期仍未修正的错误，将停止巡查。
              </div>
            </div>

            <div className="relative pt-1">
              <div
                onClick={() => setIsMaxDaysOpen(!isMaxDaysOpen)}
                className={`w-full border rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer transition-colors ${
                  isMaxDaysOpen ? 'border-[#1677ff] ring-1 ring-[#1677ff]/20' : 'border-[#1677ff]'
                }`}
              >
                <span className="text-gray-700">{maxDays}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMaxDays('1天（默认）');
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>

              {isMaxDaysOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e8e8e8] rounded shadow-lg z-20 py-1">
                  {maxDaysOptions.map(opt => (
                    <div
                      key={opt}
                      onClick={() => {
                        setMaxDays(opt);
                        setIsMaxDaysOpen(false);
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${
                        maxDays === opt ? 'text-[#1677ff] font-medium bg-blue-50/50' : 'text-gray-700'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-1 space-x-3">
        {isSaved && (
          <span className="text-xs text-green-600 flex items-center animate-in fade-in">
            <i className="fa-solid fa-circle-check mr-1.5"></i> 巡查策略配置已保存成功！
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs cursor-pointer font-medium shadow-2xs transition-colors"
        >
          保存配置
        </button>
      </div>
    </div>
  );
};
