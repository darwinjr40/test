const { v4: uuidv4 } = require('uuid');

class AppUser {

  // constructor(appUserId, dayOfWeek, imageUrl, name,) {
  //   this.appUserId = appUserId;
  //   this.dayOfWeek = dayOfWeek;
  //   this.imageUrl = imageUrl;
  //   this.name = name;
  // }
  
  constructor(data) {
    this.uid = data.uid?? uuidv4() ;
    this.dayOfWeek = data.dayOfWeek ?? 7;
    this.imageUrl = data.imageUrl ?? '';
    this.name = data.name ?? '';
    this.schedules = data.schedules ?? [];
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static createAppUser() {
    const number = AppUser.getRandomInt(1, 100); // Cambia el rango según tus necesidades
    let appUser = new AppUser(
      `${number} name`,
      number % 7 + 1,
      `${number} imageUrl`,
      `${number} name`,
      new Date()
    );
    return appUser;
  }
  
  static fromJSON(json) {
    return new AppUser(JSON.parse(json));
  }

  static fromMap(json) {
    return new AppUser(json);
  }

  toJSON() {
    return JSON.stringify(toMap());
  }

  toMap() {
    return {
      appUserId: this.appUserId,
      dayOfWeek: this.dayOfWeek,
      imageUrl: this.imageUrl,
      name: this.name,
    };
  }

  toAppUser() {
    return {
      appUserId: this.uid,
      dayOfWeek: this.dayOfWeek,
      imageUrl: this.imageUrl,
      name: this.name,
    };
  }
}

module.exports = AppUser;
