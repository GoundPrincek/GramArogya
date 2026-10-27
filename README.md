# GramArogya Connect

> **A Rural Public Healthcare Access and Coordination Platform**  
> **Problem ID:** SIH26133  
> **Target Region:** Rural & Underserved Communities of Maharashtra

---

## 1. Problem Statement
Rural healthcare delivery in Maharashtra faces significant coordination bottlenecks between primary grassroots care (ASHA workers, Sub-Centres, Primary Health Centres) and higher-tier medical facilities (Community Health Centres, Sub-District and District Hospitals). Rural citizens experience long transit times, unpredictable outpatient queues, delayed emergency escalations, and fragmented paper-based referral records.

---

## 2. Project Objective
**GramArogya Connect** is a full MERN stack platform designed to:
- Establish a verified, searchable geospatial registry of Maharashtra public healthcare facilities.
- Provide token-based outpatient appointment booking to reduce physical wait times at rural clinics.
- Enable end-to-end digital clinical referral tracking from primary triage to tertiary hospital admission.
- Offer role-tailored dashboards for citizens, ASHA workers, medical officers, and district health authorities.
- Deliver multilingual accessibility in Marathi (मराठी), Hindi (हिंदी), and English.

---

## 3. Technology Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Database** | MongoDB | Document database for health records, facilities, and referrals |
| **Backend Framework** | Express.js & Node.js | Scalable REST API with modular MVC architecture |
| **Frontend Library** | React.js (v18) | Component-based Single Page Application |
| **Build Tool** | Vite | Ultra-fast frontend build environment |
| **Object Modeling** | Mongoose | Strict schema validation, references, and 2dsphere indexes |
| **Authentication** | JWT (JSON Web Tokens) | Stateless role-based authentication |
| **Password Hashing** | bcryptjs | Secure salted credential storage |
| **HTTP Client** | Axios | Interceptor-configured REST client |
| **Client Routing** | React Router DOM (v6) | Declarative client navigation and RBAC route guards |
| **Iconography** | Lucide React | Semantic, lightweight iconography |
| **Mapping** | Leaflet & React Leaflet | Geospatial health facility discovery |
| **Styling** | HTML5 & CSS3 | Modular CSS variables & responsive design |
| **Environment** | dotenv | 12-factor configuration management |

---

## 4. Complete Folder Structure

