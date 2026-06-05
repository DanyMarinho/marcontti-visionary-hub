import { readFileSync } from 'fs';
import fetch from 'node-fetch';

const DEPLOY_URL = process.env.DEPLOY_URL || 'https://metodomec1.lovable.app';

async function getDeployedCommit(): Promise<string | null> {
  try {
    const res = await fetch(DEPLOY_URL);
    const html = await res.text();
    const match = html.match(/<meta\s+name="git-commit"\s+content="([a-f0-9]+)"/i);
    return match ? match[1] : null;
  } catch (e) {
    console.error('Failed to fetch deployed site:', e);
    return null;
  }
}

function getLocalCommit(): string {
  // Read the git commit hash from the repository's HEAD
  const head = readFileSync('.git/refs/heads/main', 'utf-8').trim();
  return head;
}

(async () => {
  const deployed = await getDeployedCommit();
  const local = getLocalCommit();
  if (!deployed) {
    console.error('Could not determine deployed commit hash.');
    process.exit(1);
  }
  console.log('Deployed commit:', deployed);
  console.log('Local HEAD commit :', local);
  if (deployed === local) {
    console.log('✅ Deployed version matches local HEAD.');
    process.exit(0);
  } else {
    console.warn('⚠️ Deployed version differs from local HEAD.');
    process.exit(1);
  }
})();
