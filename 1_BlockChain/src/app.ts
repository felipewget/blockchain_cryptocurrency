import config from './server/config'
import app from './server/server';
import Cluster from './server/cluster'

new Cluster( app, config.port );