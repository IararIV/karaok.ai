// Initialize variables
const spotifyApiBaseURL = 'https://api.spotify.com/v1';

// Token (inster manually)
const token = "";

const headers = {
  'Authorization': `Bearer ${token}`
};

// Define the function to get recent tracks
async function getRecentTracks(nSongs = 3) {
  const searchEndpoint = `https://api.spotify.com/v1/me/player/recently-played?type=track&limit=${nSongs}`;

  try {
    const response = await fetch(searchEndpoint, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const items = data['items'];

    const recentTracks = items.map(item => ({
      id: item['track']['id'],
      uri: item['track']['uri'],
      name: item['track']['name'],
      artist: item['track']['artists'][0]['name'],
      album: item['track']['album']['name'],
      year: parseInt(item['track']['album']['release_date'].slice(0, 4)),
      duration: item['track']['duration_ms'],
      image: item['track']['album']['images'][0]['url']
    }));

    return recentTracks;

  } catch (error) {
    console.error(error);
    return false; // Failed to add the track to the queue.
  }
}


// Define the function to get match songs
async function getMatchTracks(searchText, nSongs = 3) {
  const searchEndpoint = `${spotifyApiBaseURL}/search?q=${encodeURIComponent(searchText)}&type=track&limit=${nSongs}`;

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
      uri: track['uri'],
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


// Define the function to add a track to the user's queue
async function addTrackToQueue(trackUri) {
  const searchEndpoint = `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`;

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
    console.error(error);
    return false; // Failed to add the track to the queue.
  }
}