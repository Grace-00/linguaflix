import * as fs from "fs";
import nlp from "compromise";
import natural from "natural";
import SrtParser from "srt-parser-2";
import path from "path";
import { fileURLToPath } from "url";

// Helper to get the directory name in ES module context
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Helper to resolve the absolute path
const getFilePath = (relativePath: string): string => {
  return path.resolve(__dirname, relativePath);
};

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

// Function to determine if a sentence is simple enough for a beginner level
const isBeginnerLevelSentence = (sentence: string): boolean => {
  const wordTokenizer = new natural.WordTokenizer();
  const words = wordTokenizer.tokenize(sentence);

  const maxLength = 8; // Max words for a beginner sentence
  const maxComplexWords = 2; // Max complex words allowed

  // Check sentence length and complexity
  if (words.length > maxLength) return false;

  // Check for complex words
  const complexWordCount = words.filter((word) => word.length > 6).length;
  if (complexWordCount > maxComplexWords) return false;

  // Check for nouns, verbs, and complements
  const sentenceDoc = nlp(sentence);
  const nouns = sentenceDoc.nouns().out("array");
  const verbs = sentenceDoc.verbs().out("array");
  const complements = sentenceDoc
    .adjectives()
    .out("array")
    .concat(sentenceDoc.adverbs().out("array"));

  return nouns.length > 0 && verbs.length > 0 && complements.length > 0;
};

const cleanSubtitle = (subtitleLines: string[]): string => {
  // Step 1: Remove sound effects in square brackets, HTML tags, and unwanted phrases
  let cleanedSubtitles = subtitleLines.map((line) => {
    return line
      .replace(/\[.*?\]/g, "") // Remove [anything] (like sound effects or character names)
      .replace(/<.*?>/g, "") // Remove <anything> (like HTML tags)
      .replace(/^- /g, "") // Remove hyphens that indicate dialogue breaks
      .trim(); // Trim leading/trailing spaces
  });

  // Step 2: Remove lines containing unwanted phrases like "Synced and corrected by", "for www.addic7ed.com", and "Previously on"
  cleanedSubtitles = cleanedSubtitles.filter((line) => {
    return (
      !line.toLowerCase().includes("synced and corrected by") &&
      !line.toLowerCase().includes("for www.addic7ed.com") &&
      !/^previously on/i.test(line) && // Remove lines starting with "Previously on"
      line.trim() !== ""
    ); // Remove empty lines
  });

  // Step 3: Merge lines where the next line doesn’t start with a capital letter
  const mergedSubtitles: string[] = [];
  cleanedSubtitles.forEach((line, index) => {
    if (index > 0 && /^[a-z]/.test(line)) {
      // If the current line starts with a lowercase letter, append it to the previous one
      mergedSubtitles[mergedSubtitles.length - 1] += ` ${line.trim()}`;
    } else {
      mergedSubtitles.push(line.trim());
    }
  });

  // Step 4: Join all cleaned and merged lines into a single paragraph
  return mergedSubtitles.join(" ").replace(/\s+/g, " "); // Replace multiple spaces with a single space
};

// Helper function to read the SRT file
const readSrtFile = (filePath: string): string => {
  const absoluteFilePath = getFilePath(filePath);
  return fs.readFileSync(absoluteFilePath, "utf8");
};

// Helper function to parse the SRT content
const parseSrtData = (fileContent: string): Array<{ text: string }> => {
  const parser = new SrtParser();
  return parser.fromSrt(fileContent);
};

// Helper function to clean subtitle text
const cleanSubtitleText = (srtData: Array<{ text: string }>): string => {
  const subtitleText = srtData.map((entry) => entry.text);
  return cleanSubtitle(subtitleText);
};

// Helper function to extract sentences from cleaned text
const extractSentences = (cleanedText: string): string[] => {
  const doc = nlp(cleanedText);
  return doc.sentences().out("array");
};

// Helper function to filter beginner-level sentences
const filterBeginnerSentences = (sentences: string[]): string[] => {
  return sentences.filter(isBeginnerLevelSentence);
};

// Main function to extract a beginner sentence
//TODO: optimise for proficiency level
export const getBeginnerSentence = async (
  filePath: string
): Promise<string | null> => {
  const fileContent = readSrtFile(filePath);
  const srtData = parseSrtData(fileContent);
  const cleanedSubtitleText = cleanSubtitleText(srtData);
  const sentences = extractSentences(cleanedSubtitleText);
  const beginnerSentences = filterBeginnerSentences(sentences);
  const randomizedSentences = shuffleArray(beginnerSentences);

  // Return the first matching beginner sentence (or null if none found)
  return randomizedSentences.length > 0 ? randomizedSentences[0] : null;
};
