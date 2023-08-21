import AppConfigInterface from 'src/app/core/interface/app-config-interface';

export const environment = {
  production: false,
  // baseUrl : "http://localhost:4200/",
  workerPath: '/assets/js/workers/ticker-timer-worker.js',
  assetsPath: 'assets/',
  imagePath: 'images/',
  config: <AppConfigInterface>{},
  appConfigPath: 'assets/js/app-config.dev.json',
  theme: 'theme/',
  enableElasticAPM: false,
  isSocketUp: true
};

export default environment;
