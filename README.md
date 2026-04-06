# Proxy Cloudflare Workers

任意の URL を Cloudflare Workers 経由で取得するプロキシ API です。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kidatti/proxy-cloudflare-workers)

> Worker 名はデプロイ時に任意に変更できます。

## 前提条件

- [Node.js](https://nodejs.org/) (v18 以上)
- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers CLI) は `devDependencies` に含まれているため、`npm install` で自動的にインストールされます。グローバルインストールは不要です。

## API Key の設定

シークレットとして `API_KEY` を設定すると、キーなしのリクエストを拒否します。設定しなければ認証なしで動作します。

### CLI から設定する場合

```bash
npx wrangler secret put API_KEY
```

### ダッシュボードから設定する場合（Deploy ボタンでデプロイした場合）

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) を開く
2. **Workers & Pages** > デプロイした Worker を選択
3. **Settings** > **Variables and Secrets**
4. **Add** で変数名 `API_KEY`、種類 **Secret** として値を設定

## Usage

```
# https://s.apiless.com/ip の部分は実際にアクセスするURLにします

# API Key なし
curl "https://YOUR_DOMAIN/?url=https://s.apiless.com/ip

# API Key あり
curl "https://YOUR_DOMAIN/?url=https://s.apiless.com/ip&key=YOUR_API_KEY

# API Key あり / Authorization ヘッダーで渡す
curl -H "Authorization: Bearer YOUR_API_KEY" \
"https://YOUR_DOMAIN/?url=https://s.apiless.com/ip"
```

レスポンスは対象 URL のコンテンツがそのまま返ります（CORS ヘッダー付き）。

## Local Development

```bash
npm install
npx wrangler dev
```

ローカルで API_KEY を試す場合は `.dev.vars` を作成してください。

```
API_KEY=your-secret-key
```

## Deploy

上部の「Deploy to Cloudflare」ボタンから GitHub 連携でデプロイできます（GitHub アカウントが必要）。

GitHub アカウントがない場合や、ボタンでリポジトリが選択できない場合は、手動でデプロイできます。

### git clone の場合

```bash
git clone https://github.com/kidatti/proxy-cloudflare-workers.git
cd proxy-cloudflare-workers
npm install
npx wrangler deploy
```

### ZIP ダウンロードの場合

1. [ZIP をダウンロード](https://github.com/kidatti/proxy-cloudflare-workers/archive/refs/heads/main.zip)して展開
2. 展開したディレクトリで以下を実行

```bash
npm install
npx wrangler deploy
```

初回はブラウザが開き Cloudflare へのログインが求められます。

API Key を設定する場合：

```bash
npx wrangler secret put API_KEY
```
