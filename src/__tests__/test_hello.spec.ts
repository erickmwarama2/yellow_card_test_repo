import { helloWorld } from '../hello_world';

test("it should return 'Hello world'", () => {
  expect(helloWorld()).toBe('Hello world');
});
