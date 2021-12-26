import { connect } from "mongoose";

class MongoAPI {
  constructor() {}
}

export async function initializeMongoDB(user: any, password: any, cluster: any) {
  return connect(`mongodb+srv://${user}:${password}@${cluster}`).then(() => {
    console.log("Database connected!");
    return new MongoAPI();
  });
}
