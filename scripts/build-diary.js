#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

const DIARIES_DIR = path.join(__dirname, '..', 'diaries');
const OUTPUT_DIR = path.join(__dirname, '..', 'diary');
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'diary-template.html'), 'utf8');

function renderDiary(mdFile) {
  const basename = path.basename(mdFile, '.md');
  const md = fs.readFileSync(mdFile, 'utf8');
  
  // Parse frontmatter
  const frontmatter = {};
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    fmMatch[1].split('\n').forEach(line => {
      const [key, ...vals] = line.split(':');
      if (key && vals.length) {
        frontmatter[key.trim()] = vals.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
  
  const content = md.replace(/^---[\s\S]*?---\n/, '');
  const htmlContent = marked.parse(content);
  
  const title = frontmatter.title || basename;
  const date = frontmatter.date || basename;
  
  const entryHtml = TEMPLATE
    .replace('{{TITLE}}', title)
    .replace('{{DATE}}', date)
    .replace('{{CONTENT}}', htmlContent);
  
  const outPath = path.join(OUTPUT_DIR, `${basename}.html`);
  fs.writeFileSync(outPath, entryHtml);
  console.log(`Built: ${basename}.html`);
}

function buildAll() {
  if (!fs.existsSync(DIARIES_DIR)) {
    console.error('diaries/ directory not found');
    process.exit(1);
  }
  
  const files = fs.readdirSync(DIARIES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  files.forEach(f => renderDiary(path.join(DIARIES_DIR, f)));
  console.log(`\nDone: ${files.length} diary entries built`);
}

buildAll();
