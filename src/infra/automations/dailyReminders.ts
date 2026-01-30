import { SyncedCron } from 'meteor/quave:synced-cron';

import { discoveryWordsFromAllUsers } from '/imports/infra/automations/discoveryWordsFromAllUsers';
import { findTasksFromAllUsers } from '/imports/infra/automations/findTasksFromAllUsers';

SyncedCron.add({
	name: 'Find for tasks from all users',
	schedule: function (parser: any) {
		return parser.text('every 6 hours');
		// return parser.cron('0 0 8,12,19 * * *');
	},
	job: async function () {
		await findTasksFromAllUsers();
	},
});

SyncedCron.add({
	name: 'Discovery words for all users',
	schedule: function (parser: any) {
		return parser.text('every 4 hours');
		// return parser.cron('0 0 8,12,19 * * *');
	},
	job: async function () {
		await discoveryWordsFromAllUsers();
	},
});

SyncedCron.start();
