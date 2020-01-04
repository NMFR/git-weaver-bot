console.error('Not implemented yet!');

class TestClass {
  integer: number;

  string: string;
}

function testFunc(str: string): string {
  const x = new TestClass();
  x.integer = 2;
  return `test:${str} ${x?.integer} ${x?.string ?? 'it was null'}`;
}

console.log(testFunc('hello world'));
