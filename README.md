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
2. VOICEVOXエンジンを起動（ポート50021でHTTPサーバーが起動します）。GitHub Pages版（`https://cat2151.github.io/voicevox-playground/`）からアクセスする場合は、CORSを許可した状態で以下のコマンドを使用してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io
   ```

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
