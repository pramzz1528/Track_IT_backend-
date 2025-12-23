const authController = require('./controllers/authController');

console.log('Checking exports from authController...');
console.log('register:', typeof authController.register);
console.log('login:', typeof authController.login);
console.log('logout:', typeof authController.logout);
console.log('getMe:', typeof authController.getMe);
console.log('updateTheme:', typeof authController.updateTheme);
console.log('approveUser:', typeof authController.approveUser);
console.log('getUsers:', typeof authController.getUsers);
console.log('deleteUser:', typeof authController.deleteUser);

if (typeof authController.getUsers !== 'function' || typeof authController.deleteUser !== 'function') {
    console.error('FAIL: getUsers or deleteUser is missing!');
    process.exit(1);
} else {
    console.log('SUCCESS: All required functions are exported.');
}
