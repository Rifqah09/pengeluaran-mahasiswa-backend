export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan method POST" });
  }

  const { activities } = req.body;

  if (!activities) {
    return res.status(400).json({ error: "Data aktivitas kosong" });
  }

  try {
    const prompt = `
Berdasarkan aktivitas berikut:

${activities}

Bayangkan mahasiswa tersebut direpresentasikan sebagai seorang karakter kartun chibi yang memiliki kebiasaan boros dan sulit mengontrol pengeluaran.

Tentukan:

jenis karakter yang sesuai, misalnya mahasiswa muda dengan penampilan modern dan trendi
ekspresi wajah yang ceria, sedikit impulsif, dan antusias saat berbelanja
pose yang menunjukkan kebiasaan menghabiskan uang, seperti memegang banyak kantong belanja, dompet terbuka dengan uang yang hampir habis, atau sedang melihat layar ponsel untuk checkout belanja online
tambahkan properti kecil seperti smartphone, kartu debit, kopi kekinian, paket belanja, headphone, atau laptop

Ketentuan:

gaya ilustrasi kartun, chibi, cute
warna cerah, modern, dan menarik
fokus pada satu karakter utama (single character)
tidak ada hewan, hanya karakter manusia bergaya imut
jangan menampilkan teks atau angka di dalam gambar
background sederhana dan estetik, misalnya kamar kos atau area kafe minimalis dengan sedikit elemen dekoratif
gambar harus mampu menggambarkan sifat konsumtif atau kebiasaan boros secara visual tanpa terlihat negatif atau berlebihan.
    `.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({
        error: "Gagal membuat gambar dari image API gratis"
      });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return res.status(200).json({
      image: base64Image
    });

  } catch (error) {
    console.error("Generate image error:", error);

    return res.status(500).json({
      error: "Gagal menghubungi image API"
    });
  }
}
