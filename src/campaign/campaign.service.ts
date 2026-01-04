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

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const exists = await this.campaignRepository.findOne({
      where: {
        street_address: dto.street_address,
        unit_apt: dto.unit_apt || undefined,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zip_code,
      },
    });

    if (exists) {
      throw new ConflictException(
        'campaign with the same address already exists',
      );
    }

    const campaign = this.campaignRepository.create(dto);
    return this.campaignRepository.save(campaign);
  }
  findAll() {
    return this.campaignRepository.find();
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
