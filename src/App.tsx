import { useState, useMemo, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { SearchFilters } from './components/SearchFilters';
import { InstitutionTable } from './components/InstitutionTable';
import { OtherPagesView } from './components/OtherPagesView';
import { LocalInstitutionView } from './components/LocalInstitutionView';
import { ErrorInstitutionView } from './components/ErrorInstitutionView';
import { ErrorDataView } from './components/ErrorDataView';
import { HistoryDataCollectView } from './components/HistoryDataCollectView';
import { SpecialInstitutionView } from './components/SpecialInstitutionView';
import { SpecialPlanView } from './components/SpecialPlanView';
import { SystemLogView } from './components/SystemLogView';
import { DownloadCenterView } from './components/DownloadCenterView';
import { InstitutionDetailView } from './components/InstitutionDetailView';
import { InstitutionEditView } from './components/InstitutionEditView';
import { initialInstitutions } from './data/mockData';
import { Institution, FilterState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('institution_management');
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [detailInstitution, setDetailInstitution] = useState<Institution | null>(null);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [isAddingInstitution, setIsAddingInstitution] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    region: '',
    category: '',
    type: '',
    validity: '',
    statisticalUnit: ''
  });

  // Parse and sync route from hash
  const syncRouteFromHash = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '') || 'institution_management';
    const [path, param] = rawHash.split('/');

    if (path === 'institution_detail' && param) {
      const inst = institutions.find(i => String(i.id) === param) || institutions[0];
      setCurrentView('institution_management');
      setDetailInstitution(inst || null);
      setEditingInstitution(null);
      setIsAddingInstitution(false);
    } else if (path === 'institution_edit' && param) {
      const inst = institutions.find(i => String(i.id) === param) || institutions[0];
      setCurrentView('institution_management');
      setEditingInstitution(inst || null);
      setDetailInstitution(null);
      setIsAddingInstitution(false);
    } else if (path === 'institution_add') {
      setCurrentView('institution_management');
      setIsAddingInstitution(true);
      setDetailInstitution(null);
      setEditingInstitution(null);
    } else {
      setCurrentView(path || 'institution_management');
      setDetailInstitution(null);
      setEditingInstitution(null);
      setIsAddingInstitution(false);
    }
  }, [institutions]);

  useEffect(() => {
    // Initial sync
    if (!window.location.hash || window.location.hash === '#/') {
      window.location.hash = '#/institution_management';
    } else {
      syncRouteFromHash();
    }

    const handleHashChange = () => {
      syncRouteFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [syncRouteFromHash]);

  // Calculate dynamic stats counts
  const counts = useMemo(() => {
    const total = institutions.length;
    const official = institutions.filter(i => i.status === 'official').length;
    const trial = institutions.filter(i => i.status === 'trial').length;
    const expiringSoon = institutions.filter(i => i.daysRemaining <= 30 && i.status !== 'expired' && i.status !== 'closed').length;
    const expired = institutions.filter(i => i.status === 'expired' || i.daysRemaining <= 0).length;
    const closed = institutions.filter(i => i.status === 'closed' || !i.isActive).length;

    return { total, official, trial, expiringSoon, expired, closed };
  }, [institutions]);

  // Toggle active switch
  const handleToggleStatus = (id: number) => {
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextActive = !inst.isActive;
        return {
          ...inst,
          isActive: nextActive,
          status: nextActive ? (inst.status === 'closed' ? 'trial' : inst.status) : 'closed'
        };
      }
      return inst;
    }));
  };

  // Filtered institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      // Stats card filter
      if (activeFilter === 'official' && inst.status !== 'official') return false;
      if (activeFilter === 'trial' && inst.status !== 'trial') return false;
      if (activeFilter === 'expiringSoon' && (inst.daysRemaining > 30 || inst.status === 'expired')) return false;
      if (activeFilter === 'expired' && inst.daysRemaining > 0 && inst.status !== 'expired') return false;
      if (activeFilter === 'closed' && inst.isActive) return false;

      // Form filters
      if (filters.name && !inst.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.region && !inst.region.includes(filters.region)) return false;
      if (filters.category && inst.category !== filters.category) return false;
      if (filters.type && inst.type !== filters.type) return false;
      if (filters.statisticalUnit && inst.statisticalUnit !== filters.statisticalUnit) return false;

      if (filters.validity === 'valid' && inst.daysRemaining <= 0) return false;
      if (filters.validity === 'expiring' && (inst.daysRemaining > 30 || inst.daysRemaining <= 0)) return false;
      if (filters.validity === 'expired' && inst.daysRemaining > 0) return false;

      return true;
    });
  }, [institutions, activeFilter, filters]);

  const handleSearch = () => {
    // triggers filtering via useMemo
  };

  const handleReset = () => {
    setFilters({
      name: '',
      region: '',
      category: '',
      type: '',
      validity: '',
      statisticalUnit: ''
    });
    setActiveFilter('all');
  };

  // Actions
  const handleOpenAdd = () => {
    window.location.hash = '#/institution_add';
  };

  const handleAddConfirm = (data: Partial<Institution>) => {
    const newInst: Institution = {
      id: Date.now(),
      name: data.name || '未命名机构',
      region: data.region || '陕西',
      category: data.category || '一类',
      type: data.type || '网信部门',
      salesName: data.salesName || '夏小花',
      salesPhone: data.salesPhone || '136****1626',
      status: data.status || 'trial',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2026-11-30',
      daysRemaining: 105,
      statisticalUnit: data.statisticalUnit || `${data.name || '陕西省委网信办'}单元`,
    };
    setInstitutions(prev => [newInst, ...prev]);
    window.location.hash = '#/institution_management';
  };

  const handleViewDetail = (inst: Institution) => {
    window.location.hash = `#/institution_detail/${inst.id}`;
  };

  const handleEdit = (inst: Institution) => {
    window.location.hash = `#/institution_edit/${inst.id}`;
  };

  const handleEditConfirm = (updatedData: Partial<Institution>) => {
    if (editingInstitution) {
      const updated = {
        ...editingInstitution,
        ...updatedData
      } as Institution;

      setInstitutions(prev => prev.map(i => i.id === editingInstitution.id ? updated : i));

      if (detailInstitution && detailInstitution.id === editingInstitution.id) {
        setDetailInstitution(updated);
      }
    }
    window.location.hash = '#/institution_management';
  };

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除该机构吗？删除后不可恢复。')) {
      setInstitutions(prev => prev.filter(i => i.id !== id));
      if (detailInstitution && detailInstitution.id === id) {
        window.location.hash = '#/institution_management';
      }
      if (editingInstitution && editingInstitution.id === id) {
        window.location.hash = '#/institution_management';
      }
    }
  };

  const handleSelectView = (viewKey: string) => {
    window.location.hash = `#/${viewKey}`;
  };

  return (
    <div className="flex h-screen w-screen min-w-[1366px] overflow-hidden text-sm text-[#333333] bg-[#f0f2f5]">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onSelectView={handleSelectView} 
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onNavigate={handleSelectView} />

        {/* Dynamic Page Content */}
        {currentView === 'download_center' ? (
          <DownloadCenterView
            onBackToInstitution={() => handleSelectView('institution_management')}
          />
        ) : currentView === 'local_institution' ? (
          <LocalInstitutionView 
            onBackToInstitution={() => handleSelectView('institution_management')} 
          />
        ) : currentView === 'error_institution' ? (
          <ErrorInstitutionView
            onBackToInstitution={() => handleSelectView('institution_management')}
            onNavigateToView={(v) => handleSelectView(v)}
          />
        ) : currentView === 'error_data' ? (
          <ErrorDataView />
        ) : currentView === 'error_history' ? (
          <HistoryDataCollectView />
        ) : currentView === 'special_institution' ? (
          <SpecialInstitutionView
            onNavigateToPlan={() => handleSelectView('special_plan')}
          />
        ) : currentView === 'special_plan' ? (
          <SpecialPlanView />
        ) : currentView === 'system_logs' ? (
          <SystemLogView 
            onBackToInstitution={() => handleSelectView('institution_management')}
          />
        ) : currentView !== 'institution_management' ? (
          <OtherPagesView 
            viewKey={currentView} 
            onBackToInstitution={() => handleSelectView('institution_management')} 
          />
        ) : isAddingInstitution ? (
          <InstitutionEditView 
            mode="add"
            onCancel={() => { window.location.hash = '#/institution_management'; }}
            onConfirm={handleAddConfirm}
          />
        ) : editingInstitution ? (
          <InstitutionEditView 
            mode="edit"
            institution={editingInstitution}
            onCancel={() => { window.location.hash = '#/institution_management'; }}
            onConfirm={handleEditConfirm}
          />
        ) : detailInstitution ? (
          <InstitutionDetailView 
            institution={detailInstitution}
            onBack={() => { window.location.hash = '#/institution_management'; }}
            onEdit={handleEdit}
          />
        ) : (
          <main className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
            {/* Page Title & Actions */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800">机构管理</h2>
              <button 
                onClick={handleOpenAdd}
                className="bg-[#1677ff] text-white px-4 py-1.5 rounded text-xs flex items-center hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-plus mr-1.5"></i> 新增机构
              </button>
            </div>

            {/* Statistics Cards */}
            <StatsCards 
              counts={counts} 
              activeFilter={activeFilter} 
              onSelectFilter={(filter) => setActiveFilter(filter)} 
            />

            {/* Search Filters */}
            <SearchFilters 
              filters={filters}
              onFilterChange={(f) => setFilters(f)}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            {/* Data Table */}
            <InstitutionTable 
              institutions={filteredInstitutions}
              onToggleStatus={handleToggleStatus}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </main>
        )}
      </div>
    </div>
  );
}
