# Scripts - Add Sample Menu Items

This directory contains utility scripts for your Gourmet Haven application.

## Add Sample Menu Items

The `add-sample-menu.ts` script will add 14 sample dishes to your Firestore database.

### Important: Before Running

1. **Add Replit Domain to Firebase Console**  
   Go to Firebase Console → Authentication → Settings → Authorized domains  
   Add: `dc870446-c114-447c-8465-491bb9569146-00-3hqfzd6cqitaa.picard.replit.dev`

2. **Get Your User ID (UID)**  
   - Go to Firebase Console → Authentication → Users
   - Sign up/in to your app first to create a user
   - Copy your UID from the Firebase console

3. **Update the Script**  
   Open `add-sample-menu.ts` and replace all instances of `REPLACE_WITH_YOUR_UID` with your actual UID

### How to Run

```bash
npx tsx scripts/add-sample-menu.ts
```

### Sample Dishes Included

The script adds 14 gourmet dishes:
- Paneer Tikka ($14.99) - vegetarian, gluten-free
- Chicken Karahi ($18.99) - halal
- Falafel Bowl ($14.99) - vegan, vegetarian, halal
- Beef Biryani ($24.99) - halal
- Veggie Stir-Fry ($13.99) - vegan, vegetarian
- Lamb Rogan Josh ($22.99) - halal
- Palak Paneer ($15.99) - vegetarian, gluten-free
- Butter Chicken ($19.99) - halal, gluten-free
- Chana Masala ($12.99) - vegan, vegetarian, halal, gluten-free
- Fish Curry ($21.99) - gluten-free
- Aloo Gobi ($11.99) - vegan, vegetarian, halal, gluten-free
- Tandoori Salmon ($26.99) - gluten-free
- Dal Makhani ($13.99) - vegetarian, gluten-free
- Seekh Kebab ($17.99) - halal, gluten-free

All dishes will be marked as available and assigned to your owner account.
