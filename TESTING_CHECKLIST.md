# Farm Expense Tracker - Testing Checklist

## Instructions
Please test the following items and check them off as you complete each test.

---

## 1. Initial Load ✓
- [ ] Open `index.html` in browser
- [ ] Verify no console errors appear
- [ ] Verify landing page displays correctly
- [ ] Check that all CSS styles are loaded
- [ ] Verify Font Awesome icons display

**Expected Result:** Landing page loads with hero section, features, testimonials, and footer.

---

## 2. Authentication Flow

### Signup
- [ ] Click "Get Started" or "Sign Up" button
- [ ] Fill in signup form:
  - Full Name: Test User
  - Email: test@example.com
  - Farm Name: Test Farm
  - Password: password123
- [ ] Click "Sign Up" button
- [ ] Verify success notification appears
- [ ] Verify redirected to dashboard
- [ ] Verify user greeting shows "Welcome, Test User"
- [ ] Verify farm name shows "Test Farm"

**Expected Result:** New account created, user logged in, dashboard displayed.

### Logout
- [ ] Click logout button
- [ ] Verify redirected to landing/login page
- [ ] Verify success notification appears

**Expected Result:** User logged out successfully.

### Login
- [ ] Navigate to login page
- [ ] Enter credentials:
  - Email: test@example.com
  - Password: password123
- [ ] Click "Login" button
- [ ] Verify success notification appears
- [ ] Verify redirected to dashboard

**Expected Result:** User logged in successfully.

---

## 3. Navigation Testing

### Main Navigation
- [ ] Click "Dashboard" - verify dashboard page loads
- [ ] Click "Livestock" - verify livestock page loads
- [ ] Click "Processing" - verify processing page loads
- [ ] Click "Logistics" - verify logistics page loads
- [ ] Click "Settings" - verify settings page loads
- [ ] Click "Home" - verify landing page loads (if logged in, should go to dashboard)

**Expected Result:** All navigation links work correctly.

### Theme Toggle
- [ ] Click theme toggle button (moon/sun icon)
- [ ] Verify theme switches between light and dark
- [ ] Verify icon changes (moon ↔ sun)
- [ ] Verify theme persists after page reload

**Expected Result:** Theme toggles correctly and persists.

---

## 4. Dashboard Functionality

### Stats Display
- [ ] Verify all 6 stat cards display:
  - Total Farm Budget
  - Used Budget
  - Remaining Budget
  - Monthly Expenses
  - Net Margin
  - Cost Per Livestock Head
- [ ] Verify values update when data changes

**Expected Result:** All stats display with correct values.

### Charts
- [ ] Verify "Expenses Over Time" chart displays
- [ ] Verify "Farm Category Breakdown" pie chart displays
- [ ] Verify charts update when data changes

**Expected Result:** Charts render correctly with data.

---

## 5. Expense Management

