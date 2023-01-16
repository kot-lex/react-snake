import React from 'react';
import { hasIntrersection, getTargetPosition } from './helpers';

const smallSnake = [[0, 1], [0, 2]];

test('Should return true in case of intersection', () => {
  const result = hasIntrersection(smallSnake, [0, 1]);
  expect(result).toBeTruthy();
});

test('Should return false in case of no intersection', () => {
    const result = hasIntrersection(smallSnake, [1, 1]);
    expect(result).toBeFalsy();
});


test('Should return point without intersection', () => {
    const result = getTargetPosition([30, 30], smallSnake);
    const isIntersects = hasIntrersection(smallSnake, result);
    expect(isIntersects).toBeFalsy();
})

