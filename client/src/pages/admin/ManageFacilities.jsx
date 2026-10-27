import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import facilityService from '../../services/facilityService';
import {
  Building,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Search,
  MapPin,
  Phone,
  Power
} from 'lucide-react';

export const ManageFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Create Facility Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    facilityType: 'PHC',
    district: 'Pune',
    taluka: 'Haveli',
    village: '',
    pincode: '412207',
    address: '',
    phone: '020-27100000',
    emergencyPhone: '108',
    is24x7Emergency: false
  });

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await facilityService.getFacilities({
        search,
        district: districtFilter
      });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.facilities || []);
      setFacilities(list);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [districtFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFacilities();
  };

  const handleToggleStatus = async (facility) => {
    try {
      const newStatus = !facility.isActive;
      await facilityService.updateFacility(facility._id, { isActive: newStatus });
      setNotification({
        type: 'success',
        message: `${facility.name} status updated to ${newStatus ? 'Active' : 'Inactive'}.`
      });
      await fetchFacilities();
    } catch (err) {
      console.error('Failed to toggle facility status:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update facility status.'
      });
    }
  };

  const handleCreateFacility = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.district || !formData.facilityType) {
      alert('Please fill in required fields (Name, Facility Type, District).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        facilityType: formData.facilityType,
        tier: formData.facilityType,
        district: formData.district,
        taluka: formData.taluka,
        village: formData.village,
        pincode: formData.pincode,
        address: formData.address || `${formData.taluka}, ${formData.district}`,
        contactInformation: {
          phone: formData.phone,
          emergencyPhone: formData.emergencyPhone
        },
        contact: {
          phone: formData.phone
        },
        operatingHours: {
          opensAt: '09:00 AM',
          closesAt: '05:00 PM',
          is24x7Emergency: formData.is24x7Emergency
        },
        services: ['General Outpatient Care', 'Maternal Health', 'Immunization', 'Emergency Triage']
      };

      await facilityService.createFacility(payload);
      setNotification({
        type: 'success',
        message: `Healthcare facility "${formData.name}" onboarded successfully into the registry.`
      });
      setCreateModalOpen(false);
      setFormData({
        name: '',
        facilityType: 'PHC',
        district: 'Pune',
        taluka: 'Haveli',
        village: '',
        pincode: '412207',
        address: '',
        phone: '020-27100000',
        emergencyPhone: '108',
        is24x7Emergency: false
      });
      await fetchFacilities();
    } catch (err) {
      console.error('Failed to onboard facility:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create healthcare facility profile.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <DashboardHeader
          title="Manage Public Healthcare Registry"
          subtitle="Register, configure, and monitor Primary Health Centres, Sub-Centres, and Hospital networks across Maharashtra."
        />
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <PlusCircle size={16} /> Onboard New Health Facility
        </Button>
      </div>

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
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search facility name, taluka, village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem' }}
          />
          <Button variant="primary" type="submit" style={{ padding: '0.45rem 0.85rem' }}>
            <Search size={15} />
          </Button>
        </form>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '180px' }}
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Maharashtra Districts</option>
          <option value="Pune">Pune</option>
          <option value="Thane">Thane</option>
          <option value="Nashik">Nashik</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Aurangabad">Chhatrapati Sambhajinagar</option>
          <option value="Amravati">Amravati</option>
          <option value="Nanded">Nanded</option>
        </select>
      </div>

      {loading ? (
        <Loader message="Loading public health facility registry..." />
      ) : facilities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Building size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Facilities Found
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            No healthcare facilities match your search query. Try broadening your criteria or onboard a new facility.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Tier</th>
                <th>Jurisdiction</th>
                <th>Contact</th>
                <th>Operating Hours</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((fac) => {
                const tier = fac.facilityType || fac.tier;
                const contactPhone = (fac.contactInformation || fac.contact)?.phone || 'Government Helpline 108';
                const is24x7 = (fac.operatingHours || fac.operationalHours)?.is24x7Emergency;
                const isActive = fac.isActive !== false;

                return (
                  <tr key={fac._id}>
                    <td>
                      <strong style={{ color: 'var(--color-primary)' }}>{fac.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Code: {fac.facilityCode || 'MH-GOV'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tier === 'DistrictHospital' ? 'badge-emergency' : tier === 'CHC' ? 'badge-warning' : 'badge-accepted'}`}>
                        {tier}
                      </span>
                    </td>
                    <td>
                      {fac.village ? `${fac.village}, ` : ''}{fac.taluka}
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {fac.district} - {fac.pincode}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={13} color="var(--color-primary-light)" />
                        <span>{contactPhone}</span>
                      </div>
                    </td>
                    <td>
                      {is24x7 ? (
                        <span className="badge badge-emergency" style={{ fontSize: '0.75rem' }}>24x7 Emergency</span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>09:00 AM - 05:00 PM</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-accepted' : 'badge-emergency'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                        onClick={() => handleToggleStatus(fac)}
                      >
                        <Power size={12} /> {isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Onboard Facility Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Onboard Healthcare Facility"
      >
        <form onSubmit={handleCreateFacility} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">Facility Official Name *</label>
            <input
              type="text"
              placeholder="e.g. Shirur Primary Health Centre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Healthcare Tier *</label>
              <select
                className="form-select"
                value={formData.facilityType}
                onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
              >
                <option value="SubCenter">Sub-Centre (SC)</option>
                <option value="PHC">Primary Health Centre (PHC)</option>
                <option value="CHC">Community Health Centre (CHC)</option>
                <option value="SubDistrictHospital">Sub-District Hospital (SDH)</option>
                <option value="DistrictHospital">District Hospital (DH)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District *</label>
              <select
                className="form-select"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                <option value="Pune">Pune</option>
                <option value="Thane">Thane</option>
                <option value="Nashik">Nashik</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Aurangabad">Chhatrapati Sambhajinagar</option>
                <option value="Amravati">Amravati</option>
                <option value="Nanded">Nanded</option>
                <option value="Satara">Satara</option>
                <option value="Kolhapur">Kolhapur</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Taluka *</label>
              <input
                type="text"
                placeholder="e.g. Shirur"
                value={formData.taluka}
                onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village / Locality</label>
              <input
                type="text"
                placeholder="e.g. Shirur Rural"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 412210"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                placeholder="e.g. 02138-222300"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <input
              type="checkbox"
              id="is24x7"
              checked={formData.is24x7Emergency}
              onChange={(e) => setFormData({ ...formData, is24x7Emergency: e.target.checked })}
            />
            <label htmlFor="is24x7" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              Operates 24x7 Casualty & Emergency Service
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setCreateModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register Facility'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFacilities;