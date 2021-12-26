import { MongoAPI } from "./db";

export function apiExample(api: MongoAPI) {
  // 1. Make a several questions
  Promise.all([
    api.addQuestion("rudensergey", "baitun", "how old are you?"),
    api.addQuestion("rudensergey", "baitun", "what are you doing?"),
    api.addQuestion("rudensergey", "baitun", "whatsap?"),
  ])
    // 2. Get questions for the certain user
    .then(() => api.getQuestions("baitun"))
    .then((res) => {
      if (!res || !res.length) return;

      // 3. Make a responces
      api
        .responseQuestion(res[0]._id, "I am 26 years old")
        .then(() => api.responseQuestion(res[2]._id, "Nothing"))
        .then(() => api.responseQuestion(res[1]._id, "Hi"))

        // 4. Get result
        .then(() => api.getQuestions("baitun"))
        .then((res) => console.log(res));
    });
}
