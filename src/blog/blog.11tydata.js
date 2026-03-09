// blog.11tydata.js — Directory data for all blog files.
// When home.blog.enabled is false, all blog pages get permalink: false (not generated).
import { readFileSync } from 'fs';

const home = JSON.parse(readFileSync('src/_data/home.json', 'utf8'));
const blogEnabled = home.blog?.enabled === true;

export default {
  layout: "layouts/post.njk",
  tags: "posts",
  permalink: blogEnabled ? undefined : false,
};
