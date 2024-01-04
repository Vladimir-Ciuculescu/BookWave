export interface MapRangeOptions {
  inputValue: number;
  outputMin: number;
  outputMax: number;
  inputMax: number;
  inputMin: number;
}

export const mapRange = (options: MapRangeOptions) => {
  const { inputValue, outputMax, outputMin, inputMax, inputMin } = options;

  const result =
    ((inputValue - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;

  if (result === Infinity) return 0;

  return result;
};

export const formatToClock = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