### Add Expense
- [ ] Click "Add Expense" button
- [ ] Verify expense modal opens
- [ ] Fill in form:
  - Category: Livestock Feed
  - Amount: 500
  - Date: (today's date)
  - Description: Monthly feed purchase
- [ ] Click "Add Expense" button
- [ ] Verify success notification appears
- [ ] Verify modal closes
- [ ] Verify expense appears in transactions table
- [ ] Verify stats update

**Expected Result:** Expense added successfully.

### Edit Expense
- [ ] Click edit button (pencil icon) on an expense
- [ ] Verify edit modal opens with pre-filled data
- [ ] Modify amount to 550
- [ ] Click "Update Expense" button
- [ ] Verify success notification appears
- [ ] Verify modal closes
- [ ] Verify expense updated in table

**Expected Result:** Expense edited successfully.

### Delete Expense
- [ ] Click delete button (trash icon) on an expense
- [ ] Verify confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Verify success notification appears
- [ ] Verify expense removed from table
- [ ] Verify stats update

**Expected Result:** Expense deleted successfully.

---

## 6. Revenue Management

### Add Revenue
- [ ] Click "Add Revenue" button
- [ ] Verify revenue modal opens
- [ ] Fill in form:
  - Category: Crop Sales
  - Amount: 1500
  - Date: (today's date)
  - Description: Wheat harvest sale
- [ ] Click "Add Revenue" button
- [ ] Verify success notification appears
- [ ] Verify modal closes
- [ ] Verify revenue appears in transactions table (with + prefix)
- [ ] Verify stats update

**Expected Result:** Revenue added successfully.

### Edit Revenue
- [ ] Click edit button on a revenue entry
- [ ] Verify edit modal opens with pre-filled data
- [ ] Modify amount
- [ ] Click "Update Revenue" button
- [ ] Verify success notification appears
- [ ] Verify revenue updated

**Expected Result:** Revenue edited successfully.

### Delete Revenue
- [ ] Click delete button on a revenue entry
- [ ] Confirm deletion
- [ ] Verify revenue removed
- [ ] Verify stats update

**Expected Result:** Revenue deleted successfully.

---

## 7. Livestock Management

### Add Livestock
- [ ] Navigate to Livestock page
- [ ] Click "Add Livestock" button
- [ ] Verify livestock modal opens
- [ ] Fill in form:
  - Type: Cattle
  - Breed: Angus
  - Quantity: 10
  - Age: 12 months
  - Weight: 400 kg
  - Purchase Date: (select date)
  - Purchase Price: 800
  - Notes: Healthy stock
- [ ] Click "Add Livestock" button
- [ ] Verify success notification appears
- [ ] Verify modal closes
- [ ] Verify livestock appears in table
- [ ] Verify total value calculated correctly (10 × 800 = 8000)

**Expected Result:** Livestock added successfully.

### Edit Livestock
- [ ] Click edit button on livestock entry
- [ ] Verify edit modal opens with pre-filled data
- [ ] Modify quantity to 12
- [ ] Click "Update Livestock" button
- [ ] Verify success notification appears
- [ ] Verify livestock updated
- [ ] Verify total value recalculated

**Expected Result:** Livestock edited successfully.

### Delete Livestock
- [ ] Click delete button on livestock entry
- [ ] Confirm deletion
- [ ] Verify livestock removed from table

**Expected Result:** Livestock deleted successfully.

---

## 8. Processing Management

### Add Processing Activity
- [ ] Navigate to Processing page
- [ ] Click "Add Processing Activity" button
- [ ] Verify processing modal opens
- [ ] Fill in form:
  - Date: (today's date)
  - Type: Slaughter
  - Product: Beef
  - Quantity: 500
  - Cost: 200
  - Description: Processing batch
- [ ] Click "Add Processing Activity" button
- [ ] Verify success notification appears
- [ ] Verify modal closes
- [ ] Verify activity appears in table

**Expected Result:** Processing activity added successfully.

### Edit Processing Activity
- [ ] Click edit button on processing entry
- [ ] Verify edit modal opens with all fields including status dropdown
- [ ] Modify cost and status
- [ ] Click "Update Processing" button
- [ ] Verify success notification appears
- [ ] Verify activity updated

**Expected Result:** Processing activity edited successfully.

### Delete Processing Activity
- [ ] Click delete button on processing entry
- [ ] Confirm deletion
- [ ] Verify activity removed

**Expected Result:** Processing activity deleted successfully.

---

## 9. Logistics Management

### Add Logistics Activity
- [ ] Navigate to Logistics page
- [ ] Verify logistics partners section displays with carrier links
- [ ] Click "Add Logistics Expense" button (if available) or use modal trigger
- [ ] Fill in form:
  - Date: (today's date)
  - Type: Transportation
  - Destination: Local Market
  - Quantity: 100
  - Shipping Date: (select date)
  - Cost: 150
  - Carrier: FedEx
  - Tracking Number: FX123456
  - Notes: Express delivery
- [ ] Submit form
- [ ] Verify success notification appears
- [ ] Verify activity appears in table

**Expected Result:** Logistics activity added successfully.

### Test Carrier Links
- [ ] Click on various carrier links (FedEx, UPS, DHL, etc.)
- [ ] Verify links open in new tab
- [ ] Verify correct carrier website loads

**Expected Result:** All carrier links work correctly.

### Edit Logistics Activity
- [ ] Click edit button on logistics entry
- [ ] Verify edit modal opens with all fields
- [ ] Modify destination and cost
- [ ] Click "Update Logistics" button
- [ ] Verify success notification appears
- [ ] Verify activity updated

**Expected Result:** Logistics activity edited successfully.

### Delete Logistics Activity
- [ ] Click delete button on logistics entry
- [ ] Confirm deletion
- [ ] Verify activity removed

**Expected Result:** Logistics activity deleted successfully.

---

## 10. Settings Management

### Update Profile
- [ ] Navigate to Settings page
- [ ] Verify form pre-filled with current user data
- [ ] Modify name to "Updated User"
- [ ] Modify farm name to "Updated Farm"
- [ ] Click "Update Profile" button
- [ ] Verify success notification appears
- [ ] Verify header shows updated name
- [ ] Verify dashboard shows updated farm name

**Expected Result:** Profile updated successfully.

### Update Budget
- [ ] In Settings, enter total budget: 10000
- [ ] Click "Update Budget" button
- [ ] Verify success notification appears
- [ ] Navigate to Dashboard
- [ ] Verify "Total Farm Budget" stat shows $10,000
- [ ] Verify "Remaining Budget" updates correctly

**Expected Result:** Budget updated successfully.

---

## 11. Data Persistence

### LocalStorage Test
- [ ] Add some expenses, revenues, and livestock
- [ ] Close browser tab
- [ ] Reopen `index.html`
- [ ] Login with same credentials
- [ ] Verify all data is still present

**Expected Result:** Data persists across sessions.

---

## 12. Export & Sync Features

### Export CSV
- [ ] Navigate to Dashboard
- [ ] Click "Export CSV" button
- [ ] Verify CSV file downloads
- [ ] Open CSV file
- [ ] Verify data is correctly formatted

**Expected Result:** CSV export works correctly.

### Sync Data
- [ ] Click "Sync" button
- [ ] Verify "Syncing data..." notification appears
- [ ] Verify "Data synced successfully!" notification appears after delay

**Expected Result:** Sync simulation works (note: actual API sync requires backend).

---

## 13. AI Features

### AI Predict
- [ ] Click "AI Predict" button
- [ ] Verify "Analyzing data..." notification appears
- [ ] Verify predictions update in AI widget
- [ ] Check predicted expenses value
- [ ] Check overspend risk category

**Expected Result:** AI prediction simulation works.

---

## 14. Modal Behavior

### Close Modals
Test each modal can be closed by:
- [ ] Clicking X (close button)
- [ ] Clicking outside modal
- [ ] Clicking Cancel button

**Expected Result:** All close methods work for all modals.

---

## 15. Responsive Design

### Mobile View
- [ ] Resize browser to mobile width (< 768px)
- [ ] Verify layout adapts
- [ ] Verify navigation works
- [ ] Verify modals display correctly
- [ ] Verify tables are scrollable

**Expected Result:** Application is responsive.

---

## 16. Error Handling

### Form Validation
- [ ] Try submitting expense form with empty fields
- [ ] Verify error notification appears
- [ ] Try submitting with negative amount
- [ ] Verify error notification appears

**Expected Result:** Form validation works correctly.

### API Fallback
- [ ] Open browser console
- [ ] Check for API connection warnings
- [ ] Verify application works with localStorage fallback

**Expected Result:** Application gracefully handles missing API.

---

## 17. Console Errors

### Check Console
- [ ] Open browser developer tools (F12)
- [ ] Navigate through all pages
- [ ] Perform various actions
- [ ] Check console for errors

**Expected Result:** No JavaScript errors in console.

---

## Summary

**Total Tests:** ~100+ individual test cases
**Critical Tests:** Authentication, CRUD operations, navigation, data persistence
**Nice-to-Have Tests:** Export, sync, AI features, responsive design

---

## Notes

- If any test fails, note the issue and report it
- Check browser console for any errors
- Test in multiple browsers if possible (Chrome, Firefox, Edge)
- Pay attention to notification messages
- Verify data consistency across pages

---

**Testing Date:** _____________
**Tested By:** _____________
**Browser:** _____________
**Issues Found:** _____________
