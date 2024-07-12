import { AsyncStoragePlugin } from "../../src/lib/async-store-plugin";

describe('AsyncStoragePlugin', () => {
  let serverless: any;
  let options: any;
  let plugin: AsyncStoragePlugin;

  beforeEach(() => {
    const functionsInfo = {
      function1: {
        handler: 'path/to/handlerFile.handler',
        environment: {
          ENV_VAR: 'value',
        },
      },
      function2: {
        handler: 'path/to/handlerFile.handler2',
        environment: {
          ENV_VAR: 'value2',
        },
      },
    };

    serverless = {
      service: {
        getAllFunctions: jest.fn().mockReturnValue(['function1', 'function2']),
        getFunction: jest.fn().mockImplementation((functionName: never) => {
          return functionsInfo[functionName];
        }),
        custom: {
          'serverless-async-storage': {
            enabled: true,
          },
        },
      },
      config: {
        servicePath: '/path/to/service',
      },
    };
    options = {};
    plugin = new AsyncStoragePlugin(serverless, options);
  });

  describe('constructor', () => {
    it('should set the serverless property', () => {
      expect(plugin.serverless).toBe(serverless);
    });

    it('should set the hooks property', () => {
      expect(plugin.hooks).toEqual({
        'before:package:createDeploymentArtifacts': expect.any(Function),
        'before:deploy:function:packageFunction': expect.any(Function),
        'before:offline:start:init': expect.any(Function),
      });
    });
  });

  describe('init', () => {
    it('should update the function handlers and environment variables', () => {
      plugin.init();

      expect(serverless.service.getFunction('function1').handler).toBe('serverless-async-storage.asyncStoreWrapper');
      expect(serverless.service.getFunction('function2').handler).toBe('serverless-async-storage.asyncStoreWrapper');

      expect(serverless.service.getFunction('function1').environment.SAS_HANDLER).toBe('/var/task/path/to/handlerFile.handler');
      expect(serverless.service.getFunction('function2').environment.SAS_HANDLER).toBe('/var/task/path/to/handlerFile.handler2');
    });

    it('should not update the function handlers and environment variables if plugin is not enabled', () => {
      serverless.service.custom['serverless-async-storage'].enabled = false;

      plugin.init();

      expect(serverless.service.getFunction('function1').handler).toBe('path/to/handlerFile.handler');
      expect(serverless.service.getFunction('function2').handler).toBe('path/to/handlerFile.handler2');

      expect(serverless.service.getFunction('function1').environment.SAS_HANDLER).toBeUndefined();
      expect(serverless.service.getFunction('function2').environment.SAS_HANDLER).toBeUndefined();
    });

    it('should update the function handlers and environment variables for offline mode', () => {
      plugin.init(true);

      expect(serverless.service.getAllFunctions).toHaveBeenCalled();
      expect(serverless.service.getFunction).toHaveBeenCalledTimes(2);

      // Assert the modifications made to each function object
      expect(serverless.service.getFunction).toHaveBeenCalledWith('function1');
      expect(serverless.service.getFunction).toHaveBeenCalledWith('function2');
      // Add more assertions here based on your specific requirements

      // Assert the environment variable modifications
      expect(serverless.service.getFunction('function1').environment.SAS_HANDLER).toBe('/path/to/service/path/to/handlerFile.handler');
      expect(serverless.service.getFunction('function2').environment.SAS_HANDLER).toBe('/path/to/service/path/to/handlerFile.handler2');
      // Add more assertions here based on your specific requirements
    });
  });
});