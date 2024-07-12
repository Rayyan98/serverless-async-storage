const mockHandlerMock = jest.fn();

jest.mock('./mock-handler', () => ({
  mockHandler: mockHandlerMock,
}));

import { getFromStore, setInStore } from "../../src";
import { asyncStoreWrapper } from "../../src/lib/async-store-wrapper";

describe("asyncStoreWrapper", () => {
  const mockHandlerFilePath = require.resolve('./mock-handler');
  const mockHandler = `${mockHandlerFilePath}.mockHandler`
  process.env.SAS_HANDLER = mockHandler;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the handler function with the provided arguments and return its result", async () => {
    mockHandlerMock.mockResolvedValue(42);

    const args = [1, "test", { key: "value" }];

    const resp = await asyncStoreWrapper(...args);

    expect(mockHandlerMock).toHaveBeenCalledWith(...args);
    expect(resp).toBe(42);
  });

  it('the mock handler should be able to get and set from the store', async () => {
    const key = 'testKey';
    const value = 'testValue';

    mockHandlerMock.mockImplementation(() => {
      setInStore(key, value);

      return getFromStore(key);
    });

    const args = [1, "test", { key: "value" }];

    const resp = await asyncStoreWrapper(...args);

    expect(mockHandlerMock).toHaveBeenCalledWith(...args);
    expect(resp).toBe(value);
  });
});
