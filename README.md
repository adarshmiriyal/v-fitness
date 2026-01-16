# V FITNESS - Modern Gym Management System

A full-featured gym management application built with Next.js 16, featuring real-time attendance tracking, attendance analytics, and member management.

## Features

### For Members
✅ **User Authentication** - Secure signup and login  
✅ **Profile Management** - Update personal information  
✅ **Attendance Tracking** - View detailed attendance records  
✅ **Analytics Dashboard** - Visual attendance charts and trends  
✅ **Announcements** - Receive real-time gym announcements  

### For Admins
✅ **Admin Dashboard** - Overview of gym operations  
✅ **User Management** - View all members and their details  
✅ **Attendance Monitoring** - Search and filter attendance by member  
✅ **Announcements Management** - Create and manage gym announcements  
✅ **Real-time Statistics** - Live gym performance metrics  

### Innovative Features
🚀 **Real-time Notifications** - Push notifications for announcements  
🚀 **Attendance Analytics** - Visual charts showing attendance trends  
🚀 **Member Streaks** - Track consecutive gym days (coming soon)  

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js API Routes with Server Actions
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: Shadcn/UI with Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Password Hashing**: bcrypt for security

## Project Structure

```
v-fitness/
├── app/
│   ├── (auth)/                 # Authentication pages (layout isolated)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (member)/               # Member protected routes
│   │   ├── member/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── attendance/page.tsx
│   │   │   └── announcements/page.tsx
│   │   └── layout.tsx
│   ├── (admin)/                # Admin protected routes
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── members/page.tsx
│   │   │   ├── attendance/page.tsx
│   │   │   └── announcements/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── signup/route.ts
│   │   │   └── logout/route.ts
│   │   ├── member/             # Member API endpoints
│   │   │   ├── stats/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── attendance/route.ts
│   │   │   └── announcements/route.ts
│   │   ├── admin/              # Admin API endpoints
│   │   │   ├── stats/route.ts
│   │   │   ├── members/route.ts
│   │   │   ├── attendance/route.ts
│   │   │   └── announcements/route.ts
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── member-navbar.tsx       # Member navigation
│   ├── admin-navbar.tsx        # Admin navigation
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── db.ts                   # Database connection
│   ├── auth.ts                 # Auth utilities
│   ├── session.ts              # Session management
│   └── middleware-example.ts   # Auth middleware examples
├── scripts/
│   ├── 01_create_tables.sql    # Database schema
│   └── seed-admin.ts           # Create admin user
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── SETUP.md                    # Setup guide
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- Neon PostgreSQL database
- A modern web browser

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Add these to your `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

3. **Create database tables**
```bash
npm run db:setup
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### users
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `first_name` - User first name
- `last_name` - User last name
- `age` - User age
- `phone_number` - Contact number
- `user_type` - 'member' or 'admin'
- `is_active` - Account status
- `created_at` - Account creation date

### attendance
- `id` - Primary key
- `user_id` - Foreign key to users
- `check_in_time` - Check-in timestamp
- `check_out_time` - Check-out timestamp (optional)
- `date` - Attendance date
- `created_at` - Record creation date

### announcements
- `id` - Primary key
- `admin_id` - Foreign key to admin user
- `title` - Announcement title
- `content` - Announcement content
- `is_active` - Publication status
- `created_at` - Creation date
- `updated_at` - Last update date

### qr_codes
- `id` - Primary key
- `code` - Unique QR code string
- `user_id` - Foreign key to users
- `is_active` - QR code status
- `created_at` - Creation date

### notifications
- `id` - Primary key
- `user_id` - Foreign key to users
- `announcement_id` - Foreign key to announcements
- `title` - Notification title
- `message` - Notification message
- `is_read` - Read status
- `created_at` - Creation date

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "age": 25,
  "phoneNumber": "+1234567890"
}
```

#### POST /api/auth/login
Login to the application.
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "userType": "member"
}
```

#### POST /api/auth/logout
Logout and destroy session.

### Member Endpoints

#### GET /api/member/stats
Get member dashboard statistics.

#### GET /api/member/profile
Get user profile information.

#### PUT /api/member/profile
Update user profile.

#### GET /api/member/attendance
Get attendance records with analytics.

#### GET /api/member/announcements
Get all active announcements.

### Admin Endpoints

#### GET /api/admin/stats
Get admin dashboard statistics.

#### GET /api/admin/members
Get all gym members.

#### GET /api/admin/attendance
Get all attendance records.

#### GET /api/admin/announcements
Get all announcements.

#### POST /api/admin/announcements
Create new announcement.

#### DELETE /api/admin/announcements/[id]
Delete announcement.

## User Roles

### Member
- View personal dashboard
- Update profile
- Check-in via QR code
- View attendance history
- Receive announcements

### Admin
- Full dashboard overview
- Manage all users
- View all attendance records
- Create and manage announcements
- Generate reports

## Security Features

✅ **Password Hashing** - bcrypt hashing for all passwords  
✅ **JWT Authentication** - Secure token-based auth  
✅ **HTTP-Only Cookies** - Secure session storage  
✅ **CSRF Protection** - Built-in Next.js protection  
✅ **SQL Injection Prevention** - Parameterized queries  
✅ **Role-Based Access Control** - Enforced at route level  

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Run database migrations
```

### File Organization

- Component files use `.tsx` extension
- API routes in `app/api/` directory
- Utility functions in `lib/` directory
- Database scripts in `scripts/` directory
- Global styles in `app/globals.css`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

```bash
vercel deploy
```

### Environment Variables for Production

- `DATABASE_URL` - Neon database connection string
- `JWT_SECRET` - Strong random secret key
- `NODE_ENV` - Set to 'production'

## Known Limitations

- QR code camera access requires HTTPS in production
- BarcodeDetector API may not be available in all browsers (has fallback)
- Notifications are tracked in DB (can be extended with push notifications)

## Future Enhancements

- [ ] Member streak tracking and rewards
- [ ] Push notification integration
- [ ] Advanced attendance reports and exports
- [ ] Payment integration for memberships
- [ ] Mobile app (React Native)
- [ ] Class/training session management
- [ ] Member analytics and insights
- [ ] Email notifications

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon connection status
- Ensure all tables are created via setup script

### QR Code Not Scanning
- Allow camera permissions
- Use HTTPS (required in production)
- Try manual code entry as fallback

### Login Issues
- Verify user exists in database
- Check password is correct
- Clear browser cookies and retry

## Support & Contact

For issues, feature requests, or questions, please check:
1. SETUP.md for setup issues
2. Database schema for data-related questions
3. API documentation for endpoint help

## License

MIT License - Feel free to use for your projects!

---

**V FITNESS** - Empowering Fitness Through Modern Technology ✨
