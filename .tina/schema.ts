import { defineSchema } from "tina-graphql-gateway-cli";

export default defineSchema({
  collections: [
    {
      label: "Posts",
      name: "posts",
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
              type: "group",
              name: "author",
              label: "Author",
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
  ],
});
