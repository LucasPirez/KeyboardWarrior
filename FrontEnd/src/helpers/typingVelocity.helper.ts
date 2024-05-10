import { cpmWpm } from '../constants';

interface Params {
  typeText: cpmWpm;
  MilliSeconds: number;
  text: string;
}

export const typingVelocityHelper = ({
  typeText,
  MilliSeconds,
  text,
}: Params): { velocity: string; roundVelocity: string } => {
  const result = {
    velocity: '',
    roundVelocity: '',
  };
  if (typeText === cpmWpm.wpm) {
    const words = text.split(/\s+/).length;
    const wpm = words / (MilliSeconds / 60000);

    result.velocity = wpm.toFixed(2);
    result.roundVelocity = '' + Math.round(wpm);
  } else {
    const chars = text.replace(/\s+/g, ' ').replace('\n', '').length;

    const cpm = chars / (MilliSeconds / 60000);
    result.velocity = cpm.toFixed(2);
    result.roundVelocity = '' + Math.round(cpm);

    console.log(cpm);
  }

  return result;
};
