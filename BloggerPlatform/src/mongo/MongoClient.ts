import {MongoClient} from 'mongodb';

export const client = MongoClient.connect('mongodb://localhost:27017');
