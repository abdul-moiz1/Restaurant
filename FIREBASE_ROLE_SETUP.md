# How to Assign Owner Role in Firebase

## Overview
Owner and customer roles are stored in Firebase Firestore. You need to manually create the owner account and assign the role in Firebase Console.

---

## Step-by-Step Guide

### Step 1: Create User in Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **newrestaurant-25f8c**
3. Click **Authentication** in the left sidebar
4. Click the **Users** tab
5. Click **Add User** button
6. Enter your owner credentials:
   - **Email**: your-owner-email@example.com
   - **Password**: Choose a secure password
7. Click **Add User**
8. **Copy the User UID** - you'll need this for the next step!

---

### Step 2: Assign Owner Role in Firestore

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. You should see a collection called **users**
   - If you don't see it, create it by clicking **Start collection**
3. Click **Add Document** (or find the document with your user's UID if it already exists)
4. Set the **Document ID** to your user's UID (the one you copied in Step 1)
5. Add the following fields:

   | Field Name    | Type     | Value                              |
   |---------------|----------|-------------------------------------|
   | `uid`         | string   | (your user UID)                     |
   | `email`       | string   | your-owner-email@example.com        |
   | `displayName` | string   | Owner Name (e.g., "John Doe")       |
   | `role`        | string   | **owner** (important!)              |
   | `createdAt`   | string   | 2025-11-02T09:00:00.000Z (current timestamp) |

6. Click **Save**

---

### Step 3: Login as Owner

1. Go to your Gourmet Haven app
2. Click **Login**
3. Select **Owner** role
4. Enter your owner email and password
5. You'll be redirected to the Owner Dashboard automatically!

---

## Visual Guide - Firestore Document Structure

Your Firestore document should look like this:

```
users (collection)
  └── [USER_UID] (document)
      ├── uid: "abc123xyz..." (string)
      ├── email: "owner@example.com" (string)
      ├── displayName: "Restaurant Owner" (string)
      ├── role: "owner" (string) ← THIS IS CRITICAL!
      └── createdAt: "2025-11-02T09:00:00.000Z" (string)
```

---

## Important Notes

✅ **Role is the key**: The `role` field must be exactly `"owner"` (lowercase)
✅ **One owner account**: Typically you only need one owner account
✅ **Customer accounts**: Automatically created when customers sign up (role = "customer")
✅ **No PIN needed**: Role assignment is enough security - PIN verification has been removed
✅ **Email/Password only**: Owner login doesn't support Google Sign-In

---

## Troubleshooting

**Problem**: Can't login as owner
- **Solution**: Check that the `role` field in Firestore is exactly `"owner"` (lowercase, no spaces)

**Problem**: Redirected to menu instead of dashboard
- **Solution**: The role might be set to "customer" instead of "owner" - verify in Firestore

**Problem**: User document doesn't exist
- **Solution**: Create it manually in Firestore with the structure shown above

**Problem**: Forgot password
- **Solution**: In Firebase Console → Authentication → Users → Click the user → Reset Password
