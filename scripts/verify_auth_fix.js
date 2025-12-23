const http = require('http');

const API_PORT = 5000;
const API_HOST = 'localhost';

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data || {});

        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: '/api/auth' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length,
                'Origin': 'http://localhost:5173' // Simulate frontend origin
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, headers: res.headers, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, data: body });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataString);
        req.end();
    });
};

const verifyAuth = async () => {
    try {
        console.log('1. Testing Connection & Login...');
        try {
            const loginRes = await postRequest('/login', {
                email: 'test@example.com',
                password: 'password123'
            });
            console.log(`Response Status: ${loginRes.status}`);
            if (loginRes.status === 401) {
                console.log('✅ Connection successful (received 401 Invalid Credentials as expected)');
            } else if (loginRes.status === 200) {
                console.log('✅ Login successful');
            } else {
                console.log('⚠️ Received status:', loginRes.status);
                console.log('Response:', loginRes.data);
            }
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
            if (error.code === 'ECONNREFUSED') {
                console.error('Server is likely down.');
                return;
            }
        }

        console.log('\n2. Testing Logout Endpoint...');
        try {
            const logoutRes = await postRequest('/logout');
            console.log(`Response Status: ${logoutRes.status}`);
            if (logoutRes.status === 200) {
                console.log('✅ Logout successful:', logoutRes.data.message);
            } else {
                console.log('❌ Logout failed:', logoutRes.data);
            }

            // Check CORS header
            // Note: http.request might not show CORS headers if not running in browser, 
            // but the server should send them if Origin header is present.
            if (logoutRes.headers['access-control-allow-origin']) {
                console.log('✅ CORS Header present:', logoutRes.headers['access-control-allow-origin']);
            } else {
                console.log('⚠️ CORS Header missed (or not sent for this request)');
            }

        } catch (error) {
            console.error('❌ Logout request failed:', error.message);
        }

    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
};

verifyAuth();
