const validator = require("validator");

function inputValidator(input) {
  return validator.escape(input);
}
