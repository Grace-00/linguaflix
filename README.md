# BE practice: node with ts, api, databases

## Useful commands:

- `npm run dev` to start the project locally - the script will automatically start nodemon which will recompile every time you save - no need to re-start the server on every change!
- `tsc -w` to keep typescript in watch mode and save whatever changes you make to the ts files. if you don't do that, the js file won't recognise any changes and won't compile.

next steps:

- add connection to free remote relational db instance (aiven) :white_check_mark:
- add [prisma](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma) :white_check_mark:
- add models using the design from this [project](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9)
- add data to db (using fake data for now)
- add routes (GET!)
- test them (insomnia?) there's this cool vs code extension called thunder client :cool:
- add docker

Questions so far:

- why am i getting undefined if i update the values within the POST route with req.body.whatever?
- understanding relation within Prisma and DB: how do i update a model or create a new one without deleting the DB every time i make a change? deep dive into migrations.
