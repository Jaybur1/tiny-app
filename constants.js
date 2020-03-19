const bcrypt = require('bcrypt');
const urlDataBase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  er3TRp: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
  P0lkaH: { longURL: "https://www.yahoo.com", userID: "joLL3n" },
  teStin: { longURL: "https://www.facebook.com", userID: "joLL3n" }
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
