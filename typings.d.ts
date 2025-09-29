export type Fixture = {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  aggregate_id: number | null;
  state_id: number;
  round_id: number | null;
  venue_id: number | null;
  name: string | null;
  starting_at: string | null;
  result_info: string | null;
  leg: string;
  details: string | null;
  length: number | null;
  placeholder: boolean;
  has_odds: boolean;
  starting_at_timestamp: number;
  participants: Participant[];
  league: League;
  round: Round;
  group: Group;
  scores: Score[];
  periods: Period[];
  statistics: Statistic[];
  events: Event[];
  lineups: Player[];
  formations: Formation[];
  metadata: Metadata[];
};

export type Participant = {
  id: number;
  sport_id: number;
  country_id: number;
  venue_id: number;
  gender: string;
  name: string;
  short_code: string | null;
  image_path: string;
  founded: number;
  type: string;
  placeholder: boolean;
  last_played_at: string;
  meta: {
    location: string;
    winner: boolean;
    position: number;
  };
};

export type League = {
  active: boolean;
  category: number;
  country_id: number;
  has_jerseys: boolean;
  id: number;
  image_path: string;
  last_played_at: string;
  name: string;
  short_code: string;
  sport_id: number;
  sub_type: string;
  type: string;
};

export type Group = {
  ending_at: string;
  finished: boolean;
  games_in_current_week: boolean;
  id: number;
  is_current: boolean;
  league_id: number;
  name: string;
  pending: boolean;
  season_id: number;
  sport_id: number;
  stage_id: number;
  starting_at: string;
};

export type Round = {
  ending_at: string;
  finished: boolean;
  games_in_current_week: boolean;
  id: number;
  is_current: boolean;
  league_id: number;
  name: string;
  season_id: number;
  sport_id: number;
  stage_id: number;
  starting_at: string;
};

export type Score = {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  score: {
    goals: number;
    participant: string;
  };
  description: string;
};

export type Period = {
  id: number;
  fixture_id: number;
  type_id: number;
  started: number;
  ended: number;
  counts_from: number;
  ticking: boolean;
  sort_order: number;
  description: string;
  time_added: number | null;
  period_length: number;
  minutes: number | null;
  seconds: number | null;
};

export type Statistic = {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  data: {
    value: number;
  };
  location: string;
};

export type Event = {
  id: number;
  fixture_id: number;
  period_id: number;
  participant_id: number;
  type_id: number;
  section: string;
  player_id: number;
  related_player_id: number;
  player_name: string;
  related_player_name: string;
  result: string | null;
  info: string | null;
  addition: string | null;
  minute: number;
  extra_minute: number | null;
  injured: boolean;
  on_bench: boolean;
  coach_id: number | null;
  sub_type_id: number | null;
};

export type Player = {
  id: number;
  sport_id: number;
  fixture_id: number;
  player_id: number;
  team_id: number;
  position_id: number;
  formation_field: string | null;
  type_id: number;
  formation_position: number;
  player_name: string;
  jersey_number: number;
};

export type Formation = {
  id: number;
  fixture_id: number;
  participant_id: number;
  formation: string;
  location: string;
};

export type Metadata = {
  id: number;
  metadatable_id: number;
  type_id: number;
  value_type: string;
  values: any;
};

export type Standing = {
  id: number;
  participant_id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  round_id: number | null;
  standing_rule_id: number;
  position: number;
  result: string;
  points: number;
  group: Group | null;
  details: Detail[];
  participant: Participant;
  rule: Rule | null;
};

export type Group = {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  name: string;
  starting_at: string;
  ending_at: string;
  games_in_current_week: boolean;
  is_current: boolean;
  finished: boolean;
  pending: boolean;
};

export type Detail = {
  id: number;
  standing_type: string;
  standing_id: number;
  type_id: number;
  value: number;
};

export type Rule = {
  id: number;
  model_type: string;
  model_id: number;
  type_id: number;
  position: number;
};

export type FixtureTable = {
  id: number;
  name: string;
  standings: Standing[];
}