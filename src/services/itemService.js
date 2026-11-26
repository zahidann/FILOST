import { supabase } from '../lib/supabaseClient';

export async function fetchItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat data barang: ${error.message}`);
  }

  return data || [];
}

export async function uploadItem(itemData) {
  const { imageFile, ...fields } = itemData;
  let publicImageUrl = '';

  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${randomSuffix}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);

    publicImageUrl = urlData?.publicUrl || '';
  }

  const payload = {
    title: fields.title,
    category: fields.category,
    description: fields.description,
    location: fields.location,
    finder_contact: fields.finder_contact,
    secret_question: fields.secret_question,
    secret_answer: fields.secret_answer,
    latitude: fields.latitude,
    longitude: fields.longitude,
    image_url: publicImageUrl,
    status: 'Unclaimed',
  };

  const { data, error: insertError } = await supabase
    .from('items')
    .insert([payload])
    .select()
    .single();

  if (insertError) {
    throw new Error(`Gagal menyimpan laporan barang: ${insertError.message}`);
  }

  return data;
}

export async function claimItem(itemId) {
  const { data, error } = await supabase
    .from('items')
    .update({ status: 'Claimed' })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status klaim: ${error.message}`);
  }

  return data;
}