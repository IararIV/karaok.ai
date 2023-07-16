import spotipy
from spotipy.client import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

from spotify.schemas import Credentials


def get_spotify_client(credentials: Credentials) -> Spotify:
    auth_manager = SpotifyClientCredentials(client_id=credentials.client_id, client_secret=credentials.client_secret)
    spotify_client = spotipy.Spotify(auth_manager=auth_manager)
    return spotify_client
