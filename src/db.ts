import { connect, model } from "mongoose";
import { questionSchema } from "./models/question";

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

  connectMongoDB = () =>
    new Promise((res) => {
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

  addQuestion(asker: string, responder: string, question: string) {
    const questionModel = model("Question", questionSchema);
    const newQuestion = new questionModel({ asker, responder, question });

    return new Promise((res) => {
      if (!this._initialized) {
        this.logError("Data base is not connected!");
        res(false);
      }

      newQuestion.save().then(
        () => {
          this.log(`Successfully added new question! ${asker} => ${responder}`);
          res(true);
        },
        (error: string) => {
          this.logError(`Error while adding question: ${error}`);
          res(false);
        }
      );
    });
  }

  // addUser

  // respondQuestion

  // getQuestions

  log = (test: string) => console.log("\x1b[36m%s\x1b[0m", `MongoAPI: ${test}`);
  logError = (test: string) => console.log("\x1b[31m%s\x1b[0m", `MongoAPI: ${test}`);
}
