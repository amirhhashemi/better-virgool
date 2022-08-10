const colors = require("tailwindcss/colors");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const em = (px, base) => `${round(px / base)}em`;

let defaultModifiers = {
  sm: {
    css: [
      {
        blockquote: {
          paddingLeft: null,
          paddingInlineStart: em(20, 18),
        },
        pre: {
          paddingRight: null,
          paddingLeft: null,
          paddingInlineEnd: em(12, 12),
          paddingInlineStart: em(12, 12),
        },
        ol: {
          paddingLeft: null,
          paddingInlineStart: em(22, 14),
        },
        ul: {
          paddingLeft: null,
          paddingInlineStartLeft: em(22, 14),
        },
        "ol > li": {
          paddingLeft: null,
          paddingInlineStart: em(6, 14),
        },
        "ul > li": {
          paddingLeft: null,
          paddingInlineStart: em(6, 14),
        },
        "thead th": {
          paddingRight: null,
          paddingInlineEnd: em(12, 12),
          paddingLeft: null,
          paddingInlineStart: em(12, 12),
        },
        "thead th:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "thead th:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
        "tbody td, tfoot td": {
          paddingRight: null,
          paddingInlineEnd: em(12, 12),
          paddingLeft: null,
          paddingInlineStart: em(12, 12),
        },
        "tbody td:first-child, tfoot td:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "tbody td:last-child, tfoot td:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
      },
    ],
  },
  base: {
    css: [
      {
        blockquote: {
          paddingLeft: null,
          paddingInlineStart: em(20, 20),
        },
        pre: {
          paddingRight: null,
          paddingLeft: null,
          paddingInlineEnd: em(16, 14),
          paddingInlineStart: em(16, 14),
        },
        ol: {
          paddingLeft: null,
          paddingInlineStart: em(26, 16),
        },
        ul: {
          paddingLeft: null,
          paddingInlineStartLeft: em(26, 16),
        },
        "ol > li": {
          paddingLeft: null,
          paddingInlineStart: em(6, 16),
        },
        "ul > li": {
          paddingLeft: null,
          paddingInlineStart: em(6, 16),
        },
        "thead th": {
          paddingRight: null,
          paddingInlineEnd: em(8, 14),
          paddingLeft: null,
          paddingInlineStart: em(8, 14),
        },
        "thead th:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "thead th:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
        "tbody td, tfoot td": {
          paddingRight: null,
          paddingInlineEnd: em(8, 14),
          paddingLeft: null,
          paddingInlineStart: em(8, 14),
        },
        "tbody td:first-child, tfoot td:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "tbody td:last-child, tfoot td:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
      },
    ],
  },
  lg: {
    css: [
      {
        blockquote: {
          paddingLeft: null,
          paddingInlineStart: em(24, 24),
        },
        pre: {
          paddingRight: null,
          paddingLeft: null,
          paddingInlineEnd: em(24, 16),
          paddingInlineStart: em(24, 16),
        },
        ol: {
          paddingLeft: null,
          paddingInlineStart: em(28, 18),
        },
        ul: {
          paddingLeft: null,
          paddingInlineStartLeft: em(28, 18),
        },
        "ol > li": {
          paddingLeft: null,
          paddingInlineStart: em(8, 18),
        },
        "ul > li": {
          paddingLeft: null,
          paddingInlineStart: em(8, 18),
        },
        "thead th": {
          paddingRight: null,
          paddingInlineEnd: em(12, 16),
          paddingLeft: null,
          paddingInlineStart: em(12, 16),
        },
        "thead th:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "thead th:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
        "tbody td, tfoot td": {
          paddingRight: null,
          paddingInlineEnd: em(12, 16),
          paddingLeft: null,
          paddingInlineStart: em(12, 16),
        },
        "tbody td:first-child, tfoot td:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "tbody td:last-child, tfoot td:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
      },
    ],
  },
  xl: {
    css: [
      {
        blockquote: {
          paddingLeft: null,
          paddingInlineStart: em(32, 30),
        },
        pre: {
          paddingRight: null,
          paddingLeft: null,
          paddingInlineEnd: em(24, 18),
          paddingInlineStart: em(24, 18),
        },
        ol: {
          paddingLeft: null,
          paddingInlineStart: em(32, 20),
        },
        ul: {
          paddingLeft: null,
          paddingInlineStartLeft: em(32, 20),
        },
        "ol > li": {
          paddingLeft: null,
          paddingInlineStart: em(8, 20),
        },
        "ul > li": {
          paddingLeft: null,
          paddingInlineStart: em(8, 20),
        },
        "thead th": {
          paddingRight: null,
          paddingInlineEnd: em(12, 18),
          paddingLeft: null,
          paddingInlineStart: em(12, 18),
        },
        "thead th:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "thead th:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
        "tbody td, tfoot td": {
          paddingRight: null,
          paddingInlineEnd: em(12, 18),
          paddingLeft: null,
          paddingInlineStart: em(12, 18),
        },
        "tbody td:first-child, tfoot td:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "tbody td:last-child, tfoot td:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
      },
    ],
  },
  "2xl": {
    css: [
      {
        blockquote: {
          paddingLeft: null,
          paddingInlineStart: em(40, 36),
        },
        pre: {
          paddingRight: null,
          paddingLeft: null,
          paddingInlineEnd: em(32, 20),
          paddingInlineStart: em(32, 20),
        },
        ol: {
          paddingLeft: null,
          paddingInlineStart: em(38, 24),
        },
        ul: {
          paddingLeft: null,
          paddingInlineStartLeft: em(38, 24),
        },
        "ol > li": {
          paddingLeft: null,
          paddingInlineStart: em(10, 24),
        },
        "ul > li": {
          paddingLeft: null,
          paddingInlineStart: em(10, 24),
        },
        "thead th": {
          paddingRight: null,
          paddingInlineEnd: em(12, 20),
          paddingLeft: null,
          paddingInlineStart: em(12, 20),
        },
        "thead th:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "thead th:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
        "tbody td, tfoot td": {
          paddingRight: null,
          paddingInlineEnd: em(12, 20),
          paddingLeft: null,
          paddingInlineStart: em(12, 20),
        },
        "tbody td:first-child, tfoot td:first-child": {
          paddingLeft: null,
          paddingInlineStart: "0",
        },
        "tbody td:last-child, tfoot td:last-child": {
          paddingRight: null,
          paddingInlineEnd: "0",
        },
      },
    ],
  },
  invert: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
  slate: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
  gray: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
  zinc: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
  neutral: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
  stone: {
    css: {
      "--tw-prose-bold": "inherit",
      "--tw-prose-invert-bold": "inherit",
    },
  },
};

const customTypography = {
  DEFAULT: {
    css: [
      {
        blockquote: {
          fontWeight: "500",
          fontStyle: "italic",
          color: "var(--tw-prose-quotes)",
          borderLeftWidth: null,
          borderInlineStartWidth: "0.25rem",
          borderLeftColor: null,
          borderInlineStartColor: "var(--tw-prose-quote-borders)",
        },
      },
      ...defaultModifiers.base.css,
    ],
  },
  ...defaultModifiers,
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: customTypography,
    },
    fontFamily: {
      sans: ["Vazirmatn", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
