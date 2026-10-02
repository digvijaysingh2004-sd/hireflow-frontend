import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Shield, Search, Terminal, Clock, User } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => dashboardApi.getAuditLogs(),
  });

  const auditLogs = data?.data || [];

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchTerm.trim()) return true;
    const action = log.action?.toLowerCase() || '';
    const user = log.performedBy?.toLowerCase() || '';
    const resource = log.resourceId?.toLowerCase() || '';
    return (
      action.includes(searchTerm.toLowerCase()) ||
      user.includes(searchTerm.toLowerCase()) ||
      resource.includes(searchTerm.toLowerCase())
    );
  });

  const columns: Column<AuditLog>[] = [
    {
      header: 'Action Event',
      accessor: (log) => (
        <div>
          <span className="font-bold text-slate-900 text-sm block">{log.action || 'Event Log'}</span>
          {log.correlationId && (
            <span className="text-[10px] text-slate-400 font-mono block">
              Trace: {log.correlationId}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Performed By',
      accessor: (log) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{log.performedBy || 'System / Anonymous'}</span>
        </div>
      ),
    },
    {
      header: 'Target Resource',
      accessor: (log) => (
        <span className="text-xs font-mono text-slate-600">
          {log.resourceType ? `${log.resourceType}: ` : ''}
          {log.resourceId || 'N/A'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      accessor: (log) => (
        <span className="text-xs font-mono text-slate-500">{log.ipAddress || '127.0.0.1'}</span>
      ),
    },
    {
      header: 'Timestamp (UTC)',
      accessor: (log) => (
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {log.timestampUtc
              ? new Date(log.timestampUtc).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : 'N/A'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            <span>Platform Security Audit Log</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Immutable audit trial tracking administrative changes, status updates, and auth actions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search action, user, or trace ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredLogs}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyMessage="No audit log events recorded yet."
        />
      </div>
    </div>
  );
};
