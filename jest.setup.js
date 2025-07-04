import 'jest-canvas-mock';
global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

afterAll(() => {
  jest.clearAllMocks()
  jest.resetModules()
})