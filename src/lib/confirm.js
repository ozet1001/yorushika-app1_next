import readline from 'readline';

// コンソールでの入力待ちを行うための関数
export async function confirmEnvironment() {
  if (!process.stdin.isTTY) {
    console.log('⚠️ 非対話環境のため確認プロンプトをスキップします。');
    return true;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, (ans) => resolve(ans && ans.trim().toLowerCase())));

  try {
    while (true) {
      const answer = await question('この環境での実行で問題ないですか？ (y/n): ');
      if (answer === 'y') {
        console.log('✅ 続行します');
        return true;
      } else if (answer === 'n') {
        console.log('🛑 停止します');
        return false;
      } else {
        console.log("入力が認識されませんでした。'y' か 'n' を入力してください。");
      }
    }
  } finally {
    rl.close();
  }
}