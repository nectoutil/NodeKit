/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Merges multiple objects, combining properties.
 * For properties starting with 'on' (conventionally event handlers),
 * it creates a single function that calls all provided handlers.
 * The 'children' property is taken from the last object in the list.
 * For all other properties, the value from later objects overrides
 * the value from earlier objects.
 *
 * @param listOfObjects - An array of objects to merge.
 * @returns A single object with merged properties.
 */
export function mergeProps(...listOfObjects: Array<Record<string, any>>): Record<string, any> {
  if (listOfObjects.length === 0) return {};
  if (listOfObjects.length === 1) {
    return typeof listOfObjects[0] === 'object' && listOfObjects[0] !== null
      ? listOfObjects[0]
      : {};
  }

  const target: Record<string, any> = {};
  const eventHandlers: Record<string, ((...args: any[]) => void)[]> = {};

  for (const obj of listOfObjects) {
    if (typeof obj !== 'object' || obj === null) {
      continue;
    }

    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (prop === 'children') {
          continue;
        }

        const value = obj[prop];

        if (prop.startsWith('on') && typeof value === 'function') {
          eventHandlers[prop] ??= [];
          eventHandlers[prop].push(value);
        } else {
          target[prop] = value;
        }
      }
    }
  }

  for (const eventName in eventHandlers) {
    if (Object.prototype.hasOwnProperty.call(eventHandlers, eventName) && eventHandlers[eventName].length > 0) {
      target[eventName] = (...args: any[]) => {
        for (const handler of eventHandlers[eventName]) {
          handler?.(...args);
        }
      };
    }
  }

  for (let i = listOfObjects.length - 1; i >= 0; i--) {
    const lastObj = listOfObjects[i];
    if (typeof lastObj === 'object' && lastObj !== null && 'children' in lastObj) {
      target['children'] = lastObj.children;
      break;
    }
  }

  return target;
}
