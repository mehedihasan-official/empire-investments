# Empire Investments - Authentication & Admin System Setup

## Overview

This project includes a complete authentication system with Firebase for user login/signup and MongoDB for user data storage. It also includes an admin dashboard for managing users and leads.

## Architecture

### Authentication Flow

1. **User Signup**: User fills in signup form → Firebase creates account → MongoDB stores user profile
2. **User Login**: Firebase authenticates credentials → App retrieves user profile from MongoDB
3. **Protected Routes**: Routes check if user is authenticated and has required role (user/admin)
4. **Session Management**: Auth token stored in cookies for session persistence

### Database Schema - MongoDB

**Users Collection**

```json
{
  "_id": ObjectId,
  "uid": "firebase_uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "role": "user" | "admin",
  "createdAt": Date,
  "updatedAt": Date
}
```

**Leads Collection** (Pre-existing)

```json
{
  "_id": ObjectId,
  "nombre": "John Doe",
  "estado": "California",
  "edad": 30,
  "tieneIUL": "Si" | "No",
  "dondeInvierte": "...",
  "paraQueIUL": "...",
  "cuantoInvertir": "$500",
  "createdAt": Date,
  ...
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable Authentication → Email/Password
4. Copy your Firebase config from Project Settings → Your Apps → Web App
5. Go to Service Accounts and download private key JSON

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in all required variables:

```bash
# Firebase - Get from Firebase Console → Project Settings → Your Apps
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK - Get from Service Account private key JSON
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# MongoDB - Get from MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://...
```

### 4. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Add database user with username/password
4. Get connection string (starts with `mongodb+srv://`)
5. Make sure to allow your IP address in Network Access

### 5. Create Admin User (First Time Only)

To create your first admin user:

1. Sign up normally through `/signup`
2. Connect to MongoDB and update the user's role:

```javascript
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } },
);
```

Then log out and log back in to see admin dashboard.

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.js          # User registration & profile
│   │   ├── users/
│   │   │   └── route.js          # Admin: manage users
│   │   └── admin/leads/
│   │       └── route.js          # Admin: manage leads
│   ├── signup/
│   │   └── page.jsx              # Sign up form
│   ├── signin/
│   │   └── page.jsx              # Sign in form
│   ├── dashboard/
│   │   ├── user/
│   │   │   └── page.jsx          # User dashboard
│   │   └── admin/
│   │       ├── page.jsx          # Admin dashboard
│   │       ├── users/
│   │       │   └── page.jsx      # Manage users
│   │       └── leads/
│   │           └── page.jsx      # Manage leads
│   └── layout.js                 # Root layout with AuthProvider
├── components/
│   ├── AuthProvider.jsx          # Auth context & useAuth hook
│   ├── ProtectedRoute.jsx        # Protected route wrapper
│   └── ui/
│       └── Header.jsx            # Updated header with auth UI
└── lib/
    ├── firebase.js               # Firebase config
    └── mongodb.js                # MongoDB client
```

## API Routes

### Authentication

- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/register` - Create/update user in MongoDB

### Admin - Users Management

- `GET /api/users` - List all users (pagination, role filter)
- `PUT /api/users/:id` - Update user role
- `DELETE /api/users/:id` - Delete user

### Admin - Leads Management

- `GET /api/admin/leads` - List all leads (pagination, filters)
- `DELETE /api/admin/leads/:id` - Delete lead

## User Flows

### For Regular Users

1. Sign up at `/signup`
2. User data saved to MongoDB
3. Redirected to `/dashboard/user`
4. Can view profile and personal info
5. Sign out from user dashboard

### For Admin Users

1. Admin user signs in at `/signin`
2. Redirected to `/dashboard/admin` (auto-detected by role)
3. Can access:
   - Users Management - view, change roles, delete users
   - Leads Management - view, filter, delete leads
4. Sidebar navigation to switch sections

## Features

### Authentication

- ✅ Firebase Email/Password authentication
- ✅ User profiles in MongoDB
- ✅ Role-based access control (user/admin)
- ✅ Protected routes with redirect to signin
- ✅ Session persistence with cookies
- ✅ Logout functionality

### User Dashboard

- ✅ User profile display with avatar
- ✅ Account information
- ✅ Member since date
- ✅ Quick links

### Admin Dashboard

- ✅ Collapsible sidebar navigation
- ✅ Quick stats cards
- ✅ Users management table
  - View all users
  - Change user roles
  - Delete users
  - Pagination
  - Role filter
- ✅ Leads management table
  - View all leads
  - Filter by state and IUL status
  - Delete leads
  - Pagination
- ✅ Responsive design

### Header Updates

- ✅ Sign in/sign up buttons for guests
- ✅ User dropdown menu for authenticated users
- ✅ User profile picture or avatar
- ✅ Quick access to dashboard
- ✅ Sign out option

## Security Notes

### Protected Endpoints

All API routes for admin are protected with Firebase token verification:

1. Token must be valid (not expired, correct signature)
2. User must exist in MongoDB
3. User must have admin role

### Environment Variables

- Always use `.env.local` (not committed to git)
- Never expose private keys in code
- Firebase private key uses BigQuery format with `\n` escapes

## Troubleshooting

### "Unauthorized" Error

- Make sure you have valid Firebase credentials in `.env.local`
- Check that Firebase Admin SDK keys are correct
- Verify user exists in MongoDB with correct role

### "Admin access required"

- User doesn't have admin role
- Update user role in MongoDB: `db.users.updateOne({email: "..."}, {$set: {role: "admin"}})`

### Firebase Connection Error

- Check all NEXT*PUBLIC_FIREBASE*\* variables
- Ensure Firebase project ID is correct
- Check Firebase Console → Authentication is enabled

### MongoDB Connection Error

- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct username/password

## Next Steps / Future Enhancements

- [ ] User profile settings/edit
- [ ] Password reset
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Activity logs
- [ ] Export leads to CSV
- [ ] Email templates for new users
- [ ] Two-factor authentication
- [ ] Custom admin roles/permissions

## Dependencies

- **firebase** ^10.8.0 - Authentication
- **mongodb** ^6.21.0 - Database
- **js-cookie** ^3.0.5 - Session management
- **next** ^16.2.1 - Framework
- **react** ^19.0.0 - UI library
- **tailwindcss** ^4.0.0 - Styling

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
For MongoDB documentation, visit: https://docs.mongodb.com
