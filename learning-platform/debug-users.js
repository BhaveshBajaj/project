// Debug script to manage user data in localStorage
// Run this in browser console to debug auth issues

console.log('🔍 AUTH DEBUG TOOLS LOADED');
console.log('Use these functions to debug authentication:');

// View all registered users
window.viewUsers = function() {
  const users = JSON.parse(localStorage.getItem('usersCache') || '[]');
  console.log('📋 REGISTERED USERS:');
  console.log('Total users:', users.length);
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.fullName} (${user.email}) - Role: ${user.role}`);
    console.log(`   Username: ${user.username}, ID: ${user.id}`);
    console.log(`   Password: ${user.password === 'hashed_password' ? 'hashed_password (existing user)' : 'actual password (new user)'}`);
    console.log('---');
  });
  return users;
};

// View current logged in user
window.viewCurrentUser = function() {
  const currentUser = localStorage.getItem('currentUser');
  const authToken = localStorage.getItem('authToken');
  
  console.log('👤 CURRENT USER STATUS:');
  console.log('Logged in:', !!currentUser);
  if (currentUser) {
    console.log('User data:', JSON.parse(currentUser));
  }
  console.log('Auth token exists:', !!authToken);
  return { currentUser: currentUser ? JSON.parse(currentUser) : null, authToken };
};

// Clear all auth data (logout and clear cache)
window.clearAllAuth = function() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('usersCache');
  localStorage.removeItem('userEnrollmentsCache');
  console.log('🧹 All auth data cleared');
  console.log('You will need to reload the page and sign up again');
};

// Test login with existing user
window.testLogin = function(email, password) {
  console.log(`🔐 Testing login for: ${email}`);
  const users = JSON.parse(localStorage.getItem('usersCache') || '[]');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    console.log('❌ User not found');
    return false;
  }
  
  console.log('✅ User found:', user.fullName);
  
  if (user.password === 'hashed_password') {
    if (password.length >= 6) {
      console.log('✅ Login would succeed (existing user with any password >= 6)');
      return true;
    } else {
      console.log('❌ Login would fail (password too short)');
      return false;
    }
  } else {
    if (user.password === password) {
      console.log('✅ Login would succeed (new user with correct password)');
      return true;
    } else {
      console.log('❌ Login would fail (incorrect password)');
      return false;
    }
  }
};

// Add a test user
window.addTestUser = function() {
  const users = JSON.parse(localStorage.getItem('usersCache') || '[]');
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  
  const testUser = {
    id: maxId + 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    fullName: 'Test User',
    track: 'Test Track',
    avatarUrl: 'https://i.pravatar.cc/150?u=testuser',
    joinDate: new Date().toISOString(),
    role: 'Learner',
    bio: 'Test user for debugging',
    location: 'Test Location'
  };
  
  users.push(testUser);
  localStorage.setItem('usersCache', JSON.stringify(users));
  console.log('✅ Test user added:', testUser);
  return testUser;
};

console.log('Available functions:');
console.log('- viewUsers() - View all registered users');
console.log('- viewCurrentUser() - View current login status');
console.log('- clearAllAuth() - Clear all auth data');
console.log('- testLogin(email, password) - Test login logic');
console.log('- addTestUser() - Add a test user');

// Auto-run viewUsers to show current state
console.log('\n📊 CURRENT STATE:');
window.viewUsers();
window.viewCurrentUser();
