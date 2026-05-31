import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologiesService } from './technologies.service';

@ApiTags('technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar tecnologia' })
  create(@Body() dto: CreateTechnologyDto) {
    return this.technologiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tecnologias' })
  findAll() {
    return this.technologiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tecnologia por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.technologiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tecnologia' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTechnologyDto,
  ) {
    return this.technologiesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar tecnologia' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.technologiesService.remove(id);
  }
}
