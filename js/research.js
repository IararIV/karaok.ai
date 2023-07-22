// Authorization

var client_id = '30a1435e801a4f5884f0721a3fc36d2b';
var client_secret = 'eaa1be0fcc8e442f98488a759597a628';
var redirect_uri = "http://localhost:7777/callback"

var token;
var token_type;
var expires_in;

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
  },
  body: 'grant_type=client_credentials'
};


// Get access token
fetch(authOptions.url, {
  method: 'POST',
  headers: {
    'Authorization': authOptions.headers.Authorization,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: authOptions.body
})
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      token = data.access_token;
      token_type = data.token_type;
      expires_in = data.expires_in;
    } else {
      console.error('Error retrieving access token');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

const client_id = '30a1435e801a4f5884f0721a3fc36d2b';
const redirect_uri = "http://localhost:7777/callback"
const scope = 'user-read-email,user-read-private,user-library-read,user-read-playback-state,user-modify-playback-state,user-read-currently-playing';
const state = generateRandomString(16);

const authorizeUrl = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });

// Perform the fetch request to the server
fetch(authorizeUrl.url, {
    method: 'POST', 
    body: JSON.stringify({ authorizeUrl }), // Send the authorizeUrl to the server
    headers: {
        'Content-Type': 'application/json'
    }
})
.then((response) => {
    // Handle the response from the server if needed
    // For example, you can redirect the user to the received authorization URL
    return response.json();
})
.then((data) => {
    // Redirect the user to the Spotify authorization URL
    window.location.href = data.authorizeUrl;
})
.catch((error) => {
    console.error('Error fetching the authorization URL:', error);
});


// Assuming you have the Spotify API base URL and your Spotify access token stored in variables:
const spotifyApiBaseURL = 'https://api.spotify.com/v1';

// Define the function to get match songs
async function getMatchSongs(searchText, nSongs = 5) {
  const searchEndpoint = `${spotifyApiBaseURL}/search?q=${encodeURIComponent(searchText)}&type=track&limit=${nSongs}`;

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(searchEndpoint, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const tracks = data['tracks']['items'];

    const topTracks = tracks.map(track => ({
      id: track['id'],
      name: track['name'],
      artist: track['artists'][0]['name'],
      album: track['album']['name'],
      year: parseInt(track['album']['release_date'].slice(0, 4)),
      duration: track['duration_ms'],
      image: track['album']['images'][0]['url']
    }));

    return topTracks;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Usage example:
getMatchSongs('Columbia', 5)
  .then(topTracks => {
    console.log(topTracks);
  })
  .catch(error => {
    console.error('Error:', error);
  });



// Define the function to add a track to the user's queue
async function addTrackToQueue(trackId, token) {
    var trackUri = "spotify:track:" + trackId
    const searchEndpoint = `${spotifyApiBaseURL}/me/player/queue?uri=${encodeURIComponent(trackUri)}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    try {
      const response = await fetch(searchEndpoint, {
        method: 'POST',
        headers: headers
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return true; // Success! Track added to the queue.
    } catch (error) {
      console.error('Error:', error);
      return false; // Failed to add the track to the queue.
    }
  }