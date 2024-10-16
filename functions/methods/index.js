const { schedulesMigration } = require('./schedules-migration');
const { userAppMigration } = require('./user-app-migration');
const { shiftsMigration } = require('./shifts-migration.');
const { calendarShiftsMigration } = require('./calendar-shifts-migration');
const { friendsMigration } = require('./friends-migrations');
const { statusMigration } = require('./status-migration');
const { saveLog } = require('./log-saved');

module.exports = {
    schedulesMigration,
    userAppMigration,
    shiftsMigration,
    calendarShiftsMigration,
    friendsMigration,
    statusMigration,
    saveLog,
};