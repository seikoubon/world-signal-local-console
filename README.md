# WORLD SIGNAL — Local Console

世界時計、昼夜マップ、ブラウザ・端末情報を一覧表示する静的ダッシュボード。英語学習サイトとは独立したプロジェクトです。

## 起動
index.html をブラウザで開くか、このフォルダで `python -m http.server 8080` を実行して http://localhost:8080 を開きます。ビルド・依存ライブラリ不要。

## 機能と制限
- 東京、ロンドン、ニューヨーク、UTC、シンガポール、シドニーの世界時計。端末時計と Intl API を使用し、夏時間に対応。
- 世界地図は試作HTML由来の装飾用模式図。昼夜境界は太陽赤緯とUTCによる概算で、航法・観測用途には不適。
- CPU論理数、RAM目安、画面情報はブラウザが公開する値のみ。使用率ではなく、非対応時は不明と表示。
- 接続状態は navigator.onLine の推定値。インターネット到達性や速度の測定ではありません。
- 公開IPはボタン操作時のみ https://api.ipify.org?format=json に問い合わせます。取得先には通信元IPが伝わります。6秒でタイムアウトし再試行できます。
- アプリ独自の分析・保存・追跡処理はありません。GitHub Pagesや外部取得先のアクセスログは各サービスの管理下です。
- ページ自体の配信を除き、初期表示時の外部API・フォント・地図素材への通信はありません。

## 構成
- index.html: 画面
- assets/css/style.css: スタイル
- assets/js/app.js: 表示・取得処理

## GitHub Pages
専用リポジトリに登録後、Settings → Pages → Deploy from a branch → main / (root) を選択します。
公開URL: https://seikoubon.github.io/world-signal-local-console/
公式手順: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 素材とライセンス
依頼者提供の cyber_world_dashboard.html をベースに整備。地図は元HTMLに含まれるSVG図形です。外部ライブラリ・画像・フォントの同梱はありません。再配布ライセンスは未設定です。

## 今後の拡張
都市の選択、表示設定の端末内保存、地図の精度向上。外部APIは必要性とプライバシーを確認して追加します。

## 検証記録（2026-11-02）
- JavaScript構文チェック通過。
- 昼夜判定: 夏至・冬至・赤緯0度を含む40,500地点で太陽方向との内積判定と一致。
- 公開ページで6都市の時計更新・日付・タイムゾーンを確認。
- BraveでPC画面とスマートフォン相当の画面幅（表示領域375px）を確認。横はみ出しなし。
- 公開IPの任意取得が成功し、ボタンが再操作可能になることを確認。
- 確認中のコンソール警告・エラーなし。
- 実機スマートフォン、別ブラウザ、オフライン・取得失敗時の動作は未確認。
