console.error('Not implemented yet!');

class TestClass {
  integer: number;
}

function testFunc(str: string): string {
  const x = new TestClass();
  x.integer = 2;
  return `test:${str} ${x.integer}`;
}

console.log(testFunc('hello world'));
