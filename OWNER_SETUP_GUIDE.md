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

### 3. Set Owner PIN (Optional but Recommended)

The owner PIN adds an extra layer of security when logging in as owner.

**In Replit:**
1. Go to the **Secrets** tab (lock icon in left sidebar)
2. Add a new secret:
   - **Key**: `VITE_OWNER_PIN`
   - **Value**: Your 4-digit PIN (e.g., `1234`)
3. Click **Add Secret**

If you don't set this, the default PIN will be `1234`.

### 4. Login as Owner

1. Go to your Gourmet Haven app
2. Click **Login**
3. Select **Owner** role
4. Enter your owner email and password
5. Enter the 4-digit PIN when prompted
6. You'll be redirected to the Owner Dashboard

## Important Notes

- **No Owner Signup**: The signup flow only allows customers to register
- **PIN Protection**: All owner logins require PIN verification for security
- **Single Owner**: Only create one owner account
- **Password Reset**: If you forget your password, use Firebase Console to reset it

## Troubleshooting

**Can't see owner role in signup:**
- This is correct! Owner option only appears on the login page, not signup.

**PIN not working:**
- Check that `VITE_OWNER_PIN` is set correctly in Replit Secrets
- Default PIN is `1234` if not set

**Login fails:**
- Verify the email/password in Firebase Console
- Ensure the user document exists in Firestore with `role: "owner"`

**Not redirected to dashboard:**
- Verify the Firestore document has `role: "owner"` (not "customer")
- Check browser console for errors
