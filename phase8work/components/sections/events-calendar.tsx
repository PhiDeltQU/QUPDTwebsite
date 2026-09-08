'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventItem } from '@/types';
import { Container } from '@/components/layout/container';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CalendarEvent = EventItem & { dateObj: Date };

function parseEventDate(event: EventItem): CalendarEvent | null {
  const dateObj = new Date(event.date);
  if (Number.isNaN(dateObj.getTime())) return null;
  return { ...event, dateObj };
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function EventsCalendar({ events }: { events: EventItem[] }) {
  const calendarEvents = useMemo(
    () => events.map(parseEventDate).filter((event): event is CalendarEvent => event !== null),
    [events]
  );

  const undated = events.length - calendarEvents.length;

  const initialMonth = useMemo(() => {
    const today = new Date();
    const upcoming = calendarEvents
      .filter((event) => event.dateObj >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];
    return upcoming ? new Date(upcoming.dateObj.getFullYear(), upcoming.dateObj.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1);
  }, [calendarEvents]);

  const [visibleMonth, setVisibleMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();

  const selectedDayEvents = selectedDate
    ? calendarEvents.filter((event) => sameDay(event.dateObj, selectedDate))
    : [];

  const weeks = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(visibleMonth);

  return (
    <Container>
      <div className="surface p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-serif">{monthLabel}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => {
                setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1));
                setSelectedDate(null);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-fraternity-charcoal transition hover:bg-fraternity-cream"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelectedDate(null);
              }}
              className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-fraternity-azure transition hover:bg-fraternity-cream"
            >
              Today
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => {
                setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));
                setSelectedDate(null);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-fraternity-charcoal transition hover:bg-fraternity-cream"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.1em] text-fraternity-slate sm:gap-2">
          {WEEKDAY_LABELS.map((label, index) => (
            <div key={`${label}-${index}`} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weeks.flatMap((week, weekIndex) =>
            week.map((date, dayIndex) => {
              const dayEvents = date
                ? calendarEvents.filter((event) => sameDay(event.dateObj, date))
                : [];
              const isToday = date ? sameDay(date, today) : false;
              const isSelected = date && selectedDate ? sameDay(date, selectedDate) : false;
              const hasEvents = dayEvents.length > 0;

              const cellClassName = `min-h-[4.5rem] rounded-xl border p-1.5 text-left sm:min-h-[6rem] sm:p-2 ${
                date ? 'border-black/5 bg-white' : 'border-transparent bg-transparent'
              } ${isSelected ? 'ring-2 ring-fraternity-azure' : ''}`;

              const cellContent = date ? (
                <>
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday ? 'bg-fraternity-azure text-white' : 'text-fraternity-charcoal'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {/* Mobile: dots only, tap the day to see names below. Desktop cells are wide enough for titles. */}
                  <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                    {dayEvents.map((event) => (
                      <span key={event.slug} className="h-1.5 w-1.5 rounded-full bg-fraternity-azure" />
                    ))}
                  </div>

                  <div className="mt-1 hidden space-y-1 sm:block">
                    {dayEvents.map((event) => (
                      <Link
                        key={event.slug}
                        href={`/events/${event.slug}`}
                        className="block truncate rounded-md bg-fraternity-azure/10 px-1.5 py-1 text-xs font-semibold leading-tight text-fraternity-azureDeep transition hover:bg-fraternity-azure/20"
                        title={event.title}
                      >
                        {event.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;

              if (hasEvents) {
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    type="button"
                    onClick={() => setSelectedDate(isSelected ? null : (date as Date))}
                    className={cellClassName}
                  >
                    {cellContent}
                  </button>
                );
              }

              return (
                <div key={`${weekIndex}-${dayIndex}`} className={cellClassName}>
                  {cellContent}
                </div>
              );
            })
          )}
        </div>

        {selectedDayEvents.length > 0 ? (
          <div className="mt-4 rounded-xl border border-fraternity-azure/20 bg-fraternity-azure/5 p-4 sm:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-fraternity-azure">
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDate as Date)}
            </p>
            <ul className="mt-2 space-y-2">
              {selectedDayEvents.map((event) => (
                <li key={event.slug}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="text-sm font-semibold text-fraternity-azureDeep underline underline-offset-2"
                  >
                    {event.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {calendarEvents.length === 0 ? (
          <p className="mt-6 text-sm text-fraternity-slate">
            No events are scheduled yet. New dates will appear on the calendar as soon as they're announced.
          </p>
        ) : null}
        {undated > 0 ? (
          <p className="mt-6 text-sm text-fraternity-slate">
            {undated} additional {undated === 1 ? 'event has' : 'events have'} a date still to be confirmed and will appear once scheduled.
          </p>
        ) : null}
      </div>
    </Container>
  );
}
