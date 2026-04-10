export const enumToOptions = (enumObj: Record<string, string>) => {
  return Object.values(enumObj).map((value) => ({
    value,
    label: value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
};