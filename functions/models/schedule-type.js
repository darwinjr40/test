const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');


class ScheduleType {

    static generateRandom() {
        return {
            id: faker.datatype.uuid(),
            color: faker.lorem.sentence(),
            createdAt: new Date(),
            userId: 'userId',
            isActive: false,
            isEditable: false,
            isSystemDefault: false,
            name: faker.person.fullName(),
            startTime: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            endTime: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        };
    }

}

module.exports = ScheduleType;
