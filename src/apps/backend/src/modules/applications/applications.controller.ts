import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/index.js';
import { CurrentUser } from '../auth/decorators/index.js';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractPdfText(buffer: Buffer): Promise<string> {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    // Disable worker usage in Node to avoid worker bundle resolution issues
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    disableAutoFetch: true,
    disableStream: true,
  });

  const pdf = await loadingTask.promise;
  let text = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    text += `${pageText}\n`;
  }

  return text.trim();
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my applications' })
  @ApiOkResponse({ description: 'Returns applications of authenticated user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.applicationsService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new application (optional PDF CV upload)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          example: '2c5d08b2-cc71-41b2-9eb4-1048ebc95fd0',
        },
        coverLetter: {
          type: 'string',
          example: 'Bu role büyük bir istekle başvuruyorum.',
        },
        aiConsent: { type: 'boolean', example: true },
        cvFile: {
          type: 'string',
          format: 'binary',
          description: 'Optional PDF file. Max 5 MB.',
        },
      },
      required: ['jobId', 'coverLetter', 'aiConsent'],
    },
  })
  @ApiCreatedResponse({ description: 'Application created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = ['application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Sadece PDF dosyaları kabul edilmektedir.'),
            false,
          );
        }
      },
    }),
  )
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file && !dto.aiConsent) {
      throw new BadRequestException(
        'CV yüklemek için AI işleme onayı verilmelidir.',
      );
    }

    let cvText: string | null = null;

    if (file && dto.aiConsent) {
      cvText = await extractPdfText(file.buffer);
      if (!cvText) {
        throw new BadRequestException('CV metni çıkarılamadı.');
      }
    }

    return this.applicationsService.create(userId, dto, cvText);
  }
}
