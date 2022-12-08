import { Collection, MongoClient, ObjectId } from "mongodb"

const DbConfig = {
  user: string,
  password: string,
  host: string,
  port: number,
  db: string,
  collection: string,
}

class DBAdapter {
  constructor(dbConfig) {
    this.dbConfig = dbConfig
  }
  async connect() {
    let uri = `mongodb://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/`

    const connection = await new MongoClient(uri).connect()
    this.dbCollection = connection
      .db(this.dbConfig.db)
      .collection(this.dbConfig.collection)
  }
}
