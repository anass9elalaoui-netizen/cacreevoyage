import * as migration_20261026_162302_baseline from './20261026_162302_baseline';
import * as migration_20261026_162739_testimonials_poster_trip_year from './20261026_162739_testimonials_poster_trip_year';
import * as migration_20261103_185406_testimonials_video_light_preview from './20261103_185406_testimonials_video_light_preview';
import * as migration_20261103_230709_testimonials_country_code from './20261103_230709_testimonials_country_code';
import * as migration_20261104_020710_tour_day_stage from './20261104_020710_tour_day_stage';

export const migrations = [
  {
    up: migration_20261026_162302_baseline.up,
    down: migration_20261026_162302_baseline.down,
    name: '20261026_162302_baseline',
  },
  {
    up: migration_20261026_162739_testimonials_poster_trip_year.up,
    down: migration_20261026_162739_testimonials_poster_trip_year.down,
    name: '20261026_162739_testimonials_poster_trip_year',
  },
  {
    up: migration_20261103_185406_testimonials_video_light_preview.up,
    down: migration_20261103_185406_testimonials_video_light_preview.down,
    name: '20261103_185406_testimonials_video_light_preview',
  },
  {
    up: migration_20261103_230709_testimonials_country_code.up,
    down: migration_20261103_230709_testimonials_country_code.down,
    name: '20261103_230709_testimonials_country_code',
  },
  {
    up: migration_20261104_020710_tour_day_stage.up,
    down: migration_20261104_020710_tour_day_stage.down,
    name: '20261104_020710_tour_day_stage'
  },
];
