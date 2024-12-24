export interface Translation {
  locale: string;
  lang: string;
  lang_eng: string;
  title: string;
  description: string;
}

export interface Round {
  imageUrl: string;
  answerId: string;
  variants: QuizVariant[];
  expiresAt: Date;
  actors: Actor[];
  description: string;
}

export interface Person {
  uid: string;
  name: string;
  profile_path: string;
  gender: 1 | 2;
  acting_movies: Movie[];
  directing: Movie[];
  acting_tv_series: Movie[];
}

export interface Movie {
  uid: string;
  imdb_id: string;
  title: string;
  poster_path: string;
  images: string[];
  genre_ids: string[];
  actors: Person[];
  director: Person;
  translations: Translation[];
}

export type MovieAggregated<Actor> = Pick<Movie, 'title' | 'images'> & {
  translation: Pick<Translation, 'title' | 'description'>;
  actors: Actor[];
};

export type ActorAggregated = Pick<Person, 'profile_path' | 'name'>;

export type Actor = ActorAggregated & { id: string };

export type MovieResultAggregated = Pick<
  Movie,
  'title' | 'poster_path' | 'imdb_id'
> & {
  translation: Pick<Translation, 'title'> | null;
};

export interface QuizVariant {
  id: string;
  title: string;
}

export interface QuizRound {
  roundId: string;
  imageUrl: string;
  variants: QuizVariant[];
}
export interface QuizActorsRound {
  roundId: string;
  actors: Actor[];
  variants: QuizVariant[];
}

export interface QuizRoundAnswer {
  roundId: string;
  variantId?: string;
}

export interface QuizRoundResult {
  roundId: string;
  poster: string;
  title: string;
  isCorrect: boolean;
  imdbUrl: string;
}

export interface UserResult {
  bestScore: number;
}
