import { defineSchema } from "tina-graphql-gateway-cli";

export default defineSchema({
  collections: [
    {
      label: "Posts",
      name: "posts",
      /*
       * Indicates where to save this kind of content (eg. the "_posts" folder)
       */
      path: "_posts",
      templates: [
        {
          label: "Simple",
          name: "simple_post",
          fields: [
            {
              type: "text",
              label: "Title",
              name: "title",
            },
            {
              type: "text",
              label: "Excerpt",
              name: "excerpt",
            },
            {
              type: "text",
              label: "Cover Image",
              name: "coverImage",
            },
            {
              type: "text",
              label: "Date",
              name: "date",
            },
            {
              type: "reference",
              name: "author",
              label: "Author",
              collection: "authors",
            },
            {
              type: "group",
              name: "ogImage",
              label: "Open Graph Image",
              fields: [
                {
                  type: "text",
                  label: "URL",
                  name: "url",
                },
              ],
            },
            {
              type: "toggle",
              label: "Featured",
              name: "featured",
            },
          ],
        },
      ],
    },
    {
      name: "authors",
      label: "Authors",
      path: "_authors",
      templates: [
        {
          label: "Author",
          name: "author",
          fields: [
            {
              type: "text",
              label: "Name",
              name: "name",
            },

            {
              name: "picture",
              label: "Picture",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
});
