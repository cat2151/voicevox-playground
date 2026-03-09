Last updated: 2026-03-10

# Development Status

## 現在のIssues
- [Issue #115](../issue-notes/115.md) スペクトログラムの上半分が真っ暗になる表示問題を解決するため、表示対象外とする閾値設定の検討がLLMの出力品質の問題により保留されています。
- [Issue #113](../issue-notes/113.md) 波形全体表示欄に推定周波数を折れ線グラフで描画する機能の開発は、LLMのハルシネーションにより保留中です。
- [Issue #111](../issue-notes/111.md) リアルタイムFFT表示のリニア/対数切り替え機能の追加は、LLMによるコード破壊とハルシネーションの問題により保留されています。

## 次の一手候補
1. [Issue #11](../issue-notes/11.md) `translate` GitHub Actionsの外部プロジェクト向け導入手順書作成
   - 最初の小さな一歩: `.github/actions-tmp/.github_automation/translate/docs/TRANSLATION_SETUP.md` を参考に、必須設定項目（入力パラメータ、シークレット、ファイル配置）をリストアップする。
   - Agent実行プロンプ:
     ```
     対象ファイル:
       - `.github/actions-tmp/.github/workflows/translate-readme.yml`
       - `.github/actions-tmp/.github/workflows/call-translate-readme.yml`
       - `.github/actions-tmp/.github_automation/translate/docs/TRANSLATION_SETUP.md`

     実行内容: 対象ファイルの内容を分析し、外部プロジェクトが `call-translate-readme.yml` を利用する際に必要な設定項目（必須入力パラメータ、必須シークレット、ファイル配置の前提条件）を洗い出し、導入手順書としてmarkdown形式で出力してください。

     確認事項: 既存のworkflowファイルとの依存関係、および `TRANSLATION_SETUP.md` で言及されている設定項目との整合性を確認してください。

     期待する出力: 外部プロジェクトが `call-translate-readme.yml` を導入する際の手順書をmarkdown形式で生成してください。具体的には、必須パラメータの設定方法、シークレットの登録手順、前提条件の確認項目を含めてください。
     ```

2. [Issue #13](../issue-notes/13.md) `issue-note` GitHub Actionsの外部プロジェクト向け導入手順書作成
   - 最初の小さな一歩: [Issue #3](../issue-notes/3.md) を参照し、`issue-note`ワークフローの共通ワークフロー化で確立された入力と出力の仕様を特定する。
   - Agent実行プロンプ:
     ```
     対象ファイル:
       - `.github/actions-tmp/.github/workflows/issue-note.yml`
       - `.github/actions-tmp/.github/workflows/call-issue-note.yml`
       - `.github/actions-tmp/issue-notes/3.md`

     実行内容: 対象ファイルの内容を分析し、外部プロジェクトが `call-issue-note.yml` を利用する際に必要な設定項目（必須入力パラメータ、必須シークレット、ファイル配置の前提条件）と、[Issue #3](../issue-notes/3.md)で解決された `actions/github-script` の利用方法を考慮し、導入手順書としてmarkdown形式で出力してください。

     確認事項: 既存のworkflowファイルとの依存関係、および [Issue #3](../issue-notes/3.md) で議論された共通ワークフロー化の経緯と修正内容との整合性を確認してください。

     期待する出力: 外部プロジェクトが `call-issue-note.yml` を導入する際の手順書をmarkdown形式で生成してください。具体的には、必須パラメータの設定方法、シークレットの登録手順、前提条件の確認項目、および `actions/github-script` 内での入力参照方法を含めてください。
     ```

3. [Issue #15](../issue-notes/15.md) `project_summary`関連スクリプトのファイル構造概要ドキュメント化
   - 最初の小さな一歩: `project_summary/scripts/` ディレクトリ内のファイル名から、`shared/`、`overview/`、`development/` の各サブディレクトリに分けられた主要なスクリプトとその役割を特定する。
   - Agent実行プロンプ:
     ```
     対象ファイル: `.github/actions-tmp/.github_automation/project_summary/scripts/` ディレクトリ内の全ての `*.cjs` ファイル

     実行内容: [Issue #15](../issue-notes/15.md) で実施された `project_summary` モジュールのリファクタリング結果を反映し、`shared/`、`overview/`、`development/` の各ディレクトリ内の主要なスクリプト（例: `ProjectSummaryCoordinator.cjs`, `DevelopmentStatusGenerator.cjs`, `ProjectOverviewGenerator.cjs`, `CodeAnalyzer.cjs` など）について、それぞれの役割、ファイル間の依存関係、およびモジュール全体の処理フローを簡潔に説明する概要をmarkdown形式で出力してください。

     確認事項: [Issue #15](../issue-notes/15.md) の最終的なリファクタリング内容（ディレクトリ分割、クラス切り出しなど）が正確に反映されているか確認してください。ハルシネーションによる誤った依存関係や役割の記述がないことを確認してください。

     期待する出力: `project_summary` モジュールのファイル構造と、各スクリプトの役割、主要な依存関係、および処理フローの概要を説明するmarkdownドキュメント。
     ```

---
Generated at: 2026-03-10 07:04:07 JST
