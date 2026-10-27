# GramArogya Connect — Architecture Overview

## Project Identification
- **Project Name:** GramArogya Connect
- **Project Title:** A Rural Public Healthcare Access and Coordination Platform
- **Problem ID:** SIH26133
- **Target Geography:** Rural and underserved regions of Maharashtra (Sub-Centers, PHCs, CHCs, Sub-District and District Hospitals)

---

## 1. Executive Summary & System Vision
GramArogya Connect is designed to bridge the structural divide between grassroots healthcare providers (ASHA workers, ANMs, PHC medical officers) and specialized tertiary care institutions. The platform optimizes:
- Healthcare facility discovery and geographic accessibility mapping across remote talukas.
- Real-time appointment scheduling across primary, secondary, and tertiary public healthcare tiers.
- Digital referral management with end-to-end patient tracking and case handoffs.
- Multi-role dashboards for Patients, Medical Staff, and District Health Administrators.
- Multilingual accessibility (Marathi, Hindi, English) designed for rural digital literacy.

---

## 2. High-Level Architecture Pattern

GramArogya Connect follows a decoupled, three-tier MERN architecture:

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  React.js (Vite) + React Router + Context API + Lucide Icons + Leaflet  |
|         Multilingual (Marathi / Hindi / English) UI & CSS Modules       |
+-------------------------------------------------------------------------+
                                     |
                                     | HTTPS / REST (JSON)
                                     v
+-------------------------------------------------------------------------+
|                             API / APP TIER                              |
|           Node.js & Express.js Framework (Modular MVC / Layered)         |
|  - Routing Layer (auth, users, facilities, appointments, referrals)     |
|  - Middleware (JWT Auth, RBAC, Validation, Error Handling, CORS)        |
|  - Controller Layer (Request orchestration & response formatting)       |
|  - Service Layer (Business logic, status workflows, data sanitation)   |
+-------------------------------------------------------------------------+
                                     |
                                     | Mongoose ODM (Connection Pooling)
                                     v
+-------------------------------------------------------------------------+
|                              DATA TIER                                  |
|                             MongoDB                                     |
|  Collections: Users, Facilities, Appointments, Referrals, Notifications,|
|               AuditLogs (Geospatial 2dsphere indexes, TTL, Compound)   |
+-------------------------------------------------------------------------+
```

---

## 3. Technology Stack Breakdown

| Layer | Technology | Version / Tooling | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | 18.x with Vite | Declarative component UI and lightning-fast HMR |
| **Routing** | React Router DOM | 6.x | Client-side declarative routing and route guards |
| **Styling** | HTML5, CSS3 | CSS Variables & Modules | Responsive, lightweight design for low-bandwidth devices |
| **Maps** | Leaflet & React Leaflet | 1.9.x | Offline-friendly geospatial mapping of health facilities |
| **Icons** | Lucide React | Latest | Semantic, lightweight iconography |
| **HTTP Client** | Axios | 1.x | Configured API instance with auth interceptors |
| **Backend** | Node.js | v20+ LTS | Asynchronous, non-blocking runtime |
| **Framework** | Express.js | 4.x | Fast, unopinionated web framework |
| **Database** | MongoDB | 7.x / Atlas / Local | Document-oriented NoSQL storage |
| **ODM** | Mongoose | 8.x | Strict schema validation, hooks, and indexing |
| **Auth & Security** | JWT & bcryptjs | jsonwebtoken, bcryptjs | Stateless token authentication and salted password hashing |
| **Environment** | dotenv | 16.x | 12-factor application configuration management |

---

## 4. Security & Compliance Architecture
1. **Stateless JWT Authentication:**
   - Bearer tokens transmitted in the Authorization header.
   - Tokens contain user ID, role, and assigned facility ID.
2. **Role-Based Access Control (RBAC):**
   - Roles: `patient`, `asha_worker`, `doctor`, `staff`, `admin`.
   - Granular middleware guarding endpoints per role.
3. **Password Security:**
   - Hashed using bcryptjs with 10 salt rounds prior to persistence.
4. **Data Isolation & Audit Logging:**
   - AuditLog collection records clinical referrals, user changes, and critical triage updates.
5. **CORS & Input Sanitization:**
   - Strict CORS configuration bound to the frontend origin.
   - Request body validation via dedicated validator functions.

---

## 5. Three-Phase Implementation Roadmap

### Phase 1: Foundation & Facility Discovery (Current Initial Skeleton)
- Full project structure, configuration, documentation, and healthy API baseline.
- User registration and role-based login.
- Facility directory: sub-centers, PHCs, CHCs, and district hospitals in Maharashtra.
- Geospatial mapping with Leaflet for nearest facility location.
- Basic multilingual interface (Marathi, Hindi, English).

### Phase 2: Appointments & Clinical Referral Workflows
- Outpatient appointment scheduling and token generation.
- Inter-facility clinical referral chain (Sub-Center -> PHC -> CHC -> District Hospital).
- Real-time notification system for referral status changes.
- Medical staff triage portal and queue management.

### Phase 3: Analytics, Offline Synchronization & Optimization
- District and state-level healthcare administrative dashboards.
- Offline-first cache for remote ASHA workers using Service Workers and IndexedDB.
- SMS/WhatsApp gateway hooks for appointment reminders.
- Bed and essential drug availability indicators.
