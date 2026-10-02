import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { Users, Search, Shield, UserCheck, UserX, Check } from 'lucide-react';
import { AdminUserItem } from '../types';
import { UserRole } from '../../auth/types';

export const UserManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [updating, setUpdating] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers(),
  });

  const users = data?.data || [];

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    return u.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus = !user.isActive;
    try {
      await adminApi.updateUserStatus(user.id, nextStatus);
      addToast(`User ${user.email} is now ${nextStatus ? 'Active' : 'Inactive'}`, 'success');
      refetch();
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to update user status', 'error');
    }
  };

  const handleOpenRoleModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setSelectedRoles(user.roles || []);
  };

  const handleSaveRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdating(true);
    try {
      await adminApi.updateUserRoles(editingUser.id, selectedRoles);
      addToast(`Roles updated for ${editingUser.email}`, 'success');
      refetch();
      setEditingUser(null);
    } catch (err: any) {
      addToast(err.response?.data?.error?.message || 'Failed to update roles', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const toggleRoleSelection = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const availableRoles: UserRole[] = ['Candidate', 'Recruiter', 'HiringManager', 'Admin'];

  const columns: Column<AdminUserItem>[] = [
    {
      header: 'User Email',
      accessor: (u) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
            {u.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 text-sm block">{u.email}</span>
            <span className="text-[11px] text-slate-400">ID: {u.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Roles',
      accessor: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles?.map((r) => (
            <span
              key={r}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              {r}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Account Status',
      accessor: (u) => (
        <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
          {u.isActive ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      header: 'Created Date',
      accessor: (u) => (
        <span className="text-xs text-slate-500">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (u) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Shield className="w-3.5 h-3.5" />}
            onClick={() => handleOpenRoleModal(u)}
          >
            Manage Roles
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}
            icon={u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            onClick={() => handleToggleStatus(u)}
          >
            {u.isActive ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>User & Access Control Management</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Assign security roles (Candidate, Recruiter, HiringManager, Admin) and manage account state.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by email..."
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
          data={filteredUsers}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
          emptyMessage="No system users found."
        />
      </div>

      {/* Role Edit Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Assign Roles: ${editingUser.email}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveRoles} className="space-y-4">
            <p className="text-xs text-slate-500">
              Select one or more security roles to grant permissions across the microservices platform.
            </p>

            <div className="space-y-2">
              {availableRoles.map((role) => {
                const isChecked = selectedRoles.includes(role);
                return (
                  <div
                    key={role}
                    onClick={() => toggleRoleSelection(role)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold text-sm">{role}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={updating}>
                Save User Roles
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
