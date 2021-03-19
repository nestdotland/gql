interface ComplexityInput {
  field: {
    name: string;
  };
  args: {
    first?: number | null;
    last?: number | null;
  };
  childComplexity: number;
}

function complexity({ field, args, childComplexity }: ComplexityInput) {
  if (args.first == null && args.last == null) {
    throw new Error(`You must specify "first" or "last" values in an array. (${field.name})`);
  }
  const first = args.first ?? 0;
  const last = args.last ?? 0;
  return (first + last) * childComplexity;
}

export const modelOptions = {
  pagination: true,
  ordering: true,
  filtering: true,
  complexity,
};
