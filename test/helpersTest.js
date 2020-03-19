const { assert } = require("chai");

const { getId, urlsForUser } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "joLL3n",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrls = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  er3TRp: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
  P0lkaH: { longURL: "https://www.yahoo.com", userID: "joLL3n" },
  teStin: { longURL: "https://www.facebook.com", userID: "joLL3n" }
};

describe("#getId", function() {
  it("should return a user with valid email", function() {
    const user = getId("user@example.com", testUsers);
    const user2 = getId("1233@polka.com");
    const expectedOutput = "userRandomID";

    assert.strictEqual(user, expectedOutput);
    assert.isFalse(user2);
  });

  it("should return false with invalid email", function() {
    const user2 = getId("1233@polka.com");

    assert.isFalse(user2);
  });
});

describe("#urlsForUser", () => {
  it("should return an object of urls that are coresponded with the current id", () => {
    const currentId = "joLL3n";
    const expected = {
      P0lkaH: { longURL: "https://www.yahoo.com", userID: "joLL3n" },
      teStin: { longURL: "https://www.facebook.com", userID: "joLL3n" }
    };
    const userUrls = urlsForUser(currentId, testUrls);

    assert.deepEqual(userUrls, expected);
  });
});
