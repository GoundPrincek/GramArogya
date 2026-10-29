# GramArogya Connect

**A Rural Public Healthcare Access and Coordination Platform**

**Problem ID:** SIH26133  
**Target Region:** Rural and Underserved Communities of Maharashtra

## 1. Project Overview

GramArogya Connect is a MERN-stack web application designed to improve healthcare access and coordination in rural Maharashtra. It aims to help citizens find healthcare facilities, request appointments, track referrals, and access authorized healthcare information.

## 2. Objectives

- Provide a searchable healthcare facility directory.
- Support outpatient appointment requests and token management.
- Enable digital referral tracking between healthcare facilities.
- Provide role-based dashboards for citizens, healthcare staff, and administrators.
- Support Marathi, Hindi, and English.
- Improve healthcare coordination in areas with limited internet connectivity.

## 3. Key Features

- User registration and authentication.
- Healthcare facility search and map-based discovery.
- Appointment request management.
- Referral tracking and status updates.
- Role-based dashboards and access control.
- In-app notifications.
- Planned analytics, offline caching, and healthcare availability tracking.

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| React.js and Vite | Frontend |
| Node.js and Express.js | Backend and REST APIs |
| MongoDB | Database |
| MongoDB Atlas | Cloud database hosting, when configured |
| MongoDB Compass | Database management GUI |
| Mongoose | Database models and queries |
| JWT and bcryptjs | Authentication and password hashing |
| Axios | API requests |
| Leaflet | Interactive maps |

## 5. Project Structure

```text
GramArogyaConnect/
├── client/       # React frontend
├── server/       # Node.js and Express backend
├── docs/         # Project documentation
└── README.md     # Project information
```

## 6. Installation and Setup

**Install frontend dependencies:**

```bash
cd client
npm install
npm run dev
```

**Install and run the backend** in a separate terminal:

```bash
cd server
npm install
npm start
```

Use the actual scripts defined in each `package.json`. The frontend typically runs at `http://localhost:5173`, and the backend at `http://localhost:5000`.

## 7. Environment Configuration

Configure the backend's private `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=<YOUR_MONGODB_ATLAS_URI>
JWT_SECRET=<YOUR_RANDOM_SECRET>
CLIENT_URL=http://localhost:5173
```

Keep credentials private and ensure `.env` is excluded from Git.

MongoDB Compass can connect to Atlas separately; the backend must also establish its own database connection.

## 8. Testing

Run the available backend tests:

```bash
cd server
npm test
```

Build the frontend:

```bash
cd client
npm run build
```

Check the API health endpoint, if implemented, at `http://localhost:5000/api/health`.

## 9. Implementation Phases

- **Phase 1 — Frontend Architecture and UI Design:** Documented as complete.
- **Phase 2 — Backend and Frontend Integration:** Documented as complete.
- **Phase 3 — Analytics, Offline Caching and Telemedicine Coordination:** Planned features include district-level healthcare analytics, IndexedDB and Service Worker caching, SMS/WhatsApp reminder integration, and bed occupancy and emergency blood bank availability tracking.

## 10. Future Scope

- Improve district-level healthcare analytics.
- Support selected offline workflows for ASHA workers.
- Integrate healthcare reminders.
- Track facility capacity and emergency blood bank availability.

**Note:** Features and phases should be marked complete only after implementation and testing. Real healthcare data and patient records require appropriate privacy, access controls, and security measures.
