export default class Pattern {
  private id: string;

  private name: string;

  private sentence: string;

  constructor(id: string, name: string, sentence: string) {
    this.id = id;
    this.name = name;
    this.sentence = sentence;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getSentence(): string {
    return this.sentence;
  }

  setSentence(sentence: string): void {
    this.sentence = sentence;
  }
}
