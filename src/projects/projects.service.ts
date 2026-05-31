import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { paginate } from '../common/types/paginated-result.type';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const PROJECT_INCLUDE = {
  category: true,
  technologies: {
    include: { technology: true },
  },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async create(dto: CreateProjectDto, file?: Express.Multer.File) {
    const { technologyIds = [], ...projectData } = dto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        technologies: {
          create: technologyIds.map((technologyId) => ({ technologyId })),
        },
      },
      include: PROJECT_INCLUDE,
    });

    if (file) {
      const imageUrl = await this.storage.uploadProjectImage(project.id, file);
      return this.prisma.project.update({
        where: { id: project.id },
        data: { imageUrl },
        include: PROJECT_INCLUDE,
      });
    }

    return project;
  }

  async findAll(query: ProjectQueryDto) {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      order,
      categoryId,
      isFeatured,
      search,
    } = query;

    const where: Prisma.ProjectWhereInput = {
      ...(categoryId && { categoryId }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: PROJECT_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findFeatured(limit = 6) {
    return this.prisma.project.findMany({
      where: { isFeatured: true },
      include: PROJECT_INCLUDE,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: PROJECT_INCLUDE,
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, file?: Express.Multer.File) {
    await this.findOne(id);

    const { technologyIds, ...projectData } = dto;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.storage.uploadProjectImage(id, file);
    }

    return this.prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      if (technologyIds !== undefined) {
        await tx.projectTechnology.deleteMany({ where: { projectId: id } });
        if (technologyIds.length > 0) {
          await tx.projectTechnology.createMany({
            data: technologyIds.map((technologyId) => ({
              projectId: id,
              technologyId,
            })),
          });
        }
      }

      return tx.project.update({
        where: { id },
        data: {
          ...projectData,
          ...(imageUrl && { imageUrl }),
        },
        include: PROJECT_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.storage.deleteProjectImage(id);
    await this.prisma.project.delete({ where: { id } });
  }
}
