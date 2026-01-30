
import {
  doublePrecision,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core'
 
export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const captions = pgTable(
  'captions',
  {
    id: serial().primaryKey(),
    videoId: text('video_id').notNull(),
    start: doublePrecision('start').notNull(),
    dur: doublePrecision('dur').notNull(),
    text: text('text').notNull(),
  },
  (table) => [
    index('video_start_idx').on(table.videoId, table.start),
  ],
)

export const videos = pgTable(
  'videos',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    externalId: text('external_id').notNull(),
    description: text('description').notNull(),
    thumbnails: jsonb('thumbnails').notNull(),
    publishedAt: timestamp('published_at'),
    duration: doublePrecision('duration').notNull(),
    viewCount: text('view_count').notNull(),
    tags: text('tags').array(),
    channel: jsonb('channel'),
    phrasalVerbs: text('phrasal_verbs').array(),
    idioms: text('idioms').array(),
    level: text('level'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      externalIdIndex: index('external_id_idx').on(table.externalId),
    }
  },
)

export const words = pgTable(
  'words',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    en: jsonb('en'),
    pt: jsonb('pt'),
    es: jsonb('es'),
    level: text('level'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
)

export const userLearningWords = pgTable(
  'user_learning_words',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    wordId: uuid('word_id').notNull(),
    difficultyRate: jsonb('difficulty_rate'),
    nextReviewAt: timestamp('next_review_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdWordIdIndex: index('user_word_idx').on(table.userId, table.wordId),
    }
  },
)
 