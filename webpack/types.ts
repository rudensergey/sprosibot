import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

export enum ENTRY_PATH {
  APP = "./src/index.ts",
}

export enum OUTPUT_PATH {
  APP = "build/",
}

export enum ENV {
  PROD = "production",
  DEV = "development",
}

export interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
