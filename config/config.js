module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "foodvote",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "test_foodvote",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    use_env_variable: 'DATABASE_URL',
    "dialect": "postgres"
  }
};
