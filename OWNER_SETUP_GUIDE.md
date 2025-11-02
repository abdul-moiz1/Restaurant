# Owner Account Setup Guide

## Overview
Owner signup has been disabled. Only customers can create new accounts through the signup page. The owner account must be pre-configured in Firebase.

## Steps to Set Up Owner Account

### 1. Create Owner Account in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **newrestaurant-25f8c**
3. Navigate to **Authentication** → **Users**
4. Click **Add User** button
5. Enter your desired owner credentials:
   - **Email**: Your owner email (e.g., `owner@gourmethaven.com`)
   - **Password**: A secure password
6. Click **Add User**

### 2. Add Owner Role to Firestore

After creating the Firebase Auth user, you need to add the owner role in Firestore:

1. In Firebase Console, go to **Firestore Database**
2. Navigate to the `users` collection
3. Find the document with the UID matching your newly created owner user
4. If the document doesn't exist, create it with the following fields:
   ```
   uid: [the Firebase Auth UID]
   email: [your owner email]
   displayName: [Owner Name]
   role: "owner"
   createdAt: [current timestamp]
   ```
5. Save the document

### 3. Login as Owner

1. Go to your Gourmet Haven app
2. Click **Login**
3. Select **Owner** role
4. Enter your owner email and password (Google login is disabled for owners for security)
5. You'll be redirected to the Owner Dashboard automatically!

**Note**: Google Sign-In is NOT available for owner accounts for security reasons. Owner login requires email/password authentication only.

## Important Notes

- **No Owner Signup**: The signup flow only allows customers to register
- **Email/Password Only**: Owner login does NOT support Google Sign-In for security reasons
- **Role-Based Access**: Security is based on the `role` field in Firestore (no PIN needed)
- **Pre-configured Only**: Owner accounts must exist in Firebase before login (no auto-creation)
- **Single Owner**: Only create one owner account
- **Password Reset**: If you forget your password, use Firebase Console to reset it

## Troubleshooting

**Can't see owner role in signup:**
- This is correct! Owner option only appears on the login page, not signup.

**Login fails:**
- Verify the email/password in Firebase Console
- Ensure the user document exists in Firestore with `role: "owner"`

**Not redirected to dashboard:**
- Verify the Firestore document has `role: "owner"` (not "customer")
- Check browser console for errors
