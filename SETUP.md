# V FITNESS Application - Setup Guide

Welcome to V FITNESS! This is a complete gym management system with user and admin dashboards.

## Getting Started

### 1. Database Setup

The application uses Neon PostgreSQL. The database schema will be created when you run the migration script.

**To create the database tables:**

```bash
npm run db:setup
```

This will execute the SQL script at `scripts/01_create_tables.sql` and create all necessary tables.

### 2. Environment Variables

You'll need to set the following environment variables in your Vercel project:

```
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key_for_jwt_tokens
```

The `DATABASE_URL` is automatically provided by Neon integration. Make sure to set a strong `JWT_SECRET`.

### 3. Create Admin User

To create an admin account, you can:

1. Sign up as a regular user
2. Use SQL to update the user_type to 'admin':

```sql
UPDATE users SET user_type = 'admin' WHERE email = 'admin@example.com';
```

## Features

### User Dashboard
- **Signup & Login**: Easy registration and authentication
- **Profile Management**: Update personal information
- **Attendance Tracking**: View detailed attendance records
- **Analytics**: Visual charts of attendance patterns
- **Announcements**: Receive real-time gym announcements

### Admin Dashboard
- **User Management**: View all gym members and their details
- **Attendance Monitoring**: Search and view attendance by member name
- **Announcements**: Create and manage gym announcements
- **Dashboard Stats**: Real-time overview of gym operations

## Project Structure

```
.
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (member)/        # Member dashboard and pages
│   ├── (admin)/         # Admin dashboard and pages
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── admin/       # Admin API endpoints
│   │   └── member/      # Member API endpoints
│   ├── page.tsx         # Landing page
│   └── layout.tsx       # Root layout
├── components/
│   ├── member-navbar.tsx    # Member navigation
│   ├── admin-navbar.tsx     # Admin navigation
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Authentication utilities
│   └── session.ts       # Session management
├── scripts/
│   └── 01_create_tables.sql # Database schema
└── public/              # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new member
- `POST /api/auth/login` - Login (for both members and admins)
- `POST /api/auth/logout` - Logout

### Member APIs
- `GET /api/member/stats` - Get dashboard statistics
- `GET /api/member/profile` - Get user profile
- `PUT /api/member/profile` - Update user profile
- `GET /api/member/attendance` - Get attendance records
- `GET /api/member/announcements` - Get all announcements

### Admin APIs
- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/members` - Get all members
- `GET /api/admin/attendance` - Get all attendance records
- `GET /api/admin/announcements` - Get all announcements
- `POST /api/admin/announcements` - Create new announcement
- `DELETE /api/admin/announcements/[id]` - Delete announcement

## Default Test Accounts

You can create test accounts through the signup page. For admin access:

1. Create a user account via signup
2. Use the admin database query above to promote the user to admin

## Innovative Features

### 1. Real-Time Notifications
- Instant push notifications for announcements
- Members get notified when new announcements are posted
- Notification tracking system

### 3. Attendance Analytics
- Weekly attendance charts
- Visual attendance trends
- Per-member attendance records

## Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Make sure your environment variables are set in the Vercel project settings.

## Support

For issues or questions, check the error logs and ensure:
1. Database connection is working
2. Environment variables are properly set
3. All tables are created via the setup script

---

**V FITNESS** - Empowering fitness through modern technology
