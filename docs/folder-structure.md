# GramArogya Connect — Project Folder Structure

This document outlines the complete directory layout and module responsibilities for the GramArogya Connect platform.

```
GramArogyaConnect/
│
├── client/                               # Frontend React Application (Vite)
│   ├── public/                           # Static assets served directly
│   │   ├── favicon.svg                   # Platform logo favicon
│   │   └── images/                       # Public images & hero graphics
│   │
│   ├── src/                              # React source code
│   │   ├── assets/                       # Bundled static resources
│   │   │   ├── images/                   # App images, logos, banners
│   │   │   └── icons/                    # Custom SVG icons and symbols
│   │   │
│   │   ├── components/                   # Reusable UI component library
│   │   │   ├── common/                   # Universal UI building blocks
│   │   │   │   ├── Navbar.jsx            # Top navigation header with language switcher
│   │   │   │   ├── Footer.jsx            # Footer with accessibility & government links
│   │   │   │   ├── Button.jsx            # Semantic button component with variants
│   │   │   │   ├── Input.jsx             # Accessible text/number form input component
│   │   │   │   ├── Loader.jsx            # Loading spinner and skeleton placeholders
│   │   │   │   ├── Modal.jsx             # Accessible dialog/modal overlay
│   │   │   │   ├── ProtectedRoute.jsx    # Client-side RBAC route protector
│   │   │   │   └── LanguageSwitcher.jsx  # Multilingual dropdown (EN, MR, HI)
│   │   │   │
│   │   │   ├── facilities/               # Facility discovery components
│   │   │   │   ├── FacilityCard.jsx      # Summary card for PHC/CHC details
│   │   │   │   ├── FacilitySearch.jsx    # Text search by name, taluka, pin code
│   │   │   │   ├── FacilityFilters.jsx   # Filter by tier, district, emergency availability
│   │   │   │   └── FacilityMap.jsx       # Interactive Leaflet map of facilities
│   │   │   │
│   │   │   ├── appointments/             # Appointment management components
│   │   │   │   ├── AppointmentCard.jsx   # Appointment detail card
│   │   │   │   ├── AppointmentForm.jsx   # Booking form for patients & ASHA workers
│   │   │   │   └── AppointmentStatus.jsx # Status badge (Scheduled, Completed, Cancelled)
│   │   │   │
│   │   │   ├── referrals/                # Clinical referral tracking components
│   │   │   │   ├── ReferralCard.jsx      # Referral summary with originating and destination PHC
│   │   │   │   └── ReferralStatus.jsx    # Urgency & progress badge (Pending, Accepted, Closed)
│   │   │   │
│   │   │   └── dashboard/                # Operational dashboard widgets
│   │   │       ├── DashboardLayout.jsx   # Shared panel shell for authenticated users
│   │   │       ├── DashboardSidebar.jsx  # Context-aware navigation menu per role
│   │   │       ├── DashboardHeader.jsx   # Header with user profile and alerts
│   │   │       └── StatisticsCard.jsx    # Metric indicator card (appointments, referrals, etc.)
│   │   │
│   │   ├── pages/                        # Routable view pages
│   │   │   ├── Home.jsx                  # Public landing page with triage highlights
│   │   │   ├── Login.jsx                 # User & staff authentication portal
│   │   │   ├── Register.jsx              # Citizen registration portal
│   │   │   ├── NotFound.jsx              # 404 error page
│   │   │   │
│   │   │   ├── facilities/
│   │   │   │   ├── Facilities.jsx        # Searchable directory view with map & grid
│   │   │   │   └── FacilityDetails.jsx   # Detailed facility profile, doctors, timings
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── PatientDashboard.jsx  # Citizen overview, active appointments & referrals
│   │   │   │   ├── MyAppointments.jsx    # Patient appointment history & upcoming visits
│   │   │   │   ├── MyReferrals.jsx       # Patient active clinical referrals & notes
│   │   │   │   └── PatientProfile.jsx    # Personal health ID & demographic info
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── StaffDashboard.jsx    # Medical officer & ASHA daily workflow overview
│   │   │   │   ├── ManageAppointments.jsx# Patient queue, check-in & consultation notes
│   │   │   │   └── ManageReferrals.jsx   # Incoming & outgoing inter-facility transfers
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx    # District health officer platform oversight
│   │   │       ├── ManageUsers.jsx       # Staff credentialing & role management
│   │   │       ├── ManageFacilities.jsx  # Facility registry & operational status
│   │   │       └── Analytics.jsx         # Population health metrics & wait time analytics
│   │   │
│   │   ├── layouts/                      # Layout wrappers for distinct user contexts
│   │   │   ├── PublicLayout.jsx          # Public navbar, main outlet, footer
│   │   │   ├── PatientLayout.jsx         # Citizen sidebar & topbar layout
│   │   │   ├── StaffLayout.jsx           # Clinical staff operational dashboard layout
│   │   │   └── AdminLayout.jsx           # District administration layout
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx             # Central React Router configuration
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # React Context holding auth token and user profile
│   │   │
│   │   ├── services/                     # Backend API client integration
│   │   │   ├── api.js                    # Axios instance with baseURL & auth headers
│   │   │   ├── authService.js            # Login, registration, token refresh APIs
│   │   │   ├── facilityService.js        # Facility search, filter, and detail APIs
│   │   │   ├── appointmentService.js     # Appointment booking and scheduling APIs
│   │   │   └── referralService.js        # Referral dispatch and tracking APIs
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js                # Custom hook for easy AuthContext access
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js              # Enums, roles, facility types, districts
│   │   │   ├── formatDate.js             # Date/time formatting utilities for rural locales
│   │   │   └── validators.js             # Client-side form validation helpers
│   │   │
│   │   ├── locales/                      # Multilingual translation dictionaries
│   │   │   ├── en.json                   # English translations
│   │   │   ├── mr.json                   # Marathi translations (प्राथमिक आरोग्य केंद्र etc.)
│   │   │   └── hi.json                   # Hindi translations (ग्राम आरोग्य कनेक्ट etc.)
│   │   │
│   │   ├── styles/                       # Modular CSS architecture
│   │   │   ├── variables.css             # Design tokens, color palette, typography scale
│   │   │   ├── global.css                # Base resets, typography, universal utilities
│   │   │   ├── components.css            # Styles for buttons, cards, forms, tables
│   │   │   └── responsive.css            # Media queries for mobile, tablet, low-res displays
│   │   │
│   │   ├── App.jsx                       # Root React component providing Context & Routes
│   │   ├── main.jsx                      # Vite entry point rendering React into DOM
│   │   └── index.css                     # Root CSS bundle entry point
│   │
│   ├── .env.example                      # Client environment variable template
│   ├── .gitignore                        # Frontend gitignore
│   ├── index.html                        # Single Page App HTML container
│   ├── package.json                      # Frontend dependencies & scripts
│   └── vite.config.js                    # Vite configuration
│
├── server/                               # Backend Node.js & Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                     # MongoDB connection via Mongoose with retry logic
│   │   │   └── env.js                    # Validated environment configuration
│   │   │
│   │   ├── controllers/                  # Request handler functions
│   │   │   ├── authController.js         # Register, login, current user endpoint
│   │   │   ├── userController.js         # User management & profile handlers
│   │   │   ├── facilityController.js     # Facility search, geospatial query handlers
│   │   │   ├── appointmentController.js  # Booking, status update handlers
│   │   │   ├── referralController.js     # Referral creation, acceptance, triage handlers
│   │   │   ├── notificationController.js # In-app notification handlers
│   │   │   └── dashboardController.js    # Metric aggregation for dashboards
│   │   │
│   │   ├── models/                       # Mongoose Schemas & Models
│   │   │   ├── User.js                   # Citizen, Doctor, ASHA, Admin schema
│   │   │   ├── Facility.js               # Health facility schema with GeoJSON
│   │   │   ├── Appointment.js            # Appointment schedule schema
│   │   │   ├── Referral.js               # Inter-facility transfer schema
│   │   │   ├── Notification.js           # Alert and reminder schema
│   │   │   └── AuditLog.js               # Security & clinical audit trail schema
│   │   │
│   │   ├── routes/                       # Express router definitions
│   │   │   ├── authRoutes.js             # /api/auth routes
│   │   │   ├── userRoutes.js             # /api/users routes
│   │   │   ├── facilityRoutes.js         # /api/facilities routes
│   │   │   ├── appointmentRoutes.js      # /api/appointments routes
│   │   │   ├── referralRoutes.js         # /api/referrals routes
│   │   │   ├── notificationRoutes.js     # /api/notifications routes
│   │   │   └── dashboardRoutes.js        # /api/dashboard routes
│   │   │
│   │   ├── middleware/                   # Express request pipeline middleware
│   │   │   ├── authMiddleware.js         # JWT verification & req.user attachment
│   │   │   ├── roleMiddleware.js         # RBAC permission checks
│   │   │   ├── errorMiddleware.js        # Centralized JSON error formatting
│   │   │   └── notFoundMiddleware.js     # 404 route fallback handler
│   │   │
│   │   ├── services/                     # Domain business logic layer
│   │   │   ├── authService.js            # Authentication logic & token generation
│   │   │   ├── facilityService.js        # Geospatial queries & facility caching logic
│   │   │   ├── appointmentService.js     # Scheduling validation & conflict checks
│   │   │   ├── referralService.js        # Transfer chain state machine logic
│   │   │   └── notificationService.js    # Notification dispatch logic
│   │   │
│   │   ├── validators/                   # Request body schemas & validation
│   │   │   ├── authValidator.js          # Registration & login validators
│   │   │   ├── facilityValidator.js      # Facility query & mutation validators
│   │   │   ├── appointmentValidator.js   # Appointment input validators
│   │   │   └── referralValidator.js      # Referral transfer validators
│   │   │
│   │   ├── utils/                        # Shared utility helpers
│   │   │   ├── ApiError.js               # Custom operational error class
│   │   │   ├── asyncHandler.js           # Async error wrapping utility
│   │   │   └── generateToken.js          # JWT signing utility
│   │   │
│   │   ├── app.js                        # Express app initialization (stateless, exportable)
│   │   └── server.js                     # HTTP server bootstrapper with DB connection
│   │
│   ├── tests/                            # Automated test suite
│   │   ├── auth.test.js                  # Authentication unit & integration tests
│   │   ├── facilities.test.js            # Facility endpoints & geospatial tests
│   │   ├── appointments.test.js          # Appointment scheduling tests
│   │   └── referrals.test.js             # Referral workflow tests
│   │
│   ├── scripts/
│   │   └── seedFacilities.js             # Data seeding script for Maharashtra health facilities
│   │
│   ├── .env.example                      # Server environment variable template
│   ├── .gitignore                        # Server gitignore
│   └── package.json                      # Backend dependencies & npm scripts
│
├── docs/                                 # Platform documentation
│   ├── architecture.md                   # System architecture and layer breakdown
│   ├── folder-structure.md               # Detailed folder directory layout (this file)
│   ├── database-design.md                # MongoDB collections, indexes, and relations
│   └── api-design.md                     # REST API specification & response contracts
│
├── .gitignore                            # Root version control exclusion rules
└── README.md                             # Comprehensive project handbook
```
