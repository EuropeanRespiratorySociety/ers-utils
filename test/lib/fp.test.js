'use strict';

const assert = require('chai').assert;
const fp = require('../../').Fp;


describe('Functional Programming Util', () => {
  it('composes functions', () => {
    const add1 = x => x + 1;
    const mult2 = x => x * 2;

    const composed = fp.compose(add1, mult2);
    assert.isFunction(composed);
    assert.equal(composed(3), 7);
  });

  it('curries functions', () => {
    const add = (a, b) => a + b;
    const addTen = fp.curry(add, 10);
    assert.isFunction(addTen);
    assert.equal(fp.curry(add, 10, 15)(), 25, "The function returns normaly")
    assert.equal(addTen(10), 20);
  });

  it('concats sub arrays to create a flat array', () => {
    const array = [[1, 2], [3, 4], [5, 6]];
    assert.deepEqual(fp.concatAll(array), [1, 2, 3, 4 , 5, 6]);

  });

  it('zips two arrays applying a function on each elements', () => {
    const left = [1,2,3];
    const right = [4,5,6] ;
    assert.deepEqual(fp.zip(left, right, (left, right) => left + right), [5,7,9]);
  });

});