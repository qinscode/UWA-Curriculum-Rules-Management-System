import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async getSettings(): Promise<Setting> {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = await this.settingsRepository.save({
        universityName: 'Example University',
        academicYear: '2023-2024',
        pdfTemplate: 'template1',
        handbookFormat: 'pdf',
        defaultUserRole: 'editor',
      });
    }
    return settings;
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<Setting> {
    await this.settingsRepository.update(1, updateSettingsDto);
    return this.getSettings();
  }
}