import Vue from "vue";

Vue.filter("title", function(value, replacer = "_") {
  if (!value) return "";
  value = value.toString();

  const arr = value.split(replacer);
  const capitalized_array = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalized_array.push(capitalized);
  });
  return capitalized_array.join(" ");
});

Vue.filter("prettyBytes", function(num) {
  // jacked from: https://github.com/sindresorhus/pretty-bytes
  if (typeof num !== "number" || isNaN(num)) {
    return "";
  }

  var exponent;
  var unit;
  var neg = num < 0;
  var units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? "-" : "") + num + " B";
  }

  exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  );
  num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
  unit = units[exponent];

  return (neg ? "-" : "") + num + " " + unit;
});
