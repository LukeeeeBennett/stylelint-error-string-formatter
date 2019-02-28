const path = require("path");
const stringFormatter = require("stylelint/lib/formatters/stringFormatter");

// borrowed from stringFormatter as it isn't exported yet
function logFrom(fromValue) {
  if (fromValue.charAt(0) === "<") return fromValue;

  return path
    .relative(process.cwd(), fromValue)
    .split(path.sep)
    .join("/");
}

function errorMessageReducer(message, { severity, line, column, text, rule }) {
  return severity === "error"
    ? `${message}\n   ✖   ${rule} ${line}:${column}   ${text}`
    : message;
}

function errorResultReducer(message, result) {
  return result.errored
    ? result.warnings.reduce(
        errorMessageReducer,
        `${message}\n\n${logFrom(result.source)}`
      )
    : message;
}

function errorFormatter(results) {
  const output = results.reduce(errorResultReducer, "");

  return output ? `FAILURES:${output}\n\n` : "";
}

module.exports = function sortedStringFormatter(results) {
  return stringFormatter(results) + errorFormatter(results);
};

