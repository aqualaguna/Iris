export default {
  text: {
    type: "object",
    properties: {
      type: {
        constant: ['string', 'null'],
      },
      minLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Minimum Length",
        description: "Set an optional minimum character length for the field.",
      },
      maxLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Length",
        description: "Set an optional maximum character length for the field.",
      },
      pattern: {
        type: ["string", "null"],
        format: "regex",
        title: "Pattern",
        description: "Set a Regex Pattern to validate.",
      },
      default: {
        type: ["string", "null"],
        default: null,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },
      isNotEmpty: {
        type: ["boolean", "null"],
        default: false,
        title: "Required",
        description: "Set this field to not accept empty value.",
      },
      format: {
        title: "Format",
        description: "Set an optional format validation for the field.",
        enum: [
          "date",
          "date-time",
          "uri",
          "email",
          "hostname",
          "ipv4",
          "ipv6",
          "regex",
        ],
      },
    },
  },
  url: {
    type: "object",
    properties: {
      type: {
        constant: ['string', 'null'],
      },
      minLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Minimum Length",
        description: "Set an optional minimum character length for the field.",
      },
      maxLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Length",
        description: "Set an optional maximum character length for the field.",
      },
      default: {
        type: ["string", "null"],
        default: null,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },
      format: {
        title: "Format",
        description: "Set an optional format validation for the field.",
        const: "uri",
      },

      isNotEmpty: {
        type: ["boolean", "null"],
        default: false,
        title: "Required",
        description: "Set this field to not accept empty value.",
      },
    },
  },
  rich_text: {
    type: "object",
    properties: {
      type: {
        constant: ['string', 'null'],
      },
      minLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Minimum Length",
        description: "Set an optional minimum character length for the field.",
      },
      maxLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Length",
        description: "Set an optional maximum character length for the field.",
      },
      default: {
        type: ["string", "null"],
        default: null,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },

      isNotEmpty: {
        type: ["boolean", "null"],
        default: false,
        title: "Required",
        description: "Set this field to not accept empty value.",
      },
    },
  },
  html: {
    type: "object",
    properties: {
      type: {
        constant: ['string', 'null'],
      },
      minLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Minimum Length",
        description: "Set an optional minimum character length for the field.",
      },
      maxLength: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Length",
        description: "Set an optional maximum character length for the field.",
      },
      default: {
        type: ["string", "null"],
        default: null,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },

      isNotEmpty: {
        type: ["boolean", "null"],
        default: false,
        title: "Required",
        description: "Set this field to not accept empty value.",
      },
    },
  },
  dropdown: {
    properties: {
      type: {
        constant: ['string', 'null'],
      },
      enum: {
        minItems: 1,
        items: {
          properties: {
            key: { type: "string" },
            value: { type: "string" },
          },
        },
        additionalItems: false,
      },
    },
    additionalProperties: false,
  },
  ref: {
    properties: {
      collection_name: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["collection_name"],
  },
  array: {
    type: "object",
    properties: {

      definitions: {
        type: ["array", "object", "null"],
        hidden: true,
        default: null,
      },
      minItems: {
        type: ["integer", "null"],
        minimum: 0,

        title: "Minimum Item Count",
        description: "Set an optional minimum count for the field.",
      },
      maxItems: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Item Count",
        description: "Set an optional maximum count for the field.",
      },
      uniqueItemProperties: {
        type: ["array", "null"],
        uniqueItems: true,
        default: [],
        title: "Unique Field(optional)",
        description:
          "Set an optional unique field (PK) for the field. use api key field",
      },
    },
  },
  object: {
    type: "object",
    properties: {
      definitions: {
        type: ["array", "null"],
        hidden: true,
        default: [],
      },
      minProperties: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Minimum Properties Count",
        description: "Set an optional minimum properties for the field.",
      },
      maxProperties: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Properties Count",
        description: "Set an optional maximum properties for the field.",
      },
      required: {
        type: ["array", 'null'],
        items: { type: "string" },
        uniqueItems: true,
        title: "Required Properties",
        default: [],
        description:
          "Set an required properties for the field. use api field name",
      },
    },
  },
  int: {
    properties: {
      type: {
        constant: ['integer', 'null'],
      },
      minimum: {
        type: ["integer", "null"],
        title: "Minimum Value",
        description: "Set an optional maximum value for the field.",
      },
      maximum: {
        type: ["integer", "null"],
        title: "Maximum Value",
        description: "Set an optional maximum value for the field.",
      },
      default: {
        type: ["integer", "null"],
        default: "",
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },
    },
  },
  decimal: {
    properties: {
      type: {
        constant: ['number', 'null'],
      },
      minimum: {
        type: ["number", "null"],
        title: "Minimum Value",
        description: "Set an optional maximum value for the field.",
      },
      maximum: {
        type: ["number", "null"],
        title: "Maximum Value",
        description: "Set an optional maximum value for the field.",
      },
      default: {
        type: ["number", "null"],
        default: 1,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },
    },
  },
  datetime: {
    properties: {
      type: {
        constant: ['object', 'null'],
      },
      minimum: {
        type: ["string", "null"],
        format: "date-time",
        title: "Minimum Value",
        description: "Set an optional minimum value for the field.",
      },
      maximum: {
        type: ["string", "null"],
        format: "date-time",
        title: "Maximum Value",
        description: "Set an optional maximum value for the field.",
      },
    },
  },
  bool: {
    properties: {
      type: {
        constant: ['boolean', 'null'],
      },
      default: {
        type: ["boolean", "null"],
        default: true,
        title: "Default Value",
        description: "Set an optional default value for the field.",
      },
    },
  },
  blob: {
    properties: {},
  },
  image: {
    properties: {
      upload_folder: {
        type: "string",
        title: "Default Upload Folder",
        description: "Set Upload Destination for the field.",
      },
    },
    required: ["upload_folder"],
  },
  file: {
    properties: {
      upload_folder: { type: "string" },
      valid_types: {
        items: {
          enum: [
            "ppt",
            "pptx",
            "pdf",
            "doc",
            "docx",
            "xlsx",
            "xls",
            "jpg",
            "jpeg",
            "gif",
            "png",
            "svg",
            "bmp",
            "all",
          ],
        },
      },
    },
    required: ["upload_folder"],
  },
  filelist: {
    properties: {
      upload_folder: { type: "string" },
      valid_types: {
        items: {
          enum: [
            "ppt",
            "pptx",
            "pdf",
            "doc",
            "docx",
            "xlsx",
            "xls",
            "jpg",
            "jpeg",
            "gif",
            "png",
            "svg",
            "bmp",
            "all",
          ],
        },
      },
      maxItem: {
        type: ["integer", "null"],
        minimum: 1,
        title: "Maximum Item",
        description: "Set an optional maximum Item count for the field.",
      },
    },
    required: ["upload_folder"],
  },
};
