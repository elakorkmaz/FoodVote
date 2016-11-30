module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": null,
    "database": "foodvote",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "ela",
    "password": null,
    "database": "foodvote",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "ela",
    "password": null,
    "database": "foodvote",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};
