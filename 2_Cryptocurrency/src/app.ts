import config from './server/config'
import app from './server/server';
import Cluster from './server/cluster'
import { getUUID } from './app/utils/hashUtils';

new Cluster( app, config.port );