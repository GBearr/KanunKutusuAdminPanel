class DateFormatter {
  static get _now() {
    return "şimdi";
  }
  static get _secondAgo() {
    return "saniye önce";
  }
  static get _secondsAgo() {
    return "saniye önce";
  }
  static get _minuteAgo() {
    return "dakika önce";
  }
  static get _minutesAgo() {
    return "dakika önce";
  }
  static get _hourAgo() {
    return "saat önce";
  }
  static get _hoursAgo() {
    return "saat önce";
  }
  static get _dayAgo() {
    return "gün önce";
  }
  static get _daysAgo() {
    return "gün önce";
  }

  static get _weekdayList() {
    return [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ];
  }

  static get _monthList() {
    return [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
  }

  static formatWeekday(weekday) {
    return this._weekdayList[weekday - 1];
  }

  static formatMonth(month) {
    return this._monthList[month - 1];
  }

  static formatDate(
    date,
    { includeWeekday = false, includeTime = false } = {}
  ) {
    const fDate = `${date.getDate()} ${this.formatMonth(
      date.getMonth() + 1
    )} ${date.getFullYear()}`;
    if (includeWeekday) {
      fDate += ` ${this.formatWeekday(date.getDay() + 1)}`;
    }
    if (includeTime) {
      fDate += ` ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
    return fDate;
  }

  static formatDateDifference(
    date,
    { includeWeekday = false, includeTime = false } = {}
  ) {
    const now = new Date();
    const difference = now - date;
    const differenceInSeconds = Math.floor(difference / 1000);
    const differenceInMinutes = Math.floor(difference / (1000 * 60));
    const differenceInHours = Math.floor(difference / (1000 * 60 * 60));
    const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (differenceInSeconds < 1) {
      return this._now;
    } else if (differenceInSeconds < 60) {
      return `${differenceInSeconds} ${
        differenceInSeconds === 1 ? this._secondAgo : this._secondsAgo
      }`;
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} ${
        differenceInMinutes === 1 ? this._minuteAgo : this._minutesAgo
      }`;
    } else if (differenceInHours < 24) {
      return `${differenceInHours} ${
        differenceInHours === 1 ? this._hourAgo : this._hoursAgo
      }`;
    } else if (differenceInDays < 7) {
      return `${differenceInDays} ${
        differenceInDays === 1 ? this._dayAgo : this._daysAgo
      }`;
    } else {
      return this.formatDate(date, { includeWeekday, includeTime });
    }
  }
}

export default DateFormatter;
