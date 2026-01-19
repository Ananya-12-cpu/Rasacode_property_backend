import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '././../entities/campaign.entity';
import { CreateCampaignDto } from './dtos/campaign.request.dto';
import { UpdateCampaignDto } from './dtos/campaign.update.dto';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../common/dto/pagination.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const exists = await this.campaignRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (exists) {
      throw new ConflictException('campaign already exists');
    }

    const campaign = this.campaignRepository.create(dto);
    return this.campaignRepository.save(campaign);
  }
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Campaign>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await this.campaignRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException(`campaign with id ${id} not found`);
    }

    return campaign;
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException(`campaign with id ${id} not found`);
    }

    Object.assign(campaign, dto);

    return this.campaignRepository.save(campaign);
  }

  async remove(id: number) {
    await this.campaignRepository.delete(id);
    return { message: 'campaign deleted successfully' };
  }
}
