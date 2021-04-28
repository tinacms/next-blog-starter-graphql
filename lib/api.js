import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export async function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug, fields = []) {
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
              coverImage
              author {
                data {
                  ... on Author_Doc_Data {
                    name
                    picture
                  }
                }
              }
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
  return { ...data.getPostsDocument.data, slug: slug };
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
                data {
                  ... on Author_Doc_Data {
                    name
                    picture
                  }
                }
              }
              coverImage
              featured
              _body
            }
          }
        }
      }
      `,
    }),
  });
  const { data } = await response.json();
  return data.getPostsList
    .map((post) => ({ slug: post.sys.filename, ...post.data }))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    .filter((post) => post.featured === true);
}
