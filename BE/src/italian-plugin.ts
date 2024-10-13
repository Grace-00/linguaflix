const italianPlugin = {
  methods: {
    isNoun: (word: string) => {
      const nounEndings = /(o|a|e|i|ione|tà|ità|mento|aggio|zione)$/; // Common noun endings
      return nounEndings.test(word);
    },

    isVerb: (word: string) => {
      const verbEndings =
        /(are|ere|ire|ato|uto|ito|ando|endo|isco|erò|irò|erà|irà|ai|i|ò)$/; // Verb endings and past participle forms
      return verbEndings.test(word);
    },

    isAdjective: (word: string) => {
      const adjEndings = /(o|a|i|e)$/;
      return adjEndings.test(word);
    },

    isConjunction: (word: string) => {
      const italianConjunctions = [
        "e",
        "ma",
        "o",
        "perché",
        "che",
        "se",
        "anche",
        "oppure",
        "dunque",
        "poiché",
        "quindi",
        "appena",
      ];
      return italianConjunctions.includes(word.toLowerCase()); // Case-insensitive comparison
    },

    isComplement: (word: string) => {
      const complementEndings =
        /(o|a|e|i|ione|tà|ità|mento|aggio|zione|mi|ti|ci|vi|lo|la|li|le)$/;
      return complementEndings.test(word);
    },
  },
};

export default italianPlugin;
