// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'etl',
      user:     process.env.USER,
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: '_migrations'
    }
  }
};
