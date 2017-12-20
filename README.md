# e-learning
E-learning | Testing platform

**Setup**

1] Install dependencies:
```
npm install
```

2] Start mocking-API server (default port is 3001):
```
npm run mocking-api
```

3] Open another terminal tab. Start client server (default port is 3000):
```
npm install
```

4] Open your browser on:
```
http://localhost:3000
```

Node version preferred: `v8.9.1`.

**Main things you must know about this project**

1] This E-Learning Test Platform is focused more on the client side. 

2] For the API is used `json-server` package, so there's no needed yet a backend service.

3] Both `Students` and `Teachers` are already added. `CRUD` operations for those models can be marked as `todo` feature.

4] If you want to create new users, you can manipulate the `~/src/js/api/db.json` file.

5] There isn't used `routing` at all. Sections are shown or hidden based on the components's state or properties.

6] For the moment, isn't used test driven development for this platform, but is marked as `todo` feature with higher priority.

7] As a `Teacher`, you can update only unassigned quizzes.

8] This E-Learning platform assumes that all the quizzes refers to one Semester, and the `Student`'s average that can be retrieved by the `Teacher` is the average for all quizzes assigned to that `Student`.

