import fs from 'fs/promises';
import path from 'path';

// Define the path to the JSON file.
// In a self-hosted environment, this will be a persistent file on the disk.
const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
}

async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify([]), 'utf8');
    }
  } catch (error) {
    console.error('Error ensuring DB exists:', error);
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

export async function saveUsers(users: User[]): Promise<void> {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}
