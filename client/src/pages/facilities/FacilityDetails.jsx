import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import facilityService from '../../services/facilityService';
import FacilityMap from '../../components/facilities/FacilityMap';
import AppointmentRequestModal from '../../components/appointments/AppointmentRequestModal';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import DemoBanner from '../../components/common/DemoBanner';
import {
  MapPin,
  Phone,
  Clock,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Building,
  Info,
  Users,
  Bed
} from 'lucide-react';

export const FacilityDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await facilityService.getFacilityById(id);
        if (res?.data) {
          setFacility(res.data.facility || res.data);
        }
      } catch (err) {
        console.error('Error fetching facility details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  if (loading) return <Loader message="Loading healthcare facility profile..." />;
  if (!facility) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Facility Record Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          The requested health center does not exist in the demonstration catalog.
        </p>
        <Link to="/facilities" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Facilities Directory
        </Link>
      </div>
    );
  }

  const hasCoordinates = facility.location?.coordinates && facility.location.coordinates.length === 2;
  const coordinatesCenter = hasCoordinates ? [facility.location.coordinates[1], facility.location.coordinates[0]] : null;

  return (
    <div>
      <DemoBanner />

      <div className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: '960px' }}>
        <Breadcrumbs
          items={[
            { label: t('nav.facilities'), to: '/facilities' },
            { label: facility.name }
          ]}
        />

        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/facilities"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-primary)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={15} /> {t('common.back')} to Search Results
          </Link>
        </div>

        {/* Facility Header Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-accepted" style={{ fontSize: '0.8rem' }}>
                  {facility.tier || facility.facilityType}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Code: {facility.facilityCode || 'MH-GOV'}
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
                {facility.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                <MapPin size={17} color="var(--color-primary-light)" />
                <span>
                  {facility.village ? `${facility.village}, ` : ''}{facility.taluka}, {facility.district} District &bull; PIN: {facility.pincode}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setAppointmentModalOpen(true)}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Calendar size={18} /> {t('facilities.requestAppointment')}
            </Button>
          </div>

          {/* Demonstration Notice */}
          <div className="notice-box-warning" style={{ fontSize: '0.85rem' }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Demonstration Profile:</strong> Operating hours, doctor strength, and outpatient slots shown are synthetic values for Maharashtra healthcare access simulation.
            </div>
          </div>

          {/* Key Indicators Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            backgroundColor: 'var(--color-bg-main)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                {t('facilities.operatingHours')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
                <Clock size={16} color="var(--color-primary)" />
                <span>
                  {(facility.operatingHours || facility.operationalHours)?.is24x7Emergency
                    ? '24x7 Emergency Services'
                    : `${(facility.operatingHours || facility.operationalHours)?.opensAt || '09:00 AM'} - ${(facility.operatingHours || facility.operationalHours)?.closesAt || '05:00 PM'}`}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                {t('facilities.contactInfo')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
                <Phone size={16} color="var(--color-primary)" />
                <span>{(facility.contactInformation || facility.contact)?.phone || 'Government Helpline 108'}</span>
              </div>
            </div>

            {facility.doctorsCount && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Doctor Roster
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <Users size={16} color="var(--color-primary)" />
                  <span>{facility.doctorsCount} Medical Officers Assigned</span>
                </div>
              </div>
            )}

            {facility.bedsCount && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                  Inpatient Bed Strength
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <Bed size={16} color="var(--color-primary)" />
                  <span>{facility.bedsCount} Total Hospital Beds</span>
                </div>
              </div>
            )}
          </div>

          {/* Services Available */}
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
              {t('facilities.servicesOffered')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
              {(facility.services || facility.servicesAvailable || [])?.map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem'
                  }}
                >
                  <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Map Section */}
        {hasCoordinates && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
              {t('facilities.locationMap')}
            </h3>
            <FacilityMap
              facilities={[facility]}
              center={coordinatesCenter}
              zoom={13}
              height="380px"
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', margin: '0.5rem 0 0' }}>
              Geographic coordinates: [{facility.location.coordinates[1].toFixed(4)}, {facility.location.coordinates[0].toFixed(4)}]
            </p>
          </div>
        )}

        {/* Appointment Request Modal */}
        <AppointmentRequestModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          facility={facility}
        />
      </div>
    </div>
  );
};

export default FacilityDetails;
