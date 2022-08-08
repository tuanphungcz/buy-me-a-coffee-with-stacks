import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { appDetails } from './constant';

const appConfig = new AppConfig(
  ['store_write', 'publish_data'],
  'https://buy-me-a-coffee-with-stacks.vercel.app'
);

export const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails,
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession
  });
}
