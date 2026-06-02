import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import * as multer from 'multer';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'));
    }
  },
};

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar projeto com imagem opcional' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        projectUrl: { type: 'string' },
        repositoryUrl: { type: 'string' },
        isFeatured: { type: 'boolean' },
        categoryId: { type: 'string', format: 'uuid' },
        technologyIds: {
          type: 'string',
          description: 'JSON array de UUIDs: ["id1","id2"]',
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.create(dto, file);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar projetos (paginado, filtrável)' })
  @ApiPaginatedResponse(CreateProjectDto)
  findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Listar projetos em destaque' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 6 })
  findFeatured(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.projectsService.findFeatured(limit);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar projeto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        projectUrl: { type: 'string' },
        repositoryUrl: { type: 'string' },
        isFeatured: { type: 'boolean' },
        categoryId: { type: 'string', format: 'uuid' },
        technologyIds: {
          type: 'string',
          description: 'JSON array de UUIDs: ["id1","id2"]',
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.update(id, dto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar projeto e remover imagem do Storage' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
