export const percentageErrorsHelper = ({
  errors,
  textLength,
}: {
  errors: number;
  textLength: number;
}): { percentage: string; roundPercentage: string } => {
  const per = 100 - (errors * 100) / textLength;

  return {
    percentage: per.toFixed(2) + '%',
    roundPercentage: Math.round(per) + '%',
  };
};
