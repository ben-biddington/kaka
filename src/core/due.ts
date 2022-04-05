import { formatDuration, intervalToDuration } from "date-fns";

export const dueIn = (now: Date, when: Date) => {
  return formatDuration(
    intervalToDuration({
      start: now,
      end: when,
    })
  );
};
