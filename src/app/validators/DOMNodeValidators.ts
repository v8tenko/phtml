const SINGLE_STRING_COMPONENT = /<.*>.*<\/.*>/;

export const isSingleStringComponent = (string: string): boolean => SINGLE_STRING_COMPONENT.test(string);
