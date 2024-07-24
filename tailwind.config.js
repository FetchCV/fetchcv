/** @type {import("tailwindcss").Config} */

module.exports = {
   content: ["./public/**/*.{html,ejs,js,ts}"],
   theme: {
      extend: {
         colors: {
            farther: {
               dark: "#09090b",
               light: "#d4d4d8",
               b: {
                  dark: "18181b",
                  light: "#71717a",
               },
               h: {
                  dark: "18181b",
                  light: "#a1a1aa",
               }
            },
            far: {
               dark: "#18181b",
               light: "#e4e4e7",
               b: {
                  dark: "#27272a",
                  light: "#a1a1aa",
               },
               h: {
                  dark: "#27272a",
                  light: "#d4d4d8",
               }
            },
            close: {
               dark: "#27272a",
               light: "#f4f4f5",
               b: {
                  dark: "#3f3f46",
                  light: "#d4d4d8",
               },
               h: {
                  dark: "#3f3f46",
                  light: "#e4e4e7",
               }
            },
            closer: {
               dark: "#3f3f46",
               light: "#fafafa",
               b: {
                  dark: "#52525b",
                  light: "#e4e4e7",
               },
               h: {
                  dark: "#52525b",
                  light: "#f4f4f5",
               }
            },
            theme: "#ef4444",
            //icons are colored depending on who can see them and how important they are
            public: "#3b82f6",
            private: "#ef4444",
            tools: "#eab308",
         },
      },
   },
   plugins: [],
};
