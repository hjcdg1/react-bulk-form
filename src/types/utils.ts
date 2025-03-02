export type ShallowPartial<T> = {
  [P in keyof T]?: T[P];
};
