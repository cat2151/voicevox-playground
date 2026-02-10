# voicevox-playground

**VOICEVOX ローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。**

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
  <a href="https://deepwiki.com/cat2151/voicevox-playground"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

※このドキュメントは大部分がAI生成です。issueをagentに投げて生成させました。一部は人力で書いています。

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

   ローカル開発サーバー（`npm run dev` が提供する `http://localhost:5173`）からも利用する場合は、上記に続けて `http://localhost:5173` も追加してください。

   ```bash
   <your VOICEVOX directory>/vv-engine/run --cors_policy_mode all --allow_origin https://cat2151.github.io http://localhost:5173
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

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています

*Let VOICEVOX handle the talking.*
