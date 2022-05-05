const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFound');

class SongsService {
  constructor(){
    this._song = [];
  }

  addSong({title, year, genre, performer, duration, albumId}){
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newSong = {
      id, title, year, genre, performer, duration, albumId, createdAt, updatedAt
    };

    this._song.push(newSong);

    const isSuccess = this._song.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return id;
  }

  getSongs(){
    return this._song;
  }

  getSongById(id){
    const song = this._song.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {title, year, genre, performer, duration, albumId}){
    const index = this._song.findIndex((song) => song.id === id);

    if(index === -1){
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();
 
    this._song[index] = {
      ...this._song[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      updatedAt,
    };
  }

  deleteSongById(id) {
    const index = this._song.findIndex((song) => song.id === id);

    if(index === -1){
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }

    this._song.splice(index, 1);
  }
}

module.exports = SongsService;