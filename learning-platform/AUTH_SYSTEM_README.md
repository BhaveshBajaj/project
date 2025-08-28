# Authentication System Guide

## How It Works

The authentication system uses a hybrid approach with localStorage as the primary data source:

1. **Initial Load**: On first visit, users are loaded from `src/assets/data.json`
2. **Caching**: All users are cached in localStorage under `usersCache` key
3. **Persistence**: New users created via signup are stored in localStorage
4. **Session Management**: Login state is maintained in localStorage

## Existing Users (from data.json)

These users have `password: "hashed_password"` and can be logged in with:
- **Email**: Any email from the data.json file
- **Password**: Any password with 6+ characters

### Available Test Users:
- `harry.shimron@example.com` (Admin)
- `stephane.maarek@example.com` (Author)
- `wade.warren@example.com` (Learner)
- `jacob.jones@example.com` (Learner)
- `alisha.singhla@example.com` (Author)
- `dipaman.deb@example.com` (Learner)

## New Users (via Signup)

New users created through the signup form:
- Store their actual password
- Are immediately available for login
- Persist across browser sessions

## Debugging Tools

### Browser Console Commands

Load the debug script in your browser console:
```javascript
// Copy and paste the contents of debug-users.js into browser console
```

### Available Debug Functions:

1. **View all users**: `viewUsers()`
2. **Check current login status**: `viewCurrentUser()`
3. **Clear all auth data**: `clearAllAuth()`
4. **Test login logic**: `testLogin('email@example.com', 'password')`
5. **Add test user**: `addTestUser()`

### Common Issues & Solutions

#### Issue: "User not found" during login
**Solution**: 
- Check if the email exists in the system: `viewUsers()`
- For existing users, use any password with 6+ characters
- For new users, use the exact password you set during signup

#### Issue: New users not persisting
**Solution**:
- Check localStorage: `viewUsers()`
- If no users shown, the cache might be cleared
- Try signing up again

#### Issue: Login not working after copy-pasting credentials
**Solution**:
- Check for extra spaces: `testLogin('email@example.com', 'password')`
- Verify the email format
- Ensure password meets minimum length (6 characters)

#### Issue: Need to reset everything
**Solution**:
- Run `clearAllAuth()` in browser console
- Reload the page
- Sign up again

## Data Flow

```
1. App starts → Check localStorage for cached users
2. If no cache → Load from assets/data.json
3. Cache users in localStorage
4. All operations (login/signup) work with cached data
5. New users are added to cache
6. Login state stored in localStorage
```

## Security Notes

⚠️ **This is a demo system** - In production:
- Passwords should be hashed
- Use proper JWT tokens
- Implement server-side validation
- Use secure session management

## Testing the System

1. **Test existing user login**:
   - Email: `harry.shimron@example.com`
   - Password: `anypassword123`

2. **Test new user signup**:
   - Create account with unique email
   - Login with exact credentials

3. **Test persistence**:
   - Sign up a new user
   - Refresh the page
   - Login with the same credentials

## Troubleshooting

If you encounter issues:

1. Open browser console (F12)
2. Load the debug script: `debug-users.js`
3. Run `viewUsers()` to see current state
4. Run `viewCurrentUser()` to check login status
5. Use `testLogin()` to test specific credentials
6. If needed, run `clearAllAuth()` to reset everything
