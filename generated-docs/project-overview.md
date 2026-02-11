Last updated: 2026-02-12

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- 音声の波形やイントネーションを可視化し、ユーザーがテキスト入力と再生を直感的に操作できます。
- GitHub Pagesで簡単にデプロイされ、手軽に利用できる環境が提供されています。

## 技術スタック
- フロントエンド: 
    - HTML/CSS/JavaScript: Webアプリケーションの基本的なマークアップ、スタイル、振る舞いを記述するための基盤技術。
    - TypeScript: JavaScriptに静的型付けを追加し、大規模なアプリケーション開発をサポートする言語です。
- 音楽・オーディオ: 
    - Tone.js v15: Web Audio APIを抽象化し、ブラウザ上で高度な音声生成、再生、エフェクト処理を可能にするJavaScriptライブラリです。
    - VOICEVOX API: ローカルで動作するVOICEVOXエンジンと連携し、テキストから高品質な音声データを生成するためのAPIです。
- 開発ツール: 
    - Vite: 高速な開発サーバーとモダンなフロントエンドビルド機能を提供するツールです。開発時の生産性を向上させます。
- テスト: (情報なし)
- ビルドツール: 
    - Vite: プロジェクトを本番環境向けに最適化してビルドするためのツールとしても使用されます。
- 言語機能: 
    - TypeScript: 型安全性を高め、開発効率とコードの信頼性を向上させます。
- 自動化・CI/CD: 
    - GitHub Actions: GitHubリポジトリ上でのイベント（例: mainブランチへのプッシュ）をトリガーとして、自動的にビルドやGitHub Pagesへのデプロイを実行するCI/CDツールです。
- 開発標準: 
    - tsconfig.json: TypeScriptコンパイラのオプションや設定を定義し、プロジェクト全体の型チェックやコンパイル挙動を統一します。

