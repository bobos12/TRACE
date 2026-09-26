/** ATHR — Tailwind CSS v3 config. Import tokens.css once globally; colours resolve through CSS variables so both themes work. */
/** @type {import("tailwindcss").Config} */
module.exports = {
  "darkMode": [
    "selector",
    "[data-theme=\"dark\"]"
  ],
  "theme": {
    "colors": {
      "transparent": "transparent",
      "current": "currentColor",
      "carbon": "var(--carbon)",
      "graphite": "var(--graphite)",
      "ash": "var(--ash)",
      "sand": "var(--sand)",
      "paper": "var(--paper)",
      "chalk": "var(--chalk)",
      "vermilion": "var(--vermilion)",
      "surface": "var(--surface)",
      "surface-raised": "var(--surface-raised)",
      "surface-sunken": "var(--surface-sunken)",
      "surface-inverse": "var(--surface-inverse)",
      "line": "var(--line)",
      "line-strong": "var(--line-strong)",
      "ink": "var(--ink)",
      "ink-muted": "var(--ink-muted)",
      "ink-faint": "var(--ink-faint)",
      "ink-inverse": "var(--ink-inverse)",
      "nuqta": "var(--nuqta)",
      "nuqta-soft": "var(--nuqta-soft)",
      "on-nuqta": "var(--on-nuqta)",
      "success": "var(--success)",
      "success-soft": "var(--success-soft)",
      "warning": "var(--warning)",
      "warning-soft": "var(--warning-soft)",
      "danger": "var(--danger)",
      "danger-soft": "var(--danger-soft)",
      "focus": "var(--focus)",
      "link": "var(--link)",
      "scrim": "var(--scrim)"
    },
    "spacing": {
      "0": "0px",
      "px": "1px",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "6": "24px",
      "8": "32px",
      "12": "48px",
      "16": "64px",
      "24": "96px",
      "32": "128px"
    },
    "borderRadius": {
      "none": "0px",
      "sm": "2px",
      "md": "4px",
      "lg": "8px",
      "full": "9999px"
    },
    "fontFamily": {
      "sans": [
        "\"Instrument Sans\", \"IBM Plex Sans Arabic\", system-ui, sans-serif"
      ],
      "arabic": [
        "\"IBM Plex Sans Arabic\", \"Instrument Sans\", system-ui, sans-serif"
      ],
      "mono": [
        "\"IBM Plex Mono\", ui-monospace, Menlo, monospace"
      ]
    },
    "extend": {
      "fontSize": {
        "display-xl": [
          "96px",
          {
            "lineHeight": "0.92",
            "fontWeight": "600",
            "letterSpacing": "-0.035em"
          }
        ],
        "display-lg": [
          "64px",
          {
            "lineHeight": "0.98",
            "fontWeight": "600",
            "letterSpacing": "-0.03em"
          }
        ],
        "display-md": [
          "44px",
          {
            "lineHeight": "1.05",
            "fontWeight": "600",
            "letterSpacing": "-0.02em"
          }
        ],
        "heading-1": [
          "32px",
          {
            "lineHeight": "40px",
            "fontWeight": "600",
            "letterSpacing": "-0.015em"
          }
        ],
        "heading-2": [
          "24px",
          {
            "lineHeight": "32px",
            "fontWeight": "600",
            "letterSpacing": "-0.01em"
          }
        ],
        "heading-3": [
          "18px",
          {
            "lineHeight": "26px",
            "fontWeight": "600"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "30px",
            "fontWeight": "400"
          }
        ],
        "body": [
          "15px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "body-sm": [
          "13px",
          {
            "lineHeight": "20px",
            "fontWeight": "400"
          }
        ],
        "label": [
          "13px",
          {
            "lineHeight": "16px",
            "fontWeight": "500",
            "letterSpacing": "0.01em"
          }
        ],
        "ar-display": [
          "56px",
          {
            "lineHeight": "1.3",
            "fontWeight": "600"
          }
        ],
        "ar-heading": [
          "28px",
          {
            "lineHeight": "1.6",
            "fontWeight": "600"
          }
        ],
        "ar-body": [
          "16px",
          {
            "lineHeight": "1.85",
            "fontWeight": "400"
          }
        ],
        "ar-label": [
          "14px",
          {
            "lineHeight": "1.5",
            "fontWeight": "500"
          }
        ],
        "eyebrow": [
          "11px",
          {
            "lineHeight": "16px",
            "fontWeight": "500",
            "letterSpacing": "0.12em"
          }
        ],
        "data": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "500"
          }
        ],
        "code": [
          "13px",
          {
            "lineHeight": "20px",
            "fontWeight": "400"
          }
        ]
      },
      "boxShadow": {
        "float": "var(--shadow-float)",
        "focus-ring": "var(--focus-ring)"
      },
      "transitionDuration": {
        "press": "90ms",
        "quick": "160ms",
        "trace": "320ms",
        "reveal": "560ms"
      },
      "transitionTimingFunction": {
        "mark": "cubic-bezier(0.2, 0, 0, 1)",
        "press": "cubic-bezier(0.5, 0, 0.75, 0)",
        "trace": "cubic-bezier(0.65, 0, 0.35, 1)"
      },
      "maxWidth": {
        "container": "1280px",
        "measure": "64ch"
      },
      "zIndex": {
        "sticky": "10",
        "overlay": "40",
        "toast": "50"
      }
    },
    "screens": {
      "sm": "640px",
      "md": "1024px",
      "lg": "1440px"
    }
  }
};
