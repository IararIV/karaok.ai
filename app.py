from flask import Flask, render_template, request, jsonify

import json

from spotify.credentials import get_spotify_client
from spotify.functions import add_track_to_queue, get_top_track_matches
from spotify.schemas import Credentials


with open("spotify/credentials.json") as credentials_file:
    credentials_dict = json.load(credentials_file)
    credentials = Credentials(**credentials_dict)
    spotify_client = get_spotify_client(credentials)

app = Flask(__name__)


@app.route('/')
def search_page():
    return render_template('search.html')


@app.route('/search', methods=['POST'])
def search():
    name = request.form['search_text']
    tracks = get_top_track_matches(name, spotify_client)
    return render_template('search_results.html', tracks=tracks)


@app.route('/add_to_queue', methods=['POST'])
def add_to_queue():
    try:
        track_id = request.form['track_id']
        add_track_to_queue(track_id, spotify_client)
        return jsonify({"message": "OK"})
    except Exception as e:
        return jsonify({"message": "ERROR"})


if __name__ == '__main__':
    app.run()