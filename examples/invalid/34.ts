interface JobReader {
  find(id: string): Promise<{ label: string } | undefined>;
}
const reader: JobReader = {
  async find() {
    return { label: 42 };
  },
};
export {};
