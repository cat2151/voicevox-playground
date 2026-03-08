Last updated: 2026-03-09

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、Webブラウザ上でテキストを音声に変換して再生するWebアプリケーションです。
- 複数のキャラクターの音声を選択し、入力されたテキストを即座に読み上げ、イントネーションの編集も可能です。
- VOICEVOXをWebから簡単に操作できることを実証し、手軽なクライアントアプリ開発を支援することを目的としています。

## 技術スタック
- フロントエンド:
  - TypeScript: 型安全なJavaScript開発を可能にする言語。
  - Vite: 高速な開発サーバーとモダンなビルドプロセスを提供する開発ツール。
  - GitHub Pages: Webアプリケーションを公開・デプロイするためのホスティングサービス。
- 音楽・オーディオ:
  - Tone.js v15: Web Audio APIをベースにした、Web上での音楽・オーディオ処理のための強力なフレームワーク。
  - VOICEVOX API: 音声合成エンジンVOICEVOXのローカルHTTPサーバーと連携するためのインターフェース。
- 開発ツール:
  - npm: Node.jsのパッケージマネージャーで、プロジェクトの依存関係の管理に使用されます。
- テスト:
  - Vitest: 高速な単体テストフレームワークで、各種テストの実行に利用されます。
  - jsdom: Node.js環境でブラウザのDOM（Document Object Model）をエミュレートし、DOM操作を伴うテストを可能にします。
- ビルドツール:
  - Vite: (上記フロントエンドと重複しますが、ビルドプロセスを担当) 高速な開発サーバーとモダンなビルドプロセスを提供します。
- 言語機能:
  - TypeScript: JavaScriptに静的型付けを追加し、大規模なアプリケーション開発の堅牢性を高めます。
- 自動化・CI/CD:
  - GitHub Actions: GitHubリポジトリ上で様々なタスクを自動化するためのプラットフォーム。本プロジェクトではREADMEの自動翻訳などに利用されています。
- 開発標準:
  - @biomejs/biome: 高速なコードフォーマッタ、リンタ、およびテストランナーを兼ね備え、コード品質と一貫性を維持します。

## ファイル階層ツリー
```
📄 .gitignore
📖 AGENTS.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📊 biome.json
📁 generated-docs/
🌐 index.html
📁 issue-notes/
  📖 100.md
  📖 110.md
  📖 111.md
  📖 113.md
  📖 115.md
  📖 116.md
  📖 117.md
  📖 118.md
  📖 119.md
  📖 120.md
  📖 121.md
  📖 122.md
  📖 123.md
  📖 138.md
  📖 140.md
  📖 155.md
  📖 22.md
  📖 23.md
  📖 24.md
  📖 25.md
  📖 26.md
  📖 27.md
  📖 30.md
  📖 45.md
  📖 56.md
  📖 62.md
  📖 64.md
  📖 65.md
  📖 66.md
  📖 67.md
  📖 68.md
  📖 72.md
  📖 74.md
  📖 79.md
  📖 80.md
  📖 89.md
  📖 92.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📁 intonation/
    📘 display.ts
    📘 handlers.test.ts
    📘 handlers.ts
    📘 playback.test.ts
    📘 playback.ts
    📘 state.ts
    📘 utils.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 main.ts
  📘 playback.test.ts
  📘 playback.truncation.test.ts
  📘 playback.ts
  📘 settings.test.ts
  📘 settings.ts
  📘 state.ts
  📘 status.ts
  📘 styleManager.test.ts
  📘 styleManager.ts
  📁 styles/
    🎨 base.css
    🎨 intonation.css
  🎨 styles.css
  📘 textLists.test.ts
  📘 textLists.ts
  📘 uiControls.ts
  📁 visualization/
    📘 canvas.ts
    📘 fft.ts
    📘 fftMaxFreq.ts
    📘 fftOverlay.test.ts
    📘 fftOverlay.ts
    📘 fftUtils.ts
    📘 spectrogram.ts
    📘 spectrogramCache.ts
    📘 timeAxis.ts
    📘 waveform.ts
  📘 visualization.test.ts
  📘 visualization.ts
  📘 vite-env.d.ts
📊 tsconfig.json
📘 vite.config.ts
```

