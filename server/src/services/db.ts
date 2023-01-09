import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const cloudDB = process.env.CLOUD_DB;
const localDB = process.env.LOCAL_DB;
const connectionMap = new Map();
connectionMap.set("cloudDB", cloudDB);
connectionMap.set("cloud", cloudDB);
connectionMap.set("localDB", localDB);
connectionMap.set("local", localDB);

class Db {
  /**
   * The MongoDB database class
   *
   * @remarks
   * This class handles the connection to the MongoDB database. This can be the local
   * connection, cloud connection, or a test connection (in-memory database).
   */

  private dbType: string;
  public mongod = new MongoMemoryServer();

  constructor(dbType: "local" | "cloud" | "test") {
    this.dbType = dbType;
  }

  private async connectHelper() {
    const connectionURL = connectionMap.get(this.dbType);
    await mongoose.connect(connectionURL);
    console.log(
      "Successfully connected to " + this.dbType + " database server!"
    );
  }

  private async connectTest() {
    await this.mongod.start();
    const uri = this.mongod.getUri();
    await mongoose.connect(uri);
  }

  public async connect() {
    if (this.dbType === "cloud" || this.dbType === "local") {
      await this.connectHelper();
    } else if (this.dbType === "test") {
      await this.connectTest();
    }
  }

  public async closeDatabase() {
    if (!this.dbType || this.dbType === "cloud" || this.dbType === "local") {
      throw new Error("Not Implemented");
    } else if (this.dbType === "test") {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await this.mongod.stop();
    }
  }

  public async clearDatabase() {
    if (!this.dbType || this.dbType === "cloud" || this.dbType === "local") {
      throw new Error("Not Implemented");
    } else if (this.dbType === "test") {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  }
}

export default Db;
