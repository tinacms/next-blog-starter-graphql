import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug) {
  const response = await fetch("http://localhost:4001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `#graphql
      query BlogPostQuery($relativePath: String!) {
        getPostsDocument(relativePath: $relativePath) {
          data {
            ...on SimplePost_Doc_Data {
              title
              excerpt
              date
              author {
                name
                picture
              }
              coverImage
              ogImage {
                url
              }
              featured
              _body
            }
          }
        }
      }
      `,
      variables: {
        relativePath: `${slug}.md`,
      },
    }),
  });
  const { data } = await response.json();
  return data.getPostsDocument.data;
}

export async function getAllPosts(fields = []) {
  const response = await fetch("http://localhost:4001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `#graphql
      {
        getPostsList {
          sys {
            filename
          }
          data {
            ...on SimplePost_Doc_Data {
              title
              excerpt
              date
              author {
                name
                picture
              }
              coverImage
              featured
            }
          }
        }
      }
      `,
    }),
  });
  const { data } = await response.json();
  return data.getPostsList
    .map((post) => post)
    .sort((post1, post2) => (post1.data.date > post2.data.date ? -1 : 1))
    .filter((post) => post.data.featured === true);
}
