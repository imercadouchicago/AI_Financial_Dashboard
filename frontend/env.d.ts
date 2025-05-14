declare namespace NodeJS {
    interface ProcessEnv {
      MYSQL_DATABASE: string;
      MYSQL_ROOT_PASSWORD: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      JWT_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
    }
  }