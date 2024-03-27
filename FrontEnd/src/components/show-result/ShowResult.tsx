import { COLORS_SHOW_VALUES, cpmWpm } from '../../constants';
import ShowValues from './ShowValues';

interface Props {
  wpmOrCpm: cpmWpm;
  percentage: string;
  errors: string;
}

export function ShowResult({ wpmOrCpm, percentage, errors }: Props) {
  return (
    <section>
      <ShowValues
        valueName={wpmOrCpm === cpmWpm.cpm ? 'Cpm' : 'Wpm'}
        value="98%"
        color={COLORS_SHOW_VALUES.GOOD_VALUE}
      />
      <ShowValues
        valueName="Perc."
        value="98%"
        color={COLORS_SHOW_VALUES.GOOD_VALUE}
      />
      <ShowValues
        valueName="Errors"
        value="7"
        color={COLORS_SHOW_VALUES.BAD_VALUE}
      />
    </section>
  );
}
