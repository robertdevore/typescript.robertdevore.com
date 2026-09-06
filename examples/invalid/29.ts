interface Repository {
  find(id: string): Promise<string | undefined>;
}
const repository: Repository = {
  async find() {
    return 42;
  },
};
export {};
