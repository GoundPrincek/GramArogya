# GramArogya Connect — Database Design & Data Modeling

## Overview
GramArogya Connect uses **MongoDB** as its primary document-oriented database, modeled via **Mongoose ODM**. This NoSQL architecture allows flexible nested schemas (e.g., GeoJSON coordinates, operational hours, referral transfer histories) while enforcing strict schema-level validation, references, and compound indexes.

No SQL or relational tables are utilized. All relationships are modeled using Mongoose `ObjectId` references (`ref: 'Model'`) or embedded sub-documents.

---

## 1. MongoDB Collections Summary

| Collection | Model Name | Primary Purpose | Key Relationships |
| :--- | :--- | :--- | :--- |
| `users` | `User` | Stores citizen, doctor, ASHA worker, and admin profiles and credentials | References `facilities` (assigned facility for staff) |
| `facilities` | `Facility` | Public health centers (Sub-Center, PHC, CHC, District Hospital) with GeoJSON | Parent facility references for multi-tier hierarchy |
| `appointments` | `Appointment` | Outpatient appointments and walk-in consultation queues | References `users` (patient, doctor), `facilities` |
| `referrals` | `Referral` | Clinical case escalations between primary, secondary, and tertiary centers | References `users` (patient, referringDoctor), `facilities` (from, to) |
| `notifications` | `Notification` | System alerts, referral updates, and appointment reminders | References `users` (recipient) |
| `auditlogs` | `AuditLog` | Immutable event log for clinical updates and security tracking | References `users` (actor) |

---

## 2. Collection Schemas & Relationships

### 2.1. `users` Collection
Stores authentication credentials, contact numbers, roles, and assigned health jurisdictions.

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['patient', 'asha_worker', 'doctor', 'staff', 'admin'],
    default: 'patient',
    index: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    default: null
  },
  jurisdiction: {
    state: { type: String, default: 'Maharashtra' },
    district: { type: String },
    taluka: { type: String },
    village: { type: String }
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'mr', 'hi'],
    default: 'mr'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

**Indexes:**
- `{ phone: 1 }` (Unique)
- `{ role: 1 }`
- `{ "jurisdiction.district": 1, "jurisdiction.taluka": 1 }`

---

### 2.2. `facilities` Collection
Represents public health institutions in Maharashtra across rural healthcare tiers (Sub-Center, PHC, CHC, Sub-District Hospital, District Hospital).

```javascript
const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  facilityCode: { type: String, required: true, unique: true, uppercase: true },
  tier: {
    type: String,
    enum: ['SubCenter', 'PHC', 'CHC', 'SubDistrictHospital', 'DistrictHospital'],
    required: true,
    index: true
  },
  contact: {
    phone: { type: String, required: true },
    emergencyPhone: { type: String },
    email: { type: String }
  },
  address: {
    street: { type: String },
    village: { type: String },
    taluka: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true, index: true }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  servicesAvailable: [{ type: String }],
  operationalHours: {
    opensAt: { type: String, default: '09:00' },
    closesAt: { type: String, default: '17:00' },
    is24x7Emergency: { type: Boolean, default: false }
  },
  parentFacilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    default: null
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

**Indexes:**
- `{ location: '2dsphere' }` (Critical for geospatial nearest-facility queries)
- `{ facilityCode: 1 }` (Unique)
- `{ "address.district": 1, "address.taluka": 1, tier: 1 }`

---

### 2.3. `appointments` Collection
Tracks booked outpatient consultations, ASHA-facilitated visits, and tokens.

```javascript
const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
    index: true
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
  appointmentDate: { type: Date, required: true, index: true },
  timeSlot: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  department: { type: String, default: 'General Medicine' },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'],
    default: 'Scheduled',
    index: true
  },
  symptoms: { type: String, trim: true },
  consultationNotes: { type: String, default: '' },
  prescribedMedicines: [{
    name: String,
    dosage: String,
    duration: String
  }]
}, { timestamps: true });
```

**Indexes:**
- `{ facilityId: 1, appointmentDate: 1, tokenNumber: 1 }` (Compound index)
- `{ patientId: 1, appointmentDate: -1 }`

---

### 2.4. `referrals` Collection
Coordinates multi-tier patient escalations (e.g. from a remote Primary Health Center to a District Hospital for higher surgical care).

```javascript
const ReferralSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fromFacilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  toFacilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
    index: true
  },
  referringDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['Normal', 'Urgent', 'Emergency'],
    default: 'Normal',
    index: true
  },
  reasonForReferral: { type: String, required: true },
  provisionalDiagnosis: { type: String, required: true },
  vitals: {
    bloodPressure: String,
    pulseRate: Number,
    spo2: Number,
    temperature: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'EnRoute', 'Arrived', 'Completed', 'Rejected'],
    default: 'Pending',
    index: true
  },
  receivingDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  actionNotes: { type: String, default: '' }
}, { timestamps: true });
```

**Indexes:**
- `{ toFacilityId: 1, status: 1, urgencyLevel: 1 }`
- `{ patientId: 1, createdAt: -1 }`

---

### 2.5. `notifications` Collection
In-app and outbound communication logs for citizen updates and critical medical transfers.

```javascript
const NotificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['APPOINTMENT_REMINDER', 'REFERRAL_UPDATE', 'EMERGENCY_ALERT', 'SYSTEM_BROADCAST'],
    required: true
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });
```

**Indexes:**
- `{ recipientId: 1, isRead: 1, createdAt: -1 }`

---

### 2.6. `auditlogs` Collection
Audit log maintaining records of security actions, clinical modifications, and triage updates.

```javascript
const AuditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: { type: String, required: true },
  targetCollection: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  ipAddress: { type: String },
  details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
```

**Indexes:**
- `{ targetCollection: 1, targetId: 1 }`
- `{ actorId: 1, createdAt: -1 }`

---

## 3. Sample Fictional Documents

### Fictional User
```json
{
  "_id": "660a1f200000000000000001",
  "name": "Dr. Ananya Kulkarni",
  "phone": "9823012345",
  "email": "ananya.kulkarni@arogya.gov.in",
  "role": "doctor",
  "facilityId": "660a1f100000000000000001",
  "jurisdiction": {
    "state": "Maharashtra",
    "district": "Pune",
    "taluka": "Haveli",
    "village": "Wagholi"
  },
  "preferredLanguage": "mr",
  "isActive": true
}
```

### Fictional Facility
```json
{
  "_id": "660a1f100000000000000001",
  "name": "Wagholi Primary Health Centre",
  "facilityCode": "PHC-MH-PUN-042",
  "tier": "PHC",
  "contact": {
    "phone": "02027000111",
    "emergencyPhone": "02027000112"
  },
  "address": {
    "street": "Nagar Road, Near Gram Panchayat",
    "village": "Wagholi",
    "taluka": "Haveli",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "412207"
  },
  "location": {
    "type": "Point",
    "coordinates": [73.9806, 18.5793]
  },
  "servicesAvailable": ["Maternal Care", "Immunization", "OPD", "Basic Pathology"],
  "operationalHours": {
    "opensAt": "08:00",
    "closesAt": "20:00",
    "is24x7Emergency": true
  },
  "isActive": true
}
```
