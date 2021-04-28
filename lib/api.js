import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export async function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  await Promise.all(
    fields.map(async (field) => {
      if (field === "slug") {
        items[field] = realSlug;
      }
      if (field === "content") {
        items[field] = content;
      }

      if (data[field]) {
        if (field === "author") {
          // We have the author value (ex. "_authors/jj.md")
          // now we need the author data
          const fullPath = join(process.cwd(), data[field]);
          const fileContents = await fs.readFileSync(fullPath, "utf8");
          const { data: authorData } = matter(fileContents);
          items[field] = authorData;
        } else {
          items[field] = data[field];
        }
      }

      return true;
    })
  );

  return items;
}

export async function getAllPosts(fields = []) {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs
      .map(async (slug) => await getPostBySlug(slug, fields))
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
      .filter(async (post) => {
        return post.featured;
      })
  );
  return posts;
}
