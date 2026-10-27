const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    tokenNumber: {
      type: Number,
      required: true
    },
    department: {
      type: String,
      default: 'General Medicine'
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'],
      default: 'Scheduled'
    },
    symptoms: {
      type: String,
      trim: true
    },
    consultationNotes: {
      type: String,
      default: ''
    },
    prescribedMedicines: [
      {
        name: String,
        dosage: String,
        duration: String
      }
    ]
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ facilityId: 1, appointmentDate: 1, tokenNumber: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
