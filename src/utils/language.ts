import { LANGUAGE } from "@/utils/enum";

const defaultLanguage = (): string => {
  return LANGUAGE.ENGLISH;
};

export const locale = defaultLanguage();
