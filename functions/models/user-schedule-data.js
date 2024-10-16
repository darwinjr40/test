const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');


class UserScheduleData {

    static generateRandom() {
        return {
            id: faker.datatype.uuid(),
            appUserId: faker.lorem.sentence(),
            createdAt: new Date(),
            date: 'userId',
            startTime: false,
            endTime: false,
            scheduleTypeId: false,
        };
    }

}

module.exports = UserScheduleData;
