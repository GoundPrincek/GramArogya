# GramArogya Connect — API Design & Contract Specification

## Base URL
All API endpoints are prefixed with `/api`.
Default local development endpoint: `http://localhost:5000/api`

---

## 1. Standard Response Format

### Success Response Contract
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

### Error Response Contract
```json
{
  "success": false,
  "message": "Validation failed / Unauthorized access / Resource not found",
  "errors": [
    {
      "field": "phone",
      "message": "Invalid 10-digit Indian phone number"
    }
  ]
}
```

---

## 2. API Endpoints Catalog

### 2.1. System & Health
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns service status, uptime, environment, timestamp |

#### GET `/api/health` Response
```json
{
  "success": true,
  "message": "GramArogya Connect API is operational",
  "data": {
    "status": "healthy",
    "service": "GramArogyaConnect-Backend",
    "uptime": 124.56,
    "environment": "development",
    "timestamp": "2026-10-27T10:30:00.000Z"
  }
}
```

---

### 2.2. Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register citizen, ASHA worker, or medical staff |
| `POST` | `/api/auth/login` | Public | Authenticate via phone/email and password; issues JWT |
| `GET` | `/api/auth/me` | Bearer Token | Fetch currently authenticated user profile |
| `POST` | `/api/auth/logout` | Bearer Token | Invalidate client session token |

---

### 2.3. Users & Administration (`/api/users`)
| Method | Endpoint | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Bearer Token | `admin` | List registered users with pagination & role filter |
| `GET` | `/api/users/:id` | Bearer Token | `admin`, self | Get profile details of specific user |
| `PUT` | `/api/users/:id` | Bearer Token | `admin`, self | Update personal profile or language preferences |
| `DELETE`| `/api/users/:id` | Bearer Token | `admin` | Soft-deactivate user account |

---

### 2.4. Facilities & Mapping (`/api/facilities`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/facilities` | Public | Query facilities with district, taluka, tier, and search filters |
| `GET` | `/api/facilities/nearby` | Public | Geospatial query: `?lat=18.5204&lng=73.8567&radiusKm=25` |
| `GET` | `/api/facilities/:id` | Public | Retrieve detailed facility profile, services, and doctor roster |
| `POST` | `/api/facilities` | Bearer Token (Admin) | Register a new public health facility |
| `PUT` | `/api/facilities/:id` | Bearer Token (Admin) | Update operational hours, tier, or services |

---

### 2.5. Appointments (`/api/appointments`)
| Method | Endpoint | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Bearer Token | Any | Book an outpatient appointment at a selected facility |
| `GET` | `/api/appointments/my` | Bearer Token | Patient | Fetch patient's upcoming and historical appointments |
| `GET` | `/api/appointments/facility/:facilityId`| Bearer Token | Staff, Doctor, Admin | Get facility's appointment schedule for the day |
| `PUT` | `/api/appointments/:id/status` | Bearer Token | Staff, Doctor | Update status (Confirmed, Completed, Cancelled) |

---

### 2.6. Inter-Facility Referrals (`/api/referrals`)
| Method | Endpoint | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/referrals` | Bearer Token | Doctor, Staff | Create clinical escalation referral to higher-tier facility |
| `GET` | `/api/referrals/my` | Bearer Token | Patient | Get patient's referral history and transfer status |
| `GET` | `/api/referrals/facility/:facilityId` | Bearer Token | Doctor, Staff | Get incoming and outgoing referrals for the facility |
| `PUT` | `/api/referrals/:id/triage` | Bearer Token | Doctor | Accept/Reject incoming referral and assign bed/queue |

---

### 2.7. Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Bearer Token | Fetch user's notification list |
| `PUT` | `/api/notifications/:id/read` | Bearer Token | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Bearer Token | Mark all user notifications as read |

---

### 2.8. Dashboards & Analytics (`/api/dashboard`)
| Method | Endpoint | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Bearer Token | Admin, Staff | Get aggregated stats (patient count, active referrals, occupancy) |
| `GET` | `/api/dashboard/overview` | Bearer Token | Any | Role-customized dashboard overview |
