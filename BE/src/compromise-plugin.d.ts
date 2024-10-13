import "compromise";

export interface ItalianMethods {
  isConjunction: (word: string) => boolean;
  isAdjective: (word: string) => boolean;
  isVerb: (word: string) => boolean;
  isNoun: (word: string) => boolean;
  isComplement: (word: string) => boolean;
}

declare module "compromise" {
  interface Plugin {
    methods: ItalianMethods;
  }
}
