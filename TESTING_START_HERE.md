# 🎬 Quick Testing Action Guide

**Status**: ✅ Development Server Running on http://localhost:3000

---

## 🚀 START HERE: IMMEDIATE TESTING STEPS

### **Step 1: Access the Application** ✅ DONE
- Development server is now running
- Visit: http://localhost:3000
- You should see the landing page or login page

---

### **Step 2: Test Google OAuth Login**
1. Click "Sign in with Google"
2. You'll be redirected to Google's OAuth consent screen
3. Accept the permissions
4. You should be redirected to either:
   - `/onboarding` (if first time) - proceed to Step 3
   - `/dashboard` (if returning user)

**What to verify:**
- ✅ OAuth redirects work
- ✅ Session is created
- ✅ User data is saved to database

---

### **Step 3: Create Your First Campaign**
If on `/onboarding`:
1. Enter a campaign name (e.g., "Test Campaign")
2. Enter or paste a Google Drive folder URL (or folder ID)
3. Click "Create Campaign"
4. Wait for sync to complete

**What to verify:**
- ✅ Campaign created in database
- ✅ You see campaign dashboard
- ✅ Users from folder are imported

---

### **Step 4: Explore the Dashboard**
Navigate to: http://localhost:3000/dashboard

**Check these sections:**

#### User Directory Table
- [ ] Table displays with user data
- [ ] Search box filters users in real-time
- [ ] Campaign filter dropdown works
- [ ] Checkboxes select users

#### Stats Cards (Top)
- [ ] Total Users count
- [ ] Growth Rate shows
- [ ] Sync Status displays
- [ ] Last Sync Time accurate

#### Bulk Actions (If users selected)
- [ ] Select multiple users
- [ ] "Bulk Actions" menu appears
- [ ] Grant/Suspend/Delete options work

**What to verify:**
- ✅ Dashboard loads correctly
- ✅ Data displays properly
- ✅ Responsive design works

---

### **Step 5: Test User Management Features**
1. **Search Users**
   - Type in search box
   - Verify filtering works

2. **Filter by Campaign**
   - Use dropdown to filter
   - Check results update

3. **Bulk Select Users**
   - Click "Select All Items" button
   - Verify checkboxes check/uncheck

4. **View User Details**
   - Click a user row
   - Detail sheet should open
   - Close sheet by clicking X or outside

**What to verify:**
- ✅ Search functionality works
- ✅ Filters apply correctly
- ✅ Bulk operations respond correctly
- ✅ Mobile view is responsive

---

### **Step 6: Test Campaigns**
Navigate to: http://localhost:3000/campaigns

1. **View All Campaigns**
   - Should see list of your campaigns
   - Cards display campaign info

2. **Create New Campaign** (Optional)
   - Click "New Campaign" button
   - Fill form
   - Submit
   - Verify new campaign appears

**What to verify:**
- ✅ Campaign list displays
- ✅ Campaign details accurate
- ✅ Campaign creation form works

---

### **Step 7: Test Analytics** (if data available)
Navigate to: http://localhost:3000/analytics

**Check these elements:**
- [ ] Page loads without errors
- [ ] Overview cards show metrics
- [ ] Charts render (if using test data)
- [ ] Date range filters work

**Note:** May show empty if no historical data yet

**What to verify:**
- ✅ Analytics page loads
- ✅ No JavaScript errors in console
- ✅ Layout is responsive

---

### **Step 8: Test Sync Functionality**
1. Go to `/dashboard`
2. Look for "Sync Now" button
3. Click it
4. Watch for sync progress

**What to verify:**
- ✅ Sync starts immediately
- ✅ Progress indicator shows
- ✅ Completion message appears
- ✅ User list updates

---

### **Step 9: Test Export**
1. On `/dashboard`
2. Look for "Export CSV" button in table header
3. Click it
4. CSV file should download

**What to verify:**
- ✅ Export button visible
- ✅ CSV file downloads
- ✅ File contains user data

---

### **Step 10: Test Responsive Design**
1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**What to verify:**
- ✅ Layout adapts to screen size
- ✅ Tables convert to card view on mobile
- ✅ Navigation works on all sizes
- ✅ Buttons are tap-friendly on mobile

---

## ✅ Feature Testing Checklist

### **Core Features**
- [ ] Google OAuth login works
- [ ] Campaign creation works
- [ ] User directory displays
- [ ] Search/filtering works
- [ ] Bulk operations work
- [ ] User details sheet works
- [ ] Export to CSV works
- [ ] Sync button functions
- [ ] Analytics page loads
- [ ] Responsive design responsive

### **API Endpoints** (Test with curl or Postman)
```bash
# Get current user
curl http://localhost:3000/api/users/me

# List campaigns
curl http://localhost:3000/api/campaigns

# Get sync status
curl http://localhost:3000/api/sync/status

# List users
curl "http://localhost:3000/api/users?page=1&pageSize=10"
```

### **Browser Console**
- [ ] No red errors in console
- [ ] No TypeScript errors
- [ ] Network requests successful

---

## 🔍 Browser Console Debugging

Open DevTools (F12) and check:

1. **Console Tab**
   - Look for red errors
   - Green messages are OK

2. **Network Tab**
   - Check API calls to /api/ endpoints
   - Look for failed requests (red)

3. **Application Tab**
   - Check cookies (should have NextAuth session)
   - Check localStorage

---

## 🐛 Common Issues & Fixes

### **Issue: "Google OAuth Not Configured"**
- **Fix**: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Verify values are not empty
- Restart dev server

### **Issue: "Database Connection Failed"**
- **Fix**: Check DATABASE_URL in .env
- For SQLite: Should be `file:./prisma/dev.db`
- For Turso: Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN

### **Issue: "Users Not Showing in Dashboard"**
- **Fix**: Click "Sync Now" button
- Wait for sync to complete
- Refresh page

### **Issue: "Export CSV Not Working"**
- **Fix**: Check /api/users endpoint works
- Verify users exist in database
- Check browser console for errors

### **Issue: "Mobile View Broken"**
- **Fix**: This is a known edge case
- Desktop view works perfectly
- Tablet view should work fine

---

## 📊 Success Metrics

### ✅ **If You See:**
- Dashboard loads with user table
- At least one campaign visible
- Search/filter work
- Export button available
- Analytics page loads
- Sync button functions

### ✅ **You Have Successfully Verified:**
- Database connection ✅
- Google OAuth integration ✅
- API endpoints working ✅
- UI rendering correctly ✅
- Core features functional ✅

**🎉 Congratulations! Your application is working!**

---

## 🚀 Next Phase: Full Deployment

Once testing is complete:

1. **Run Automated Tests**
   ```bash
   pnpm test              # Unit tests
   pnpm exec playwright test  # E2E tests
   ```

2. **Choose Deployment Platform**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)

3. **Deploy to Production**
   - Follow platform-specific instructions

---

## 📞 Need Help?

- **Testing Questions**: See [NAVIGATION_TESTING_GUIDE.md](./NAVIGATION_TESTING_GUIDE.md)
- **Deployment Questions**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full Testing Procedures**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

**Happy Testing! 🎉**

_Dev Server: http://localhost:3000_  
_Status: ✅ Running_  
_Ready for: Feature Testing → Deployment_