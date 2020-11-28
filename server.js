require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const db = require('./server/database.handler');
const cors = require('@koa/cors');
const serve = require('koa-static');
const Shopify = require('shopify-api-node');
const bodyParser = require('koa-body');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  server.use(cors({
    origin: '*',
  }));
  server.use(serve('public'));
  server.use(bodyParser());

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_script_tags'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        // await getSubscriptionUrl(ctx, accessToken, shop);
        const shopify = new Shopify({
          shopName: shop,
          accessToken,
        });

        console.log("auth")

        shopify.scriptTag.list().then((res) => {
          // TODO Check for duplicates
          console.log('scripts tags', res);

          shopify.scriptTag.create({
            event: 'onload',
            src: `${HOST}/christmas-loader.js`,
            display_scope: 'all',
          });
        });
      }
    })
  );
  
  router.get('/public-config', cors({
    origin: '*',
  }),async (ctx) => {
    const shop = "codespherexmalt.myshopify.com"; // TODO query

    const config = db.getConfig(shop);
    console.log(config)
    const { rewardText, rewardCode } = config;
    ctx.body = {
      success: true,
      reward: {
        code: rewardCode,
        body: rewardText,
      }
    };
  })

  router.get('/config', verifyRequest(), async (ctx) => {
    const { shop } = ctx.session;

    if (typeof shop !== "undefined") {
      const config = db.getConfig(shop);
      ctx.body = { success: true, config }
    } else {
      ctx.body = { success: false }
    }
  });

  router.put('/config', verifyRequest(), async (ctx) => {
    const body = ctx.request.body;

    const { shop } = ctx.session;

    if (typeof body !== "undefined" && typeof body.config !== "undefined" && typeof shop !== "undefined") {
      db.saveConfig(shop, body.config);
      ctx.body = { success: true }
    } else {
      ctx.body = { success: false }
    }
  });

  server.use(graphQLProxy({ version: ApiVersion.July20 }));

  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
