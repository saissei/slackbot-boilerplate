import config from 'config';

const slack = config.get('slack_config');
const logger = config.get('log4js');

const slackString = (): string => {
  return JSON.stringify(slack);
};

const loggerString = (): string => {
  return JSON.stringify(logger);
};

console.log('slack config:  ', slackString());
console.log('logger config:  ', loggerString());
