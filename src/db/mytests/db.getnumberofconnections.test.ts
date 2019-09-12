import {Db, MongoClient, Server} from 'mongodb';

import db$ from '../db.factory';

db$
.subscribe((clidb) => {
    clidb.db.admin().serverStatus()
    .then((info) => {
        console.log(info.connections);
    });
});
