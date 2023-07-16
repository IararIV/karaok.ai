from typing import List

from spotipy.client import Spotify

from spotify.schemas import Track


def get_top_track_matches(search_text: str, spotify_client: Spotify, n_songs: int = 3) -> List[Track]:
    results = spotify_client.search(q=search_text, limit=n_songs, type='track')
    tracks = results['tracks']['items']
    
    top_track_matches = []
        
    for track in tracks:
        track = Track(
                    id=track['id'],
                    name=track['name'], 
                    artist= track['artists'][0]['name'], 
                    album=track['album']['name'], 
                    year=int(track['album']['release_date'][:4]), 
                    duration=track['duration_ms'], 
                    image=track['album']['images'][0]['url']
                    )
        top_track_matches.append(track)
    
    return top_track_matches
