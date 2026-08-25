import React, { useState, useEffect } from 'react';
import { Institution, InstitutionStatus } from '../types';
import { regionsList, categoriesList, typesList, statisticalUnitsList } from '../data/mockData';

interface InstitutionModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'detail';
  institution: Institution | null;
  onClose: () => void;
  onSubmit: (data: Partial<Institution>) => void;
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({
  isOpen,
  mode,
  institution,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '',
    region: '陕西',
    category: '一类',
    type: '网信部门',
    salesName: '',
    salesPhone: '',
    status: 'trial',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    daysRemaining: 30,
    statisticalUnit: '陕西省委网信办单元',
  });

  useEffect(() => {
    if (institution && (mode === 'edit' || mode === 'detail')) {
      setFormData(institution);
    } else if (mode === 'add') {
      setFormData({
        name: '',
        region: '陕西',
        category: '一类',
        type: '网信部门',
        salesName: '邓东升',
        salesPhone: '138****0000',
        status: 'trial',
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysRemaining: 90,
        statisticalUnit: '新统计单元',
      });
    }
  }, [institution, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('请输入机构名称');
      return;
    }
    onSubmit(formData);
  };

  const isDetail = mode === 'detail';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8] bg-[#f0f5ff]">
          <h3 className="text-base font-bold text-gray-800">
            {mode === 'add' ? '新增机构' : mode === 'edit' ? '编辑机构信息' : '机构详情'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer bg-transparent border-none"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">机构名称 *</label>
              <input 
                type="text"
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100"
                placeholder="请输入完整机构名称"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">所在地区</label>
              <select
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100 bg-white"
                value={formData.region || ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                {regionsList.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">机构状态类型</label>
              <select
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100 bg-white"
                value={formData.status || 'trial'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InstitutionStatus })}
              >
                <option value="trial">试用</option>
                <option value="official">正式</option>
                <option value="expired">已到期</option>
                <option value="closed">已关闭</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">机构类别</label>
              <select
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100 bg-white"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categoriesList.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">机构类型</label>
              <select
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100 bg-white"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {typesList.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">销售人员姓名</label>
              <input 
                type="text"
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100"
                value={formData.salesName || ''}
                onChange={(e) => setFormData({ ...formData, salesName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">销售联系电话</label>
              <input 
                type="text"
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100"
                value={formData.salesPhone || ''}
                onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">服务开始日期</label>
              <input 
                type="date"
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">服务截止日期</label>
              <input 
                type="date"
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">统计单元</label>
              <select
                disabled={isDetail}
                className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff] disabled:bg-gray-100 bg-white"
                value={formData.statisticalUnit || ''}
                onChange={(e) => setFormData({ ...formData, statisticalUnit: e.target.value })}
              >
                {statisticalUnitsList.map((su, i) => (
                  <option key={i} value={su}>{su}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#e8e8e8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#d9d9d9] rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {isDetail ? '关闭' : '取消'}
            </button>
            {!isDetail && (
              <button
                type="submit"
                className="px-4 py-2 bg-[#1677ff] text-white rounded text-xs hover:bg-blue-600 cursor-pointer"
              >
                确定
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
