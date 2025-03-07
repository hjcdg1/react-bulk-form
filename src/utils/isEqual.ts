export function isEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1).filter(
    (key) => (obj1 as Record<string, unknown>)[key] !== undefined
  );
  const keys2 = Object.keys(obj2).filter(
    (key) => (obj2 as Record<string, unknown>)[key] !== undefined
  );

  if (keys1.length !== keys2.length) {
    return false;
  }
  return keys1.every((key) => {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
    return isEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key]);
  });
}
