import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTechnologyDto) {
    const existing = await this.prisma.technology.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Tecnologia "${dto.name}" já existe`);
    }
    return this.prisma.technology.create({ data: dto });
  }

  findAll() {
    return this.prisma.technology.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const technology = await this.prisma.technology.findUnique({
      where: { id },
    });
    if (!technology) throw new NotFoundException('Tecnologia não encontrada');
    return technology;
  }

  async update(id: string, dto: UpdateTechnologyDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.technology.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Tecnologia "${dto.name}" já existe`);
      }
    }

    return this.prisma.technology.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.technology.delete({ where: { id } });
  }
}
