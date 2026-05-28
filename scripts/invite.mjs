#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const [, , email, name, password] = process.argv;

if (!email || !name || !password) {
  console.error('Usage: node scripts/invite.mjs <email> "<name>" <password>');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, '../src/data/beta-users.json');
const users = JSON.parse(readFileSync(file, 'utf8'));

const normalized = email.trim().toLowerCase();
const exists = users.findIndex((u) => u.email.toLowerCase() === normalized);
const entry = { email: normalized, name, passwordHash: bcrypt.hashSync(password, 10) };

if (exists >= 0) {
  users[exists] = entry;
  console.log(`Updated ${normalized}`);
} else {
  users.push(entry);
  console.log(`Added ${normalized}`);
}

writeFileSync(file, JSON.stringify(users, null, 2) + '\n');
console.log(`Wrote ${users.length} user(s) to ${file}`);
