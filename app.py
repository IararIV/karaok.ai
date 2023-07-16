from flask import Flask, render_template, request

import json

from spotify.credentials import get_spotify_client
from spotify.functions import get_top_track_matches
from spotify.schemas import Credentials


with open("spotify/credentials.json") as credentials_file:
    credentials_dict = json.load(credentials_file)
    credentials = Credentials(**credentials_dict)

app = Flask(__name__)


@app.route('/')
def search_page():
    return render_template('search.html')


@app.route('/search', methods=['POST'])
def search():
    name = request.form['search_text']
    spotify_client = get_spotify_client(credentials)
    tracks = get_top_track_matches(name, spotify_client)
    return render_template('search_results.html', tracks=tracks)


@app.route('/add_to_queue', methods=['POST'])
def add_to_queue():
    track_id = request.form['track_id']
    print(track_id)
    # TODO implement add_to_queue


if __name__ == '__main__':
    app.run()