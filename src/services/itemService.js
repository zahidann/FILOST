import { supabase } from '../lib/supabaseClient';

/**
 * 1. fetchItems(): Mengambil semua data barang dari tabel 'items' Supabase
 */
export async function fetchItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil data barang: ${error.message}`);
  }

  return data || [];
}

/**
 * 2. uploadItem(): Mengunggah foto ke bucket 'item-images' dan menyimpan datanya ke tabel 'items'
 */
export async function uploadItem(itemData, imageFile) {
  let publicImageUrl =
    'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80';

  // Jika pengguna memilih file foto, upload ke Supabase Storage terlebih dahulu
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
    }

    // Ambil URL publik dari gambar yang baru diunggah
    const { data: urlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath);

    publicImageUrl = urlData.publicUrl;
  }

  // Simpan record barang ke tabel 'items'
  const { data, error: insertError } = await supabase
    .from('items')
    .insert([
      {
        title: itemData.title,
        category: itemData.category,
        description: itemData.description,
        location: itemData.location,
        image_url: publicImageUrl,
        status: 'Unclaimed',
        secret_question: itemData.secret_question,
        secret_answer: itemData.secret_answer,
        finder_contact: itemData.finder_contact,
        latitude: itemData.latitude ?? -7.9525,
        longitude: itemData.longitude ?? 112.6145,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw new Error(`Gagal menyimpan laporan barang: ${insertError.message}`);
  }

  return data;
}

/**
 * 3. claimItem(): Mengecek validasi jawaban verifikasi langsung dari database Supabase
 */
export async function claimItem(itemId, userAnswer) {
  // Ambil jawaban rahasia dan kontak langsung dari baris item di database
  const { data: item, error: fetchError } = await supabase
    .from('items')
    .select('id, secret_answer, finder_contact, location, status')
    .eq('id', itemId)
    .single();

  if (fetchError || !item) {
    throw new Error('Data barang tidak ditemukan di database.');
  }

  const isMatch =
    userAnswer.trim().toLowerCase() === item.secret_answer.trim().toLowerCase();

  if (!isMatch) {
    return {
      success: false,
      message: 'Jawaban tidak cocok, silakan coba lagi',
    };
  }

  // Jika cocok, perbarui status item menjadi 'Claimed' di database
  const { error: updateError } = await supabase
    .from('items')
    .update({ status: 'Claimed' })
    .eq('id', itemId);

  if (updateError) {
    throw new Error(`Gagal memperbarui status klaim: ${updateError.message}`);
  }

  return {
    success: true,
    message: 'Verifikasi Berhasil!',
    finder_contact: item.finder_contact,
    location: item.location,
  };
}