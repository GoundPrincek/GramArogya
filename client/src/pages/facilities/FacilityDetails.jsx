import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { MapPin, Phone, Clock, ArrowLeft, Calendar, ShieldCheck } from 'lucide-react';

export const FacilityDetails = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await facilityService.getFacilityById(id);
        if (res?.data) {
          setFacility(res.data);
        }
      } catch (err) {
        console.error('Error fetching facility details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  if (loading) return <Loader message="Loading facility profile..." />;
  if (!facility) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Facility not found</h2>
        <Link to="/facilities">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem', maxWidth: '900px' }}>
      <Link to="/facilities" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Facilities
      </Link>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
              {facility.tier}
            </span>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary)', margin: 0 }}>
              {facility.name}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Facility Code: {facility.facilityCode}
            </span>
          </div>

          <Button variant="primary" onClick={() => setBookingModalOpen(true)}>
            <Calendar size={16} /> Book Appointment
          </Button>
        </div>

        <div className="grid sm:grid-cols-2" style={{ gap: '1.5rem', backgroundColor: 'var(--color-bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>LOCATION</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem' }}>
              <MapPin size={18} color="var(--color-primary)" />
              <div>
                {facility.address?.street && <div>{facility.address.street}</div>}
                <div>{facility.address?.village}, {facility.address?.taluka}</div>
                <div>{facility.address?.district}, Maharashtra - {facility.address?.pincode}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>CONTACT & HOURS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-primary)" />
                <span>{facility.contact?.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--color-primary)" />
                <span>
                  {facility.operationalHours?.is24x7Emergency
                    ? '24x7 Emergency Services Available'
                    : `${facility.operationalHours?.opensAt} - ${facility.operationalHours?.closesAt}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Services & Facilities Available
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {facility.servicesAvailable?.map((srv, idx) => (
              <span key={idx} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-primary-dark)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem'
              }}>
                <ShieldCheck size={14} /> {srv}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Book Appointment - ${facility.name}`}
      >
        <AppointmentForm
          facilityId={facility._id}
          onSubmit={() => {
            alert('Appointment booking endpoint will process this in Phase 2.');
            setBookingModalOpen(false);
          }}
          onCancel={() => setBookingModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default FacilityDetails;
