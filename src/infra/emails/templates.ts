import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates = {
	from: 'eoc@poli.digital',
	siteName: 'EOC',
	resetPassword: {
		subject(user) {
			return `${user?.profile?.name}, Reset your password`;
		},
		text(user, url) {
			return `Hello ${user?.profile?.name},\n\nClick the link below to reset your password:\n${url}\n\nIf you did not request this, please ignore this email.`;
		},
		html(user, url) {
			return `<p>Hello ${user?.profile?.name},</p>
              <p>Click the link below to reset your password:</p>
              <p><a href="${url}">Reset Password</a></p>
              <p>If you did not request this, please ignore this email.</p>`;
		},
	},
	enrollAccount: {
		// Add enrollAccount template
	},
	verifyEmail: {
		// Add verifyEmail template
	},
};
