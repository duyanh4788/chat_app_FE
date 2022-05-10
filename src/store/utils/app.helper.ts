/* eslint-disable no-useless-concat */
/* eslint-disable array-callback-return */
import * as _ from 'lodash';
const moment = require('moment');

export class AppHelper {
  /**
   * Format queryParams Url
   * @param  {String} url queryString
   * @return {Object} format query parameter
   */
  static getParamsFromUrl(url: string): any {
    url = decodeURI(url);
    if (typeof url === 'string') {
      let params = url.split('?');
      let eachParamsArr = params[1].split('&');
      let obj = {};
      if (eachParamsArr && eachParamsArr.length) {
        eachParamsArr.map((param: any): any => {
          let keyValuePair = param.split('=');
          let key = keyValuePair[0];
          let value = keyValuePair[1];
          obj[key] = value;
        });
      }
      return obj;
    }
  }

  /**
   * Sort Collection
   * @param {Array}: any[],
   * @return {Array}: sorted array
   */

  static sortColection(array: any[], keys: string[]): any[] {
    return _.sortBy(array, [keys]);
  }

  /**
   * Format Current To VND
   * @param  {String} cur input string currency
   * @return {String}  Price with format VND  "123.457 ₫"
   */

  static convertBirthDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  }

  static formDateTimeYmDSlash(dateTime) {
    if (!dateTime) return '-';
    return moment(dateTime).format('YYYY/MM/DD');
  }

  static formDateYDM(dateTime) {
    if (!dateTime || _.isEmpty(dateTime)) return '-';
    return moment(dateTime).format('YYYY-DD-MM');
  }

  static formDatePrintRegisBank(dateTime) {
    if (!dateTime) return null;
    return moment(dateTime).format('MM/DD/YYYY');
  }

  static formOnlyYear(dateTime) {
    if (!dateTime) return '-';
    return moment(dateTime).format('YYYY');
  }

  static formOnlyMonth(dateTime) {
    if (!dateTime) return '-';
    return moment(dateTime).format('M');
  }

  static formTimer(dateTime) {
    if (!dateTime) return '-';
    return moment(dateTime).format('HH:mm');
  }

  static formmatDateTimeChat(dateTime) {
    if (!dateTime) return '-';
    if (
      moment(dateTime).format('DD-MM-YYYY') === AppHelper.getToDate(new Date())
    ) {
      return 'Hôm nay' + ' ' + AppHelper.formTimer(dateTime);
    }
    return moment(dateTime).format('DD-MM-YYYY - HH:mm');
  }

  static getToDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  static convertFullName(name: string | any) {
    if (!name) return '';
    return name.split(' ').pop().charAt(0) + name.split(' ').shift().charAt(0);
  }

  static truncate(text: string, length: number): string {
    if (text.length > length) return text.substring(0, length) + '...';
    else return text;
  }

  /**
   * Text To TitleCase
   * @param   { String } str string text input
   * @returns { String } string text to TitleCase
   */

  static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static generateUUID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static randomNumber(min: number = 1000000, max: number = 5000000): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static getFirstLastName(fullName: string): any {
    const name: string[] = fullName.split(/(?:\/)([^#]+)(?=#*)/);
    return {
      firstName: name[1],
      lastName: name[0],
    };
  }
  
  static getCurrentTimeAndDate(times): string {
    const today = new Date(times);
    const day = today.getDate() >= 10 ? today.getDate() : '0' + today.getDate();
    const month =
      today.getMonth() + 1 >= 10
        ? today.getMonth() + 1
        : '0' + (today.getMonth() + 1);
    const year = today.getFullYear();
    const date = ' Ngày ' + day + ' Tháng ' + month + ' Năm ' + year;
    const minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const time = today.getHours() + ':' + minutes;
    const dateTime = time + ', ' + date;
    return dateTime;
  }

  static getTimeStartOfDay(date: Date): string {
    return new Date(date.setHours(0, 0, 0, 0)).toISOString();
  }

  static getTimeEndOfDay(date: Date): string {
    return new Date(date.setHours(23, 0, 0, 0)).toISOString();
  }

  static getYearOldsByBirth(birthDay: string | Date): number {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDay).getFullYear();
    return currentYear - birthYear;
  }

  static addMinutesToDate(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  static getYearBirthDay(birthDay: string): string {
    const years: number = new Date(birthDay).getFullYear();
    if (isNaN(years)) {
      return '';
    }
    return years.toString();
  }

  static convertStringToDate(date: string) {
    if (!date) return '';
    const convert = date.split('/').reverse().join('-');
    return convert;
  }

  static getValueFromProxy(proxyTarget): any {
    return JSON.parse(JSON.stringify(proxyTarget));
  }

  static cloneDeepCollections(collection: any[]): any[] {
    if (!collection.length) return [];
    return JSON.parse(JSON.stringify(collection));
  }

  static compareAndModifyTwoCollections(
    modifyList: any[],
    optionsList: any[],
    key: string,
    modifyKey: string,
  ): any[] {
    if (!modifyList.length || !optionsList.length) {
      return modifyList;
    }
    let updateList = AppHelper.cloneDeepCollections(modifyList);
    updateList = updateList.map(item => {
      const optionItem = optionsList.find(updateItem => {
        return updateItem[key] === item[key];
      });
      return {
        ...item,
        [modifyKey]: optionItem ? true : false,
      };
    });
    return updateList;
  }

  static descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  static checkEmptyString(str: string): boolean {
    if (
      typeof str == 'undefined' ||
      !str ||
      str.length === 0 ||
      str === '' ||
      !/[^\s]/.test(str) ||
      /^\s*$/.test(str) ||
      str.replace(/\s/g, '') === ''
    )
      return true;
    else return false;
  }

  static checkEmptyNumber(num: number): boolean {
    if (typeof num === 'undefined' || !num || num === null || num === 0) {
      return true;
    } else {
      return false;
    }
  }

  static vietnamesePattern(): RegExp {
    return new RegExp(
      /^[^-\s][a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéếêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ_\s-]+$/,
    );
  }

  static numberTextOnlyPattern(): RegExp {
    return new RegExp(/^[^-\s][a-zA-Z0-9_\s-]+$/);
  }

  static numberTextWithDotPattern(): RegExp {
    return new RegExp(/^[^-\s][a-zA-Z0-9.]+$/);
  }

  static removeSpaceStartEnd(): RegExp {
    return new RegExp(/^[^\s]+(\s+[^\s]+)*$/);
  }

  static setPagiClient(
    list: any[],
    pagi: any,
    setState: (setList?) => void,
  ): any {
    if (!list.length || _.isEmpty(pagi)) {
      return {
        data: [],
        setPagi: setState({
          data: [],
          total: 0,
        }),
      };
    }
    const { page, rowsPerPage } = pagi;
    const takeFrom = page * rowsPerPage;
    const takeTo = !page ? rowsPerPage : page * rowsPerPage + rowsPerPage;
    const data = list.slice(takeFrom, takeTo);
    return {
      data,
      setPagi: setState({
        data,
        total: list.length,
      }),
    };
  }
  static setSearchPagiClient(
    list: any[],
    pagi: any,
    keySearch: string = '',
    setState: (setList?) => void,
  ) {
    if (!list.length || _.isEmpty(pagi)) return null;
    const searchTable = list.filter((item: any) => {
      return (
        (item.name &&
          item.name.toLowerCase().includes(keySearch.toLowerCase())) ||
        (item.code &&
          item.code.toLowerCase().includes(keySearch.toLowerCase())) ||
        (item.description &&
          item.description.toLowerCase().includes(keySearch.toLowerCase())) ||
        (item.full_name &&
          item.full_name.toLowerCase().includes(keySearch.toLowerCase()))
      );
    });
    return AppHelper.setPagiClient(searchTable, pagi, setState);
  }
  static getUnique(arr: any[], comp: string): any[] {
    if (!arr.length || comp === '') return [];
    const unique = arr
      .map((e: any) => e[comp])
      .map((e: any, i: number, final: any) => final.indexOf(e) === i && i)
      .filter((e: any) => arr[e])
      .map((e: any) => arr[e]);
    return unique;
  }

  static getFileUploadName(file: FileList): string {
    return file[0].name;
  }

  static disableF5(canReload: boolean, e: any): void {
    if (!canReload && !e) return;
    if ((e.which || e.keyCode) === 116 || (e.which || e.keyCode) === 82)
      e.preventDefault();
  }

  static parseBODDate = (date?: string) => {
    if (date) {
      return moment.utc(new Date(date)).startOf('day');
    }
    return moment.utc(new Date()).startOf('day');
  };

  static nonAccentVietnamese(str: string): string {
    str = str.toLowerCase();
    // str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    // str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    // str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    // str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    // str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    // str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    // str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  static searchVNEntity = (multi: string, keyword: string): number => {
    return AppHelper.nonAccentVietnamese(multi).indexOf(
      AppHelper.nonAccentVietnamese(keyword),
    );
  };

  static formatTimeSlots(timeSlot: any, keys: string[]): string {
    return (
      AppHelper.formatRenderTime(timeSlot[keys[0]]) +
      ' - ' +
      AppHelper.formatRenderTime(timeSlot[keys[1]])
    );
  }

  static formatRenderTime(time: string): string {
    if (!time) return '';
    return time.slice(0, time.length - 3);
  }
}
