require('module-alias/register');
const server = require('@src/handlers/serverHandler');
const port = 8888;

server(port);
