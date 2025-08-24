export const parseStringIntoObject = (input: string) =>
  Object.fromEntries(
    input.split("\n").map((line: string) => {
      const [key, ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim()];
    })
  );
