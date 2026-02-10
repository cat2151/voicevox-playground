# voicevox-playground

VOICEVOX ローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。

## 機能

- VOICEVOXローカルHTTPサーバー（ポート50021）にリクエストを送信
- ずんだもんの音声で任意のテキストを読み上げ
- Tone.js v15を使用した音声再生
- GitHub Pagesにデプロイ

## 前提条件

VOICEVOXのローカルサーバーが起動していることが必要です。

1. [VOICEVOX](https://voicevox.hiroshiba.jp/)をダウンロードしてインストール
2. VOICEVOXを起動（ポート50021でHTTPサーバーが起動します）。GitHub Pages版（`https://cat2151.github.io/voicevox-playground/`）やローカル開発サーバー（`http://localhost:5173`）からアクセスする場合はCORSの許可が必要です。以下のように起動すると両方のオリジンを許可できます。

   ```powershell
   VOICEVOX.exe --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173
   ```

   既に起動している場合は <http://127.0.0.1:50021/setting> を開き、上記オリジンを追加して保存後にエンジンを再起動してください。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## デプロイ

GitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

1. リポジトリの Settings > Pages で、Source を "GitHub Actions" に設定
2. mainブランチにプッシュすると自動的にデプロイされます

## 使い方

1. VOICEVOXを起動
2. ブラウザでアプリケーションを開く
3. テキストエリアに読み上げたいテキストを入力
4. 「再生」ボタンをクリック

## 技術スタック

- TypeScript
- Vite
- Tone.js v15
- VOICEVOX API
