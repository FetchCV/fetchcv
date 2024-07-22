/** @type {import("tailwindcss").Config} */
module.exports = {
   content: ["./public/**/*.{html,ejs,js,ts}"],
   theme: {
      extend: {
         colors: {
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
