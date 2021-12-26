import { ObjectId } from "mongodb";
import { connect } from "mongoose";
import { IQuestion, questionModel } from "./models/question";

export type Nullable<T> = T | null;

export class MongoAPI {
  private _user: string;
  private _cluster: string;
  private _password: string;

  constructor(user: any, password: any, cluster: any) {
    this._user = user;
    this._cluster = cluster;
    this._password = password;
  }

  connectMongoDB(): Promise<boolean> {
    return new Promise((res) => {
      connect(`mongodb+srv://${this._user}:${this._password}@${this._cluster}`)
        .then(() => {
          this.log("Database connected!");
          res(true);
        })
        .catch((error) => {
          this.logError(`Error while connection: ${error}`);
          res(false);
        });
    });
  }

  addQuestion(asker: string, responder: string, question: string): Promise<boolean> {
    return new Promise((res) =>
      new questionModel({ asker, responder, question })
        .save()
        .then(() => {
          this.log(`Question added! ${asker} => ${responder} ${question.slice(0, 20)}`);
          res(true);
        })
        .catch((error: string) => {
          this.logError(`Error while adding question: ${error}`);
          res(false);
        })
    );
  }

  responseQuestion(id: ObjectId, answer: string): Promise<boolean> {
    return new Promise((res) =>
      questionModel
        .findById(id)
        .then((data) => Object.assign(data, { answer }))
        .then((model) => model.save())
        .then(() => {
          this.log(`Answer added! ${answer.slice(0, 30)}`);
          res(true);
        })
        .catch((error) => {
          this.logError(`Cannot add the answer: ${error}`);
          res(false);
        })
    );
  }

  getQuestions(username: string): Promise<Nullable<IQuestion[]>> {
    return new Promise((res) =>
      questionModel
        .find({ responder: username })
        .then((data: IQuestion[]) => {
          if (data.length) {
            this.log(`Recieved ${data.length} qestions for ${username}`);
            return res(data);
          }

          this.log("No questions recieved!");
          res([]);
        })
        .catch((error) => {
          this.logError(`Error during the accessing question for user ${username}: ${error}`);
          res(null);
        })
    );
  }

  log = (test: string) => console.log("\x1b[36m%s\x1b[0m", `MongoAPI: ${test}`);
  logError = (test: string) => console.log("\x1b[31m%s\x1b[0m", `MongoAPI: ${test}`);
}
