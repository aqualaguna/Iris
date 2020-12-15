import * as Ajv from "ajv";

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allErrors: true,
});
require("ajv-errors")(ajv /*, {singleError: true} */);

ajv.addKeyword("isNotEmpty", {
  type: "string",
  validate: function (_schema: any, data: any) {
    return typeof data === "string" && data.trim() !== "";
  },
  errors: true,
});

require("ajv-keywords")(ajv);

export default ajv;
