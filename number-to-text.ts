const onesArray = [
  ["", "", ""],
  ["yksi", "ensimmäinen", "ensimmäistä"],
  ["kaksi", "toinen", "toista"],
  ["kolme", "kolmas", "kolmatta"],
  ["neljä", "neljäs", "neljättä"],
  ["viisi", "viides", "viidettä"],
  ["kuusi", "kuudes", "kuudetta"],
  ["seitsemän", "seitsemäs", "seitsemännettä"],
  ["kahdeksan", "kahdeksas", "kahdeksennatta"],
  ["yhdeksän", "yhdeksäs", "yhdeksättä"],
];

export const convertNumber = (value: string, variation: Variation): string => {
  return onesArray[Number(value)][variation];
};

export enum Variation {
  Number,
  Order,
}

type ConverterOptions = {
  result: string[][];
  previousValue: string;
  variation: Variation;
};

const literals = [
  [
    ["kymmenen", "kymmentä"],
    ["kymmenes", "kymmenes"],
  ],
  [["sata", "sataa"], ["sadas"]],
  [["tuhat", "tuhatta"], ["tuhannes"]],
  [["miljoona"], ["miljoonas"]],
  [["miljardi"], ["miljardis"]],
  [["biljoona"], ["biljoonas"]],
];

// In scope converters
const ones = (input: string, options: ConverterOptions) => {
  options.result.push([input, ""]);
};

const tens = (input: string, options: ConverterOptions) => {
  if (onesArray[1].includes(input)) {
    const [a, b] = options.result.pop() || [];
    if (a === "") {
      return options.result.push([literals[0][options.variation][0]]);
    }
    return options.result.push([`${a}toista`, b]);
  }
  return options.result.push([input, literals[0][options.variation][1]]);
};

const hundreds = (input: string, options: ConverterOptions) => {
  if (input === "") {
    return;
  }
  options.result.push(
    onesArray[1].includes(input)
      ? ["", literals[1][options.variation][0]]
      : [input, literals[1][options.variation][1]],
  );
};

const isFirst = (input: string[][]) =>
  input.length === 1 && onesArray[1].includes(input[0][0]);

const inScopeConverters = [ones, tens, hundreds];

const chunk = (array: string[]): string[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += 3) {
    chunks.push(array.slice(i, i + 3));
  }
  return chunks;
};

export const numberToText = (numberString: string): string => {
  const [actual, emptyString] = numberString.split(".");
  // Resolve variation
  const variation = emptyString === "" ? Variation.Order : Variation.Number;

  const numbers = actual.split("").reverse();
  const chunks = chunk(numbers);

  const result: any = [];

  for (let scope = 0; scope < chunks.length; scope++) {
    const inScopeResult: string[][] = [];

    for (let i = 0; i < chunks[scope].length; i++) {
      const convertMethod = inScopeConverters[i];

      const convertedNumber = convertNumber(chunks[scope][i], variation);

      convertMethod(convertedNumber, {
        result: inScopeResult,
        previousValue: chunks[scope][i - 1],
        variation: variation || Variation.Number,
      });
    }

    inScopeResult.reverse();

    if (scope > 0) {
      let suffix = literals[scope + 1][variation][1];
      if (isFirst(inScopeResult)) {
        suffix = literals[scope + 1][variation][0];
        inScopeResult.pop();
      }
      result.push([...inScopeResult, suffix]);
    } else {
      result.push([...inScopeResult]);
    }
  }

  return result.reverse().flat().flat().join("");
};
