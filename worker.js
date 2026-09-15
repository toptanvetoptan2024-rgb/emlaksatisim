export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // D1 bağlantı testi
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

    // İlan başvurusu kaydet
    if (url.pathname === "/api/ilanlar" && request.method === "POST") {

      try {

        const veri = await request.json();

        const sonuc = await env.DB.prepare(`
          INSERT INTO ilanlar (
            ad_soyad,
            telefon,
            email,
            ilan_turu,
            islem_turu,
            il,
            ilce,
            mahalle,
            fiyat,
            metrekare,
            oda_sayisi,
            bina_yasi,
            aciklama
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          veri.ad_soyad || "",
          veri.telefon || "",
          veri.email || "",
          veri.ilan_turu || "",
          veri.islem_turu || "",
          veri.il || "",
          veri.ilce || "",
          veri.mahalle || "",
          veri.fiyat ? Number(veri.fiyat.replace(/\./g, "").replace(",", ".")) : null,
          veri.metrekare ? Number(veri.metrekare.replace(/\./g, "").replace(",", ".")) : null,
          veri.oda_sayisi || "",
          veri.bina_yasi || "",
          veri.aciklama || ""
        ).run();

        return Response.json({
          basarili: true,
          id: sonuc.meta.last_row_id
        });

      } catch (hata) {

        return Response.json({
          basarili: false,
          hata: hata.message
        }, { status: 500 });

      }
    }

    // Normal site dosyalarını göster
    return env.ASSETS.fetch(request);
  }
};
