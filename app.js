// Fill in with your values
const POST_ENDPOINT = 'https://seccamp2020b3-08.azurewebsites.net/api/post'
const TIMELINE_ENDPOINT = 'https://seccamp2020b3-08.azurewebsites.net/api/timeline'
const TIMESTAMP_KEY = 'timestamp_key'

function updateUI() {
  const isLoggedIn = localStorage.getItem('id_token');
  if (isLoggedIn) {
    // swap buttons
    document.getElementById('btn-login').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'inline';
    const profile = JSON.parse(localStorage.getItem('profile'));
    // show username
    document.getElementById('nick').textContent = profile.email;
  }
}

// Handle login
/*
lock.on('authenticated', (authResult) => {
  console.log(authResult);
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) {
      // Handle error
      return;
    }

    document.getElementById('nick').textContent = profile.nickname;

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));

    updateUI();
  });
});
*/

updateUI();

/*
// Handle login
document.getElementById('btn-login').addEventListener('click', () => {
  lock.show();
});

// Handle logout
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('profile');
  document.getElementById('btn-login').style.display = 'flex';
  document.getElementById('btn-logout').style.display = 'none';
  document.getElementById('nick').textContent = '';
});
*/

// Handle timeline api call
document.getElementById('btn-timeline').addEventListener('click', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;

  // get timestamp
  const previousTimestamp = localStorage.getItem(TIMESTAMP_KEY);
  const timestamp = (previousTimestamp != null) ? previousTimestamp : 0;

  const requestData = {
    id: email,
    previous_timestamp : timestamp
  }

  fetch(TIMELINE_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: email ? JSON.stringify(requestData) : "",
  })
    .then(response => response.json())
    .then((data) => {
      console.log('Message:', data);
      const base = document.getElementById('messages')
      // base.innerHTML = '';

      const template  = document.getElementById('msgtmpl');
      data.msgs.forEach((msg) => {
        const msgrow = template.cloneNode(true);
        msgrow.id = null;
        msgrow.querySelector('.msgtext').textContent = msg.text;
        msgrow.querySelector('.msgemail').textContent = msg.user_id;
        msgrow.querySelector('.msgdate').textContent = new Date(msg.timestamp);
        base.appendChild(msgrow);
      });
      
      // Save last timestamp 
      localStorage.setItem(TIMESTAMP_KEY, timestamp);
    })
    .catch((e) => {
      console.log('error', e);
    });
});

// Handle post api call
document.getElementById('btn-post').addEventListener('click', (e) => {
  e.preventDefault();

  fetch(POST_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: document.getElementById('text').value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      document.getElementById('message').textContent = '';
    })
    .catch((e) => {
      console.log('error', e);
    });
  return false;
});
