export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // D1 bağlantısını test etmek için
    if (url.pathname === "/api/test") {
      try {
        const sonuc = await env.DB
          .prepare("SELECT name FROM sqlite_master WHERE type='table'")
          .all();

        return Response.json({
          basarili: true,
          tablolar: sonuc.results
        });

      } catch (hata) {
        return Response.json({
          basarili: false,
          hata: hata.message
        }, { status: 500 });
      }
    }

    // Normal site dosyalarını çalıştır
    return env.ASSETS.fetch(request);
  }
};
