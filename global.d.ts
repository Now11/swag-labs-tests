import { ENVS } from '@src/utils/constants/envs.enum.ts';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      ENVIRONMENT: `${ENVS}`;
      WEB_URL: string;
    }
  }
}
