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
// D1 kayıt testi
if (url.pathname === "/api/test-kayit") {

  try {

    const sonuc = await env.DB.prepare(`
      INSERT INTO ilanlar (
        ad_soyad,
        telefon,
        ilan_turu,
        islem_turu
      )
      VALUES (?, ?, ?, ?)
    `).bind(
      "TEST KULLANICI",
      "05550000000",
      "Daire",
      "Satılık"
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

    // İlanları görüntüleme / kayıt sayısını kontrol
    if (url.pathname === "/api/ilanlar" && request.method === "GET") {

      try {

        const sonuc = await env.DB
          .prepare("SELECT * FROM ilanlar ORDER BY id DESC")
          .all();

        return Response.json({
          basarili: true,
          toplam: sonuc.results.length,
          ilanlar: sonuc.results
        });

      } catch (hata) {

        return Response.json({
          basarili: false,
          hata: hata.message
        }, { status: 500 });

      }
    }


    // Yeni ilan başvurusu
    if (url.pathname === "/api/ilanlar" && request.method === "POST") {

      try {

        const veri = await request.json();

        const fiyat =
          veri.fiyat
            ? Number(String(veri.fiyat).replace(/\./g, "").replace(",", "."))
            : null;

        const metrekare =
          veri.metrekare
            ? Number(String(veri.metrekare).replace(/\./g, "").replace(",", "."))
            : null;

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
          fiyat,
          metrekare,
          veri.oda_sayisi || "",
          veri.bina_yasi || "",
          veri.aciklama || ""
        ).run();

        return Response.json({
          basarili: true,
          mesaj: "İlan başvurusu D1'e kaydedildi.",
          id: sonuc.meta.last_row_id
        });

      } catch (hata) {

        return Response.json({
          basarili: false,
          hata: hata.message
        }, { status: 500 });

      }
    }


    // Normal site dosyaları
    return env.ASSETS.fetch(request);

  }
};
