import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { startOfDay, subDays } from 'date-fns';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }
  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async getProfile(id: string) {
    const profile = await this.getById(id);
    const totalTasks = profile.tasks.length;
    // fix next line
    const completedTasks = await this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true,
      },
    });

    const todayStart = startOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 7));

    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString(),
        },
      },
    });
    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString(),
        },
      },
    });

    const { password, ...rest } = profile;
    return {
      user: rest,
      statistics: [
        { label: 'Total', value: totalTasks },
        { label: 'Complete tasks', value: completedTasks },
        { label: 'Today tasks', value: todayTasks },
        { label: 'Week tasks', value: weekTasks },
      ],
    };
  }
  async create(dto: RegisterDto) {
    const user = {
      email: dto.email,
      name: dto.name ? dto.name : '',
      userAvatar: dto.userAvatar ? dto.userAvatar : undefined,
      password: await hash(dto.password),
    };
    return this.prisma.user.create({
      data: user,
    });
  }
  async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        name: true,
        email: true,
      },
    });
  }
  async updateImage(id: string, userAvatar: string) {
    const data = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        userAvatar: userAvatar,
      },
      select: {
        userAvatar: true,
      },
    });

    return data;
  }
}
