declare namespace NodeJS {
  interface ProcessEnv {
    MYSQL_PASSWORD: string;
    MYSQL_HOST: string;
    SERVER_PORT: string;
    MYSQL_USER: string;
  }
}
