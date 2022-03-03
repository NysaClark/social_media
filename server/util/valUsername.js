const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim;

module.exports = regexUserName;
