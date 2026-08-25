// Download Center Task Management Store

export interface DownloadTask {
  id: string;
  fileName: string;
  taskType: string; // e.g. '台账一键导出' | '台账选中导出' | '台账导入日志' | '错误表述台账导出'
  count: number;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  operator: string;
  time: string;
  progress?: number;
  selectedFields?: string[];
  records?: any[];
}

export const INITIAL_DOWNLOAD_TASKS: DownloadTask[] = [
  {
    id: 'dt-1',
    fileName: '台账一键导出_20260819161511.xlsx',
    taskType: '台账一键导出',
    count: 707,
    status: 'completed',
    operator: '李隆荔',
    time: '2026-08-19 16:15:11'
  },
  {
    id: 'dt-2',
    fileName: '台账一键导出_20260819141624.xlsx',
    taskType: '台账一键导出',
    count: 501,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 14:16:24'
  },
  {
    id: 'dt-3',
    fileName: '台账一键导出_20260819141557.xlsx',
    taskType: '台账一键导出',
    count: 78,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 14:15:57'
  },
  {
    id: 'dt-4',
    fileName: '台账一键导出_20260819141533.xlsx',
    taskType: '台账一键导出',
    count: 109,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 14:15:33'
  },
  {
    id: 'dt-5',
    fileName: '台账一键导出_20260819103517.xlsx',
    taskType: '台账一键导出',
    count: 668,
    status: 'completed',
    operator: '王飞飞',
    time: '2026-08-19 10:35:17'
  },
  {
    id: 'dt-6',
    fileName: '台账一键导出_20260819101451.xlsx',
    taskType: '台账一键导出',
    count: 813,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 10:14:51'
  },
  {
    id: 'dt-7',
    fileName: '台账一键导出_20260819101418.xlsx',
    taskType: '台账一键导出',
    count: 196,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 10:14:18'
  },
  {
    id: 'dt-8',
    fileName: '台账一键导出_20260819101344.xlsx',
    taskType: '台账一键导出',
    count: 253,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-19 10:13:44'
  },
  {
    id: 'dt-9',
    fileName: '台账一键导出_20260818170423.xlsx',
    taskType: '台账一键导出',
    count: 668,
    status: 'completed',
    operator: '王飞飞',
    time: '2026-08-18 17:04:23'
  },
  {
    id: 'dt-10',
    fileName: '台账导入模版-多平台导入-天津_导出.xlsx',
    taskType: '台账导入日志',
    count: 475,
    status: 'completed',
    operator: '王卓',
    time: '2026-08-18 16:59:01'
  },
  {
    id: 'dt-11',
    fileName: '台账一键导出_20260818164222.xlsx',
    taskType: '台账一键导出',
    count: 136,
    status: 'completed',
    operator: '王卓',
    time: '2026-08-18 16:42:22'
  },
  {
    id: 'dt-12',
    fileName: '台账一键导出_20260818141611.xlsx',
    taskType: '台账一键导出',
    count: 13,
    status: 'completed',
    operator: '相建旗',
    time: '2026-08-18 14:16:11'
  }
];

let globalTasks: DownloadTask[] = [...INITIAL_DOWNLOAD_TASKS];
type Listener = (tasks: DownloadTask[]) => void;
const listeners = new Set<Listener>();

export function getDownloadTasks(): DownloadTask[] {
  return globalTasks;
}

export function subscribeDownloadTasks(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  const cloned = [...globalTasks];
  listeners.forEach(l => l(cloned));
}

export function addDownloadTask(task: Omit<DownloadTask, 'id' | 'time'> & { time?: string }): DownloadTask {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const newTask: DownloadTask = {
    ...task,
    id: `dt-${Date.now()}`,
    time: task.time || timeStr,
    progress: task.status === 'processing' ? 15 : 100
  };

  globalTasks = [newTask, ...globalTasks];
  notify();

  // If task is processing, simulate progress completion
  if (newTask.status === 'processing') {
    setTimeout(() => {
      globalTasks = globalTasks.map(t => t.id === newTask.id ? { ...t, progress: 65 } : t);
      notify();
    }, 700);

    setTimeout(() => {
      globalTasks = globalTasks.map(t => t.id === newTask.id ? { ...t, status: 'completed', progress: 100 } : t);
      notify();
    }, 1500);
  }

  return newTask;
}

// Function to trigger client-side CSV / Excel download
export function triggerFileDownload(task: DownloadTask) {
  // Generate CSV data with UTF-8 BOM
  const headers = task.selectedFields && task.selectedFields.length > 0 
    ? task.selectedFields 
    : ['序号', '台账名称', '所属平台', '粉丝数量', '认证类型', '主体名称', '管辖归属地', '状态'];

  const rows: string[] = [];
  rows.push(headers.join(','));

  if (task.records && task.records.length > 0) {
    task.records.forEach((item, index) => {
      const row = headers.map(h => {
        let val = '';
        if (h.includes('台账名称')) val = item.name || `测试台账_${index + 1}`;
        else if (h.includes('所属平台')) val = item.platform || '微博';
        else if (h.includes('主页地址')) val = item.homepage || 'https://weibo.com/u/1000';
        else if (h.includes('粉丝数量')) val = item.fans || '12.00万';
        else if (h.includes('台账认证类型') || h.includes('认证类型')) val = item.authType || '机构';
        else if (h.includes('认证标识')) val = item.badge || '蓝V';
        else if (h.includes('台账认证信息')) val = item.authDesc || '中共陕西省委网信办官方微博';
        else if (h.includes('台账简介')) val = item.summary || '发布权威政务信息与便民服务';
        else if (h.includes('管辖归属地')) val = item.region || '陕西省/西安市';
        else if (h.includes('IP属地')) val = item.ip || '陕西';
        else if (h.includes('最后一天发文地址')) val = item.lastPostLoc || '陕西西安';
        else if (h.includes('注册地址')) val = item.regLoc || '陕西西安';
        else if (h.includes('区域模型地址')) val = item.modelLoc || '陕西省';
        else if (h.includes('待确认区域模型地址')) val = item.pendingLoc || '-';
        else if (h.includes('台账研判类型')) val = item.judgmentType || '精准匹配';
        else if (h.includes('关联主体名称') || h.includes('主体名称')) val = item.subjectName || '中共陕西省委网络安全和信息化委员会办公室';
        else if (h.includes('主体类型')) val = item.subjectType || '机关';
        else if (h.includes('序号')) val = String(index + 1);
        else val = '-';

        return `"${String(val).replace(/"/g, '""')}"`;
      });
      rows.push(row.join(','));
    });
  } else {
    // Generate dummy rows up to Math.min(task.count, 20)
    const dummyCount = Math.min(task.count || 10, 20);
    for (let i = 1; i <= dummyCount; i++) {
      const row = headers.map(h => {
        if (h.includes('台账名称')) return `"陕西网信政务发布_${i}"`;
        if (h.includes('所属平台')) return `"微博"`;
        if (h.includes('粉丝数量')) return `"12.00万"`;
        if (h.includes('主体名称')) return `"中共陕西省委网络安全和信息化委员会办公室"`;
        if (h.includes('序号')) return `"${i}"`;
        return `"示例数据_${i}"`;
      });
      rows.push(row.join(','));
    }
  }

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', task.fileName.replace(/\.xlsx$/, '.csv'));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
