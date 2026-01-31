// Email templates for custom notifications
// Note: Authentication emails (password reset, verification) are handled by Clerk

export const emailConfig = {
  from: "eoc@poli.digital",
  siteName: "EOC",
};

export const emailTemplates = {
  welcomeEmail: {
    subject: (name: string) => `Welcome to EOC, ${name}!`,
    text: (name: string) =>
      `Hello ${name},\n\nWelcome to English Of Course! We're excited to have you on board.\n\nStart learning today!`,
    html: (name: string) => `
      <p>Hello ${name},</p>
      <p>Welcome to English Of Course! We're excited to have you on board.</p>
      <p>Start learning today!</p>
    `,
  },

  dailyReminder: {
    subject: (name: string) => `${name}, time to practice!`,
    text: (name: string, wordsToReview: number) =>
      `Hello ${name},\n\nYou have ${wordsToReview} words waiting for review.\n\nKeep up the great work!`,
    html: (name: string, wordsToReview: number) => `
      <p>Hello ${name},</p>
      <p>You have <strong>${wordsToReview}</strong> words waiting for review.</p>
      <p>Keep up the great work!</p>
    `,
  },

  weeklyProgress: {
    subject: (name: string) => `Your weekly progress, ${name}`,
    text: (
      name: string,
      stats: { wordsLearned: number; reviewsCompleted: number },
    ) =>
      `Hello ${name},\n\nThis week you learned ${stats.wordsLearned} new words and completed ${stats.reviewsCompleted} reviews.\n\nKeep it up!`,
    html: (
      name: string,
      stats: { wordsLearned: number; reviewsCompleted: number },
    ) => `
      <p>Hello ${name},</p>
      <p>This week you learned <strong>${stats.wordsLearned}</strong> new words and completed <strong>${stats.reviewsCompleted}</strong> reviews.</p>
      <p>Keep it up!</p>
    `,
  },
};