## ファイル詳細説明
- **.gitignore**: Gitのバージョン管理から除外するファイルやディレクトリを指定します。
- **AGENTS.md**: プロジェクトで協力しているAIエージェントや自動化ツールに関する情報が記述されている可能性があります。
- **LICENSE**: プロジェクトのライセンス情報（著作権や利用条件）を記述します。
- **README.ja.md**: プロジェクトの概要、機能、使い方、開発方法などを日本語で説明するメインのドキュメントです。
- **README.md**: `README.ja.md` の英語版で、プロジェクトのグローバルな情報提供に使用されます。
- **biome.json**: コードフォーマッタ・リンタであるBiomeの設定ファイルです。
- **generated-docs/**: 自動生成されたドキュメントを格納するためのディレクトリです。
- **index.html**: WebアプリケーションのエントリーポイントとなるHTMLファイルです。
- **issue-notes/**: 開発中に検討された課題やアイデア、メモを記録するためのファイル群が格納されています。
- **package-lock.json**: `package.json` に記述された依存関係の正確なバージョンとツリー構造を記録し、ビルドの一貫性を保証します。
- **package.json**: プロジェクトのメタデータ（名前、バージョンなど）と、依存するnpmパッケージを定義します。
- **src/audio.ts**: VOICEVOX APIへのリクエスト送信、音声データの取得、オーディオバッファの結合・エンコードなど、オーディオ処理に関する主要なロジックを扱います。
- **src/config.ts**: アプリケーション全体で使用される設定値や定数を定義します。
- **src/intonation/display.ts**: イントネーション表示用のキャンバスの描画、ピッチ範囲の計算、ユーザーインターフェースの更新など、視覚化と表示に関するロジックを管理します。
- **src/intonation/handlers.test.ts**: `src/intonation/handlers.ts` の機能をテストするコードです。
- **src/intonation/handlers.ts**: イントネーションの編集に関するユーザーインタラクション（ポインタ操作、キーボード操作など）を処理するイベントハンドラを定義します。
- **src/intonation/playback.test.ts**: `src/intonation/playback.ts` の機能をテストするコードです。
- **src/intonation/playback.ts**: イントネーション編集後の音声再生、キャッシュ管理、VOICEVOXからの音声取得とレンダリングに関するロジックを扱います。
- **src/intonation/state.ts**: イントネーション編集の状態管理（タイミング情報の更新など）を行います。
- **src/intonation/utils.ts**: イントネーション関連の共通ユーティリティ関数（オーディオクエリの検証や複製など）を提供します。
- **src/intonation.test.ts**: イントネーション関連の全体的な機能をテストするコードです。
- **src/intonation.ts**: イントネーションのお気に入り管理、状態リセット、イベントハンドラの設定、描画更新など、イントネーション機能の統合的な管理を行います。
- **src/main.ts**: アプリケーションのメインエントリーポイントで、初期設定の適用、スタイル選択、各種UI要素の初期化とイベントリスナーの設定を行います。
- **src/playback.test.ts**: 音声再生機能の全体的なテストコードです。
- **src/playback.truncation.test.ts**: 音声再生の切り捨て（truncation）に関するテストコードです。
- **src/playback.ts**: 音声の再生、停止、ループ、ダウンロード、キャッシュ管理など、再生に関する全てのロジックを担います。
- **src/settings.test.ts**: 設定管理機能のテストコードです。
- **src/settings.ts**: アプリケーションの設定（VOICEVOXポート、周波数パーセンテージなど）の読み込み、保存、リセットを行います。
- **src/state.ts**: アプリケーション全体で共有されるシンプルな状態管理を行います。
- **src/status.ts**: アプリケーションのステータス表示（メッセージの表示・非表示、色の取得など）を管理します。
- **src/styleManager.test.ts**: スタイル管理機能のテストコードです。
- **src/styleManager.ts**: VOICEVOXのスタイル（話者、話速など）の選択、管理、取得、およびUIへの反映に関するロジックを扱います。
- **src/styles/base.css**: アプリケーションの基本的なスタイルを定義するCSSファイルです。
- **src/styles/intonation.css**: イントネーション表示部分に特化したスタイルを定義するCSSファイルです。
- **src/styles.css**: 全体的なスタイルシートの統合や、追加のスタイル定義を行うCSSファイルです。
- **src/textLists.test.ts**: テキストリスト管理機能のテストコードです。
- **src/textLists.ts**: テキストの履歴やお気に入りリストの管理、永続化、レンダリングを行います。
- **src/uiControls.ts**: UIコントロール（例: エクスポートボタンの状態更新）に関するユーティリティ関数を提供します。
- **src/visualization/canvas.ts**: キャンバス要素の準備や初期化に関する基本的なユーティリティを提供します。
- **src/visualization/fft.ts**: 高速フーリエ変換 (FFT) の計算ロジックを提供します。
- **src/visualization/fftMaxFreq.ts**: FFT結果から最大周波数を検出するためのロジックを提供します。
- **src/visualization/fftOverlay.test.ts**: FFTオーバーレイ表示のテストコードです。
- **src/visualization/fftOverlay.ts**: リアルタイムFFTの描画、ピーク検出、ラベル表示など、FFTの視覚化に関するロジックを扱います。
- **src/visualization/fftUtils.ts**: FFTのデータ変換（周波数とビン、Y座標間の変換）に関するユーティリティ関数を提供します。
- **src/visualization/spectrogram.ts**: スペクトログラムの計算、色変換、描画、オーディオコンテンツハッシュの生成など、スペクトログラム表示に関するロジックを扱います。
- **src/visualization/spectrogramCache.ts**: スペクトログラム画像のキャッシュ管理、分析、初期化に関するロジックを扱います。
- **src/visualization/timeAxis.ts**: タイム軸のラベルフォーマット、ティックの構築、描画など、時間表示に関するロジックを扱います。
- **src/visualization/waveform.ts**: ウェーブフォーム（波形）の統計計算、相関抽出、リアルタイムおよびレンダリングされた波形の描画に関するロジックを扱います。
- **src/visualization.test.ts**: 視覚化機能の全体的なテストコードです。
- **src/visualization.ts**: 視覚化キャンバスの初期化、再生中の波形・スペクトログラム描画、進捗バーの更新など、オーディオ視覚化の全体的な管理を行います。
- **src/vite-env.d.ts**: Vite環境固有の型定義ファイルです。
- **vite.config.ts**: Viteのビルド設定を定義するファイルです。

## 関数詳細説明
- **getAudioQuery** (src/audio.ts): VOICEVOX APIからテキストに対応する音声クエリ（イントネーション情報など）を取得します。
- **synthesize** (src/audio.ts): 音声クエリに基づいてVOICEVOX APIから音声データを合成・取得します。
- **combineAudioBuffers** (src/audio.ts): 複数のAudioBufferオブジェクトを一つに結合します。
- **encodeAudioBufferToWav** (src/audio.ts): AudioBufferをWAV形式のバイナリデータにエンコードします。
- **writeString** (src/audio.ts): 文字列データを指定されたフォーマットで書き出す、あるいは処理する機能です。
- **clamp** (src/audio.ts): 数値を指定された最小値と最大値の範囲内に制限します。
- **getPitchRange** (src/intonation/display.ts): イントネーション表示のためのピッチ（音高）の表示範囲を計算します。
- **calculateBasePadding** (src/intonation/display.ts): イントネーション表示のベースパディング（余白）を計算します。
- **getBaseDisplayRange** (src/intonation/display.ts): イントネーション表示の基本となる表示範囲を取得します。
- **calculateDisplayRange** (src/intonation/display.ts): イントネーション表示の動的な表示範囲を計算します。
- **clampRangeExtra** (src/intonation/display.ts): 表示範囲の超過部分をクランプ（制限）します。
- **applyRangeExtra** (src/intonation/display.ts): 表示範囲の超過部分を適用します。
- **refreshDisplayRange** (src/intonation/display.ts): イントネーション表示の範囲をリフレッシュします。
- **clampPitchToDisplayRange** (src/intonation/display.ts): ピッチ値を表示範囲内にクランプします。
- **calculateStepSize** (src/intonation/display.ts): イントネーション編集のステップサイズを計算します。
- **calculateLetterKeyAdjustment** (src/intonation/display.ts): キーボード操作による文字ごとの調整量を計算します。
- **handleIntonationWheel** (src/intonation/display.ts): イントネーション表示上でのマウスホイール操作を処理します。
- **ensureWheelHandler** (src/intonation/display.ts): ホイールイベントハンドラが適切に設定されていることを確認します。
- **updateInitialRangeFromPoints** (src/intonation/display.ts): イントネーションポイントから初期表示範囲を更新します。
- **initializeIntonationCanvas** (src/intonation/display.ts): イントネーション表示用キャンバスを初期化します。
- **buildIntonationPointsFromQuery** (src/intonation/display.ts): 音声クエリからイントネーション表示用のポイントデータを構築します。
- **renderIntonationLabels** (src/intonation/display.ts): イントネーション表示上のラベル（文字など）をレンダリングします。
- **updateHoveredLabel** (src/intonation/display.ts): マウスオーバーされたイントネーションラベルを更新します。
- **drawIntonationChart** (src/intonation/display.ts): イントネーションのチャートを描画します。
- **adjustIntonationScale** (src/intonation/display.ts): イントネーションの表示スケールを調整します。
- **pitchFromY** (src/intonation/display.ts): Y座標からピッチ値に変換します。
- **findNearestIntonationPoint** (src/intonation/display.ts): 指定された位置に最も近いイントネーションポイントを見つけます。
- **disableLoopOnIntonationEdit** (src/intonation/handlers.ts): イントネーション編集時にループ再生を無効にします。
- **applyPitchToQuery** (src/intonation/handlers.ts): 編集されたピッチ情報を音声クエリに適用します。
- **applyPitchEdit** (src/intonation/handlers.ts): ピッチ編集を適用し、関連するUIを更新します。
- **handleIntonationPointerDown** (src/intonation/handlers.ts): イントネーション表示上でのポインタダウンイベントを処理します。
- **handleIntonationPointerMove** (src/intonation/handlers.ts): イントネーション表示上でのポインタムーブイベントを処理します。
- **handleIntonationPointerUp** (src/intonation/handlers.ts): イントネーション表示上でのポインタアップイベントを処理します。
- **handleIntonationMouseMove** (src/intonation/handlers.ts): イントネーション表示上でのマウスムーブイベントを処理します。
- **handleIntonationMouseLeave** (src/intonation/handlers.ts): イントネーション表示からマウスが離れたイベントを処理します。
- **handleIntonationKeyDown** (src/intonation/handlers.ts): イントネーション編集時のキーボードダウンイベントを処理します。
- **scheduleIntonationPlayback** (src/intonation/playback.ts): イントネーション編集後の音声再生をスケジュールします。
- **replayCachedIntonationAudio** (src/intonation/playback.ts): キャッシュされたイントネーション音声を再再生します。
- **showPlaybackStatus** (src/intonation/playback.ts): 再生ステータスを表示します。
- **buildSynthesisCacheKey** (src/intonation/playback.ts): 音声合成のキャッシュキーを構築します。
- **playUpdatedIntonation** (src/intonation/playback.ts): 更新されたイントネーションで音声を再生します。
- **fetchAndRenderIntonation** (src/intonation/playback.ts): イントネーションデータを取得し、視覚化をレンダリングします。
- **resetIntonationToInitial** (src/intonation/playback.ts): イントネーションを初期状態にリセットします。
- **updateIntonationTiming** (src/intonation/state.ts): イントネーションのタイミング情報を更新します。
- **isValidAudioQueryShape** (src/intonation/utils.ts): AudioQueryオブジェクトの形式が正しいか検証します。
- **cloneAudioQuery** (src/intonation/utils.ts): AudioQueryオブジェクトを複製します。
- **dedupeIntonationFavorites** (src/intonation.ts): イントネーションのお気に入りリストから重複を削除します。
- **parseIntonationFavoritesArray** (src/intonation.ts): イントネーションのお気に入り配列を解析します。
- **loadIntonationFavorites** (src/intonation.ts): 保存されたイントネーションのお気に入りリストを読み込みます。
- **persistIntonationFavorites** (src/intonation.ts): イントネーションのお気に入りリストを永続化（保存）します。
- **resetIntonationState** (src/intonation.ts): イントネーション関連の状態をリセットします。
- **setStyleChangeHandler** (src/intonation.ts): スタイル変更時のハンドラを設定します。
- **setHandlePlayHandler** (src/intonation.ts): 再生ボタンが押された際のハンドラを設定します。
- **initializeIntonationElements** (src/intonation.ts): イントネーション関連のHTML要素を初期化します。
- **isIntonationDirty** (src/intonation.ts): イントネーションが編集されているか（ダーティ状態か）を判定します。
- **isIntonationActive** (src/intonation.ts): イントネーション機能がアクティブであるか（表示されているか）を判定します。
- **hasActiveIntonationQuery** (src/intonation.ts): アクティブなイントネーションクエリが存在するかを判定します。
- **setIntonationKeyboardEnabled** (src/intonation.ts): イントネーション編集時のキーボード操作の有効/無効を設定します。
- **getIntonationKeyboardEnabled** (src/intonation.ts): イントネーション編集時のキーボード操作が有効かを返します。
- **renderIntonationFavoritesList** (src/intonation.ts): イントネーションのお気に入りリストをレンダリングします。
- **removeIntonationFavorite** (src/intonation.ts): イントネーションのお気に入りから項目を削除します。
- **applyIntonationFavorite** (src/intonation.ts): 選択されたイントネーションのお気に入りを適用します。
- **exportIntonationFavorites** (src/intonation.ts): イントネーションのお気に入りリストをエクスポートします。
- **importIntonationFavorites** (src/intonation.ts): イントネーションのお気に入りリストをインポートします。
- **saveCurrentIntonationFavorite** (src/intonation.ts): 現在のイントネーションの状態をお気に入りとして保存します。
- **refreshIntonationChart** (src/intonation.ts): イントネーションチャートをリフレッシュ（再描画）します。
- **setupIntonationCanvasEvents** (src/intonation.ts): イントネーションキャンバスのイベントリスナーを設定します。
- **applySettingsToInputs** (src/main.ts): 現在の設定値をUIの入力フィールドに適用します。
- **refreshStylesAfterPortChange** (src/main.ts): ポート変更後にスタイル関連の表示をリフレッシュします。
- **applyStyleSelection** (src/main.ts): 選択されたスタイルをアプリケーションに適用します。
- **applyRandomStyleSelection** (src/main.ts): ランダムなスタイルを選択して適用します。
- **saveDelimiter** (src/main.ts): テキストの区切り文字設定を保存します。
- **scheduleSaveDelimiter** (src/main.ts): テキストの区切り文字設定の保存をスケジュールします。
- **updateSpectrogramScaleLabel** (src/main.ts): スペクトログラムのスケール表示ラベルを更新します。
- **updateIntonationKeyboardToggle** (src/main.ts): イントネーションキーボードトグルの状態を更新します。
- **clearAudioCache** (src/playback.ts): 音声キャッシュをクリアします。
- **setLoopCheckboxElement** (src/playback.ts): ループ再生のチェックボックス要素を設定します。
- **setPlayButtonAppearance** (src/playback.ts): 再生ボタンの見た目を更新します。
- **isPlayRequestPending** (src/playback.ts): 再生リクエストが保留中であるかを確認します。
- **stopPlaybackAndResetLoop** (src/playback.ts): 再生を停止し、ループ設定をリセットします。
- **getAudioCacheKey** (src/playback.ts): オーディオキャッシュのキーを生成します。
- **setTextAndPlay** (src/playback.ts): テキストを設定し、再生を開始します。
- **downloadLastAudio** (src/playback.ts): 最後に再生された音声をダウンロードします。
- **scheduleAutoPlay** (src/playback.ts): 自動再生をスケジュールします。
- **confirmResetIntonationBeforePlay** (src/playback.ts): 再生前にイントネーションのリセットを確認します。
- **handlePlayButtonClick** (src/playback.ts): 再生ボタンクリックイベントを処理します。
- **handlePlay** (src/playback.ts): 音声再生を開始します。
- **clearRealtimeWaveformCanvas** (src/playback.ts): リアルタイム波形表示キャンバスをクリアします。
- **triggerPlay** (src/playback.ts): 再生処理をトリガーします。
- **cleanup** (src/playback.ts): 再生関連のリソースをクリーンアップします。
- **handleReset** (src/playback.ts): リセットイベントを処理します。
- **handleCancel** (src/playback.ts): キャンセルイベントを処理します。
- **loadSettings** (src/settings.ts): アプリケーション設定を読み込みます。
- **saveSettings** (src/settings.ts): アプリケーション設定を保存します。
- **resetSettings** (src/settings.ts): アプリケーション設定をデフォルトにリセットします。
- **getVoicevoxApiBase** (src/settings.ts): VOICEVOX APIのベースURLを取得します。
- **getVoicevoxNemoApiBase** (src/settings.ts): VOICEVOX Nemo APIのベースURLを取得します。
- **getFrequencyTopPercent** (src/settings.ts): 周波数トップパーセンテージ設定を取得します。
- **getCurrentSettings** (src/settings.ts): 現在のアプケーション設定を取得します。
- **setVoicevoxPort** (src/settings.ts): VOICEVOXのポート番号を設定します。
- **setVoicevoxNemoPort** (src/settings.ts): VOICEVOX Nemoのポート番号を設定します。
- **setFrequencyTopPercent** (src/settings.ts): 周波数トップパーセンテージを設定します。
- **showStatus** (src/status.ts): ステータスメッセージを表示します。
- **hideStatus** (src/status.ts): ステータスメッセージを非表示にします。
- **scheduleHideStatus** (src/status.ts): ステータスメッセージを一定時間後に非表示にするようスケジュールします。
- **invalidateColorVariableCache** (src/status.ts): カラー変数キャッシュを無効化します。
- **getColorVariable** (src/status.ts): CSSカスタムプロパティから色変数の値を取得します。
- **getSelectedStyleId** (src/styleManager.ts): 現在選択されているスタイルIDを取得します。
- **setSelectedStyleId** (src/styleManager.ts): スタイルIDを設定します。
- **selectRandomStyleId** (src/styleManager.ts): ランダムなスタイルIDを選択します。
- **getStyleLabel** (src/styleManager.ts): スタイルIDに対応するラベルを取得します。
- **getStyleById** (src/styleManager.ts): スタイルIDに対応するスタイル情報を取得します。
- **getApiBaseForStyleId** (src/styleManager.ts): スタイルIDに対応するAPIベースURLを取得します。
- **getSpeakerStylesByStyleId** (src/styleManager.ts): スタイルIDに対応する話者のスタイルリストを取得します。
- **resolveStyleMarker** (src/styleManager.ts): スタイルマーカーを解決します。
- **parseDelimiterConfig** (src/styleManager.ts): 区切り文字の設定を解析します。
- **addSegment** (src/styleManager.ts): テキストセグメントを追加します。
- **buildTextSegments** (src/styleManager.ts): テキストからセグメントを構築します。
- **populateStyleSelect** (src/styleManager.ts): スタイル選択ドロップダウンをデータで埋めます。
- **populateSpeakerStyleSelect** (src/styleManager.ts): 話者スタイル選択ドロップダウンをデータで埋めます。
- **fetchVoiceStyles** (src/styleManager.ts): VOICEVOX APIから音声スタイル一覧を取得します。
- **loadStoredList** (src/textLists.ts): 保存されたテキストリスト（履歴やお気に入り）を読み込みます。
- **persistList** (src/textLists.ts): テキストリストを永続化（保存）します。
- **persistLists** (src/textLists.ts): 複数のテキストリストを永続化します。
- **dedupeAndLimit** (src/textLists.ts): テキストリストの重複を削除し、項目数を制限します。
- **renderList** (src/textLists.ts): テキストリストをHTMLにレンダリングします。
- **renderTextLists** (src/textLists.ts): 全てのテキストリスト（履歴とお気に入り）をレンダリングします。
- **moveToFavorites** (src/textLists.ts): テキストを履歴からお気に入りに移動します。
- **moveToHistory** (src/textLists.ts): テキストをお気に入りから履歴に移動します。
- **addToHistory** (src/textLists.ts): テキストを履歴リストに追加します。
- **initializeTextLists** (src/textLists.ts): テキストリスト機能を初期化します。
- **updateExportButtonState** (src/uiControls.ts): エクスポートボタンの有効/無効状態を更新します。
- **prepareCanvas** (src/visualization/canvas.ts): 指定されたキャンバス要素を視覚化のために準備します。
- **getHannWindow** (src/visualization/fft.ts): ハン窓関数を生成します。
- **fftRadix2** (src/visualization/fft.ts, src/visualization/fftMaxFreq.ts): ラディックス2アルゴリズムに基づく高速フーリエ変換を実行します。
- **getMaxFreqByThreshold** (src/visualization/fftMaxFreq.ts): しきい値に基づいて最大周波数を検出します。
- **drawRealtimeFFT** (src/visualization/fftOverlay.ts): リアルタイムのFFT（周波数スペクトル）をキャンバスに描画します。
- **getTopFreqInfo** (src/visualization/fftOverlay.ts): 最も優勢な周波数情報（ピーク）を取得します。
- **findPeakPosition** (src/visualization/fftOverlay.ts): スペクトルデータ内のピーク位置を見つけます。
- **drawPeakLine** (src/visualization/fftOverlay.ts): ピーク周波数を示すラインを描画します。
- **drawFFTLine** (src/visualization/fftOverlay.ts): FFTスペクトルのラインを描画します。
- **drawTopBinLine** (src/visualization/fftOverlay.ts): 最も高いビン（周波数帯）を示すラインを描画します。
- **drawPeakLabel** (src/visualization/fftOverlay.ts): ピーク周波数のラベルを描画します。
- **xToFreq** (src/visualization/fftUtils.ts): X座標を周波数に変換します。
- **freqToBinF** (src/visualization/fftUtils.ts): 周波数をFFTビン番号に変換します。
- **getInterpolatedValue** (src/visualization/fftUtils.ts): 補間された値を取得します。
- **fftValueToY** (src/visualization/fftUtils.ts): FFTの値をY座標に変換します。
- **lerpColor** (src/visualization/spectrogram.ts): 2つの色の間で線形補間を行います。
- **mapIntensityToSpectrogramColor** (src/visualization/spectrogram.ts): 音響強度をスペクトログラムの色にマッピングします。
- **determineSpectrogramCeiling** (src/visualization/spectrogram.ts): スペクトログラムの天井値（最大強度）を決定します。
- **analyzeSpectrogramFrames** (src/visualization/spectrogram.ts): スペクトログラムのフレームを分析します。
- **drawSpectrogram** (src/visualization/spectrogram.ts): スペクトログラム全体を描画します。
- **drawSpectrogramColumn** (src/visualization/spectrogram.ts): スペクトログラムの一列（特定の時間点での周波数強度）を描画します。
- **drawOfflineSpectrogram** (src/visualization/spectrogram.ts): オフライン（録音済み）のスペクトログラムを描画します。
- **computeAudioContentHash** (src/visualization/spectrogram.ts): オーディオコンテンツのハッシュを計算し、キャッシュキーなどに利用します。
- **buildSpectrogramSignature** (src/visualization/spectrogram.ts): スペクトログラムのシグネチャを構築します。
- **processChunk** (src/visualization/spectrogram.ts): オーディオデータのチャンク（断片）を処理します。
- **getSpectrogramScale** (src/visualization/spectrogramCache.ts): スペクトログラムの現在のスケールを取得します。
- **setSpectrogramScale** (src/visualization/spectrogramCache.ts): スペクトログラムのスケールを設定します。
- **requestSpectrogramReset** (src/visualization/spectrogramCache.ts): スペクトログラムのリセットを要求します。
- **createSpectrogramImageCache** (src/visualization/spectrogramCache.ts): スペクトログラムの画像キャッシュを作成します。
- **analyzeAndCacheSpectrogram** (src/visualization/spectrogramCache.ts): スペクトログラムを分析し、キャッシュします。
- **handleSpectrogramInitialization** (src/visualization/spectrogramCache.ts): スペクトログラムの初期化処理をハンドルします。
- **resetSpectrogramCaches** (src/visualization/spectrogramCache.ts): スペクトログラム関連のキャッシュをリセットします。
- **formatTimeLabel** (src/visualization/timeAxis.ts): 時間ラベルの表示形式を整形します。
- **buildTimeTicks** (src/visualization/timeAxis.ts): タイム軸のティック（目盛り）を構築します。
- **drawTimeTicks** (src/visualization/timeAxis.ts): タイム軸のティックを描画します。
- **computeSegmentStats** (src/visualization/waveform.ts): ウェーブフォームセグメントの統計情報を計算します。
- **computeSegmentCorrelation** (src/visualization/waveform.ts): ウェーブフォームセグメント間の相関を計算します。
- **extractAlignedRealtimeSegment** (src/visualization/waveform.ts): 整列されたリアルタイムセグメントを抽出します。
- **drawRenderedWaveform** (src/visualization/waveform.ts): レンダリングされた（合成済み）ウェーブフォームを描画します。
- **drawRealtimeWaveformBackground** (src/visualization/waveform.ts): リアルタイムウェーブフォームの背景を描画します。
- **drawRealtimeWaveformOnly** (src/visualization/waveform.ts): リアルタイムウェーブフォームのみを描画します。
- **isPlaybackActive** (src/visualization.ts): 再生がアクティブであるかを確認します。
- **stopActivePlayback** (src/visualization.ts): アクティブな再生を停止します。
- **initializeVisualizationCanvases** (src/visualization.ts): 視覚化用のキャンバスを初期化します。
- **clearWaveformCanvas** (src/visualization.ts): ウェーブフォームキャンバスをクリアします。
- **playAudio** (src/visualization.ts): 音声再生を開始し、視覚化と同期します。
- **setProgressPosition** (src/visualization.ts): 再生進捗バーの位置を設定します。
- **updateProgressLines** (src/visualization.ts): 進捗ラインを更新します。
- **clearProgressLines** (src/visualization.ts): 進捗ラインをクリアします。
- **drawRealtimeVisuals** (src/visualization.ts): リアルタイム視覚化要素を描画します。
- **handleSpectrogramDraw** (src/visualization.ts): スペクトログラムの描画処理をハンドルします。
- **cleanupPlayback** (src/visualization.ts): 再生関連の視覚化リソースをクリーンアップします。
- **requestSpectrogramDraw** (src/visualization.ts): スペクトログラムの描画を要求します。
- **render** (src/visualization.ts): 視覚化のレンダリングループを実行します。
- **finalize** (src/visualization.ts): 視覚化処理を最終処理します。
- **stopPlayback** (src/visualization.ts): 視覚化を伴う再生を停止します。

## 関数呼び出し階層ツリー
```
- if (src/audio.ts)
  - getAudioQuery (src/audio.ts)
    - synthesize ()
      - combineAudioBuffers ()
      - encodeAudioBufferToWav ()
      - writeString ()
      - clamp ()
  - getPitchRange (src/intonation/display.ts)
    - calculateBasePadding ()
      - getBaseDisplayRange ()
      - calculateDisplayRange ()
      - clampRangeExtra ()
      - applyRangeExtra ()
      - refreshDisplayRange ()
      - clampPitchToDisplayRange ()
      - calculateStepSize ()
      - calculateLetterKeyAdjustment ()
      - handleIntonationWheel ()
      - ensureWheelHandler ()
      - updateInitialRangeFromPoints ()
      - initializeIntonationCanvas ()
      - buildIntonationPointsFromQuery ()
      - renderIntonationLabels ()
      - updateHoveredLabel ()
      - drawIntonationChart ()
      - adjustIntonationScale ()
      - pitchFromY ()
      - findNearestIntonationPoint ()
      - getColorVariable ()
  - disableLoopOnIntonationEdit (src/intonation/handlers.ts)
    - applyPitchToQuery ()
      - applyPitchEdit ()
      - handleIntonationPointerDown ()
      - handleIntonationPointerMove ()
      - handleIntonationPointerUp ()
      - handleIntonationMouseMove ()
      - handleIntonationMouseLeave ()
      - handleIntonationKeyDown ()
      - scheduleIntonationPlayback ()
      - replayCachedIntonationAudio ()
      - showPlaybackStatus ()
  - buildSynthesisCacheKey ()
    - playUpdatedIntonation ()
      - fetchAndRenderIntonation ()
      - resetIntonationToInitial ()
      - updateIntonationTiming ()
      - cloneAudioQuery ()
      - showStatus ()
      - scheduleHideStatus ()
      - getApiBaseForStyleId ()
      - updateExportButtonState ()
      - drawRenderedWaveform ()
      - initializeVisualizationCanvases ()
      - playAudio ()
  - setHandlePlayHandler ()
    - isValidAudioQueryShape (src/intonation/utils.ts)
    - dedupeIntonationFavorites (src/intonation.ts)
      - parseIntonationFavoritesArray ()
      - loadIntonationFavorites ()
      - persistIntonationFavorites ()
      - resetIntonationState ()
      - setStyleChangeHandler ()
      - initializeIntonationElements ()
      - isIntonationDirty ()
      - isIntonationActive ()
      - hasActiveIntonationQuery ()
      - setIntonationKeyboardEnabled ()
      - getIntonationKeyboardEnabled ()
      - renderIntonationFavoritesList ()
      - removeIntonationFavorite ()
      - applyIntonationFavorite ()
      - exportIntonationFavorites ()
      - importIntonationFavorites ()
      - saveCurrentIntonationFavorite ()
      - refreshIntonationChart ()
      - setupIntonationCanvasEvents ()
      - stopActivePlayback ()
  - applySettingsToInputs (src/main.ts)
    - refreshStylesAfterPortChange ()
      - applyStyleSelection ()
      - applyRandomStyleSelection ()
      - updateSpectrogramScaleLabel ()
      - updateIntonationKeyboardToggle ()
      - clearAudioCache ()
      - setLoopCheckboxElement ()
      - setPlayButtonAppearance ()
      - isPlayRequestPending ()
      - scheduleAutoPlay ()
      - handlePlayButtonClick ()
      - handlePlay ()
      - loadSettings ()
      - resetSettings ()
      - getCurrentSettings ()
      - setVoicevoxPort ()
      - setVoicevoxNemoPort ()
      - setFrequencyTopPercent ()
      - getSelectedStyleId ()
      - setSelectedStyleId ()
      - selectRandomStyleId ()
      - populateStyleSelect ()
      - populateSpeakerStyleSelect ()
      - fetchVoiceStyles ()
      - initializeTextLists ()
      - getSpectrogramScale ()
      - setSpectrogramScale ()
      - isPlaybackActive ()
  - stopPlaybackAndResetLoop ()
    - getAudioCacheKey ()
      - setTextAndPlay ()
      - downloadLastAudio ()
      - confirmResetIntonationBeforePlay ()
      - clearRealtimeWaveformCanvas ()
      - cleanup ()
      - handleCancel ()
      - parseDelimiterConfig ()
      - buildTextSegments ()
      - addToHistory ()
  - saveSettings ()
    - getVoicevoxApiBase ()
      - getVoicevoxNemoApiBase ()
      - getFrequencyTopPercent ()
  - hideStatus ()
    - invalidateColorVariableCache ()
  - getStyleLabel ()
    - getStyleById ()
      - getSpeakerStylesByStyleId ()
      - resolveStyleMarker ()
      - addSegment ()
  - loadStoredList (src/textLists.ts)
    - persistList ()
      - persistLists ()
      - dedupeAndLimit ()
      - renderList ()
      - renderTextLists ()
      - moveToFavorites ()
      - moveToHistory ()
  - prepareCanvas (src/visualization/canvas.ts)
  - getHannWindow (src/visualization/fft.ts)
    - fftRadix2 ()
      - getMaxFreqByThreshold (src/visualization/fftMaxFreq.ts)
  - drawRealtimeFFT ()
    - getTopFreqInfo ()
      - findPeakPosition ()
      - drawPeakLine ()
      - drawFFTLine ()
      - drawTopBinLine ()
      - drawPeakLabel ()
      - xToFreq ()
      - freqToBinF ()
      - getInterpolatedValue ()
      - fftValueToY ()
  - lerpColor (src/visualization/spectrogram.ts)
    - mapIntensityToSpectrogramColor ()
      - determineSpectrogramCeiling ()
      - analyzeSpectrogramFrames ()
      - drawSpectrogram ()
      - drawSpectrogramColumn ()
      - drawOfflineSpectrogram ()
      - computeAudioContentHash ()
      - buildSpectrogramSignature ()
      - processChunk ()
      - drawTimeTicks ()
  - catch (src/audio.ts)
  - requestSpectrogramReset ()
    - createSpectrogramImageCache ()
      - analyzeAndCacheSpectrogram ()
      - handleSpectrogramInitialization ()
      - resetSpectrogramCaches ()
      - requestSpectrogramDraw ()
  - formatTimeLabel (src/visualization/timeAxis.ts)
    - buildTimeTicks ()
  - computeSegmentStats (src/visualization/waveform.ts)
    - computeSegmentCorrelation ()
      - extractAlignedRealtimeSegment ()
      - drawRealtimeWaveformBackground ()
      - drawRealtimeWaveformOnly ()
  - clearWaveformCanvas ()
    - setProgressPosition ()
      - updateProgressLines ()
      - clearProgressLines ()
      - drawRealtimeVisuals ()
      - handleSpectrogramDraw ()
      - cleanupPlayback ()
      - render ()
      - finalize ()
      - stopPlayback ()
- for (src/audio.ts)
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- makeDOM (src/playback.truncation.test.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
- while (src/styleManager.ts)

---
Generated at: 2026-03-09 07:02:03 JST
