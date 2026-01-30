import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

export async function checkAdminPermissions() {
	await checkLoggedInUser();

	if (await hasAccess({ user: Meteor.user(), role: 'admin' })) {
		return;
	}

	throw new Meteor.Error('unauthorized', 'Unauthorized');
}

export async function checkLoggedInUser() {
	const user = await Meteor.userAsync();
	if (!user) {
		throw new Meteor.Error('unauthorized', 'You must be logged in');
	}
}

export async function hasAccess({
	user,
	role,
	scope,
}: {
	user: any;
	role: string;
	scope?: string;
}) {
	if (!user) {
		return false;
	}

	return Roles.userIsInRole(user._id, role, scope);
}
