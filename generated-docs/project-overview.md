Last updated: 2026-03-02

# Project Overview

## プロジェクト概要
- VOICEVOXローカルサーバーと連携し、テキストを音声に変換して再生するWebアプリケーションです。
- 任意のテキストを複数のキャラクターの音声で読み上げ、イントネーションの編集も可能です。
- VOICEVOXクライアントアプリの簡易構築を実証し、手軽な音声再生体験を提供することを目指します。

## 技術スタック
- フロントエンド: **TypeScript** (型安全なJavaScriptでアプリケーションを構築), **Vite** (高速な開発サーバーとビルドツールを提供)
- 音楽・オーディオ: **Tone.js v15** (Web Audio APIを抽象化し、音声再生・加工を容易にするライブラリ), **VOICEVOX API** (ローカルで動作するVOICEVOXエンジンと連携し、音声合成機能を提供)
- 開発ツール: **npm** (Node.jsのパッケージマネージャーとして、プロジェクトの依存関係管理とスクリプト実行に使用)
- テスト: **vitest** (JavaScript/TypeScriptプロジェクト向けの高速なテストフレームワーク), **jsdom** (Node.js環境でブラウザのDOMをシミュレートし、DOM操作のテストを可能にする)
- ビルドツール: **Vite** (開発サーバーの起動、本番用ビルドの生成に使用)
- 言語機能: **TypeScript** (JavaScriptに静的型付けを追加し、大規模なプロジェクトでの堅牢性を向上)
- 自動化・CI/CD: **GitHub Pages** (Webアプリケーションのホスティングとデプロイに使用), **GitHub Actions** (READMEファイルの自動翻訳などの自動化プロセスに利用)
- 開発標準: **@biomejs/biome** (コードの整形、Lint、フォーマットを統合的に行うツールで、コード品質と一貫性を維持)

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
  📖 127.md
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
  📖 97.md
  📖 99.md
