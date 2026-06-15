import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/constants.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Faz o upload do ficheiro local (diskStorage) para o Supabase
 */
export const uploadToSupabase = async (file, bucket) => {
    try {
        // 1. Lê o ficheiro que o Multer acabou de salvar no disco
        const fileContent = fs.readFileSync(file.path); 
        
        // 2. Usa o nome gerado pelo Multer
        const fileName = file.filename;

        // 3. Envia para o bucket correspondente no Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileContent, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) throw error;

        // 4. Gera a URL pública
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        // 5. LIMPEZA: Apaga o ficheiro do servidor local após o upload bem-sucedido
        // Isso evita que o seu servidor fique sem espaço em disco
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return publicUrlData.publicUrl;

    } catch (err) {
        // Se houver erro, também tentamos limpar o ficheiro local para não acumular lixo
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        
        console.error(`❌ Erro no upload para o Supabase (${bucket}):`, err.message);
        throw new Error('Falha ao sincronizar imagem com a nuvem.');
    }
};