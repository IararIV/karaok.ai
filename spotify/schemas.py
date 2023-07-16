from dataclasses import dataclass


@dataclass
class Credentials:
    client_id: str
    client_secret: str


@dataclass
class Track:
    id: str
    name: str
    artist: str
    album: str
    year: int
    duration: int
    image: str