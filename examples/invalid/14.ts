type Expect<T extends true> = T;
type IsString<T> = T extends string ? true : false;
type Wrong = Expect<IsString<number>>;
export {};