```
GramArogyaConnect/
│
├── client/                               # React Single Page App (Vite)
│   ├── public/                           # Static assets
│   │   ├── favicon.svg                   # Platform logo
│   │   └── images/                       # Public images & graphics
│   │
│   ├── src/
│   │   ├── assets/                       # Bundled static resources (images, icons)
│   │   ├── components/                   # Reusable UI component library
│   │   │   ├── common/                   # Navbar, Footer, Button, Input, Modal, Loader, etc.
│   │   │   ├── facilities/               # FacilityCard, FacilitySearch, Filters, FacilityMap
│   │   │   ├── appointments/             # AppointmentCard, Form, Status badge
│   │   │   ├── referrals/                # ReferralCard, ReferralStatus badge
│   │   │   └── dashboard/                # Layout, Sidebar, Header, StatisticsCard
│   │   ├── pages/                        # Routable views (Home, Auth, Portals)
│   │   │   ├── facilities/               # Directory & FacilityDetails
│   │   │   ├── patient/                  # Dashboard, Appointments, Referrals, Profile
│   │   │   ├── staff/                    # StaffDashboard, ManageAppointments, ManageReferrals
│   │   │   └── admin/                    # AdminDashboard, ManageUsers, Facilities, Analytics
│   │   ├── layouts/                      # Layout wrappers (Public, Patient, Staff, Admin)
│   │   ├── routes/                       # React Router configuration (AppRoutes.jsx)
│   │   ├── context/                      # AuthContext & Language state
│   │   ├── services/                     # Axios API clients
│   │   ├── hooks/                        # Custom hooks (useAuth)
│   │   ├── utils/                        # Constants, date formatting, validators
│   │   ├── locales/                      # Multilingual JSON (en.json, mr.json, hi.json)
│   │   ├── styles/                       # CSS architecture (variables, global, components, responsive)
│   │   ├── App.jsx                       # Root React application
│   │   ├── main.jsx                      # DOM mount point
│   │   └── index.css                     # Global stylesheet bundle
│   │
│   ├── .env.example                      # Client environment template
│   ├── .gitignore                        # Client gitignore
│   ├── index.html                        # HTML5 container
│   ├── package.json                      # Frontend dependencies
│   └── vite.config.js                    # Vite configuration
│
├── server/                               # Node.js & Express REST API
│   ├── src/
│   │   ├── config/                       # db.js (Mongoose connection), env.js
│   │   ├── controllers/                  # Handlers (auth, users, facilities, appointments, referrals)
│   │   ├── models/                       # Mongoose Schemas (User, Facility, Appointment, Referral, etc.)
│   │   ├── routes/                       # Express Routers
│   │   ├── middleware/                   # JWT Protect, Role Authorize, Error Handling, 404
│   │   ├── services/                     # Business logic layer
│   │   ├── validators/                   # Input validation logic
│   │   ├── utils/                        # ApiError, asyncHandler, generateToken
│   │   ├── app.js                        # Stateless Express app (exportable for tests)
│   │   └── server.js                     # HTTP server bootstrapper
│   │
│   ├── tests/                            # Automated tests (auth, facilities, appointments, referrals)
│   ├── scripts/                          # seedFacilities.js (Maharashtra health facilities data)
│   ├── .env.example                      # Server environment template
│   ├── .gitignore                        # Server gitignore
│   └── package.json                      # Backend dependencies & npm scripts
│
├── docs/                                 # Architectural & Technical Documentation
│   ├── architecture.md                   # Three-tier system architecture
│   ├── folder-structure.md               # Detailed directory guide
│   ├── database-design.md                # MongoDB collections & Mongoose schemas
│   └── api-design.md                     # REST API specification & response contracts
│
├── .gitignore                            # Root version control exclusion rules
└── README.md                             # Project handbook
```

---

## 5. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **NPM:** v9.0.0 or higher
- **MongoDB:** MongoDB Community Server or MongoDB Atlas cluster (optional for running frontend and health check API)

---

## 6. Setup Instructions

### 6.1. Clone Repository & Setup Environment Variables

```bash
# Navigate to the project root
cd GramArogyaConnect

# Copy client environment template
cp client/.env.example client/.env

# Copy server environment template
cp server/.env.example server/.env
```

### 6.2. Server Environment Configuration (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gram_arogya_connect
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 6.3. Client Environment Configuration (`client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Commands to Run the Application

### 7.1. Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# (Optional) Seed sample Maharashtra healthcare facilities into MongoDB
npm run seed

# Run in development mode with nodemon
npm run dev

# Or run in production mode
npm start

# Run automated tests
npm test
```

### 7.2. Frontend Client

```bash
# Open a second terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The frontend client will be accessible at: `http://localhost:5173`  
The backend API health check will be accessible at: `http://localhost:5000/api/health`

---

## 8. Planned Three-Phase Implementation

### Phase 1: Foundation, Facility Discovery & Triage Mapping (Current Baseline)
- Complete directory structure, configuration, documentation, and clean MERN skeleton.
- Health facility catalog with Maharashtra taluka indexing and Leaflet geospatial map.
- User authentication and role-based route protection.
- Baseline multilingual support (Marathi, Hindi, English).

### Phase 2: Outpatient Scheduling & Clinical Referral Transfers
- Citizen and ASHA-facilitated outpatient appointment booking with daily queue tokens.
- Inter-facility clinical referral state machine (Pending -> Accepted -> EnRoute -> Arrived -> Completed).
- Real-time in-app notification triggers for clinical case updates.
- Clinical staff triage dashboard and prescription recording.

### Phase 3: Analytics, Offline Caching & Telemedicine Coordination
- District Health Officer analytics console: referral turnaround times, facility patient load.
- Offline-first cache utilizing IndexedDB and Service Workers for remote ASHA workers with poor connectivity.
- SMS / WhatsApp reminder gateway hooks for rural patients.
- Bed occupancy and emergency blood bank availability tracking.
