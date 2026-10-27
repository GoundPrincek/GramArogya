import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import AppointmentCard from '../../components/appointments/AppointmentCard';

export const MyAppointments = () => {
  // Sample placeholder appointment for Phase 1 skeleton
  const sampleAppointment = {
    _id: 'app-001',
    tokenNumber: 14,
    department: 'General Medicine',
    status: 'Scheduled',
    appointmentDate: new Date().toISOString(),
    timeSlot: '10:00 - 11:00 AM',
    facilityId: {
      name: 'Wagholi Primary Health Centre',
      tier: 'PHC'
    },
    symptoms: 'Fever and seasonal cough for 3 days'
  };

  return (
    <div>
      <DashboardHeader
        title="My Appointments"
        subtitle="View and manage scheduled outpatient consultations and visit tokens."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AppointmentCard appointment={sampleAppointment} />
      </div>
    </div>
  );
};

export default MyAppointments;
