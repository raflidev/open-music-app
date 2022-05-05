const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const albums = require('./api/albums');
const AlbumsService = require('./services/inMemory/AlbumsService');

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
