async function runTests() {
  try {
    const ts = Date.now();
    const email = `testuser${ts}@example.com`;
    console.log('1. Registering user');
    
    let res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Test User',
        email,
        phone: '1234567890',
        password: 'password123',
        role: 'User'
      })
    });
    
    let setCookie = res.headers.get('set-cookie');
    const cookieString = setCookie ? setCookie.split(';')[0] : '';
    console.log('Got cookie:', cookieString);
    
    console.log('2. Testing /report with VALID payload');
    let reportRes = await fetch('http://localhost:3000/api/incidents/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieString },
      body: JSON.stringify({
        title: 'Fire in the kitchen',
        description: 'Huge fire coming out from the stove in kitchen area.',
        location: 'Kitchen'
      })
    });
    console.log('VALID Payload status:', reportRes.status);
    console.log(await reportRes.json());

    console.log('3. Testing /report with INVALID payload');
    let badRes = await fetch('http://localhost:3000/api/incidents/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieString },
      body: JSON.stringify({
        title: 'bad', // too short
        description: 'short', // too short
        location: '' // empty
      })
    });
    console.log('INVALID Payload status:', badRes.status);
    console.log(await badRes.json());

  } catch (error) {
    console.error('Test script error:', error);
  }
}

runTests();
