import moment from "moment";
moment.locale("pt-br");

const BASE_TIMESTAMP_FORMATS = [moment.ISO_8601, "DD/MM/YYYY"];
const CALENDAR_FORMATS = {
  sameDay: "[Hoje às] LT",
  nextDay: "[Amanhã às] LT",
  nextWeek: "L",
  lastDay: "[Ontem às] LT",
  lastWeek: "L",
  sameElse: "L",
};

const parseTimestamp = (value: string) => {
  const normalized = value.trim();
  const baseTimestamp = moment(normalized, BASE_TIMESTAMP_FORMATS, true);
  if (baseTimestamp.isValid()) {
    return baseTimestamp;
  }

  const todayTimestamp = moment(normalized, "[Hoje às] LT", "pt-br", true);
  if (todayTimestamp.isValid()) {
    return todayTimestamp;
  }

  const yesterdayTimestamp = moment(normalized, "[Ontem às] LT", "pt-br", true);
  if (yesterdayTimestamp.isValid()) {
    return yesterdayTimestamp.subtract(1, "day");
  }

  return null;
};

export const createTimestamp = () => moment().toISOString();

export const coerceStoredTimestamp = (value?: string | null) => {
  if (typeof value !== "string" || !value.trim()) {
    return createTimestamp();
  }

  const parsed = parseTimestamp(value);
  return parsed ? parsed.toISOString() : value.trim();
};

export const formatRelativeTimestamp = (value: string) => {
  const parsed = parseTimestamp(value);
  if (!parsed) {
    return value;
  }

  const now = moment();
  const shouldUseCalendar =
    parsed.isSame(now, "day") ||
    parsed.isSame(now.clone().subtract(1, "day"), "day");

  return shouldUseCalendar
    ? parsed.calendar(now, CALENDAR_FORMATS)
    : parsed.fromNow();
};
