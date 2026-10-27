import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import userService from '../../services/userService';
import facilityService from '../../services/facilityService';
import { formatDate } from '../../utils/formatDate';
import {
  Users,
  Search,
  Shield,
  CheckCircle,
  AlertCircle,
  Building,
  UserCheck
} from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);

  // Edit Role Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('patient');
  const [newFacilityId, setNewFacilityId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [uRes, fRes] = await Promise.allSettled([
        userService.getAllUsers({ role: roleFilter, search }),
        facilityService.getFacilities()
      ]);

      if (uRes.status === 'fulfilled') {
        const uList = Array.isArray(uRes.value?.data)
          ? uRes.value.data
          : (uRes.value?.data?.users || []);
        setUsers(uList);
      }

      if (fRes.status === 'fulfilled') {
        const fList = Array.isArray(fRes.value?.data)
          ? fRes.value.data
          : (fRes.value?.data?.facilities || []);
        setFacilities(fList);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'patient');
    setNewFacilityId(user.facilityId?._id || user.facilityId || '');
    setEditModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSaving(true);
      await userService.updateUserRole(selectedUser._id || selectedUser.id, {
        role: newRole,
        facilityId: newFacilityId || null
      });

      setNotification({
        type: 'success',
        message: `Permissions updated for user ${selectedUser.name}. New role: ${newRole}.`
      });
      setEditModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to update user role:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update user role.'
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-emergency">Administrator</span>;
      case 'doctor':
        return <span className="badge badge-accepted">Doctor</span>;
      case 'staff':
        return <span className="badge badge-warning">Medical Staff</span>;
      case 'asha_worker':
        return <span className="badge badge-info">ASHA Worker</span>;
      default:
        return <span className="badge badge-routine">Citizen</span>;
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Manage Platform Users"
        subtitle="Manage credentials, roles, and jurisdictions for medical officers, ASHA workers, and citizens."
      />

      {notification && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: notification.type === 'success' ? 'var(--color-success-bg)' : '#fee2e2',
            color: notification.type === 'success' ? 'var(--color-success)' : '#dc2626',
            border: `1px solid ${notification.type === 'success' ? '#86efac' : '#fca5a5'}`
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'All Users', value: '' },
            { label: 'Citizens', value: 'patient' },
            { label: 'Staff', value: 'staff' },
            { label: 'Doctors', value: 'doctor' },
            { label: 'ASHA Workers', value: 'asha_worker' },
            { label: 'Admins', value: 'admin' }
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setRoleFilter(tab.value)}
              className={`btn btn-sm ${roleFilter === tab.value ? 'btn-primary' : 'btn-outline'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem' }}
          />
          <Button variant="primary" type="submit" style={{ padding: '0.45rem 0.85rem' }}>
            <Search size={15} />
          </Button>
        </form>
      </div>

      {loading ? (
        <Loader message="Loading registered users..." />
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Users size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Users Found
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            No user profiles match the selected role or search filter.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Assigned Facility</th>
                <th>Jurisdiction</th>
                <th>Registered On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const facName = u.facilityId?.name || (u.facilityId ? 'Assigned Facility' : '--');
                const taluka = u.jurisdiction?.taluka || 'Haveli';
                const district = u.jurisdiction?.district || 'Pune';

                return (
                  <tr key={u._id || u.id}>
                    <td>
                      <strong style={{ color: 'var(--color-primary)' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {u.phone || u.email || 'No contact provided'}
                      </div>
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <span style={{ fontSize: '0.825rem' }}>{facName}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem' }}>{taluka}, {district}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {formatDate(u.createdAt)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                        onClick={() => handleOpenEdit(u)}
                      >
                        <UserCheck size={12} /> Edit Role
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update User Privileges"
      >
        <form onSubmit={handleSaveRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Configure access control and facility assignment for <strong>{selectedUser?.name}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label">System Role *</label>
            <select
              className="form-select"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="patient">Citizen / Patient</option>
              <option value="asha_worker">ASHA Health Worker</option>
              <option value="staff">Medical Staff / Reception</option>
              <option value="doctor">Medical Officer / Doctor</option>
              <option value="admin">District Health Administrator</option>
            </select>
          </div>

          {newRole !== 'patient' && newRole !== 'admin' && (
            <div className="form-group">
              <label className="form-label">Affiliated Healthcare Facility</label>
              <select
                className="form-select"
                value={newFacilityId}
                onChange={(e) => setNewFacilityId(e.target.value)}
              >
                <option value="">-- No Facility Assigned --</option>
                {facilities.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.facilityType || f.tier}) &bull; {f.district}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Save Privileges'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;