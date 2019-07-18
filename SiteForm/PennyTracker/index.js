const MAX_DATE = 8640000000000000;

const penniesPerMs = 1100 / 3600 / 1000;
let pennyIncrement;

// const pennyHdSrc = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/US_One_Cent_Obv.png';
const pennySrc = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/409445/penny_heads.png';
const pennyImg = `<img src='${pennySrc}' width='1%' />`;

const getCookie = (cookieName) => {
  for (let cookie of document.cookie.split(';')) {
    if (cookie.trim().startsWith(`${cookieName}=`)) {
      return cookie.trim().slice(cookieName.length + 1);
    }
  }
  return '';
};
const getTimeElapsed = () => {
  const timeElapsedCookie = getCookie('timeElapsed');
  return timeElapsedCookie ? parseInt(timeElapsedCookie) : 0;
};
const getPastPennies = () => {
  return Math.floor(getTimeElapsed() * penniesPerMs);
};

const updateNumPenniesDisplay = (numPennies) => {
  document.getElementById('numPenniesDisplay').innerHTML = numPennies;
  document.getElementById('pennyDisplay').innerHTML = (
    pennyImg.repeat(numPennies)
  );
};
const addPenny = () => {
  const numPennies = parseInt(document.getElementById('numPenniesDisplay').innerHTML) + 1;
  document.getElementById('numPenniesDisplay').innerHTML = numPennies;
  document.getElementById('pennyDisplay').innerHTML += pennyImg;
}
const hideCookieMessage = () => {
  document.getElementById('cookie-message').style.display = 'none';
}

const initPage = () => {
  updateNumPenniesDisplay(getPastPennies());
  if (getCookie('acceptedCookies') === 'true') hideCookieMessage();
};
const clockIn = () => {
  const clockInTimeCookie = getCookie('clockInTime');
  if (clockInTimeCookie.length) {
    if (pennyIncrement) {
      window.alert(`You've already clocked in at ${clockInTimeCookie}!`);
      return;
    }
    document.cookie = 'clockInTime=; expires=0;';
  }
  const currentDate = new Date();
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  tomorrow.setHours(0, tomorrow.getTimezoneOffset(), 0, 0);
  document.cookie = `clockInTime=${currentDate.toUTCString()}; expires=${tomorrow.toUTCString()};`;
  let numPennies = getPastPennies();
  pennyIncrement = setInterval(() => {
    numPennies += 1;
    addPenny();
  }, 1 / penniesPerMs)
};
const clockOut = () => {
  if (pennyIncrement) clearInterval(pennyIncrement);
  let timeElapsed = getTimeElapsed();
  timeElapsed += new Date() - new Date(getCookie('clockInTime'));
  document.cookie = 'clockInTime=; expires=0;';
  document.cookie = `timeElapsed=${timeElapsed}; expires=${MAX_DATE};`;
};
const resetPennies = () => {
  if (pennyIncrement) clearInterval(pennyIncrement);
  document.cookie = 'clockInTime=; expires=0;';
  document.cookie = `timeElapsed=; expires=0;`;
  window.alert('Pennies have been reset! Dirty worker...');
  updateNumPenniesDisplay(0);
};
const acceptCookies = () => {
  document.cookie = `acceptedCookies=true; expires=${MAX_DATE};`
  hideCookieMessage();
};