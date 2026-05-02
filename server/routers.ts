import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { callDataApi } from "./_core/dataApi";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// 各品种的Yahoo Finance代码
const SYMBOLS: Record<string, { yahoo: string; label: string }> = {
  'XAU/USD': { yahoo: 'GC=F',     label: '现货黄金' },
  'DXY':     { yahoo: 'DX-Y.NYB', label: '美元指数' },
  'USD/JPY': { yahoo: 'JPY=X',    label: '美元/日元' },
  'US10Y':   { yahoo: '^TNX',     label: '10年期美债' },
  'WTI/USD': { yahoo: 'CL=F',     label: 'WTI原油' },
};

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // 实时行情数据接口
  market: router({
    prices: publicProcedure.query(async () => {
      const results: Record<string, {
        asset: string;
        assetZh: string;
        price: number;
        change: number;
        changePct: number;
        updatedAt: string;
      }> = {};

      await Promise.allSettled(
        Object.entries(SYMBOLS).map(async ([asset, { yahoo, label }]) => {
          try {
            const resp = await callDataApi('YahooFinance/get_stock_chart', {
              query: {
                symbol: yahoo,
                region: 'US',
                interval: '1d',
                range: '2d',
              },
            }) as {
              chart?: {
                result?: Array<{
                  meta?: {
                    regularMarketPrice?: number;
                    previousClose?: number;
                    chartPreviousClose?: number;
                  };
                }>;
              };
            };

            const meta = resp?.chart?.result?.[0]?.meta;
            if (meta?.regularMarketPrice) {
              const price = meta.regularMarketPrice;
              const prev = meta.previousClose ?? meta.chartPreviousClose ?? price;
              const change = price - prev;
              const changePct = prev !== 0 ? (change / prev) * 100 : 0;
              results[asset] = {
                asset,
                assetZh: label,
                price,
                change,
                changePct,
                updatedAt: new Date().toISOString(),
              };
            }
          } catch (e) {
            console.error(`[Market] Failed to fetch ${asset}:`, e);
          }
        })
      );

      return results;
    }),
  }),
});

export type AppRouter = typeof appRouter;
