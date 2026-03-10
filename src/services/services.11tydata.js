export default {
  layout: "layouts/service.njk",
  tags: "services",
  eleventyComputed: {
    permalink: (data) => {
      if (data.hide === true || data.hide === "true") {
        return false;
      }
      return undefined;
    },
  },
};
