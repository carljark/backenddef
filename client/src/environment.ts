const mode = process.env.NODE_ENV;
interface IConfig {
  urlServer: string;
  tooltipTimeFormat: string;
  timeForUpdates: number;
}

const config: IConfig = {
  timeForUpdates: 60000,
  tooltipTimeFormat:  'DD/MM HH[h]mm[m]ss[s]',
  urlServer: '',
};

if (mode === 'development') {
  config.timeForUpdates = 6000;
  config.tooltipTimeFormat = 'DD/MM HH[h]mm[m]ss[s]';
  config.urlServer = 'http://192.168.1.3:8000';
} else if (mode === 'devserver') {
  config.timeForUpdates = 6000;
  config.tooltipTimeFormat = 'DD/MM HH[h]mm[m]ss[s]';
  config.urlServer = '';
} else {
  config.urlServer = '';

}
export default config;
