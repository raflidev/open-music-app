const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFound');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'select playlists.id, playlists.name, users.username from users INNER JOIN playlists ON playlists.owner=users.id where users.id=$1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    console.log('====================================');
    console.log(result.rows);
    console.log('====================================');

    return result.rows;
  }

  async getPlaylistsById(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner 
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
