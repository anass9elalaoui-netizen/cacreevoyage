import * as migration_20261026_162302_baseline from './20261026_162302_baseline';
import * as migration_20261026_162739_testimonials_poster_trip_year from './20261026_162739_testimonials_poster_trip_year';

export const migrations = [
  {
    up: migration_20261026_162302_baseline.up,
    down: migration_20261026_162302_baseline.down,
    name: '20261026_162302_baseline',
  },
  {
    up: migration_20261026_162739_testimonials_poster_trip_year.up,
    down: migration_20261026_162739_testimonials_poster_trip_year.down,
    name: '20261026_162739_testimonials_poster_trip_year'
  },
];
