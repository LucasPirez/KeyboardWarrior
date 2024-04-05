import { RoomType } from '../../type';
import {
  COLORS_SHOW_VALUES,
  LANGUAGES,
  cpmWpm,
} from '../../constants';
import ShowValues from './ShowValues';
import { percentageErrorsHelper } from '../../helpers';
import { typingVelocityHelper } from '../../helpers';

interface Props {
  language: RoomType['RoomType'];
  text: string;
  errors: number;
  timeMilliseconds: number;
}

export function ShowResult({
  language,
  text,
  errors,
  timeMilliseconds,
}: Props) {
  const textLength = text.length;
  const typeText =
    language === LANGUAGES.NORMAL_TEXT ? cpmWpm.wpm : cpmWpm.cpm;

  const { roundPercentage } = percentageErrorsHelper({
    errors,
    textLength,
  });

  const { roundVelocity } = typingVelocityHelper({
    MilliSeconds: timeMilliseconds,
    text,
    typeText,
  });

  return (
    <section>
      <ShowValues
        valueName={typeText === cpmWpm.cpm ? 'CPM' : 'WPM'}
        value={roundVelocity}
        color={COLORS_SHOW_VALUES.GOOD_VALUE}
      />
      <ShowValues
        valueName="Perc."
        value={roundPercentage}
        color={COLORS_SHOW_VALUES.GOOD_VALUE}
      />
      <ShowValues
        valueName="Errors"
        value={errors.toString()}
        color={COLORS_SHOW_VALUES.BAD_VALUE}
      />
    </section>
  );
}
