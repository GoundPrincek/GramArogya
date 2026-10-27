import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export const AppointmentForm = ({ facilityId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    facilityId: facilityId || '',
    appointmentDate: '',
    timeSlot: '09:00 - 11:00 AM',
    department: 'General Medicine',
    symptoms: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="Preferred Date"
        name="appointmentDate"
        type="date"
        required
        value={formData.appointmentDate}
        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
      />

      <div className="form-group">
        <label className="form-label">Time Slot *</label>
        <select
          className="form-select"
          value={formData.timeSlot}
          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
        >
          <option value="09:00 - 11:00 AM">Morning (09:00 - 11:00 AM)</option>
          <option value="11:00 - 01:00 PM">Midday (11:00 - 01:00 PM)</option>
          <option value="02:00 - 04:00 PM">Afternoon (02:00 - 04:00 PM)</option>
          <option value="04:00 - 06:00 PM">Evening (04:00 - 06:00 PM)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <select
          className="form-select"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        >
          <option value="General Medicine">General Medicine</option>
          <option value="Maternal & Child Health">Maternal & Child Health</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Immunization">Immunization</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Symptoms / Reason for Visit</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Brief description of symptoms..."
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" type="submit">
          Confirm Booking
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
