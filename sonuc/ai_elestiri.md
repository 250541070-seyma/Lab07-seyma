Araç: Gemini, 15.11.2026

## Verilen İstem

FıratFit veritabanında Föy 04 Görev 2.4'teki 'eğitmen başına toplam kayıt sayısını en çoktan aza sıralayan' 3 tablolu SQL sorgusunu (egitmenler, dersler, kayitlar JOIN), doküman modelimize (egitmen bilgisinin dersler koleksiyonu içine gömülü alt doküman olduğu yapıya) uygun MongoDB aggregate boru hattına çevirir misin?

## Modelin İlk Ürettiği Boru Hattı (Gereksiz İki Aşamalı Lookup)

    db.kayitlar.aggregate([
      { $lookup: { from: 'dersler', localField: 'ders_id', foreignField: '_id', as: 'ders' } },
      { $unwind: '$ders' },
      { $lookup: { from: 'egitmenler', localField: 'ders.egitmen_id', foreignField: '_id', as: 'egitmen' } },
      { $unwind: '$egitmen' },
      { $group: { _id: '$egitmen.ad', toplam_kayit: { $sum: 1 } } },
      { $sort: { toplam_kayit: -1 } }
    ])

## Sadeleştirilmiş Boru Hattı ve Ortam Çıktısı

    db.kayitlar.aggregate([
      { $lookup: { from: 'dersler', localField: 'ders_id', foreignField: '_id', as: 'ders' } },
      { $unwind: '$ders' },
      { $group: { _id: '$ders.egitmen.ad', toplam_kayit: { $sum: 1 } } },
      { $sort: { toplam_kayit: -1 } }
    ])

Çalıştırma Çıktısı:
[
  {
    _id: 'Selim ??ahin',
    toplam_kayit: 80
  },
  {
    _id: 'Serkan Ko??',
    toplam_kayit: 66
  },
  {
    _id: 'Kemal ??etin',
    toplam_kayit: 56
  },
  {
    _id: 'Yakup K??l????',
    toplam_kayit: 41
  },
  {
    _id: 'Deniz Demir',
    toplam_kayit: 35
  },
  {
    _id: 'Burak Ko??',
    toplam_kayit: 30
  },
  {
    _id: 'Murat Aslan',
    toplam_kayit: 27
  },
  {
    _id: 'Serkan Do??an',
    toplam_kayit: 20
  },
  {
    _id: 'Ece Ko??',
    toplam_kayit: 12
  },
  {
    _id: 'Mehmet Y??ld??z',
    toplam_kayit: 12
  }
]

## Eleştiri ve Değerlendirme

Model, ilişkisel şemadaki üç tablolu JOIN mantığını birebir taklit ederek hem dersler hem de olmayan bir egitmenler koleksiyonu için iki ayrı $lookup aşaması üretmiştir. Oysa doküman modelimizde eğitmen bilgisi zaten dersler koleksiyonunun içine gömülü alt doküman olarak yerleştirilmiştir ve ayrı bir egitmenler koleksiyonu bulunmamaktadır. Bu nedenle ikinci $lookup aşaması tamamen gereksizdir ve çalıştırıldığında boş sonuç dönmesine yol açar. İkinci $lookup ve $unwind aşamaları kaldırılıp doğrudan gömülü alana ($ders.egitmen.ad) nokta notasyonuyla erişildiğinde sorgu hem sadeleşmiş hem de PostgreSQL tarafındaki sonuçla birebir aynı çıktıyı üretmiştir.
