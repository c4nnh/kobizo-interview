export function getArguments() {
  const argv = process.argv.slice(2);

  return argv
    .map((item) => item.split("="))
    .reduce(
      (initial, [key, value]) => {
        if (!key) {
          return initial;
        }

        return { ...initial, [key]: value ?? "" };
      },
      {} as Record<string, string>,
    );
}
