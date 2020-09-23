const {KintoneRestAPIClientWeChatMP} = require('@kintone/rest-api-client-wechat-mp');
const kintoneConfig = require('./kintoneConfig');

const getClient = () => {
  return new KintoneRestAPIClientWeChatMP({
    baseUrl: kintoneConfig.baseUrl,
    auth: {
      username: kintoneConfig.username,
      password: kintoneConfig.password,
    },
  });
};

const kintoneRecordModule = () => {
  return getClient().record;
};

const kintoneFileModule = () => {
  return getClient().file;
};

const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
};

const formatTime = date => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const checkNull = (data, defaultValue) => {
  return data ? data : (defaultValue ? defaultValue : '');
};

module.exports = {
  kintoneRecordModule: kintoneRecordModule,
  kintoneFileModule: kintoneFileModule,
  formatDate: formatDate,
  formatTime: formatTime,
  checkNull: checkNull,
};
