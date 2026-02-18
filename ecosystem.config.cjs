module.exports = {
  apps: [
    {
      name: 'meshforge-api',
      cwd: '/var/www/meshforge-next',
      script: 'npm',
      args: 'run start:api',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      max_restarts: 10,
      restart_delay: 5000,
      out_file: '/var/log/meshforge-api.out.log',
      error_file: '/var/log/meshforge-api.err.log',
      time: true,
    },
    {
      name: 'meshforge-indexer',
      cwd: '/var/www/meshforge-next',
      script: 'npm',
      args: 'run indexer',
      env: {
        NODE_ENV: 'production',
      },
      max_restarts: 10,
      restart_delay: 5000,
      out_file: '/var/log/meshforge-indexer.out.log',
      error_file: '/var/log/meshforge-indexer.err.log',
      time: true,
    },
  ],
};
