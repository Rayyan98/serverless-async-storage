export class AsyncStoragePlugin {
  serverless: any;
  hooks;

  constructor(serverless: any, options: any) {
    this.serverless = serverless;

    this.hooks = {
      "before:package:createDeploymentArtifacts": this.init.bind(this),
      "before:deploy:function:packageFunction": this.init.bind(this),
      "before:offline:start:init": () => this.init(true),
    };
  }

  init(offline = false) {
    this.serverless.service.getAllFunctions().forEach((functionName: string) => {
      const functionObject = this.serverless.service.getFunction(functionName);

      const originalHandler = functionObject.handler;
      const serverlessPath = this.serverless.config.servicePath;

      functionObject.handler = `serverless-async-storage.asyncStoreWrapper`;
      functionObject.environment = functionObject.environment || {};

      functionObject.environment.SAS_HANDLER = `${offline ? serverlessPath : '/var/task'}/${originalHandler}`;
    })
  }
}