## ファイル階層ツリー
```
📄 .gitignore
📄 LICENSE
📖 README.ja.md
📖 README.md
📁 generated-docs/
🌐 index.html
📁 issue-notes/
  📖 18.md
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 main.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
-   `.gitignore`: Gitのバージョン管理システムで追跡対象から除外するファイルやディレクトリを指定します。
-   `LICENSE`: プロジェクトが公開されているライセンス情報（例: MIT License）を記述したファイルです。
-   `README.ja.md`: プロジェクトの概要、機能、セットアップ方法、使い方などを日本語で詳細に説明するドキュメントです。
-   `README.md`: `README.ja.md`を元に自動生成された、プロジェクトの英語版ドキュメントです。
-   `generated-docs/`: プロジェクトに関連する自動生成されたドキュメントやファイルを格納するディレクトリです。
-   `index.html`: WebアプリケーションのエントリポイントとなるHTMLファイルで、ユーザーインターフェースの基本的な構造を定義します。
-   `issue-notes/`: 開発過程で記録された、Issueに関するAI生成のメモや関連情報が格納されているディレクトリです。
-   `package-lock.json`: `package.json`に記述されたnpmパッケージの依存関係について、インストールされた正確なバージョンとツリー構造を記録し、ビルドの再現性を保証します。
-   `package.json`: プロジェクトのメタデータ（名前、バージョンなど）、スクリプト、および開発・実行に必要なnpmパッケージの依存関係を定義するファイルです。
-   `src/main.ts`: アプリケーションの主要なロジックが記述されたTypeScriptファイルです。VOICEVOX APIとの連携、音声の再生、UI操作、波形やスペクトログラムなどの可視化機能、イントネーション調整などが含まれます。
-   `tsconfig.json`: TypeScriptコンパイラの設定ファイルで、コンパイルオプション、インクルード・エクスクルードするファイルなどを定義し、プロジェクトのTypeScript開発環境を構成します。
-   `vite.config.ts`: Viteビルドツールの設定ファイルで、開発サーバーの挙動やビルドプロセスに関する設定（例: プラグイン、エイリアス）を定義します。

## 関数詳細説明
-   `showStatus`: アプリケーションの現在の状態を示すメッセージやインジケータを表示します。
-   `hideStatus`: 表示中のアプリケーション状態メッセージやインジケータを非表示にします。
-   `invalidateColorVariableCache`: カラー変数に関連するキャッシュデータを無効化します。
-   `getColorVariable`: 指定されたカラー変数の値を取得します。
-   `prepareCanvas`: グラフィック描画のためにCanvas要素を初期設定し、描画可能な状態にします。
-   `fftRadix2`: 高速フーリエ変換 (FFT) のRadix-2アルゴリズムを実行し、時間領域の信号を周波数領域に変換します。
-   `getHannWindow`: 音声信号処理に用いられるHann窓関数を生成します。
-   `estimateFrequencySeries`: 音声データから周波数系列を推定し、周波数スペクトルを計算します。
-   `drawRenderedWaveform`: 生成またはレンダリングされた音声データの波形をCanvasに描画します。
-   `drawRealtimeWaveform`: リアルタイムで入力される音声データ（または処理中のデータ）の波形をCanvasに描画します。
-   `determineSpectrogramCeiling`: スペクトログラムの表示範囲における最大強度値を決定します。
-   `drawSpectrogram`: 音声の周波数スペクトルを時間軸に沿って色や濃淡で表現するスペクトログラムをCanvasに描画します。
-   `initializeVisualizationCanvases`: 音声の波形やスペクトログラム、イントネーションなどを表示するためのCanvas要素群を初期化します。
-   `updateIntonationTiming`: 音声のイントネーション（抑揚）に関するタイミング情報を更新します。
-   `initializeIntonationCanvas`: イントネーションのグラフ描画に特化したCanvas要素を初期化します。
-   `buildIntonationPointsFromQuery`: VOICEVOXからのオーディオクエリ情報に基づいて、イントネーショングラフを構成するポイントデータを生成します。
-   `renderIntonationLabels`: イントネーショングラフ上のラベル（例: 音素、ピッチ値）を描画します。
-   `drawIntonationChart`: ユーザーが調整可能なイントネーションのピッチカーブをグラフとしてCanvasに描画します。
-   `adjustIntonationScale`: イントネーショングラフの表示スケール（拡大・縮小）を調整します。
-   `pitchFromY`: イントネーショングラフのY座標から対応するピッチ（音高）の値を計算します。
-   `findNearestIntonationPoint`: 指定された座標に最も近いイントネーションコントロールポイントを検索します。
-   `applyPitchToQuery`: ユーザーが調整したピッチ情報をVOICEVOXのオーディオクエリに適用します。
-   `scheduleIntonationPlayback`: イントネーションの調整結果に基づいた音声の再生をスケジュールします。
-   `playUpdatedIntonation`: 更新されたイントネーション情報で音声を再生します。
-   `fetchAndRenderIntonation`: VOICEVOXからイントネーションデータを取得し、それをCanvas上に描画します。
-   `handleIntonationPointerDown`: イントネーショングラフ上でポインター（マウスやタッチ）が押された際のイベントを処理し、調整開始の準備をします。
-   `handleIntonationPointerMove`: イントネーショングラフ上でポインターが移動した際のイベントを処理し、リアルタイムでピッチカーブを調整します。
-   `handleIntonationPointerUp`: イントネーショングラフ上でポインターが離された際のイベントを処理し、調整の完了を検出します。
-   `handleIntonationKeyDown`: イントネーション調整中にキーボードが押された際のイベントを処理します。
-   `updateExportButtonState`: 音声のエクスポートボタンが利用可能かどうかの状態を更新します。
-   `downloadLastAudio`: 最後に合成・再生された音声データをファイルとしてダウンロードします。
-   `scheduleAutoPlay`: 特定の条件が満たされた際に、音声の自動再生をスケジュールします。
-   `getAudioQuery`: VOICEVOX APIに対してテキストを渡し、音声合成のためのオーディオクエリ（パラメータ）を取得します。
-   `synthesize`: 取得したオーディオクエリとVOICEVOX APIを使用して、実際の音声データ（WAV形式など）を合成します。
-   `playAudio`: 合成された音声データをWeb Audio API (`Tone.js`) を介してブラウザで再生します。
-   `handlePlay`: ユーザーが「再生」ボタンをクリックした際に、テキストから音声合成・再生までの一連の処理を制御します。
-   `drawTick`: 可視化グラフのX軸やY軸に目盛り線とラベルを描画します。
-   `yToBin`: CanvasのY座標を、オーディオ処理で使用される周波数ビンのインデックスに変換します。
-   `triggerPlay`: 音声再生処理全体の開始点となる主要な関数で、UIの状態更新や音声合成・再生フローを呼び出します。
-   `render`: アプリケーションのUI要素や可視化Canvasの内容を描画・更新します。
-   `cleanup`: アプリケーション終了時や状態リセット時に、使用されたリソース（イベントリスナー、タイマーなど）を解放し、クリーンな状態に戻します。
-   `updateSpectrogramScaleLabel`: スペクトログラムの表示スケールに関連するラベルを更新します。
-   `updateIntonationKeyboardToggle`: イントネーション調整におけるキーボード操作の有効/無効状態を切り替えます。

## 関数呼び出し階層ツリー
```
- triggerPlay (src/main.ts)
  - showStatus (src/main.ts)
    - hideStatus ()
      - invalidateColorVariableCache ()
      - getColorVariable ()
      - prepareCanvas ()
      - fftRadix2 ()
      - getHannWindow ()
      - estimateFrequencySeries ()
      - drawRenderedWaveform ()
      - drawRealtimeWaveform ()
      - determineSpectrogramCeiling ()
      - drawSpectrogram ()
      - initializeVisualizationCanvases ()
      - updateIntonationTiming ()
      - initializeIntonationCanvas ()
      - buildIntonationPointsFromQuery ()
      - renderIntonationLabels ()
      - drawIntonationChart ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - applyPitchToQuery ()
      - scheduleIntonationPlayback ()
      - playUpdatedIntonation ()
      - fetchAndRenderIntonation ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationKeyDown ()
      - updateExportButtonState ()
      - downloadLastAudio ()
      - scheduleAutoPlay ()
      - getAudioQuery ()
      - synthesize ()
      - playAudio ()
      - handlePlay ()
      - drawTick ()
      - yToBin ()
      - render ()
      - cleanup ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()

---
Generated at: 2026-02-12 07:05:37 JST
