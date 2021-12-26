import { ObjectId } from "mongodb";
import { connect } from "mongoose";
import { IQuestion, questionModel } from "./models/question";

export type Nullable<T> = T | null;

export class MongoAPI {
  private _user: string;
  private _cluster: string;
  private _password: string;
  private _initialized: boolean;

  constructor(user: any, password: any, cluster: any) {
    this._user = user;
    this._cluster = cluster;
    this._password = password;
    this._initialized = false;
  }

  connectMongoDB(): Promise<boolean> {
    return new Promise((res) => {
      connect(`mongodb+srv://${this._user}:${this._password}@${this._cluster}`)
        .then(() => {
          this.log("Database connected!");
          this._initialized = true;
          res(true);
        })
        .catch((error) => {
          this.logError(`Error in connection: ${error}`);
          res(false);
        });
    });
  }

  addQuestion(asker: string, responder: string, question: string): Promise<boolean> {
    return new Promise((res) => {
      if (!this._initialized) {
        this.logError("Data base is not connected!");
        res(false);
      }

      const newQuestion = new questionModel({ asker, responder, question });
      newQuestion.save().then(
        () => {
          this.log(`Question! ${asker} => ${responder} ${question.slice(0, 20)}`);
          res(true);
        },
        (error: string) => {
          this.logError(`Error while adding question: ${error}`);
          res(false);
        }
      );
    });
  }

  responseQuestion(id: ObjectId, answer: string): Promise<boolean> {
    return new Promise((res) => {
      if (!this._initialized) {
        this.logError("Data base is not connected!");
        res(false);
      }

      return questionModel
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
        });
    });
  }

  getQuestions(username: string): Promise<Nullable<IQuestion[]>> {
    return new Promise((res) => {
      if (!this._initialized) {
        this.logError("Data base is not connected!");
        res(null);
      }

      return questionModel
        .find({ responder: username })
        .then((data: IQuestion[]) => {
          if (data.length) {
            this.log(`Recieved ${data.length} qestion for ${username}`);
            return res(data);
          }

          this.log("No questions");
          res([]);
        })
        .catch((error) => {
          this.logError(`Error during the accessing question for user ${username}: ${error}`);
          res(null);
        });
    });
  }

  log = (test: string) => console.log("\x1b[36m%s\x1b[0m", `MongoAPI: ${test}`);
  logError = (test: string) => console.log("\x1b[31m%s\x1b[0m", `MongoAPI: ${test}`);
}
