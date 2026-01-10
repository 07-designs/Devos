import 'dotenv/config';
import { authStorage } from '../server/replit_integrations/auth/storage';

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: tsx script/checkUser.ts <username>');
    process.exit(1);
  }

  try {
    const user = await authStorage.getUserByUsername(username);
    if (!user) {
      console.log(`User not found: ${username}`);
      process.exit(0);
    }
    // Don't print the password hash
    const { password: _p, ...safeUser } = user as any;
    console.log('Found user:', safeUser);
  } catch (err) {
    console.error('Error checking user:', err);
    process.exit(2);
  }
}

main();