📊 package-lock.json
📊 package.json
📁 src/
  📘 audio.ts
  📘 config.ts
  📘 intonation.test.ts
  📘 intonation.ts
  📘 intonationDisplay.ts
  📘 intonationHandlers.ts
  📘 intonationPlayback.ts
  📘 intonationState.ts
  📘 intonationUtils.ts
  📘 main.ts
  📘 playback.test.ts
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
- **.gitignore**: Gitがバージョン管理の対象から除外するファイルやディレクトリを指定する設定ファイルです。
- **AGENTS.md**: プロジェクトの開発に協力したAIエージェントやツールに関する情報を記述するファイルです。
- **LICENSE**: プロジェクトのライセンス情報（ソフトウェアの使用、複製、配布条件）が記述されています。
- **README.ja.md**: プロジェクトの概要、機能、使い方、開発方法などを日本語で説明する主要なドキュメントです。
- **README.md**: プロジェクトの概要などを英語で説明するドキュメントで、`README.ja.md`を元に自動生成されています。
- **biome.json**: コードの整形、Lint、フォーマットを統一的に行うBiomeツールの設定ファイルです。
- **generated-docs/**: 自動生成されたドキュメントが格納されるディレクトリです。
- **index.html**: WebアプリケーションのエントリポイントとなるHTMLファイルです。ユーザーインターフェースの骨格を定義し、スクリプトを読み込みます。
- **issue-notes/**: 開発時のメモや検討事項を記録したファイル群を格納するディレクトリです。
- **package-lock.json**: `package.json`で定義された依存関係の正確なバージョンとツリー構造を記録し、ビルドの再現性を保証します。
- **package.json**: プロジェクトのメタデータ（名前、バージョンなど）と依存関係、スクリプトコマンドを定義するファイルです。
- **src/audio.ts**: VOICEVOX APIへのリクエストを処理し、音声データの取得、合成、結合、WAVエンコードを行います。
- **src/config.ts**: VOICEVOX APIのエンドポイントURLやポート番号など、アプリケーション全体の構成設定を定義します。
- **src/intonation.test.ts**: イントネーション関連機能の単体テストを記述するファイルです。
- **src/intonation.ts**: イントネーション編集機能の中核ロジック、お気に入り管理、UIの初期化などを担当します。
- **src/intonationDisplay.ts**: イントネーションチャートの描画、表示範囲の計算、ユーザー操作による表示調整など、表示関連のロジックを扱います。
- **src/intonationHandlers.ts**: イントネーションチャートに対するユーザーのポインター（マウス/タッチ）やキーボード操作イベントを処理します。
- **src/intonationPlayback.ts**: イントネーション編集後の音声再生、キャッシュ管理、再生ステータス表示などを制御します。
- **src/intonationState.ts**: イントネーション編集に関する現在のアクティブな状態やタイミング情報を管理します。
- **src/intonationUtils.ts**: イントネーション関連の共通ユーティリティ関数（オーディオクエリの検証やクローンなど）を提供します。
- **src/main.ts**: アプリケーションの主要な初期化処理、設定の適用、スタイル選択、UIイベントハンドラーの登録などを担当するエントリポイントファイルです。
- **src/playback.test.ts**: 音声再生機能の単体テストを記述するファイルです。
- **src/playback.ts**: 音声の再生、停止、ループ、ダウンロード、キャッシュ管理など、再生機能全般のロジックを扱います。
- **src/settings.test.ts**: アプリケーション設定機能の単体テストを記述するファイルです。
- **src/settings.ts**: アプリケーションの設定（VOICEVOXポート、周波数パーセンテージなど）の読み込み、保存、リセット、取得を行うファイルです。
- **src/state.ts**: アプリケーション全体の共有状態を管理するファイルです。
- **src/status.ts**: アプリケーションのステータスメッセージ（成功、エラーなど）の表示と非表示、およびCSSカラー変数キャッシュの管理を行います。
- **src/styleManager.test.ts**: スタイル管理機能の単体テストを記述するファイルです。
- **src/styleManager.ts**: 音声スタイル（キャラクター）の選択、取得、UIへの反映、APIベースURLの解決など、スタイル関連のロジックを管理します。
- **src/styles/base.css**: アプリケーション全体の基本的なスタイリング（レイアウト、タイポグラフィ、共通コンポーネント）を定義するCSSファイルです。
- **src/styles/intonation.css**: イントネーション編集UIに特化したスタイリングを定義するCSSファイルです。
- **src/styles.css**: アプリケーションのメインのCSSファイルをインポートする役割を持つ、あるいはごく基本的なスタイルを定義するファイルです。
- **src/textLists.test.ts**: テキストリスト機能（お気に入り、履歴）の単体テストを記述するファイルです。
- **src/textLists.ts**: ユーザーが入力したテキストのお気に入りリストや履歴リストの管理、保存、レンダリングを行います。
- **src/uiControls.ts**: UIコントロール（例：エクスポートボタン）の状態更新を行う補助関数を提供します。
- **src/visualization/canvas.ts**: HTMLキャンバス要素の準備や初期化を行うユーティリティ関数を提供します。
- **src/visualization/fft.ts**: 高速フーリエ変換（FFT）に関連する関数（Hann窓関数、Radix-2 FFTアルゴリズム）を提供します。
- **src/visualization/fftMaxFreq.ts**: FFTデータから特定の閾値に基づいて最大周波数を計算する関数を提供します。
- **src/visualization/fftOverlay.test.ts**: FFTオーバーレイ表示機能の単体テストを記述するファイルです。
- **src/visualization/fftOverlay.ts**: リアルタイムFFTの描画、周波数ピークの検出と表示、ラベルの描画など、FFTの視覚化を担当します。
- **src/visualization/fftUtils.ts**: FFT関連の座標変換（X座標から周波数、周波数からビン番号など）ユーティリティ関数を提供します。
- **src/visualization/spectrogram.ts**: スペクトログラムの分析、色マッピング、描画、オーディオコンテンツのハッシュ計算など、スペクトログラムの生成と表示を担当します。
- **src/visualization/spectrogramCache.ts**: スペクトログラムのスケール設定、キャッシュ管理、初期化、リセットを制御します。
- **src/visualization/timeAxis.ts**: 時間軸のラベルフォーマット、ティックの構築、描画など、時間軸表示のロジックを提供します。
- **src/visualization/waveform.ts**: 波形データの統計計算、相関計算、リアルタイム波形とレンダリング波形の描画など、波形の視覚化を担当します。
- **src/visualization.test.ts**: 視覚化機能全般の単体テストを記述するファイルです。
- **src/visualization.ts**: アプリケーションの視覚化機能全体（波形、FFT、スペクトログラム）を初期化し、再生と同期させて描画するメインの制御ファイルです。
- **src/vite-env.d.ts**: Vite環境の型定義ファイルです。
- **vite.config.ts**: Viteビルドツールと開発サーバーの設定ファイルです。

## 関数詳細説明
- **getAudioQuery(src/audio.ts)**: VOICEVOXローカルサーバーに音声合成クエリをリクエストし、音声情報（ピッチ、アクセントなど）を取得します。
- **synthesize() (src/audio.ts)**: 取得した音声クエリを基に、VOICEVOX APIから実際の音声データ（WAV形式など）を生成し、取得します。
- **combineAudioBuffers() (src/audio.ts)**: 複数のオーディオバッファ（音声データ）を結合して一つのオーディオストリームを作成します。
- **encodeAudioBufferToWav() (src/audio.ts)**: AudioBuffer形式の音声データを標準的なWAV形式のバイナリデータに変換します。
- **writeString() (src/audio.ts)**: 文字列データを指定されたバッファに書き込む補助関数です。
- **clamp() (src/audio.ts)**: 数値を指定された最小値と最大値の範囲内に制限します。
- **dedupeIntonationFavorites() (src/intonation.ts)**: イントネーションのお気に入りリストから重複するエントリを削除します。
- **loadIntonationFavorites() (src/intonation.ts)**: ローカルストレージから保存されているイントネーションのお気に入りリストを読み込みます。
- **persistIntonationFavorites() (src/intonation.ts)**: 現在のイントネーションのお気に入りリストをローカルストレージに保存します。
- **resetIntonationState() (src/intonation.ts)**: イントネーション編集に関する現在の状態を初期値にリセットします。
- **setStyleChangeHandler() (src/intonation.ts)**: スタイル（キャラクター）変更時に実行されるハンドラーを設定します。
- **initializeIntonationElements() (src/intonation.ts)**: イントネーション編集UIに関連するDOM要素を初期化します。
- **isIntonationDirty() (src/intonation.ts)**: 現在のイントネーション状態が変更されているか判定します。
- **setIntonationKeyboardEnabled() (src/intonation.ts)**: イントネーション編集のためのキーボード操作の有効/無効を切り替えます。
- **getIntonationKeyboardEnabled() (src/intonation.ts)**: イントネーションキーボード操作が有効であるかどうかの状態を取得します。
- **renderIntonationFavoritesList() (src/intonation.ts)**: お気に入りイントネーションのリストをUIに表示します。
- **removeIntonationFavorite() (src/intonation.ts)**: 指定されたイントネーションをお気に入りリストから削除します。
- **applyIntonationFavorite() (src/intonation.ts)**: お気に入りから選択されたイントネーション設定を現在の編集状態に適用します。
- **saveCurrentIntonationFavorite() (src/intonation.ts)**: 現在のイントネーション設定をお気に入りとして保存します。
- **refreshIntonationChart() (src/intonation.ts)**: イントネーション表示チャートを最新の状態に更新します。
- **getPitchRange() (src/intonationDisplay.ts)**: 音高（ピッチ）の表示範囲を計算し、取得します。
- **calculateBasePadding() (src/intonationDisplay.ts)**: イントネーション表示におけるベースラインのパディングを計算します。
- **getBaseDisplayRange() (src/intonationDisplay.ts)**: イントネーションの基準となる表示範囲を計算します。
- **calculateDisplayRange() (src/intonationDisplay.ts)**: イントネーション表示の具体的な範囲を計算します。
- **clampRangeExtra() (src/intonationDisplay.ts)**: 表示範囲の追加設定が過度にならないように制限します。
- **applyRangeExtra() (src/intonationDisplay.ts)**: 表示範囲に追加設定を適用します。
- **refreshDisplayRange() (src/intonationDisplay.ts)**: イントネーションの表示範囲を更新します。
- **clampPitchToDisplayRange() (src/intonationDisplay.ts)**: 音高を現在の表示範囲に制限します。
- **calculateStepSize() (src/intonationDisplay.ts)**: イントネーション編集時のステップサイズを計算します。
- **calculateLetterKeyAdjustment() (src/intonationDisplay.ts)**: キーボード操作による文字ごとの調整量を計算します。
- **handleIntonationWheel() (src/intonationDisplay.ts)**: イントネーション表示上でのマウスホイール操作を処理し、表示範囲のズームなどを調整します。
- **ensureWheelHandler() (src/intonationDisplay.ts)**: イントネーション表示用のマウスホイールイベントハンドラーが適切に設定されていることを保証します。
- **updateInitialRangeFromPoints() (src/intonationDisplay.ts)**: イントネーションポイントから初期表示範囲を更新します。
- **initializeIntonationCanvas() (src/intonationDisplay.ts)**: イントネーションチャートを描画するためのキャンバス要素を初期化します。
- **buildIntonationPointsFromQuery() (src/intonationDisplay.ts)**: 音声クエリデータからイントネーションポイントを構築します。
- **renderIntonationLabels() (src/intonationDisplay.ts)**: イントネーションチャート上に文字や音高のラベルをレンダリングします。
- **updateHoveredLabel() (src/intonationDisplay.ts)**: マウスオーバーしているイントネーションポイントのラベルを更新します。
- **drawIntonationChart() (src/intonationDisplay.ts)**: イントネーションチャート全体を描画します。
- **adjustIntonationScale() (src/intonationDisplay.ts)**: イントネーション表示のスケールを調整します。
- **pitchFromY() (src/intonationDisplay.ts)**: キャンバスのY座標から対応する音高（ピッチ）を計算します。
- **findNearestIntonationPoint() (src/intonationDisplay.ts)**: 指定された座標に最も近いイントネーションポイントを検索します。
- **disableLoopOnIntonationEdit() (src/intonationHandlers.ts)**: イントネーション編集中にループ再生を無効化します。
- **applyPitchToQuery() (src/intonationHandlers.ts)**: 編集された音高を音声合成クエリに適用します。
- **applyPitchEdit() (src/intonationHandlers.ts)**: ユーザーの操作に基づいて音高の編集を適用します。
- **handleIntonationPointerDown() (src/intonationHandlers.ts)**: イントネーションチャート上でのポインター押し下げイベントを処理します。
- **handleIntonationPointerMove() (src/intonationHandlers.ts)**: イントネーションチャート上でのポインター移動イベントを処理します。
- **handleIntonationPointerUp() (src/intonationHandlers.ts)**: イントネーションチャート上でのポインター離しイベントを処理します。
- **handleIntonationMouseMove() (src/intonationHandlers.ts)**: イントネーションチャート上でのマウス移動イベントを処理します。
- **handleIntonationMouseLeave() (src/intonationHandlers.ts)**: イントネーションチャートからマウスが離れたイベントを処理します。
- **handleIntonationKeyDown() (src/intonationHandlers.ts)**: イントネーション編集時のキーボード入力イベントを処理します。
- **scheduleIntonationPlayback() (src/intonationPlayback.ts)**: イントネーション再生をスケジュールします。
- **replayCachedIntonationAudio() (src/intonationPlayback.ts)**: キャッシュされたイントネーション音声を再生します。
- **showPlaybackStatus() (src/intonationPlayback.ts)**: 再生ステータスをUIに表示します。
- **playUpdatedIntonation() (src/intonationPlayback.ts)**: 更新されたイントネーション設定で音声を再生します。
- **fetchAndRenderIntonation() (src/intonationPlayback.ts)**: イントネーションデータを取得し、UIにレンダリングします。
- **resetIntonationToInitial() (src/intonationPlayback.ts)**: イントネーションの状態を初期値にリセットします。
- **updateIntonationTiming() (src/intonationState.ts)**: イントネーションのタイミング情報を更新します。
- **isValidAudioQueryShape() (src/intonationUtils.ts)**: 渡されたオブジェクトが有効なオーディオクエリの形状を持っているか検証します。
- **cloneAudioQuery() (src/intonationUtils.ts)**: オーディオクエリオブジェクトをディープコピーして返します。
- **applySettingsToInputs() (src/main.ts)**: 現在の設定値をUIの入力フィールドに適用します。
- **refreshStylesAfterPortChange() (src/main.ts)**: VOICEVOXサーバーのポート変更後にスタイル情報を更新します。
- **applyStyleSelection() (src/main.ts)**: 選択された音声スタイルをアプリケーションに適用します。
- **applyRandomStyleSelection() (src/main.ts)**: ランダムな音声スタイルを選択し、適用します。
- **saveDelimiter() (src/main.ts)**: 区切り文字設定を保存します。
- **scheduleSaveDelimiter() (src/main.ts)**: 区切り文字の保存をスケジュールします。
- **updateSpectrogramScaleLabel() (src/main.ts)**: スペクトログラムのスケール表示を更新します。
- **updateIntonationKeyboardToggle() (src/main.ts)**: イントネーションキーボードトグルの状態を更新します。
- **clearAudioCache() (src/playback.ts)**: 生成された音声データのキャッシュをクリアします。
- **setLoopCheckboxElement() (src/playback.ts)**: ループ再生チェックボックスのDOM要素を設定します。
- **setPlayButtonAppearance() (src/playback.ts)**: 再生ボタンの表示状態を更新します。
- **isPlayRequestPending() (src/playback.ts)**: 再生リクエストが保留中であるかを判定します。
- **stopPlaybackAndResetLoop() (src/playback.ts)**: 現在の再生を停止し、ループ設定をリセットします。
- **getAudioCacheKey() (src/playback.ts)**: 音声キャッシュのためのキーを生成します。
- **setTextAndPlay() (src/playback.ts)**: 指定されたテキストで音声を生成し、再生します。
- **downloadLastAudio() (src/playback.ts)**: 最後に生成された音声データをダウンロードします。
- **scheduleAutoPlay() (src/playback.ts)**: 自動再生をスケジュールします。
- **confirmResetIntonationBeforePlay() (src/playback.ts)**: 再生前にイントネーションのリセットが必要かを確認します。
- **handlePlayButtonClick() (src/playback.ts)**: 再生ボタンがクリックされたときのイベントを処理します。
- **handlePlay() (src/playback.ts)**: 音声の再生を開始または再開します。
- **clearRealtimeWaveformCanvas() (src/playback.ts)**: リアルタイム波形表示キャンバスをクリアします。
- **triggerPlay() (src/playback.ts)**: プログラム的に再生をトリガーします。
- **cleanup() (src/playback.ts)**: 再生関連のリソースをクリーンアップします。
- **handleReset() (src/playback.ts)**: リセットボタンがクリックされたときのイベントを処理します。
- **handleCancel() (src/playback.ts)**: キャンセルボタンがクリックされたときのイベントを処理します。
- **loadSettings() (src/settings.ts)**: アプリケーションの設定をローカルストレージから読み込みます。
- **saveSettings() (src/settings.ts)**: 現在のアプリケーション設定をローカルストレージに保存します。
- **resetSettings() (src/settings.ts)**: アプリケーションの設定をデフォルト値にリセットします。
- **getVoicevoxApiBase() (src/settings.ts)**: VOICEVOX APIのベースURLを取得します。
- **getVoicevoxNemoApiBase() (src/settings.ts)**: VOICEVOX Nemo APIのベースURLを取得します。
- **getFrequencyTopPercent() (src/settings.ts)**: 周波数トップパーセンテージ設定を取得します。
- **getCurrentSettings() (src/settings.ts)**: 現在のすべての設定値を含むオブジェクトを取得します。
- **setVoicevoxPort() (src/settings.ts)**: VOICEVOXサーバーのポート番号を設定します。
- **setVoicevoxNemoPort() (src/settings.ts)**: VOICEVOX Nemoサーバーのポート番号を設定します。
- **setFrequencyTopPercent() (src/settings.ts)**: 周波数トップパーセンテージを設定します。
- **showStatus() (src/status.ts)**: アプリケーションのステータスメッセージをUIに表示します。
- **hideStatus() (src/status.ts)**: UIに表示されているステータスメッセージを非表示にします。
- **scheduleHideStatus() (src/status.ts)**: 指定時間後にステータスメッセージを自動的に非表示にするようスケジュールします。
- **invalidateColorVariableCache() (src/status.ts)**: CSSカラー変数のキャッシュを無効化します。
- **getColorVariable() (src/status.ts)**: CSSカスタムプロパティ（カラー変数）の値を取得します。
- **getSelectedStyleId() (src/styleManager.ts)**: 現在選択されている音声スタイルIDを取得します。
- **setSelectedStyleId() (src/styleManager.ts)**: 選択する音声スタイルIDを設定します。
- **selectRandomStyleId() (src/styleManager.ts)**: ランダムな音声スタイルIDを選択します。
- **getStyleLabel() (src/styleManager.ts)**: 指定されたスタイルIDのラベル（表示名）を取得します。
- **getStyleById() (src/styleManager.ts)**: スタイルIDに基づいてスタイルオブジェクトを取得します。
- **getApiBaseForStyleId() (src/styleManager.ts)**: 特定のスタイルIDに対応するAPIベースURLを取得します。
- **getSpeakerStylesByStyleId() (src/styleManager.ts)**: 指定されたスタイルIDに関連するスピーカーのスタイルを取得します。
- **resolveStyleMarker() (src/styleManager.ts)**: スタイルマーカー（例: [話者名]）を解決します。
- **parseDelimiterConfig() (src/styleManager.ts)**: 区切り文字設定をパース（解析）します。
- **addSegment() (src/styleManager.ts)**: テキストセグメントを追加します。
- **buildTextSegments() (src/styleManager.ts)**: テキスト入力から音声合成に適したセグメントを構築します。
- **populateStyleSelect() (src/styleManager.ts)**: スタイル選択ドロップダウンメニューを音声スタイルデータで埋めます。
- **populateSpeakerStyleSelect() (src/styleManager.ts)**: スピーカーとスタイル選択ドロップダウンメニューを埋めます。
- **fetchVoiceStyles() (src/styleManager.ts)**: VOICEVOX APIから利用可能な音声スタイル（キャラクター）のリストを取得します。
- **loadStoredList() (src/textLists.ts)**: 保存されたテキストリスト（お気に入り、履歴など）を読み込みます。
- **persistList() (src/textLists.ts)**: 指定されたテキストリストをローカルストレージに保存します。
- **persistLists() (src/textLists.ts)**: すべてのテキストリスト（お気に入り、履歴など）を保存します。
- **dedupeAndLimit() (src/textLists.ts)**: テキストリストの重複を削除し、指定された数に制限します。
- **renderList() (src/textLists.ts)**: テキストリストをUIにレンダリングします。
- **renderTextLists() (src/textLists.ts)**: お気に入りや履歴などのテキストリスト全体をUIにレンダリングします。
- **moveToFavorites() (src/textLists.ts)**: 履歴内のテキストをお気に入りリストに移動します。
- **moveToHistory() (src/textLists.ts)**: お気に入り内のテキストを履歴リストに移動します。
- **addToHistory() (src/textLists.ts)**: 指定されたテキストを履歴リストに追加します。
- **initializeTextLists() (src/textLists.ts)**: テキストリスト機能（お気に入り、履歴）を初期化します。
- **updateExportButtonState() (src/uiControls.ts)**: エクスポートボタンの有効/無効状態を更新します。
- **prepareCanvas() (src/visualization/canvas.ts)**: キャンバス要素を初期化し、描画可能な状態に設定します。
- **getHannWindow() (src/visualization/fft.ts)**: Hann窓関数（FFTの前処理に使う重み関数）の配列を生成します。
- **fftRadix2() (src/visualization/fft.ts)**: ラディックス2FFTアルゴリズムを実行し、周波数スペクトルを計算します。
- **getMaxFreqByThreshold() (src/visualization/fftMaxFreq.ts)**: 指定された閾値に基づいて最大周波数を計算します。
- **drawRealtimeFFT() (src/visualization/fftOverlay.ts)**: リアルタイムのFFTデータをキャンバスに描画します。
- **getTopFreqInfo() (src/visualization/fftOverlay.ts)**: 周波数スペクトルから主要な周波数情報（ピークなど）を抽出します。
- **findPeakPosition() (src/visualization/fftOverlay.ts)**: FFTデータ内のピーク位置を特定します。
- **drawPeakLine() (src/visualization/fftOverlay.ts)**: ピーク周波数を示すラインをキャンバスに描画します。
- **drawFFTLine() (src/visualization/fftOverlay.ts)**: FFTスペクトルのラインをキャンバスに描画します。
- **drawTopBinLine() (src/visualization/fftOverlay.ts)**: トップ周波数ビンを示すラインを描画します。
- **drawPeakLabel() (src/visualization/fftOverlay.ts)**: ピーク周波数のラベルをキャンバスに描画します。
- **xToFreq() (src/visualization/fftUtils.ts)**: キャンバスのX座標を周波数に変換します。
- **freqToBinF() (src/visualization/fftUtils.ts)**: 周波数をFFTビン番号に変換します。
- **getInterpolatedValue() (src/visualization/fftUtils.ts)**: 補間された値を取得します。
- **fftValueToY() (src/visualization/fftUtils.ts)**: FFTの値をキャンバスのY座標に変換します。
- **lerpColor() (src/visualization/spectrogram.ts)**: 2つの色の間で線形補間を行い、中間の色を生成します。
- **mapIntensityToSpectrogramColor() (src/visualization/spectrogram.ts)**: 音声の強度をスペクトログラムの色にマッピングします。
- **determineSpectrogramCeiling() (src/visualization/spectrogram.ts)**: スペクトログラム表示の天井（最大強度）を決定します。
- **analyzeSpectrogramFrames() (src/visualization/spectrogram.ts)**: スペクトログラムのフレームごとに音声データを分析します。
- **drawSpectrogram() (src/visualization/spectrogram.ts)**: スペクトログラム全体を描画します。
- **drawSpectrogramColumn() (src/visualization/spectrogram.ts)**: スペクトログラムの一列（特定の時間点における周波数スペクトル）を描画します。
- **drawOfflineSpectrogram() (src/visualization/spectrogram.ts)**: オフライン（リアルタイムではない）のスペクトログラムを描画します。
- **computeAudioContentHash() (src/visualization/spectrogram.ts)**: 音声コンテンツのハッシュ値を計算します。
- **buildSpectrogramSignature() (src/visualization/spectrogram.ts)**: スペクトログラムのシグネチャを構築します。
- **processChunk() (src/visualization/spectrogram.ts)**: 音声データのチャンクを処理します。
- **getSpectrogramScale() (src/visualization/spectrogramCache.ts)**: スペクトログラムのスケール設定を取得します。
- **setSpectrogramScale() (src/visualization/spectrogramCache.ts)**: スペクトログラムのスケール設定を設定します。
- **requestSpectrogramReset() (src/visualization/spectrogramCache.ts)**: スペクトログラムのリセットを要求します。
- **createSpectrogramImageCache() (src/visualization/spectrogramCache.ts)**: スペクトログラムの画像キャッシュを作成します。
- **analyzeAndCacheSpectrogram() (src/visualization/spectrogramCache.ts)**: スペクトログラムを分析し、キャッシュします。
- **handleSpectrogramInitialization() (src/visualization/spectrogramCache.ts)**: スペクトログラムの初期化を処理します。
- **resetSpectrogramCaches() (src/visualization/spectrogramCache.ts)**: スペクトログラムのキャッシュをすべてリセットします。
- **formatTimeLabel() (src/visualization/timeAxis.ts)**: 時間軸のラベルをフォーマットします。
- **buildTimeTicks() (src/visualization/timeAxis.ts)**: 時間軸のティック（目盛り）データを構築します。
- **drawTimeTicks() (src/visualization/timeAxis.ts)**: 時間軸のティックとラベルをキャンバスに描画します。
- **computeSegmentStats() (src/visualization/waveform.ts)**: 波形セグメントの統計情報を計算します。
- **computeSegmentCorrelation() (src/visualization/waveform.ts)**: 波形セグメント間の相関を計算します。
- **extractAlignedRealtimeSegment() (src/visualization/waveform.ts)**: リアルタイム波形からアラインされたセグメントを抽出します。
- **drawRenderedWaveform() (src/visualization/waveform.ts)**: レンダリングされた（最終的な）波形をキャンバスに描画します。
- **drawRealtimeWaveformBackground() (src/visualization/waveform.ts)**: リアルタイム波形表示の背景を描画します。
- **drawRealtimeWaveformOnly() (src/visualization/waveform.ts)**: リアルタイム波形のみをキャンバスに描画します。
- **isPlaybackActive() (src/visualization.ts)**: 現在音声再生がアクティブであるかを判定します。
- **stopActivePlayback() (src/visualization.ts)**: 現在アクティブな音声再生を停止します。
- **initializeVisualizationCanvases() (src/visualization.ts)**: 視覚化用のキャンバス要素を初期化します。
- **clearWaveformCanvas() (src/visualization.ts)**: 波形表示キャンバスをクリアします。
- **playAudio() (src/visualization.ts)**: 指定された音声データを再生します。
- **setProgressPosition() (src/visualization.ts)**: 再生プログレスバーの位置を設定します。
- **updateProgressLines() (src/visualization.ts)**: プログレスラインを更新します。
- **clearProgressLines() (src/visualization.ts)**: プログレスラインをクリアします。
- **drawRealtimeVisuals() (src/visualization.ts)**: リアルタイムの視覚化要素（波形、FFTなど）を描画します。
- **handleSpectrogramDraw() (src/visualization.ts)**: スペクトログラムの描画を処理します。
- **cleanupPlayback() (src/visualization.ts)**: 再生終了後のクリーンアップ処理を行います。
- **requestSpectrogramDraw() (src/visualization.ts)**: スペクトログラムの描画を要求します。
- **render() (src/visualization.ts)**: 視覚化フレームをレンダリングします。
- **finalize() (src/visualization.ts)**: 視覚化の最終処理を行います。
- **stopPlayback() (src/visualization.ts)**: 視覚化に関連する再生を停止します。
- **constructor (src/visualization.test.ts)**: テスト用クラスのコンストラクタです。

## 関数呼び出し階層ツリー
```
- getAudioQuery (src/audio.ts)
  - synthesize ()
    - combineAudioBuffers ()
    - encodeAudioBufferToWav ()
    - writeString ()
    - clamp ()
- dedupeIntonationFavorites (src/intonation.ts)
  - loadIntonationFavorites ()
    - persistIntonationFavorites ()
    - resetIntonationState ()
    - setStyleChangeHandler ()
    - initializeIntonationElements ()
    - isIntonationDirty ()
    - setIntonationKeyboardEnabled ()
    - getIntonationKeyboardEnabled ()
    - renderIntonationFavoritesList ()
    - removeIntonationFavorite ()
    - applyIntonationFavorite ()
    - saveCurrentIntonationFavorite ()
    - refreshIntonationChart ()
    - refreshDisplayRange ()
    - ensureWheelHandler ()
    - updateInitialRangeFromPoints ()
    - buildIntonationPointsFromQuery ()
    - drawIntonationChart ()
    - playUpdatedIntonation ()
    - updateIntonationTiming ()
    - isValidAudioQueryShape ()
    - cloneAudioQuery ()
    - showStatus ()
    - scheduleHideStatus ()
- getPitchRange (src/intonationDisplay.ts)
  - calculateBasePadding ()
    - getBaseDisplayRange ()
    - calculateDisplayRange ()
    - clampRangeExtra ()
    - applyRangeExtra ()
    - clampPitchToDisplayRange ()
    - calculateStepSize ()
    - calculateLetterKeyAdjustment ()
    - handleIntonationWheel ()
    - initializeIntonationCanvas ()
    - renderIntonationLabels ()
    - updateHoveredLabel ()
    - adjustIntonationScale ()
    - pitchFromY ()
    - findNearestIntonationPoint ()
    - getColorVariable ()
- disableLoopOnIntonationEdit (src/intonationHandlers.ts)
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
- fetchAndRenderIntonation ()
  - resetIntonationToInitial ()
    - getApiBaseForStyleId ()
    - updateExportButtonState ()
    - drawRenderedWaveform ()
    - initializeVisualizationCanvases ()
    - playAudio ()
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
    - handlePlayButtonClick ()
    - clearRealtimeWaveformCanvas ()
    - cleanup ()
    - handleCancel ()
    - parseDelimiterConfig ()
    - buildTextSegments ()
    - addToHistory ()
    - stopActivePlayback ()
- saveDelimiter (src/main.ts)
- scheduleSaveDelimiter (src/main.ts)
- triggerPlay (src/playback.ts)
- handleReset (src/playback.ts)
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
- constructor (src/visualization.test.ts)

---
Generated at: 2026-03-02 07:02:42 JST
