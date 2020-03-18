const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const generateRandomString = () => {
  let randomKey = "";
  for (let i = 0; i < 6; i++) {
    const randomCase = randomNum(0, 3);
    if (randomCase === 0) {
      randomKey += randomNum(0, 9);
    } else if (randomCase === 1) {
      randomKey += String.fromCharCode(randomNum(65, 90));
    } else {
      randomKey += String.fromCharCode(randomNum(97, 122));
    }
  }
  return randomKey;
};

const checkDataBase = (elementToCheck, dataBase, key) => {
  for (const id in dataBase) {
    if (dataBase[id][key] === elementToCheck) return true;
  }
  return false;
};

const getId = (email, password, dataBase) => {
  for (const id in dataBase) {
    if (dataBase[id].email === email && dataBase[id].password === password) {
      return id;
    }
  }
  return false;
};

module.exports = { generateRandomString, checkDataBase, getId };
