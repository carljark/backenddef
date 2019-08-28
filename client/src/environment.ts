const mode = process.env.NODE_ENV;
interface IConfig {
  urlServer: string;
  tooltipTimeFormat: string;
  timeForUpdates: number;
  minutesForHistory: number;
}

const config: IConfig = {
  minutesForHistory: 10,
  timeForUpdates: 60000,
  tooltipTimeFormat:  'DD/MM HH[h]mm[m]ss[s]',
  urlServer: '',
};

if (mode === 'development') {
  config.timeForUpdates = 6000;
  config.tooltipTimeFormat = 'DD/MM HH[h]mm[m]ss[s]';
  config.urlServer = 'https://carlosalbertogodoy.ddns.net';
  config.minutesForHistory = 10;
} else if (mode === 'production') {
  config.timeForUpdates = 6000;
  config.tooltipTimeFormat = 'DD/MM HH[h]mm[m]ss[s]';
  config.urlServer = '';
  config.minutesForHistory = 10;
} else {
  config.urlServer = '';

}
export default config;
