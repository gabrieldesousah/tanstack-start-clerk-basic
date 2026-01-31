import {
  doublePrecision,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const captions = pgTable(
  "captions",
  {
    id: serial().primaryKey(),
    videoId: text("video_id").notNull(),
    start: doublePrecision("start").notNull(),
    dur: doublePrecision("dur").notNull(),
    text: text("text").notNull(),
  },
  (table) => [index("video_start_idx").on(table.videoId, table.start)],
);

export const videos = pgTable(
  "videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    externalId: text("external_id").notNull(),
    description: text("description").notNull(),
    thumbnails: jsonb("thumbnails").notNull(),
    publishedAt: timestamp("published_at"),
    duration: doublePrecision("duration").notNull(),
    viewCount: text("view_count").notNull(),
    tags: text("tags").array(),
    channel: jsonb("channel"),
    phrasalVerbs: text("phrasal_verbs").array(),
    idioms: text("idioms").array(),
    level: text("level"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      externalIdIndex: index("external_id_idx").on(table.externalId),
    };
  },
);

export const words = pgTable("words", {
  id: uuid("id").defaultRandom().primaryKey(),
  en: jsonb("en"),
  pt: jsonb("pt"),
  es: jsonb("es"),
  level: text("level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userLearningWords = pgTable(
  "user_learning_words",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    wordId: uuid("word_id").notNull(),
    difficultyRate: jsonb("difficulty_rate"),
    nextReviewAt: timestamp("next_review_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdWordIdIndex: index("user_word_idx").on(table.userId, table.wordId),
    };
  },
);

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    whatsappPhone: text("whatsapp_phone"),
    whatsappLastSentAt: timestamp("whatsapp_last_sent_at"),
    whatsappLastReceivedAt: timestamp("whatsapp_last_received_at"),
    languageLevel: text("language_level"),
    active: text("active").default("true"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      clerkUserIdIndex: index("clerk_user_id_idx").on(table.clerkUserId),
      whatsappPhoneIndex: index("whatsapp_phone_idx").on(table.whatsappPhone),
    };
  },
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    uid: text("uid"),
    type: text("type").notNull(),
    activeMessageType: text("active_message_type"),
    accountChannelUid: text("account_channel_uid").notNull(),
    direction: text("direction").notNull(),
    contactUid: text("contact_uid").notNull(),
    context: jsonb("context"),
    components: jsonb("components"),
    interactive: jsonb("interactive"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      contactUidIndex: index("contact_uid_idx").on(table.contactUid),
      directionIndex: index("direction_idx").on(table.direction),
    };
  },
);

export const whatsappTemplates = pgTable("whatsapp_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull(),
  components: jsonb("components"),
  variables: text("variables").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
