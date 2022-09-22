import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ApproveReportDto, CreateReportDto, GetEstimateDto } from './dtos';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(data: CreateReportDto, user: User) {
    const report = this.repo.create(data);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, body: ApproveReportDto) {
    const report = await this.repo.findOne({
      where: {
        id: id,
      },
    });

    if (!report) {
      throw new NotFoundException();
    }

    report.approved = body.approved;
    return this.repo.save(report);
  }

  estimate({ make, model }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .getRawMany();
  }
}
