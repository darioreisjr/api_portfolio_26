import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService implements OnModuleInit {
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('supabase.url')!;
    const key = this.config.get<string>('supabase.serviceRoleKey')!;
    this.bucketName = this.config.get<string>('supabase.storageBucket')!;
    this.supabase = createClient(url, key);
  }

  async uploadProjectImage(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = file.mimetype.split('/')[1];
    const path = `projects/${projectId}/cover.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Falha ao enviar imagem: ${error.message}`,
      );
    }

    return this.getPublicUrl(path);
  }

  async deleteProjectImage(projectId: string): Promise<void> {
    const { data: files } = await this.supabase.storage
      .from(this.bucketName)
      .list(`projects/${projectId}`);

    if (!files || files.length === 0) return;

    const paths = files.map((f) => `projects/${projectId}/${f.name}`);
    await this.supabase.storage.from(this.bucketName).remove(paths);
  }

  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    return data.publicUrl;
  }
}
