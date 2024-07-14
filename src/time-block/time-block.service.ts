import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { TimeBlockDto } from './dto/time-block.dto';
import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class TimeBlockService {
  constructor(private prisma: PrismaService) { }
  async getAll(userId: string) {
    return this.prisma.timeBlock.findMany({
      where: {
        userId
      },
      orderBy: {
        order: 'asc'
      }
    })
  }
  async create(dto: TimeBlockDto, userId: string) {
    return this.prisma.timeBlock.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }
  async update(
    dto: Partial<TimeBlockDto>,
    timeBlockId: string,
    userId: string
  ) {
    return this.prisma.timeBlock.update({
      where: {
        userId,
        id: timeBlockId,
      },
      data: dto
    })
  }

  async delete(TimeBlockId: string, userId: string) {
    return this.prisma.timeBlock.delete({
      where: {
        id: TimeBlockId,
        userId
      }
    })
  }

  async UpdateOrder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, order) => this.prisma.timeBlock.update({
        where: { id },
        data: { order }
      }))
    )
  }

}
