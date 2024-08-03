import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  private settings = {
    universityName: 'Example University',
    academicYear: '2023-2024',
    pdfTemplate: 'template1',
    handbookFormat: 'pdf',
    defaultUserRole: 'editor',
  };

  getSettings() {
    return this.settings;
  }

  updateSettings(updateSettingsDto: UpdateSettingsDto) {
    this.settings = { ...this.settings, ...updateSettingsDto };
    return this.settings;
  }
}