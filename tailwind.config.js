export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};

