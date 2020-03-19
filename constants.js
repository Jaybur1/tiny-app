const bcrypt = require('bcrypt');
const urlDataBase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" ,createdAt: "03/07/1990",visits: 34},
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" ,createdAt: "07/20/1999",visits: 3},
  er3TRp: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" ,createdAt: "01/20/1999",visits: 0},
  P0lkaH: { longURL: "https://www.yahoo.com", userID: "joLL3n" ,createdAt: "09/20/1999",visits: 17},
  teStin: { longURL: "https://www.facebook.com", userID: "joLL3n" ,createdAt: "08/20/1999",visits: 1}
};

const usersDataBase = {
  aJ48lW: {
    id: "aJ48lW",
    name: "holymolly",
    email: "user@example.com",
    password: bcrypt.hashSync('plasplas', 10)
  },
  joLL3n: {
    id: "joLL3n",
    name: "polygolly",
    email: "user2@example.com",
    password: bcrypt.hashSync('plasplas', 10)
  }
};

module.exports = { urlDataBase, usersDataBase };
