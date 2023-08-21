import AppConfigInterface from 'src/app/core/interface/app-config-interface';

export const environment = {
  production: false,
  baseUrl: '',
  config: <AppConfigInterface>{},
  assetsPath: 'assets/',
  imagePath: 'images/',
  appConfigPath: 'assets/js/app-config.dev.json',
  workerPath: '/assets/js/workers/ticker-timer-worker.js',
  theme: 'theme/',
  enableElasticAPM: true,
  isSocketUp: true
};

export default environment;
